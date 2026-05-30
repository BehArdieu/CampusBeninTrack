import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Annonces logement" };

export default function AnnoncesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
            Recherches de logement
          </h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            Les étudiants publient leurs besoins, la diaspora propose des solutions.
          </p>
        </div>
        <Link
          href="/annonces/new"
          className="inline-flex shrink-0 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)] shadow-md transition hover:brightness-110"
        >
          Publier une demande
        </Link>
      </div>

      <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)]/50 px-6 py-20 text-center">
        <div className="text-4xl">🏠</div>
        <h2 className="mt-4 font-display text-xl font-semibold text-[var(--ink)]">
          Bientôt disponible
        </h2>
        <p className="mt-2 max-w-md text-[var(--muted)]">
          Les annonces de recherche de logement apparaîtront ici.
          Connecte-toi pour publier ta première demande.
        </p>
        <Link
          href="/connexion"
          className="mt-6 inline-flex rounded-full border-2 border-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
