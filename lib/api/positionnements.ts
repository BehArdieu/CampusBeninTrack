import { apiFetch, ApiError } from "./client";
import type {
  Annonce,
  PaginatedResponse,
  Positionnement,
  PositionnementStatus,
} from "./types";

type PositionnementsIndexResponse =
  | Positionnement[]
  | PaginatedResponse<Positionnement>;

function unwrapList(res: PositionnementsIndexResponse): Positionnement[] {
  if (Array.isArray(res)) return res;
  return res.data ?? [];
}

export async function listPositionnements(): Promise<Positionnement[]> {
  const res = await apiFetch<PositionnementsIndexResponse>("/positionnements");
  return unwrapList(res);
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

/** Positionnement diaspora sur une annonce, synchronisé avec annonce.diaspora_id. */
export async function getMyPositionnementForAnnonce(
  annonceId: number,
  diasporaUserId: number,
  annonceHint?: Pick<Annonce, "diaspora_id" | "positionnements"> | null,
): Promise<Positionnement | null> {
  const mine = await listPositionnements();
  let found = findMyPositionnementInList(mine, annonceId, diasporaUserId);

  if (!found && annonceHint?.positionnements?.length) {
    found = findMyPositionnementInList(
      annonceHint.positionnements,
      annonceId,
      diasporaUserId,
    );
  }

  if (!found || !annonceHint) return found;

  return syncPositionnementWithAnnonce(annonceHint, found);
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

  if (linked === null || Number.isNaN(linked)) return items;

  return items.map((p) => {
    if (Number(p.diaspora_id) !== linked) return p;
    if (p.status === "accepte") return p;
    return { ...p, status: "accepte" as const };
  });
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
    if (!Number.isNaN(id)) return id;
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
