"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import {
  formatReponsePrix,
  REPONSE_STATUS_LABELS,
  updateReponseStatus,
} from "@/lib/api/reponses";
import { ImageGallery } from "@/components/image-gallery";
import type { Reponse } from "@/lib/api/types";

type Props = {
  reponses: Reponse[];
  canManage?: boolean;
  onUpdate: (updated: Reponse) => void;
};

function statusBadgeClass(status: Reponse["status"]): string {
  switch (status) {
    case "accepte":
    case "offre_acceptee":
    case "contrat_signe":
    case "paiement_effectue":
      return "bg-green-100 text-green-800";
    case "refusee":
      return "bg-red-100 text-red-700";
    case "visite_planifiee":
    case "visite_effectuee":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-[var(--accent-soft)] text-[var(--accent)]";
  }
}

function formatActionError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 403) {
      return "Action refusée par le serveur. Seul l’étudiant auteur peut réagir à cette proposition.";
    }
    return (err.body.message as string) || "Action impossible.";
  }
  return "Action impossible.";
}

export function AnnonceReponsesPanel({
  reponses,
  canManage = true,
  onUpdate,
}: Props) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptedId = reponses.find((r) => r.status === "accepte")?.id ?? null;

  async function setStatus(r: Reponse, status: "accepte" | "refusee") {
    if (!canManage) return;
    setBusyId(r.id);
    setError(null);
    try {
      const updated = await updateReponseStatus(r.id, status);
      onUpdate(updated);
    } catch (err) {
      setError(formatActionError(err));
    } finally {
      setBusyId(null);
    }
  }

  if (reponses.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-6 py-10 text-center">
        <p className="font-display text-lg text-[var(--ink)]">Aucune proposition de logement</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ton accompagnant pourra publier ici des logements concrets (adresse, loyer, photos) une
          fois retenu.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
        Propositions de logement ({reponses.length})
      </h2>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {acceptedId !== null && canManage ? (
        <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Tu as déjà retenu une proposition de logement. Tu peux encore refuser les autres offres en
          attente.
        </p>
      ) : null}
      <ul className="space-y-4">
        {reponses.map((r) => {
          const pending = r.status === "en_attente";
          const canAccept = pending && canManage && acceptedId === null;
          const name = r.diaspora
            ? `${r.diaspora.prenom} ${r.diaspora.nom}`.trim()
            : `Accompagnant #${r.diaspora_id}`;

          return (
            <li
              key={r.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[var(--ink)]">{r.address}</p>
                  <p className="mt-1 text-lg font-semibold text-[var(--forest)]">
                    {formatReponsePrix(r.prix)}
                    <span className="text-sm font-normal text-[var(--muted)]"> / mois</span>
                  </p>
                  <p className="mt-2 text-xs text-[var(--muted)]">Proposé par {name}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(r.status)}`}
                >
                  {REPONSE_STATUS_LABELS[r.status]}
                </span>
              </div>

              {r.images && r.images.length > 0 ? (
                <ImageGallery images={r.images} />
              ) : null}

              {pending && canManage ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {canAccept ? (
                    <button
                      type="button"
                      disabled={busyId === r.id}
                      onClick={() => setStatus(r, "accepte")}
                      className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--card)] transition hover:brightness-110 disabled:opacity-60"
                    >
                      {busyId === r.id ? "…" : "Accepter"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => setStatus(r, "refusee")}
                    className="rounded-full border border-[var(--border-strong)] px-5 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-red-300 hover:text-red-700 disabled:opacity-60"
                  >
                    Refuser
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
