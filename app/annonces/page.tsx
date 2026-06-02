"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { isDiasporaRole, isEtudiantRole } from "@/lib/api/user";
import { apiFetch } from "@/lib/api/client";
import type { Annonce, PaginatedResponse } from "@/lib/api/types";

function AnnonceCard({ annonce }: { annonce: Annonce }) {
  return (
    <Link
      href={`/annonces/${annonce.id}`}
      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--forest)]">
          {annonce.titre}
        </h3>
        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
          {annonce.status ?? "active"}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--muted)]">
        {annonce.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
        {annonce.ville && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 py-1">
            📍 {annonce.ville.ville}
          </span>
        )}
        {annonce.universite && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 py-1">
            🎓 {annonce.universite}
          </span>
        )}
        {(annonce.positionnements_count ?? 0) > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--forest)]/10 px-2.5 py-1 text-[var(--forest)]">
            🤝 {annonce.positionnements_count}
          </span>
        )}
        <span className="ml-auto text-[var(--muted)]">
          {new Date(annonce.created_at).toLocaleDateString("fr-FR")}
        </span>
      </div>
    </Link>
  );
}

function AnnoncesListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
        >
          <div className="h-5 w-3/4 rounded bg-[var(--surface)]" />
          <div className="mt-3 h-4 w-full rounded bg-[var(--surface)]" />
          <div className="mt-2 h-4 w-2/3 rounded bg-[var(--surface)]" />
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-[var(--surface)]" />
            <div className="h-6 w-24 rounded-full bg-[var(--surface)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnnoncesPage() {
  const { backendToken, backendUser, ready } = useBackendAuth();
  const isDiaspora = isDiasporaRole(backendUser?.role);
  const isEtudiant = isEtudiantRole(backendUser?.role);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!backendToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    apiFetch<PaginatedResponse<Annonce>>("/annonces")
      .then((res) => {
        setAnnonces(res.data);
        setError(null);
      })
      .catch((err) => {
        console.warn("[annonces] erreur chargement:", err);
        setError("Impossible de charger les annonces.");
      })
      .finally(() => setLoading(false));
  }, [ready, backendToken]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
            Recherches de logement
          </h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            {isDiaspora
              ? "Parcours les demandes des étudiants et positionne-toi pour les accompagner."
              : "Les étudiants publient leurs besoins, la diaspora se positionne pour aider."}
          </p>
        </div>
        {backendToken && isEtudiant && (
          <Link
            href="/annonces/new"
            className="inline-flex shrink-0 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)] shadow-md transition hover:brightness-110"
          >
            Publier une demande
          </Link>
        )}
        {backendToken && isDiaspora && (
          <Link
            href="/positionnements"
            className="inline-flex shrink-0 rounded-full border-2 border-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
          >
            Mes positionnements
          </Link>
        )}
      </div>

      <div className="mt-10">
        {!ready || loading ? (
          <AnnoncesListSkeleton />
        ) : !backendToken ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)]/50 px-6 py-20 text-center">
            <div className="text-4xl">🏠</div>
            <h2 className="mt-4 font-display text-xl font-semibold text-[var(--ink)]">
              Connecte-toi pour voir les annonces
            </h2>
            <p className="mt-2 max-w-md text-[var(--muted)]">
              La connexion est nécessaire pour accéder aux annonces de logement.
            </p>
            <Link
              href="/connexion"
              className="mt-6 inline-flex rounded-full border-2 border-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
            >
              Se connecter
            </Link>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : annonces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)]/50 px-6 py-20 text-center">
            <div className="text-4xl">📭</div>
            <h2 className="mt-4 font-display text-xl font-semibold text-[var(--ink)]">
              Aucune annonce pour le moment
            </h2>
            <p className="mt-2 max-w-md text-[var(--muted)]">
              Sois le premier à publier une demande de logement !
            </p>
            <Link
              href="/annonces/new"
              className="mt-6 inline-flex rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--card)] transition hover:brightness-110"
            >
              Publier une demande
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {annonces.map((a) => (
              <AnnonceCard key={a.id} annonce={a} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
