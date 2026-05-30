"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { apiFetch } from "@/lib/api/client";
import type { Annonce } from "@/lib/api/types";

export default function AnnonceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { backendToken, ready } = useBackendAuth();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !backendToken || !id) return;

    setLoading(true);
    apiFetch<Annonce>(`/annonces/${id}`)
      .then((data) => {
        setAnnonce(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.status === 404 ? "Annonce introuvable." : "Erreur de chargement.");
      })
      .finally(() => setLoading(false));
  }, [ready, backendToken, id]);

  if (!ready || loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 rounded bg-[var(--surface)]" />
          <div className="h-9 w-3/4 rounded bg-[var(--surface)]" />
          <div className="h-4 w-full rounded bg-[var(--surface)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--surface)]" />
          <div className="mt-8 h-40 rounded-2xl bg-[var(--surface)]" />
        </div>
      </main>
    );
  }

  if (!backendToken) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Connexion requise</h1>
        <Link
          href="/connexion"
          className="mt-6 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)]"
        >
          Se connecter
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-red-700">{error}</p>
          <Link href="/annonces" className="mt-4 inline-block text-sm text-[var(--accent)] underline">
            Retour aux annonces
          </Link>
        </div>
      </main>
    );
  }

  if (!annonce) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-[var(--muted)]">
        <Link href="/annonces" className="hover:text-[var(--accent)] hover:underline">
          Annonces
        </Link>
        {" · "}
        <span className="text-[var(--ink-soft)]">{annonce.titre}</span>
      </nav>

      <article className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-[var(--ink)]">{annonce.titre}</h1>
          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {annonce.status ?? "active"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
          {annonce.ville && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
              📍 {annonce.ville.ville}
            </span>
          )}
          {annonce.universite && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
              🎓 {annonce.universite}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
            📅 {new Date(annonce.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {annonce.user && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--forest)] text-xs font-bold text-[var(--card)]">
              {annonce.user.prenom?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="text-sm text-[var(--ink-soft)]">
              {annonce.user.prenom} {annonce.user.nom}
            </span>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Description</h2>
          <p className="mt-3 whitespace-pre-wrap text-[var(--ink-soft)] leading-relaxed">
            {annonce.description}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/annonces"
            className="inline-flex rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
          >
            ← Retour aux annonces
          </Link>
        </div>
      </article>
    </main>
  );
}
