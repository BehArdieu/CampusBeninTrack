"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { createPositionnement } from "@/lib/api/positionnements";
import type { Positionnement } from "@/lib/api/types";

type Props = {
  annonceId: number;
  existing?: Positionnement | null;
  onSuccess: (p: Positionnement) => void;
};

export function PositionnementForm({ annonceId, existing, onSuccess }: Props) {
  const [message, setMessage] = useState(existing?.message ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (existing) {
    return (
      <div className="rounded-2xl border border-[var(--forest)]/30 bg-[var(--forest)]/5 p-6">
        <p className="font-display text-lg font-semibold text-[var(--forest)]">
          Tu t’es déjà positionné sur cette annonce
        </p>
        {existing.message ? (
          <p className="mt-3 text-sm text-[var(--ink-soft)] whitespace-pre-wrap">{existing.message}</p>
        ) : null}
        <p className="mt-4 text-sm text-[var(--muted)]">
          L’étudiant peut accepter ou refuser ta proposition. Tu seras notifié lorsque le statut évolue.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await createPositionnement(annonceId, message);
      onSuccess(created);
    } catch (err) {
      if (err instanceof ApiError) {
        const errors = err.body.errors as Record<string, string[]> | undefined;
        const first = errors && Object.values(errors)[0]?.[0];
        setError(
          first ||
            (err.body.message as string) ||
            "Impossible de t’enregistrer sur cette annonce.",
        );
      } else {
        setError("Impossible de t’enregistrer sur cette annonce.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
        Me positionner pour aider
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Présente brièvement comment tu peux accompagner l’étudiant (ville connue, disponibilité, type
        d’aide…). Ce message sera visible par l’étudiant.
      </p>
      <label className="mt-5 block">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Message (optionnel)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Ex. : Je vis à Lyon depuis 5 ans, je peux l’aider à visiter des quartiers proches de l’Université Lyon 2…"
          className="mt-2 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
        />
      </label>
      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)] transition hover:brightness-110 disabled:opacity-60"
      >
        {submitting ? "Envoi…" : "Envoyer ma candidature"}
      </button>
    </form>
  );
}
