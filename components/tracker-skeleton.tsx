"use client";

export function ChecklistSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex gap-3 rounded-xl border border-[var(--border)] px-4 py-3"
        >
          <div className="mt-1 h-5 w-5 shrink-0 rounded bg-[var(--surface)]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-[var(--surface)]" />
            {i % 2 === 0 && (
              <div className="h-3 w-1/2 rounded bg-[var(--surface)]" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressRibbonSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
      <div className="h-4 w-8 rounded bg-[var(--surface)]" />
      <div className="h-2 min-w-[88px] flex-1 rounded-full bg-[var(--surface)]" />
      <div className="hidden h-4 w-16 rounded bg-[var(--surface)] sm:block" />
    </div>
  );
}

export function SuiviSkeleton() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl animate-pulse">
        <div className="h-9 w-64 rounded bg-[var(--surface)]" />
        <div className="mt-4 h-5 w-96 rounded bg-[var(--surface)]" />
        <div className="mt-8 flex items-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5">
          <div className="h-10 w-14 rounded bg-[var(--surface)]" />
          <div className="min-w-[120px] flex-1">
            <div className="h-3 rounded-full bg-[var(--surface)]" />
            <div className="mt-2 h-4 w-24 rounded bg-[var(--surface)]" />
          </div>
        </div>
      </div>
      <div className="mt-12 space-y-12">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8"
          >
            <div className="h-7 w-48 rounded bg-[var(--surface)]" />
            <div className="mt-2 h-4 w-80 rounded bg-[var(--surface)]" />
            <div className="mt-8 space-y-3">
              <ChecklistSkeleton count={3} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
