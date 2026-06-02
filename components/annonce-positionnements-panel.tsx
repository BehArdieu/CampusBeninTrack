"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import {
  POSITIONNEMENT_STATUS_LABELS,
  updatePositionnementStatus,
} from "@/lib/api/positionnements";
import type { Positionnement, PositionnementStatus } from "@/lib/api/types";

type Props = {
  positionnements: Positionnement[];
  onUpdate: (updated: Positionnement) => void;
};

function statusBadgeClass(status: PositionnementStatus): string {
  switch (status) {
    case "accepte":
      return "bg-green-100 text-green-800";
    case "refuse":
      return "bg-red-100 text-red-700";
    case "lu":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-[var(--accent-soft)] text-[var(--accent)]";
  }
}

export function AnnoncePositionnementsPanel({ positionnements, onUpdate }: Props) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(id: number, status: "accepte" | "refuse") {
    setBusyId(id);
    setError(null);
    try {
      const updated = await updatePositionnementStatus(id, status);
      onUpdate(updated);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? ((err.body.message as string) || "Action impossible.")
          : "Action impossible.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (positionnements.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-6 py-10 text-center">
        <p className="font-display text-lg text-[var(--ink)]">Aucun positionnement pour l’instant</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Les membres de la diaspora peuvent se proposer pour t’aider dès qu’ils consultent ton annonce.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
        Diaspora intéressée ({positionnements.length})
      </h2>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <ul className="space-y-4">
        {positionnements.map((p) => {
          const name = p.diaspora
            ? `${p.diaspora.prenom} ${p.diaspora.nom}`.trim()
            : `Membre #${p.diaspora_id}`;
          const pending = p.status === "en_attente" || p.status === "lu";

          return (
            <li
              key={p.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-bold text-[var(--card)]">
                    {p.diaspora?.prenom?.[0]?.toUpperCase() ?? "D"}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--ink)]">{name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(p.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(p.status)}`}
                >
                  {POSITIONNEMENT_STATUS_LABELS[p.status]}
                </span>
              </div>
              {p.message ? (
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--ink-soft)]">
                  {p.message}
                </p>
              ) : (
                <p className="mt-4 text-sm italic text-[var(--muted)]">Aucun message joint.</p>
              )}
              {pending ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => setStatus(p.id, "accepte")}
                    className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--card)] transition hover:brightness-110 disabled:opacity-60"
                  >
                    {busyId === p.id ? "…" : "Accepter"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === p.id}
                    onClick={() => setStatus(p.id, "refuse")}
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
