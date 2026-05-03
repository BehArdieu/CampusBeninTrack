"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { logout } from "@/app/connexion/actions";

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [configured, setConfigured] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    setConfigured(true);

    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!configured) return null;

  if (!user) {
    return (
      <Link
        href="/connexion"
        className="rounded-full bg-[var(--forest)] px-4 py-2 text-xs font-semibold text-[var(--card)] transition hover:brightness-110"
      >
        Connexion
      </Link>
    );
  }

  const initial = (
    user.user_metadata?.full_name?.[0] ??
    user.email?.[0] ??
    "?"
  ).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--forest)] text-xs font-bold text-[var(--card)] transition hover:brightness-110"
        aria-label="Menu utilisateur"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg">
          <p className="truncate text-sm font-medium text-[var(--ink)]">
            {user.user_metadata?.full_name ?? user.email}
          </p>
          {user.user_metadata?.full_name && (
            <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
          )}
          <hr className="my-2 border-[var(--border)]" />
          <form action={logout}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--accent)] transition hover:bg-[var(--surface)]"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
