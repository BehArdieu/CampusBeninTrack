"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { isDiasporaRole } from "@/lib/api/user";
import {
  listPositionnements,
  POSITIONNEMENT_STATUS_LABELS,
  syncPositionnementWithAnnonce,
} from "@/lib/api/positionnements";
import type { Positionnement } from "@/lib/api/types";

export default function MesPositionnementsPage() {
  const { backendToken, backendUser, ready } = useBackendAuth();
  const [items, setItems] = useState<Positionnement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDiaspora = isDiasporaRole(backendUser?.role);

  useEffect(() => {
    if (!ready || !backendToken || !isDiaspora) {
      setLoading(false);
      return;
    }

    setLoading(true);
    listPositionnements()
      .then((list) =>
        setItems(
          list.map((p) =>
            p.annonce
              ? syncPositionnementWithAnnonce(p.annonce, p) ?? p
              : p,
          ),
        ),
      )
      .catch(() => setError("Impossible de charger tes positionnements."))
      .finally(() => setLoading(false));
  }, [ready, backendToken, isDiaspora]);

  if (!ready || loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-[var(--surface)]" />
          <div className="h-24 rounded-2xl bg-[var(--surface)]" />
          <div className="h-24 rounded-2xl bg-[var(--surface)]" />
        </div>
      </main>
    );
  }

  if (!backendToken) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl font-bold">Connexion requise</h1>
        <Link href="/connexion" className="mt-6 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)]">
          Se connecter
        </Link>
      </main>
    );
  }

  if (!isDiaspora) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Réservé à la diaspora</h1>
        <p className="mt-3 text-[var(--muted)]">
          Cette page liste les annonces sur lesquelles tu t’es positionné en tant qu’aidant.
        </p>
        <Link href="/annonces" className="mt-6 inline-block text-[var(--accent)] underline">
          Voir les annonces
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">Mes positionnements</h1>
        <p className="mt-2 text-[var(--ink-soft)]">
          Les demandes de logement sur lesquelles tu t’es proposé pour accompagner un étudiant.
        </p>
      </header>

      <div className="mt-10">
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-14 text-center">
            <p className="text-[var(--ink)]">Tu n’as encore postulé sur aucune annonce.</p>
            <Link
              href="/annonces"
              className="mt-4 inline-block rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--card)]"
            >
              Parcourir les demandes
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/annonces/${p.annonce_id}`}
                  className="block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
                      {p.annonce?.titre ?? `Annonce #${p.annonce_id}`}
                    </h2>
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                      {POSITIONNEMENT_STATUS_LABELS[p.status]}
                    </span>
                  </div>
                  {p.annonce?.ville ? (
                    <p className="mt-2 text-sm text-[var(--muted)]">📍 {p.annonce.ville.ville}</p>
                  ) : null}
                  {p.message ? (
                    <p className="mt-3 line-clamp-2 text-sm text-[var(--ink-soft)]">{p.message}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
