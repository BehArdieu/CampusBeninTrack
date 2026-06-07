import { apiFetch } from "./client";
import type { Annonce, Positionnement, PublicUserContact, UserProfileEmbed } from "./types";

type ResolveContactInput = {
  userId: number;
  annonceId?: number;
  positionnementId?: number;
  embedded?: UserProfileEmbed | null;
  /** true = récupérer l’étudiant auteur ; false = diaspora accompagnant */
  etudiant?: boolean;
};

function fromEmbed(
  userId: number,
  embedded?: UserProfileEmbed | null,
): PublicUserContact | null {
  if (!embedded || Number(embedded.id) !== Number(userId)) return null;
  if (!embedded.email && !embedded.telephone) return null;
  return {
    id: embedded.id,
    nom: embedded.nom,
    prenom: embedded.prenom,
    photo: embedded.photo ?? null,
    email: embedded.email ?? "",
    telephone: embedded.telephone ?? null,
  };
}

function fromAnnonce(
  annonce: Annonce,
  userId: number,
  etudiant: boolean,
): PublicUserContact | null {
  const profile = etudiant ? annonce.user : annonce.diaspora;
  return fromEmbed(userId, profile);
}

/** Coordonnées d’un utilisateur après acceptation d’un positionnement. */
export async function resolveUserContact(
  input: ResolveContactInput,
): Promise<PublicUserContact | null> {
  const { userId, annonceId, positionnementId, embedded, etudiant = false } =
    input;

  const direct = fromEmbed(userId, embedded);
  if (direct) return direct;

  if (annonceId) {
    try {
      const annonce = await apiFetch<Annonce>(`/annonces/${annonceId}`);
      const fromA = fromAnnonce(annonce, userId, etudiant);
      if (fromA) return fromA;
    } catch {
      // ignore
    }
  }

  if (positionnementId && !etudiant) {
    try {
      const p = await apiFetch<Positionnement>(
        `/positionnements/${positionnementId}`,
      );
      const fromP = fromEmbed(userId, p.diaspora);
      if (fromP) return fromP;
    } catch {
      // ignore
    }
  }

  return fromEmbed(userId, embedded);
}

export function formatContactName(contact: Pick<PublicUserContact, "prenom" | "nom">): string {
  return `${contact.prenom} ${contact.nom}`.trim();
}
