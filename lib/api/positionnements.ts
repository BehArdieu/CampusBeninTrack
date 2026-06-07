import { getStoredBackendUser } from "./auth";
import { apiFetch, ApiError } from "./client";
import type {
  Annonce,
  PaginatedResponse,
  Positionnement,
  PositionnementStatus,
} from "./types";

const REFUSED_POSITIONNEMENTS_PREFIX = "360cf-refused-positionnements";
const GLOBAL_REFUSALS_KEY = "360cf-positionnement-refusals-global";
const DIASPORA_WAS_LINKED_KEY = "360cf-diaspora-was-linked";

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

function readGlobalRefusals(): RefusedPositionnementEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GLOBAL_REFUSALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RefusedPositionnementEntry[];
  } catch {
    return [];
  }
}

function writeGlobalRefusals(entries: RefusedPositionnementEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GLOBAL_REFUSALS_KEY, JSON.stringify(entries));
}

function readWasLinkedIds(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(DIASPORA_WAS_LINKED_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function noteDiasporaWasLinked(positionnementId: number) {
  if (typeof window === "undefined" || positionnementId <= 0) return;
  const ids = readWasLinkedIds();
  ids.add(positionnementId);
  window.localStorage.setItem(DIASPORA_WAS_LINKED_KEY, JSON.stringify([...ids]));
}

function isGloballyRefused(positionnementId: number, diasporaId: number): boolean {
  return readGlobalRefusals().some(
    (e) => e.id === positionnementId && Number(e.diasporaId) === Number(diasporaId),
  );
}

/** Refus enregistré localement (le backend n’autorise pas PUT /positionnements côté étudiant). */
export function markPositionnementRefusedLocally(entry: RefusedPositionnementEntry) {
  const entries = readRefusedPositionnements().filter((e) => e.id !== entry.id);
  entries.push(entry);
  writeRefusedPositionnements(entries);

  const global = readGlobalRefusals().filter((e) => e.id !== entry.id);
  global.push(entry);
  writeGlobalRefusals(global);
}

export function applyLocallyRefusedPositionnements(
  items: Positionnement[],
): Positionnement[] {
  const refusedIds = new Set([
    ...readRefusedPositionnements().map((e) => e.id),
    ...readGlobalRefusals().map((e) => e.id),
  ]);
  if (refusedIds.size === 0) return items;

  return items.map((p) =>
    refusedIds.has(p.id) && p.status !== "refuse"
      ? { ...p, status: "refuse" as const }
      : p,
  );
}

type ResolveStatusOptions = {
  cloudRefusedIds?: Set<number>;
};

/** Statut affiché pour la diaspora (acceptation via diaspora_id, refus inféré ou synchronisé). */
export function resolvePositionnementStatus(
  annonce: Pick<Annonce, "diaspora_id">,
  p: Positionnement,
  options?: ResolveStatusOptions,
): Positionnement {
  if (p.status === "refuse") return p;

  const myId = Number(p.diaspora_id);
  const linked =
    annonce.diaspora_id != null ? Number(annonce.diaspora_id) : null;

  if (
    options?.cloudRefusedIds?.has(p.id) ||
    isGloballyRefused(p.id, myId)
  ) {
    return { ...p, status: "refuse" };
  }

  if (linked !== null && !Number.isNaN(linked)) {
    if (linked === myId) {
      noteDiasporaWasLinked(p.id);
      if (p.status !== "accepte") return { ...p, status: "accepte" };
      return p;
    }
    if (p.status === "en_attente" || p.status === "lu") {
      return { ...p, status: "refuse" };
    }
  }

  if (
    (linked === null || Number.isNaN(linked)) &&
    readWasLinkedIds().has(p.id)
  ) {
    return { ...p, status: "refuse" };
  }

  return p;
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

  if (embedded) {
    return resolvePositionnementStatus(annonceHint, embedded);
  }

  return resolvePositionnementStatus(annonceHint, {
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
  const { fetchRefusedPositionnementIdsForDiaspora } = await import(
    "@/lib/positionnement-refusals"
  );
  const syncOpts: ResolveStatusOptions = {
    cloudRefusedIds: await fetchRefusedPositionnementIdsForDiaspora(diasporaUserId),
  };

  if (annonceHint?.positionnements?.length) {
    const fromEmbed = findMyPositionnementInList(
      annonceHint.positionnements,
      annonceId,
      diasporaUserId,
    );
    if (fromEmbed) {
      return syncPositionnementWithAnnonce(annonceHint, fromEmbed, syncOpts);
    }
  }

  const mine = await listPositionnements();
  const fromList = findMyPositionnementInList(mine, annonceId, diasporaUserId);
  if (fromList) {
    return annonceHint
      ? syncPositionnementWithAnnonce(annonceHint, fromList, syncOpts)
      : resolvePositionnementStatus(
          annonceHint ?? { diaspora_id: null },
          fromList,
          syncOpts,
        );
  }

  if (annonceHint) {
    const linked = positionnementFromAnnonceLink(
      annonceId,
      diasporaUserId,
      annonceHint,
    );
    if (!linked) return null;
    return syncPositionnementWithAnnonce(annonceHint, linked, syncOpts);
  }

  return null;
}

/** Recharge les statuts des positionnements diaspora via les annonces liées. */
export async function enrichPositionnementsWithAnnonces(
  items: Positionnement[],
  diasporaBackendId?: number,
): Promise<Positionnement[]> {
  if (items.length === 0) return items;

  const { fetchRefusedPositionnementIdsForDiaspora } = await import(
    "@/lib/positionnement-refusals"
  );
  const cloudRefusedIds =
    diasporaBackendId != null
      ? await fetchRefusedPositionnementIdsForDiaspora(diasporaBackendId)
      : new Set<number>();

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
    const resolved = resolvePositionnementStatus(
      full,
      { ...p, annonce: full },
      { cloudRefusedIds },
    );
    return applyLocallyRefusedPositionnements([resolved])[0] ?? resolved;
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
  options?: ResolveStatusOptions,
): Positionnement[] {
  const resolved = items.map((p) =>
    resolvePositionnementStatus(annonce, p, options),
  );
  return applyLocallyRefusedPositionnements(resolved);
}

export function syncPositionnementWithAnnonce(
  annonce: Pick<Annonce, "diaspora_id">,
  item: Positionnement | null,
  options?: ResolveStatusOptions,
): Positionnement | null {
  if (!item) return null;
  return syncPositionnementsWithAnnonce(annonce, [item], options)[0] ?? item;
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
