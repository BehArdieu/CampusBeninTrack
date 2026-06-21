"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { createReponse, formatReponsePrix } from "@/lib/api/reponses";
import type { Reponse } from "@/lib/api/types";

type Props = {
  annonceId: number;
  onSuccess: (reponse: Reponse) => void;
};

export function ReponseForm({ annonceId, onSuccess }: Props) {
  const [address, setAddress] = useState("");
  const [prix, setPrix] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const prixNum = Number(prix.replace(",", "."));
    if (!address.trim()) {
      setError("L’adresse est obligatoire.");
      return;
    }
    if (!Number.isFinite(prixNum) || prixNum < 0) {
      setError("Indique un loyer mensuel valide (en euros).");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const files = images?.length ? Array.from(images) : undefined;
      const created = await createReponse(annonceId, address, prixNum, files);
      onSuccess(created);
      setAddress("");
      setPrix("");
      setImages(null);
    } catch (err) {
      if (err instanceof ApiError) {
        const errors = err.body.errors as Record<string, string[]> | undefined;
        const first = errors && Object.values(errors)[0]?.[0];
        setError((err.body.message as string) || first || "Impossible de publier cette proposition.");
      } else {
        setError("Impossible de publier cette proposition.");
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
        Proposer un logement
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Tu as été retenu comme accompagnant. Décris un logement concret que l’étudiant pourra
        consulter (adresse, loyer, photos).
      </p>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Adresse</span>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          maxLength={500}
          placeholder="Ex. : 12 rue Example, 69007 Lyon"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Loyer mensuel (€)</span>
        <input
          type="number"
          min={0}
          step={1}
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
          placeholder="Ex. : 450"
          className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-[var(--ink-soft)]">Photos (optionnel)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="mt-2 block w-full text-sm text-[var(--ink-soft)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--forest)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--card)]"
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
        {submitting ? "Publication…" : "Publier la proposition"}
      </button>
    </form>
  );
}

type ReponseListProps = {
  items: Reponse[];
  title?: string;
  showDiasporaName?: boolean;
};

export function ReponseListSummary({
  items,
  title = "Mes propositions de logement",
  showDiasporaName = false,
}: ReponseListProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{title}</h2>
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm"
          >
            <p className="font-medium text-[var(--ink)]">{r.address}</p>
            <p className="mt-1 text-[var(--forest)]">{formatReponsePrix(r.prix)} / mois</p>
            {showDiasporaName && r.diaspora ? (
              <p className="mt-1 text-[var(--muted)]">
                {r.diaspora.prenom} {r.diaspora.nom}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
