import type { User } from "@supabase/supabase-js";
import { apiFetch, storeToken, clearToken, getStoredToken } from "./client";
import type { BackendUser } from "./types";

const USER_KEY = "360cf-api-user";

interface BackendAuthResponse {
  token: string;
  user: BackendUser;
}

export function storeBackendUser(user: BackendUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredBackendUser(): BackendUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BackendUser;
  } catch {
    return null;
  }
}

export function clearBackendUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
}

function extractGoogleId(user: User): string | null {
  const identity = user.identities?.find((i) => i.provider === "google");
  return identity?.id ?? user.user_metadata?.sub ?? null;
}

function splitFullName(fullName: string): { nom: string; prenom: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { prenom: parts[0] || "", nom: "" };
  const prenom = parts[0];
  const nom = parts.slice(1).join(" ");
  return { prenom, nom };
}

export async function syncWithBackend(user: User): Promise<string | null> {
  const googleId = extractGoogleId(user);
  if (!googleId) {
    console.warn("[api-auth] pas de google_id trouvé dans le profil Supabase");
    return null;
  }

  const { prenom, nom } = splitFullName(
    user.user_metadata?.full_name ?? user.email ?? "",
  );

  try {
    const res = await apiFetch<BackendAuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        google_id: googleId,
        email: user.email,
        nom,
        prenom,
        photo: user.user_metadata?.avatar_url ?? null,
      }),
    });

    console.log("[api-auth] ✔ sync backend réussie, token obtenu");
    storeToken(res.token);
    if (res.user) storeBackendUser(res.user);
    return res.token;
  } catch (err) {
    console.warn("[api-auth] ✘ erreur sync backend:", err);
    return null;
  }
}

export async function logoutBackend(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      console.log("[api-auth] ✔ logout backend");
    } catch {
      // best effort
    }
  }
  clearToken();
  clearBackendUser();
}
