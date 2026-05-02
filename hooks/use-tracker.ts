"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "campusbenintrack-checklist-v1";

function readSet(): Set<string> {
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

function writeSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export function useTracker() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(readSet());
    setHydrated(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeSet(next);
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
