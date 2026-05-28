"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { createClient } from "@/lib/supabase/client";
import { syncWithBackend, logoutBackend } from "@/lib/api/auth";
import { getStoredToken } from "@/lib/api/client";
import type { User } from "@supabase/supabase-js";

interface BackendAuthState {
  supabaseUser: User | null;
  backendToken: string | null;
  ready: boolean;
}

export const BackendAuthContext = createContext<BackendAuthState>({
  supabaseUser: null,
  backendToken: null,
  ready: false,
});

export function useBackendAuth() {
  return useContext(BackendAuthContext);
}

export function useBackendAuthProvider(): BackendAuthState {
  const [state, setState] = useState<BackendAuthState>({
    supabaseUser: null,
    backendToken: null,
    ready: false,
  });
  const syncingRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setState({ supabaseUser: null, backendToken: null, ready: true });
      return;
    }

    async function handleUser(user: User | null) {
      if (syncingRef.current) return;
      syncingRef.current = true;

      try {
        if (user) {
          const existing = getStoredToken();
          const token = existing || (await syncWithBackend(user));
          setState({ supabaseUser: user, backendToken: token, ready: true });
        } else {
          await logoutBackend();
          setState({ supabaseUser: null, backendToken: null, ready: true });
        }
      } finally {
        syncingRef.current = false;
      }
    }

    supabase.auth.getUser().then(({ data }) => handleUser(data?.user ?? null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const user = session?.user ?? null;
        if (!user) {
          await logoutBackend();
          setState({ supabaseUser: null, backendToken: null, ready: true });
        } else {
          await handleUser(user);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
