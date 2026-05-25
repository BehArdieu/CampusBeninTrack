"use client";

import Link from "next/link";
import type { ChecklistItem } from "@/lib/parcours";
import { useTracker } from "@/hooks/use-tracker";
import { ChecklistSkeleton } from "@/components/tracker-skeleton";

type Props = {
  items: ChecklistItem[];
  phaseId: string;
  heading?: string;
};

export function PhaseChecklist({ items, phaseId, heading = "Ma checklist" }: Props) {
  const { toggle, isChecked, hydrated, authenticated } = useTracker();

  if (!items.length) return null;

  if (!hydrated) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="font-display text-xl text-[var(--ink)]">{heading}</h2>
        <div className="mt-5">
          <ChecklistSkeleton count={items.length} />
        </div>
      </section>
    );
  }

  const canToggle = authenticated;

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
      aria-labelledby={`checklist-heading-${phaseId}`}
    >
      <h2 id={`checklist-heading-${phaseId}`} className="font-display text-xl text-[var(--ink)]">
        {heading}
      </h2>

      {!authenticated ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-4">
          <p className="text-sm text-[var(--ink-soft)]">
            Connecte-toi pour cocher les étapes et sauvegarder ta progression.
          </p>
          <Link
            href="/connexion"
            className="rounded-full bg-[var(--forest)] px-5 py-2 text-sm font-semibold text-[var(--card)] transition hover:brightness-110"
          >
            Se connecter
          </Link>
        </div>
      ) : (
        <p className="mt-2 text-sm text-[var(--muted)]">
          Ta progression est sauvegardée sur ton compte.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {items.map((item) => {
          const done = isChecked(item.id);
          return (
            <li key={item.id}>
              <label className={`group flex gap-3 rounded-xl border border-transparent px-1 py-2 transition ${canToggle ? "cursor-pointer hover:border-[var(--border)] hover:bg-[var(--surface)]" : "cursor-default opacity-60"}`}>
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(item.id)}
                  disabled={!canToggle}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-[var(--border-strong)] accent-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                  aria-describedby={item.detail ? `hint-${item.id}` : undefined}
                />
                <span className="min-w-0">
                  <span
                    className={`block font-medium leading-snug ${
                      done ? "text-[var(--muted)] line-through decoration-[var(--accent)]/50" : "text-[var(--ink)]"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.detail ? (
                    <span id={`hint-${item.id}`} className="mt-1 block text-sm text-[var(--muted)]">
                      {item.detail}
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
