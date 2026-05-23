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
      console.log("[tracker] init — localStorage ids:", [...local]);

      if (!supabase) {
        console.log("[tracker] Supabase non configuré → mode local uniquement");
        setChecked(local);
        setHydrated(true);
        return;
      }

      console.log("[tracker] Supabase configuré, appel getUser()…");
      try {
        const { data } = await supabase.auth.getUser();
        if (cancelled) return;
        const user = data?.user ?? null;
        userRef.current = user;
        console.log("[tracker] getUser →", user ? `connecté (${user.id})` : "non connecté");

        if (user) {
          try {
            const remote = await loadRemote(supabase, user.id);
            if (cancelled) return;
            const merged = mergeSets(local, remote);
            console.log("[tracker] merge local/remote:", { local: [...local], remote: [...remote], merged: [...merged] });
            writeLocal(merged);
            setChecked(merged);
            if (merged.size !== remote.size) {
              console.log("[tracker] remote désynchronisé → upsert");
              await saveRemote(supabase, user.id, merged);
            }
          } catch (err) {
            console.warn("[tracker] erreur chargement remote, fallback local:", err);
            setChecked(local);
          }
        } else {
          setChecked(local);
        }
      } catch (err) {
        console.warn("[tracker] erreur getUser(), fallback local:", err);
        if (!cancelled) setChecked(local);
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
      const action = next.has(id) ? "uncheck" : "check";
      if (next.has(id)) next.delete(id);
      else next.add(id);

      console.log(`[tracker] toggle "${id}" → ${action} (total: ${next.size})`);
      writeLocal(next);

      const supabase = clientRef.current;
      if (supabase && userRef.current && !savingRef.current) {
        savingRef.current = true;
        console.log("[tracker] sync remote…");
        saveRemote(supabase, userRef.current.id, next)
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

  return { checked, toggle, isChecked, countForIds, hydrated };
}
