import { apiFetch, ApiError } from "./client";
import type { Annonce, PaginatedResponse, Positionnement, Reponse } from "./types";

export type ReponseStatus = Reponse["status"];

type ReponsesIndexResponse = Reponse[] | PaginatedResponse<Reponse>;

function unwrapList(res: ReponsesIndexResponse): Reponse[] {
  if (Array.isArray(res)) return res;
  return res.data ?? [];
}

export async function listReponses(): Promise<Reponse[]> {
  const res = await apiFetch<ReponsesIndexResponse>("/reponses");
  if (Array.isArray(res)) return res;

  const first = res.data ?? [];
  const lastPage = res.last_page ?? 1;
  if (lastPage <= 1) return first;

  const rest: Reponse[] = [];
  for (let page = 2; page <= lastPage; page++) {
    const next = await apiFetch<PaginatedResponse<Reponse>>(`/reponses?page=${page}`);
    rest.push(...(next.data ?? []));
  }
  return [...first, ...rest];
}

export async function listReponsesForAnnonce(annonceId: number): Promise<Reponse[]> {
  const all = await listReponses();
  return all.filter((r) => r.annonce_id === annonceId);
}

export async function createReponse(
  annonceId: number,
  address: string,
  prix: number,
  images?: File[],
): Promise<Reponse> {
  const form = new FormData();
  form.append("annonce_id", String(annonceId));
  form.append("address", address.trim());
  form.append("prix", String(prix));
  if (images?.length) {
    for (const file of images) {
      form.append("images[]", file);
    }
  }

  return apiFetch<Reponse>("/reponses", {
    method: "POST",
    body: form,
  });
}

export async function updateReponseStatus(
  id: number,
  status: ReponseStatus,
): Promise<Reponse> {
  const body = JSON.stringify({ status });
  try {
    return await apiFetch<Reponse>(`/reponses/${id}`, {
      method: "PATCH",
      body,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 405) {
      return apiFetch<Reponse>(`/reponses/${id}`, {
        method: "PUT",
        body,
      });
    }
    throw err;
  }
}

/** Diaspora retenue sur l’annonce (accompagnement accepté). */
export function isDiasporaAcceptedForAnnonce(
  annonce: Pick<Annonce, "diaspora_id">,
  diasporaUserId: number,
  positionnement?: Positionnement | null,
): boolean {
  if (
    annonce.diaspora_id != null &&
    Number(annonce.diaspora_id) === Number(diasporaUserId)
  ) {
    return true;
  }
  return positionnement?.status === "accepte";
}

export function formatReponsePrix(prix: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(prix);
}

export const REPONSE_STATUS_LABELS: Record<ReponseStatus, string> = {
  en_attente: "En attente de réponse",
  accepte: "Acceptée par l’étudiant",
  visite_planifiee: "Visite planifiée",
  visite_effectuee: "Visite effectuée",
  offre_acceptee: "Offre acceptée",
  en_cours_paiement: "Paiement en cours",
  paiement_effectue: "Paiement effectué",
  contrat_signe: "Contrat signé",
  refusee: "Refusée par l’étudiant",
};
