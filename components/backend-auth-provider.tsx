"use client";

import type { ReactNode } from "react";
import { BackendAuthContext, useBackendAuthProvider } from "@/hooks/use-backend-auth";

export function BackendAuthProvider({ children }: { children: ReactNode }) {
  const state = useBackendAuthProvider();
  return (
    <BackendAuthContext value={state}>
      {children}
    </BackendAuthContext>
  );
}
