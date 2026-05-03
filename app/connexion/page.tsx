import { loginWithEmail, loginWithGoogle } from "./actions";

export const metadata = { title: "Connexion — CampusBeninTrack" };

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-[var(--ink)]">
        Connexion
      </h1>
      <p className="mt-3 text-center text-[var(--ink-soft)]">
        Connecte-toi pour sauvegarder ta progression sur tous tes appareils.
      </p>

      {params.error && (
        <div className="mt-6 w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error === "email" && "Erreur lors de l'envoi du lien magique. Réessaie."}
          {params.error === "google" && "Erreur lors de la connexion avec Google. Réessaie."}
          {params.error === "auth" && "Erreur d'authentification. Réessaie."}
          {params.error === "confirm" && "Le lien de confirmation a expiré ou est invalide."}
        </div>
      )}

      {params.success === "magic-link" && (
        <div className="mt-6 w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Un lien magique a été envoyé à ton adresse e-mail. Vérifie ta boîte de réception.
        </div>
      )}

      <form action={loginWithGoogle} className="mt-8 w-full">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--forest)] hover:shadow-sm"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuer avec Google
        </button>
      </form>

      <div className="my-6 flex w-full items-center gap-4">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs uppercase tracking-widest text-[var(--muted)]">ou</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form action={loginWithEmail} className="w-full space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Adresse e-mail</span>
          <input
            type="email"
            name="email"
            required
            placeholder="toi@example.com"
            className="mt-1 block w-full rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--forest)] px-4 py-3 text-sm font-semibold text-[var(--card)] transition hover:brightness-110"
        >
          Recevoir un lien magique
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-[var(--muted)]">
        Pas de mot de passe requis — un lien sécurisé est envoyé par e-mail.
        <br />
        Sans connexion, ta progression reste enregistrée localement.
      </p>
    </main>
  );
}
