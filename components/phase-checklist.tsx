"use client";

import type { ChecklistItem } from "@/lib/parcours";
import { useTracker } from "@/hooks/use-tracker";

type Props = {
  items: ChecklistItem[];
  phaseId: string;
  heading?: string;
};

export function PhaseChecklist({ items, phaseId, heading = "Ma checklist" }: Props) {
  const { toggle, isChecked, hydrated } = useTracker();

  if (!items.length) return null;

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
      aria-labelledby={`checklist-heading-${phaseId}`}
    >
      <h2 id={`checklist-heading-${phaseId}`} className="font-display text-xl text-[var(--ink)]">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Cochages enregistrés uniquement sur cet appareil (navigateur).
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => {
          const done = hydrated && isChecked(item.id);
          return (
            <li key={item.id}>
              <label className="group flex cursor-pointer gap-3 rounded-xl border border-transparent px-1 py-2 transition hover:border-[var(--border)] hover:bg-[var(--surface)]">
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggle(item.id)}
                  disabled={!hydrated}
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
