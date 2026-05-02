"use client";

import { PARCOURS_PHASES } from "@/lib/parcours";
import { useTracker } from "@/hooks/use-tracker";

const allIds = PARCOURS_PHASES.flatMap((p) => p.checklist.map((c) => c.id));

export function GlobalProgressRibbon() {
  const { countForIds, hydrated } = useTracker();

  const done = hydrated ? countForIds(allIds) : 0;
  const pct = Math.round(allIds.length ? (done / allIds.length) * 100 : 0);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink-soft)]">
      <span className="tabular-nums font-semibold text-[var(--accent)]">{pct}%</span>
      <div className="h-2 min-w-[88px] flex-1 rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="hidden text-[var(--muted)] sm:inline">
        {hydrated ? `${done} / ${allIds.length}` : "…"}
      </span>
    </div>
  );
}
