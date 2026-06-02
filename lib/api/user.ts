import { apiFetch } from "./client";
import type { BackendUser } from "./types";

export async function fetchCurrentUser(): Promise<BackendUser> {
  return apiFetch<BackendUser>("/user");
}

export function isDiasporaRole(role: string | undefined | null): boolean {
  return role?.toLowerCase() === "diaspora";
}

export function isEtudiantRole(role: string | undefined | null): boolean {
  const r = role?.toLowerCase();
  return r === "etudiant" || r === "student" || r === "étudiant";
}
