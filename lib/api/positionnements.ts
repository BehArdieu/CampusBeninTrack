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

/** Positionnement de l'utilisateur diaspora connecté sur une annonce (source fiable). */
export async function getMyPositionnementForAnnonce(
  annonceId: number,
  diasporaUserId: number,
): Promise<Positionnement | null> {
  const mine = await listPositionnements();
  return (
    mine.find(
      (p) => p.annonce_id === annonceId && p.diaspora_id === diasporaUserId,
    ) ?? null
  );
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

export const POSITIONNEMENT_STATUS_LABELS: Record<PositionnementStatus, string> = {
  en_attente: "En attente de réponse",
  lu: "Vu par l’étudiant",
  accepte: "Accepté — accompagnement en cours",
  refuse: "Refusé par l’étudiant",
};
