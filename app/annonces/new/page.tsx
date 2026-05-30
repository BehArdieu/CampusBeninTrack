import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Publier une demande de logement" };

export default function NewAnnoncePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-[var(--muted)]">
        <Link href="/annonces" className="hover:text-[var(--accent)] hover:underline">
          Annonces
        </Link>
        {" · "}
        <span className="text-[var(--ink-soft)]">Nouvelle demande</span>
      </nav>

      <h1 className="mt-6 font-display text-3xl font-bold text-[var(--ink)]">
        Publier une demande de logement
      </h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Décris ton besoin pour que la diaspora puisse te proposer des solutions.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--border)] bg-[var(--surface)]/50 px-6 py-16 text-center">
        <div className="text-4xl">📝</div>
        <h2 className="mt-4 font-display text-xl font-semibold text-[var(--ink)]">
          Formulaire bientôt disponible
        </h2>
        <p className="mt-2 max-w-md text-[var(--muted)]">
          Tu pourras indiquer ta ville, ton université, et décrire ton besoin en logement.
        </p>
      </div>
    </main>
  );
}
