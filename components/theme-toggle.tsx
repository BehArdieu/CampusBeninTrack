"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Passer en mode jour" : "Passer en mode nuit"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-[var(--card)]"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
