"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, SupabaseClient } from "@supabase/supabase-js";

const STORAGE_KEY = "campusbenintrack-checklist-v1";

function readLocal(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeLocal(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

async function loadRemote(supabase: SupabaseClient, userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from("user_progress")
    .select("checked_ids")
    .eq("user_id", userId)
    .single();
  if (data?.checked_ids && Array.isArray(data.checked_ids)) {
    return new Set(data.checked_ids as string[]);
  }
  return new Set();
}

async function saveRemote(supabase: SupabaseClient, userId: string, set: Set<string>) {
  await supabase.from("user_progress").upsert(
    { user_id: userId, checked_ids: [...set], updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
}

function mergeSets(a: Set<string>, b: Set<string>): Set<string> {
  const merged = new Set(a);
  for (const id of b) merged.add(id);
  return merged;
}

export function useTracker() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const userRef = useRef<User | null>(null);
  const clientRef = useRef<SupabaseClient | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    clientRef.current = supabase;
    let cancelled = false;

    async function init() {
      const local = readLocal();

      if (!supabase) {
        setChecked(local);
        setHydrated(true);
        return;
      }

      try {
        const { data } = await supabase.auth.getUser();
        if (cancelled) return;
        const user = data?.user ?? null;
        userRef.current = user;

        if (user) {
          try {
            const remote = await loadRemote(supabase, user.id);
            if (cancelled) return;
            const merged = mergeSets(local, remote);
            writeLocal(merged);
            setChecked(merged);
            if (merged.size !== remote.size) {
              await saveRemote(supabase, user.id, merged);
            }
          } catch {
            setChecked(local);
          }
        } else {
          setChecked(local);
        }
      } catch {
        if (!cancelled) setChecked(local);
      }
      if (!cancelled) setHydrated(true);
    }

    init();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const user = session?.user ?? null;
          userRef.current = user;
          if (user) {
            try {
              const local = readLocal();
              const remote = await loadRemote(supabase, user.id);
              const merged = mergeSets(local, remote);
              writeLocal(merged);
              setChecked(merged);
              if (merged.size !== remote.size) {
                await saveRemote(supabase, user.id, merged);
              }
            } catch {
              // Keep local state on remote failure
            }
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
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeLocal(next);

      const supabase = clientRef.current;
      if (supabase && userRef.current && !savingRef.current) {
        savingRef.current = true;
        saveRemote(supabase, userRef.current.id, next).finally(() => {
          savingRef.current = false;
        });
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

  return { checked, toggle, isChecked, countForIds, hydrated };
}
