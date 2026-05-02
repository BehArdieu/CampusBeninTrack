import Link from "next/link";
import { notFound } from "next/navigation";
import { PARCOURS_PHASES, getPhaseById } from "@/lib/parcours";
import { PhaseChecklist } from "@/components/phase-checklist";
import type { Metadata } from "next";

export function generateStaticParams() {
  return PARCOURS_PHASES.map((p) => ({ id: p.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const phase = getPhaseById(id);
  if (!phase) return { title: "Phase introuvable" };
  return { title: phase.shortTitle };
}

export default async function PhasePage({ params }: Props) {
  const { id } = await params;
  const phase = getPhaseById(id);
  if (!phase) notFound();

  const index = PARCOURS_PHASES.findIndex((p) => p.id === id);
  const prev = index > 0 ? PARCOURS_PHASES[index - 1] : null;
  const next = index < PARCOURS_PHASES.length - 1 ? PARCOURS_PHASES[index + 1] : null;

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="text-sm text-[var(--muted)]" aria-label="Fil d'Ariane">
        <Link href="/" className="hover:text-[var(--accent)] hover:underline">
          Accueil
        </Link>
        {" · "}
        <Link href="/parcours" className="hover:text-[var(--accent)] hover:underline">
          Parcours
        </Link>
        {" · "}
        <span className="text-[var(--ink-soft)]">{phase.shortTitle}</span>
      </nav>

      <header className="mt-8 max-w-3xl border-l-4 border-[var(--forest)] pl-6">
        <p className="font-display text-4xl leading-none text-[var(--accent)]">{phase.icon}</p>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-[var(--ink)] md:text-4xl">
          {phase.title}
        </h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)]">{phase.summary}</p>
        {phase.officialHint ? (
          <p className="mt-4 rounded-2xl border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--ink-soft)]">
            <strong>Rappel : </strong>
            {phase.officialHint}
          </p>
        ) : null}
      </header>

      {phase.links?.length ? (
        <section className="mt-10">
          <h2 className="font-display text-lg text-[var(--forest)]">Liens utiles officiels ou nationaux</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {phase.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--forest)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
                >
                  {l.label}
                  <span aria-hidden className="text-[0.7rem] opacity-70">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 space-y-10">
        {phase.steps.map((step, i) => (
          <div key={`${phase.id}-${i}`} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
            <h2 className="font-display text-xl text-[var(--ink)]">{step.title}</h2>
            <ul className="mt-4 list-disc space-y-3 ps-6 text-[var(--ink-soft)] marker:text-[var(--accent)]">
              {step.body.map((paragraph, j) => (
                <li key={j}>{paragraph}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 md:p-8">
        <h2 className="font-display text-xl text-[var(--forest)]">Bon réflexe</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-1 md:gap-4">
          {phase.reflexes.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[var(--ink-soft)] shadow-sm"
            >
              <span className="font-display font-bold leading-none text-[var(--accent)]">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14" id={`checklist-${phase.id}`}>
        <PhaseChecklist
          phaseId={phase.id}
          items={phase.checklist}
          heading={`Checklist personnelle · ${phase.shortTitle}`}
        />
      </div>

      <footer className="mt-14 flex flex-col gap-6 border-t border-[var(--border)] pt-10 sm:flex-row sm:justify-between">
        <div>
          {prev ? (
            <Link
              href={`/parcours/${prev.id}`}
              className="group inline-flex flex-col rounded-2xl border border-transparent px-4 py-2 transition hover:border-[var(--border)] hover:bg-[var(--card)]"
            >
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Étape précédente</span>
              <span className="font-medium text-[var(--forest)] group-hover:underline">{prev.shortTitle}</span>
            </Link>
          ) : (
            <span className="text-sm text-[var(--muted)]">Début du parcours</span>
          )}
        </div>
        <div className="text-right">
          {next ? (
            <Link
              href={`/parcours/${next.id}`}
              className="group inline-flex flex-col rounded-2xl border border-transparent px-4 py-2 transition hover:border-[var(--border)] hover:bg-[var(--card)]"
            >
              <span className="text-xs uppercase tracking-wider text-[var(--muted)]">Étape suivante</span>
              <span className="font-medium text-[var(--accent)] group-hover:underline">{next.shortTitle}</span>
            </Link>
          ) : (
            <span className="text-sm text-[var(--muted)]">Fin du parcours proposé ici.</span>
          )}
        </div>
      </footer>
    </article>
  );
}
