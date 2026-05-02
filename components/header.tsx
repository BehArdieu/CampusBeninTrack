import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/parcours", label: "Parcours complet" },
  { href: "/suivi", label: "Ma progression" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            Campus<span className="text-[var(--accent)]">BeninTrack</span>
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline">
            Campus France
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-[var(--ink-soft)] transition hover:bg-[var(--card)] hover:text-[var(--ink)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
