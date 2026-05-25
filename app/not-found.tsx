import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl font-bold text-[var(--ink)]">Page introuvable</h1>
      <p className="mt-4 max-w-md text-[var(--muted)]">Ce chemin ne correspond à aucune fiche 360CampusFrance.</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
      >
        Retour à l’accueil
      </Link>
    </main>
  );
}
