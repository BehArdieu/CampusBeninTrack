"use client";

import Link from "next/link";
import { PARCOURS_PHASES } from "@/lib/parcours";
import { useTracker } from "@/hooks/use-tracker";
import { PhaseIllustration } from "@/components/illustrations";

export default function SuiviPage() {
  const { toggle, isChecked, countForIds, hydrated, authenticated } = useTracker();

  const allIds = PARCOURS_PHASES.flatMap((p) => p.checklist.map((c) => c.id));
  const globalDone = hydrated ? countForIds(allIds) : 0;
  const pct = Math.round(allIds.length ? (globalDone / allIds.length) * 100 : 0);
  const canToggle = hydrated && authenticated;

  if (hydrated && !authenticated) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">Ma progression</h1>
        <p className="mt-4 text-center text-[var(--ink-soft)]">
          Connecte-toi pour suivre ta progression et cocher les étapes de ton parcours Campus France.
        </p>
        <Link
          href="/connexion"
          className="mt-8 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)] transition hover:brightness-110"
        >
          Se connecter
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">Ma progression globale</h1>
        <p className="mt-4 text-[var(--ink-soft)]">
          Coche les cases depuis une fiche précise ou ici même. Ta progression est sauvegardée sur ton compte.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5">
          <div className="font-display text-4xl font-bold tabular-nums text-[var(--accent)]">{pct}%</div>
          <div className="min-w-[120px] flex-1">
            <div className="h-3 overflow-hidden rounded-full bg-[var(--surface)]">
              <div
                className="h-full rounded-full bg-[var(--forest)] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {hydrated ? `${globalDone} sur ${allIds.length}` : "Chargement…"}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-12 space-y-12">
        {PARCOURS_PHASES.map((phase) => (
          <section key={phase.id} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex items-start gap-4">
                <PhaseIllustration phaseId={phase.id} className="hidden h-16 w-auto shrink-0 sm:block" />
                <div>
                  <h2 className="font-display text-2xl text-[var(--ink)]">{phase.shortTitle}</h2>
                  <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">{phase.summary}</p>
                </div>
              </div>
              <Link
                href={`/parcours/${phase.id}`}
                className="shrink-0 text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Ouvrir la fiche détaillée
              </Link>
            </div>
            <ul className="mt-8 space-y-3">
              {phase.checklist.map((item) => {
                const done = hydrated && isChecked(item.id);
                return (
                  <li key={item.id}>
                    <label className={`flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-4 py-3 transition ${canToggle ? "cursor-pointer hover:border-[var(--forest)]/30" : "cursor-default opacity-60"}`}>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(item.id)}
                        disabled={!canToggle}
                        className="mt-1 h-5 w-5 shrink-0 rounded border-[var(--border-strong)] accent-[var(--accent)]"
                      />
                      <span className="min-w-0">
                        <span
                          className={`block font-medium leading-snug ${
                            done ? "text-[var(--muted)] line-through" : "text-[var(--ink)]"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.detail ? (
                          <span className="mt-1 block text-sm text-[var(--muted)]">{item.detail}</span>
                        ) : null}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
