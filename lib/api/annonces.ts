import { apiFetch, ApiError } from "./client";
import {
  deletePositionnement,
  persistPositionnementRefuse,
  syncPositionnementWithAnnonce,
} from "./positionnements";
import type { Annonce, Positionnement } from "./types";

export type AcceptPositionnementResult = {
  annonce: Annonce;
  positionnement: Positionnement;
};

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
    status: current.status,
    ...patch,
  });
}

function isDiasporaLinked(annonce: Annonce, diasporaId: number): boolean {
  return (
    annonce.diaspora_id != null &&
    Number(annonce.diaspora_id) === Number(diasporaId)
  );
}

/**
 * Acceptation côté étudiant via PUT /annonces/{id} + diaspora_id.
 * Vérifie la persistance en rechargeant l’annonce après sauvegarde.
 */
export async function acceptPositionnementAsStudent(
  positionnement: Positionnement,
  annonceId: number,
): Promise<AcceptPositionnementResult> {
  const before = await apiFetch<Annonce>(`/annonces/${annonceId}`);

  if (
    before.diaspora_id != null &&
    Number(before.diaspora_id) !== Number(positionnement.diaspora_id)
  ) {
    throw new ApiError(422, {
      message:
        "Tu as déjà accepté un accompagnant pour cette annonce. Refuse-le d’abord si tu souhaites en choisir un autre.",
    });
  }

  await updateAnnonceMerged(annonceId, {
    diaspora_id: positionnement.diaspora_id,
  });

  const verified = await apiFetch<Annonce>(`/annonces/${annonceId}`);

  if (!isDiasporaLinked(verified, positionnement.diaspora_id)) {
    throw new ApiError(422, {
      message:
        "L’acceptation n’a pas été enregistrée sur le serveur. Le champ diaspora_id de l’annonce est toujours vide — vérifiez la configuration backend.",
    });
  }

  const positionnementSynced = syncPositionnementWithAnnonce(verified, positionnement)!;
  return { annonce: verified, positionnement: positionnementSynced };
}

export async function refusePositionnementAsStudent(
  positionnement: Positionnement,
  annonceId: number,
): Promise<AcceptPositionnementResult> {
  const current = await apiFetch<Annonce>(`/annonces/${annonceId}`);

  if (isDiasporaLinked(current, positionnement.diaspora_id)) {
    await updateAnnonceMerged(annonceId, { diaspora_id: null });
  }

  let positionnementSynced: Positionnement;

  try {
    positionnementSynced = await persistPositionnementRefuse(positionnement.id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      await deletePositionnement(positionnement.id);
      positionnementSynced = { ...positionnement, status: "refuse" };
    } else {
      throw err;
    }
  }

  const verified = await apiFetch<Annonce>(`/annonces/${annonceId}`);

  const refreshed = await apiFetch<Positionnement>(
    `/positionnements/${positionnement.id}`,
  ).catch(() => null);

  if (refreshed) {
    if (refreshed.status === "refuse") {
      positionnementSynced = refreshed;
    } else {
      throw new ApiError(422, {
        message:
          "Le refus n’a pas été enregistré sur le serveur. Réessaie ou contacte le support.",
      });
    }
  }

  return { annonce: verified, positionnement: positionnementSynced };
}
