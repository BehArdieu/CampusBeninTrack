import Link from "next/link";
import { PARCOURS_PHASES } from "@/lib/parcours";

export const metadata = {
  title: "Parcours complet",
};

export default function ParcoursIndexPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-2xl border-l-4 border-[var(--accent)] pl-6">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">
          Parcours Campus France&nbsp;—&nbsp;départs du&nbsp;Bénin
        </h1>
        <p className="mt-4 text-[var(--ink-soft)]">
          Chaque fiche liste les grandes étapes, des rappels pratiques et une checklist locale à cocher. La
          dernière fiche prolonge jusqu’après votre arrivée en France (titres séjour en ligne finances sociales
          et premier contact avec l’impôt sur le revenu).
        </p>
      </header>

      <nav className="mt-14 relative" aria-label="Liste des phases">
        <div className="absolute left-[1.125rem] top-3 bottom-3 w-px bg-[var(--border-strong)] md:left-[1.25rem]" />
        <ul className="relative space-y-10">
          {PARCOURS_PHASES.map((phase, i) => (
            <li key={phase.id} className="flex gap-5 md:gap-8">
              <div className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] font-display text-sm font-bold text-[var(--card)] shadow-lg ring-[6px] ring-[var(--paper)]">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
                <Link href={`/parcours/${phase.id}`} className="inline-block font-display text-2xl font-semibold text-[var(--ink)] underline-offset-8 hover:text-[var(--forest)] hover:underline">
                  {phase.title}
                </Link>
                <p className="mt-3 text-[var(--muted)]">{phase.summary}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/parcours/${phase.id}`}
                    className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Lire la fiche
                  </Link>
                  <Link
                    href={`/parcours/${phase.id}#checklist-${phase.id}`}
                    className="rounded-full border border-[var(--border-strong)] px-5 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
                  >
                    Aller à la checklist
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
