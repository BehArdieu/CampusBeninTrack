import { apiFetch } from "./client";
import type { Annonce, Positionnement } from "./types";

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

/** Corps PUT complet (certains backends Laravel exigent tous les champs modifiables). */
async function updateAnnonceMerged(
  annonceId: number,
  patch: Partial<{ diaspora_id: number | null; status: string }>,
): Promise<Annonce> {
  const current = await apiFetch<Annonce>(`/annonces/${annonceId}`);
  return updateAnnonce(annonceId, {
    titre: current.titre,
    description: current.description,
    universite: current.universite,
    ...patch,
  });
}

/**
 * Acceptation côté étudiant via PUT /annonces/{id} + diaspora_id.
 * Le backend refuse en général PATCH/PUT sur /positionnements pour l’étudiant.
 */
export async function acceptPositionnementAsStudent(
  positionnement: Positionnement,
  annonceId: number,
): Promise<Positionnement> {
  await updateAnnonceMerged(annonceId, {
    diaspora_id: positionnement.diaspora_id,
  });
  return { ...positionnement, status: "accepte" };
}

export async function refusePositionnementAsStudent(
  positionnement: Positionnement,
  annonceId: number,
): Promise<Positionnement> {
  const current = await apiFetch<Annonce>(`/annonces/${annonceId}`);
  if (Number(current.diaspora_id) === Number(positionnement.diaspora_id)) {
    await updateAnnonceMerged(annonceId, { diaspora_id: null });
  }
  return { ...positionnement, status: "refuse" };
}
