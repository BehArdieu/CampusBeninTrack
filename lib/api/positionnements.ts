import { apiFetch } from "./client";
import type { PaginatedResponse, Positionnement, PositionnementStatus } from "./types";

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
  return apiFetch<Positionnement>(`/positionnements/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export const POSITIONNEMENT_STATUS_LABELS: Record<PositionnementStatus, string> = {
  en_attente: "En attente de réponse",
  lu: "Vu par l’étudiant",
  accepte: "Accepté — accompagnement en cours",
  refuse: "Refusé par l’étudiant",
};
