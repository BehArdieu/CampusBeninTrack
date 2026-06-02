import { apiFetch, ApiError } from "./client";
import type { Annonce, Positionnement, PositionnementStatus } from "./types";

export async function updateAnnonce(
  annonceId: number,
  payload: Partial<{
    titre: string;
    description: string;
    universite: string | null;
    diaspora_id: number | null;
    status: string;
  }>,
): Promise<Annonce> {
  return apiFetch<Annonce>(`/annonces/${annonceId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function patchPositionnementStatus(
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
      return apiFetch<Positionnement>(`/positionnements/${id}`, { method: "PUT", body });
    }
    throw err;
  }
}

/**
 * Acceptation côté étudiant : met à jour le positionnement, ou à défaut lie la diaspora à l’annonce
 * (certains backends n’autorisent l’acceptation que via PUT /annonces/{id}).
 */
export async function acceptPositionnementAsStudent(
  positionnement: Positionnement,
  annonceId: number,
): Promise<Positionnement> {
  try {
    return await patchPositionnementStatus(positionnement.id, "accepte");
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 403) throw err;
  }

  await updateAnnonce(annonceId, { diaspora_id: positionnement.diaspora_id });

  try {
    return await apiFetch<Positionnement>(`/positionnements/${positionnement.id}`);
  } catch {
    return { ...positionnement, status: "accepte" };
  }
}

export async function refusePositionnementAsStudent(
  positionnement: Positionnement,
  annonceId: number,
): Promise<Positionnement> {
  try {
    return await patchPositionnementStatus(positionnement.id, "refuse");
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 403) throw err;
  }

  await updateAnnonce(annonceId, { diaspora_id: null });

  try {
    return await apiFetch<Positionnement>(`/positionnements/${positionnement.id}`);
  } catch {
    return { ...positionnement, status: "refuse" };
  }
}
