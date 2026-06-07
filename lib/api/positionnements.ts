import { getStoredBackendUser } from "./auth";
import { apiFetch, ApiError } from "./client";
import type {
  Annonce,
  PaginatedResponse,
  Positionnement,
  PositionnementStatus,
} from "./types";

const REFUSED_POSITIONNEMENTS_PREFIX = "360cf-refused-positionnements";

type RefusedPositionnementEntry = {
  id: number;
  annonceId: number;
  diasporaId: number;
};

function refusedPositionnementsStorageKey(): string {
  const user = getStoredBackendUser();
  return user
    ? `${REFUSED_POSITIONNEMENTS_PREFIX}-${user.id}`
    : `${REFUSED_POSITIONNEMENTS_PREFIX}-anonymous`;
}

function readRefusedPositionnements(): RefusedPositionnementEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(refusedPositionnementsStorageKey());
    if (!raw) return [];
    return JSON.parse(raw) as RefusedPositionnementEntry[];
  } catch {
    return [];
  }
}

function writeRefusedPositionnements(entries: RefusedPositionnementEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    refusedPositionnementsStorageKey(),
    JSON.stringify(entries),
  );
}

/** Refus enregistré localement (le backend n’autorise pas PUT /positionnements côté étudiant). */
export function markPositionnementRefusedLocally(entry: RefusedPositionnementEntry) {
  const entries = readRefusedPositionnements().filter((e) => e.id !== entry.id);
  entries.push(entry);
  writeRefusedPositionnements(entries);
}

export function applyLocallyRefusedPositionnements(
  items: Positionnement[],
): Positionnement[] {
  const refusedIds = new Set(readRefusedPositionnements().map((e) => e.id));
  if (refusedIds.size === 0) return items;

  return items.map((p) =>
    refusedIds.has(p.id) && p.status !== "refuse"
      ? { ...p, status: "refuse" as const }
      : p,
  );
}

type PositionnementsIndexResponse =
  | Positionnement[]
  | PaginatedResponse<Positionnement>;

function unwrapList(res: PositionnementsIndexResponse): Positionnement[] {
  if (Array.isArray(res)) return res;
  return res.data ?? [];
}

export async function listPositionnements(): Promise<Positionnement[]> {
  const res = await apiFetch<PositionnementsIndexResponse>("/positionnements");
  if (Array.isArray(res)) return res;

  const first = res.data ?? [];
  const lastPage = res.last_page ?? 1;
  if (lastPage <= 1) return first;

  const rest: Positionnement[] = [];
  for (let page = 2; page <= lastPage; page++) {
    const next = await apiFetch<PaginatedResponse<Positionnement>>(
      `/positionnements?page=${page}`,
    );
    rest.push(...(next.data ?? []));
  }
  return [...first, ...rest];
}

export async function listPositionnementsForAnnonce(
  annonceId: number,
): Promise<Positionnement[]> {
  const all = await listPositionnements();
  return all.filter((p) => p.annonce_id === annonceId);
}

function findMyPositionnementInList(
  items: Positionnement[],
  annonceId: number,
  diasporaUserId: number,
): Positionnement | null {
  return (
    items.find(
      (p) =>
        p.annonce_id === annonceId &&
        Number(p.diaspora_id) === Number(diasporaUserId),
    ) ?? null
  );
}

function positionnementFromAnnonceLink(
  annonceId: number,
  diasporaUserId: number,
  annonceHint: Pick<Annonce, "diaspora_id" | "positionnements">,
): Positionnement | null {
  if (
    annonceHint.diaspora_id == null ||
    Number(annonceHint.diaspora_id) !== Number(diasporaUserId)
  ) {
    return null;
  }

  const embedded = annonceHint.positionnements?.length
    ? findMyPositionnementInList(
        annonceHint.positionnements,
        annonceId,
        diasporaUserId,
      )
    : null;

  if (embedded) return syncPositionnementWithAnnonce(annonceHint, embedded);

  return syncPositionnementWithAnnonce(annonceHint, {
    id: 0,
    annonce_id: annonceId,
    diaspora_id: diasporaUserId,
    message: null,
    status: "en_attente",
    read_at: null,
    created_at: "",
    updated_at: "",
  });
}

/** Positionnement diaspora sur une annonce, synchronisé avec annonce.diaspora_id. */
export async function getMyPositionnementForAnnonce(
  annonceId: number,
  diasporaUserId: number,
  annonceHint?: Pick<Annonce, "diaspora_id" | "positionnements"> | null,
): Promise<Positionnement | null> {
  if (annonceHint?.positionnements?.length) {
    const fromEmbed = findMyPositionnementInList(
      annonceHint.positionnements,
      annonceId,
      diasporaUserId,
    );
    if (fromEmbed) {
      return syncPositionnementWithAnnonce(annonceHint, fromEmbed);
    }
  }

  const mine = await listPositionnements();
  const fromList = findMyPositionnementInList(mine, annonceId, diasporaUserId);
  if (fromList) {
    return annonceHint
      ? syncPositionnementWithAnnonce(annonceHint, fromList)
      : fromList;
  }

  if (annonceHint) {
    return positionnementFromAnnonceLink(annonceId, diasporaUserId, annonceHint);
  }

  return null;
}

/** Recharge les statuts des positionnements diaspora via les annonces liées. */
export async function enrichPositionnementsWithAnnonces(
  items: Positionnement[],
): Promise<Positionnement[]> {
  if (items.length === 0) return items;

  const ids = [...new Set(items.map((p) => p.annonce_id))];
  const annonces = await Promise.all(
    ids.map((id) => apiFetch<Annonce>(`/annonces/${id}`).catch(() => null)),
  );
  const byId = new Map(
    annonces.filter((a): a is Annonce => a != null).map((a) => [a.id, a]),
  );

  return items.map((p) => {
    const annonce = byId.get(p.annonce_id) ?? p.annonce;
    if (!annonce) return p;
    const full = byId.get(p.annonce_id) ?? annonce;
    return syncPositionnementWithAnnonce(full, { ...p, annonce: full }) ?? p;
  });
}

export async function createPositionnement(
  annonceId: number,
  message?: string | null,
): Promise<Positionnement> {
  return apiFetch<Positionnement>("/positionnements", {
    method: "POST",
    body: JSON.stringify({
      annonce_id: annonceId,
      message: message?.trim() || null,
    }),
  });
}

export async function updatePositionnementStatus(
  id: number,
  status: PositionnementStatus,
): Promise<Positionnement> {
  const body = JSON.stringify({ status });
  try {
    return await apiFetch<Positionnement>(`/positionnements/${id}`, {
      method: "PATCH",
      body,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 405) {
      return apiFetch<Positionnement>(`/positionnements/${id}`, {
        method: "PUT",
        body,
      });
    }
    throw err;
  }
}

/**
 * Le backend lie souvent l’acceptation via annonce.diaspora_id sans mettre à jour
 * positionnement.status — on aligne l’affichage sur la source de vérité annonce.
 */
export function syncPositionnementsWithAnnonce(
  annonce: Pick<Annonce, "diaspora_id">,
  items: Positionnement[],
): Positionnement[] {
  const linked =
    annonce.diaspora_id != null ? Number(annonce.diaspora_id) : null;

  const synced =
    linked === null || Number.isNaN(linked)
      ? items
      : items.map((p) => {
          if (Number(p.diaspora_id) !== linked) return p;
          if (p.status === "accepte") return p;
          return { ...p, status: "accepte" as const };
        });

  return applyLocallyRefusedPositionnements(synced);
}

export function syncPositionnementWithAnnonce(
  annonce: Pick<Annonce, "diaspora_id">,
  item: Positionnement | null,
): Positionnement | null {
  if (!item) return null;
  return syncPositionnementsWithAnnonce(annonce, [item])[0] ?? item;
}

/** Diaspora déjà retenue sur l’annonce (un seul accompagnant à la fois). */
export function getAcceptedDiasporaId(
  annonce: Pick<Annonce, "diaspora_id">,
  positionnements: Positionnement[],
): number | null {
  if (annonce.diaspora_id != null) {
    const id = Number(annonce.diaspora_id);
    if (!Number.isNaN(id)) {
      const linked = positionnements.find((p) => Number(p.diaspora_id) === id);
      if (linked?.status === "refuse") return null;
      return id;
    }
  }
  const accepted = positionnements.find((p) => p.status === "accepte");
  return accepted ? Number(accepted.diaspora_id) : null;
}

export function hasAcceptedPositionnement(
  annonce: Pick<Annonce, "diaspora_id">,
  positionnements: Positionnement[],
): boolean {
  return getAcceptedDiasporaId(annonce, positionnements) !== null;
}

export const POSITIONNEMENT_STATUS_LABELS: Record<PositionnementStatus, string> = {
  en_attente: "En attente de réponse",
  lu: "Vu par l’étudiant",
  accepte: "Accepté — accompagnement en cours",
  refuse: "Refusé par l’étudiant",
};
