"use client";

import Link from "next/link";
import { AuthButton } from "./auth-button";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { isDiasporaRole } from "@/lib/api/user";

const baseLinks = [
  { href: "/annonces", label: "Logement" },
  { href: "/parcours", label: "Parcours" },
  { href: "/suivi", label: "Ma progression" },
];

export function SiteHeader() {
  const { backendUser, backendToken } = useBackendAuth();
  const links =
    backendToken && isDiasporaRole(backendUser?.role)
      ? [
          ...baseLinks.slice(0, 1),
          { href: "/positionnements", label: "Mes positionnements" },
          ...baseLinks.slice(1),
        ]
      : baseLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-[var(--ink)]">
            360<span className="text-[var(--accent)]">CampusFrance</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
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
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
