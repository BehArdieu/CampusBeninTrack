export type UserRole = "etudiant" | "diaspora" | string;

export interface BackendUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  photo: string | null;
  telephone?: string | null;
  ville_id?: number | null;
}

export interface Ville {
  id: number;
  ville: string;
  longitude: string;
  latitude: string;
}

export interface Annonce {
  id: number;
  titre: string;
  description: string;
  photo: string | null;
  universite: string | null;
  ville_id: number;
  user_id: number;
  diaspora_id?: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  ville?: Ville;
  user?: { id: number; nom: string; prenom: string; photo: string | null };
  positionnements_count?: number;
  reponses_count?: number;
  positionnements?: Positionnement[];
}

export type PositionnementStatus = "en_attente" | "lu" | "accepte" | "refuse";

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface Positionnement {
  id: number;
  annonce_id: number;
  diaspora_id: number;
  message: string | null;
  status: PositionnementStatus;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  diaspora?: { id: number; nom: string; prenom: string; photo: string | null };
  annonce?: Pick<Annonce, "id" | "titre" | "ville" | "status" | "diaspora_id">;
}

export interface Reponse {
  id: number;
  annonce_id: number;
  diaspora_id: number;
  address: string;
  prix: number;
  status:
    | "en_attente"
    | "accepte"
    | "visite_planifiee"
    | "visite_effectuee"
    | "offre_acceptee"
    | "en_cours_paiement"
    | "paiement_effectue"
    | "contrat_signe"
    | "refusee";
  read_at: string | null;
  created_at: string;
  updated_at: string;
  images?: { id: number; url: string }[];
}
