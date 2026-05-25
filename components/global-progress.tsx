"use client";

import Link from "next/link";
import { PARCOURS_PHASES } from "@/lib/parcours";
import { useTracker } from "@/hooks/use-tracker";
import { ProgressRibbonSkeleton } from "@/components/tracker-skeleton";

const allIds = PARCOURS_PHASES.flatMap((p) => p.checklist.map((c) => c.id));

export function GlobalProgressRibbon() {
  const { countForIds, hydrated, authenticated } = useTracker();

  if (!hydrated) return <ProgressRibbonSkeleton />;

  if (!authenticated) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink-soft)]">
        <Link
          href="/connexion"
          className="font-semibold text-[var(--forest)] underline-offset-4 hover:underline"
        >
          Connecte-toi
        </Link>
        <span>pour suivre ta progression</span>
      </div>
    );
  }

  const done = countForIds(allIds);
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
        {done} / {allIds.length}
      </span>
    </div>
  );
}
