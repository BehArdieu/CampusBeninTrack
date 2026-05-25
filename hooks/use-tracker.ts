"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, SupabaseClient } from "@supabase/supabase-js";

const STORAGE_PREFIX = "campusbenintrack-checklist-";
const AUTH_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout après ${ms}ms`)), ms),
    ),
  ]);
}

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function readLocal(userId: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeLocal(userId: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify([...set]));
}

function clearLegacyLocal() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("campusbenintrack-checklist-v1");
}

const DB_TIMEOUT_MS = 5000;

async function loadRemote(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const query = supabase
    .from("user_progress")
    .select("checked_ids")
    .eq("user_id", userId)
    .single();
  const { data } = await withTimeout(Promise.resolve(query), DB_TIMEOUT_MS);
  if (data?.checked_ids && Array.isArray(data.checked_ids)) {
    return new Set(data.checked_ids as string[]);
  }
  return new Set();
}

async function saveRemote(supabase: SupabaseClient, userId: string, set: Set<string>) {
  const query = supabase.from("user_progress").upsert(
    { user_id: userId, checked_ids: [...set], updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  await withTimeout(Promise.resolve(query), DB_TIMEOUT_MS);
}

export function useTracker() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const userRef = useRef<User | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    clientRef.current = supabase;
    let cancelled = false;

    async function init() {
      clearLegacyLocal();

      if (!supabase) {
        console.log("[tracker] Supabase non configuré → connexion requise mais impossible");
        setHydrated(true);
        return;
      }

      console.log("[tracker] Supabase configuré, appel getUser()…");
      try {
        const { data } = await withTimeout(supabase.auth.getUser(), AUTH_TIMEOUT_MS);
        if (cancelled) return;
        const user = data?.user ?? null;
        userRef.current = user;
        console.log("[tracker] getUser →", user ? `connecté (${user.id})` : "non connecté");

        if (user) {
          setAuthenticated(true);
          const cached = readLocal(user.id);
          try {
            const remote = await loadRemote(supabase, user.id);
            if (cancelled) return;
            console.log("[tracker] remote chargé:", [...remote]);
            writeLocal(user.id, remote);
            setChecked(remote);
          } catch (err) {
            console.warn("[tracker] erreur chargement remote, fallback cache user:", err);
            setChecked(cached);
          }
        }
      } catch (err) {
        console.warn("[tracker] erreur getUser():", err);
      }
      if (!cancelled) {
        console.log("[tracker] ✔ hydraté");
        setHydrated(true);
      }
    }

    init();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const user = session?.user ?? null;
          userRef.current = user;
          setAuthenticated(!!user);
          console.log("[tracker] authStateChange →", user ? `connecté (${user.id})` : "déconnecté");
          if (user) {
            try {
              const remote = await loadRemote(supabase, user.id);
              console.log("[tracker] authStateChange remote:", [...remote]);
              writeLocal(user.id, remote);
              setChecked(remote);
            } catch (err) {
              console.warn("[tracker] authStateChange erreur:", err);
              setChecked(readLocal(user.id));
            }
          } else {
            setChecked(new Set());
          }
        },
      );

      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    }

    return () => { cancelled = true; };
  }, []);

  const toggle = useCallback((id: string) => {
    if (!userRef.current) {
      console.warn("[tracker] toggle bloqué — connexion requise");
      return;
    }
    const userId = userRef.current.id;

    setChecked((prev) => {
      const next = new Set(prev);
      const action = next.has(id) ? "uncheck" : "check";
      if (next.has(id)) next.delete(id);
      else next.add(id);

      console.log(`[tracker] toggle "${id}" → ${action} (total: ${next.size})`);
      writeLocal(userId, next);

      const supabase = clientRef.current;
      if (supabase && !savingRef.current) {
        savingRef.current = true;
        console.log("[tracker] sync remote…");
        saveRemote(supabase, userId, next)
          .then(() => console.log("[tracker] ✔ remote sauvegardé"))
          .catch((err) => console.warn("[tracker] ✘ erreur sync remote:", err))
          .finally(() => { savingRef.current = false; });
      }

      return next;
    });
  }, []);

  const isChecked = useCallback(
    (id: string) => checked.has(id),
    [checked],
  );

  const countForIds = useCallback(
    (ids: string[]) => ids.filter((id) => checked.has(id)).length,
    [checked],
  );

  return { checked, toggle, isChecked, countForIds, hydrated, authenticated };
}
