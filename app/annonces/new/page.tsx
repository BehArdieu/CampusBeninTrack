"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { apiFetch } from "@/lib/api/client";
import type { Ville } from "@/lib/api/types";

export default function NewAnnoncePage() {
  const router = useRouter();
  const { backendToken, ready } = useBackendAuth();

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [universite, setUniversite] = useState("");
  const [villeSearch, setVilleSearch] = useState("");
  const [villeId, setVilleId] = useState<number | null>(null);
  const [villeName, setVilleName] = useState("");
  const [villes, setVilles] = useState<Ville[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!backendToken || villeSearch.length < 2) {
      setVilles([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(() => {
      apiFetch<Ville[]>(`/villes/search?q=${encodeURIComponent(villeSearch)}`)
        .then((data) => {
          setVilles(data);
          setShowDropdown(data.length > 0);
        })
        .catch(() => setVilles([]));
    }, 300);

    return () => clearTimeout(timeout);
  }, [villeSearch, backendToken]);

  function selectVille(v: Ville) {
    setVilleId(v.id);
    setVilleName(v.ville);
    setVilleSearch(v.ville);
    setShowDropdown(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!villeId) {
      setError("Sélectionne une ville dans la liste.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiFetch("/annonces", {
        method: "POST",
        body: JSON.stringify({
          titre,
          description,
          ville_id: villeId,
          universite: universite || null,
        }),
      });
      router.push("/annonces");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de la publication.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (ready && !backendToken) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">Connexion requise</h1>
        <p className="mt-4 text-center text-[var(--ink-soft)]">
          Connecte-toi pour publier une demande de logement.
        </p>
        <Link
          href="/connexion"
          className="mt-8 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)] transition hover:brightness-110"
        >
          Se connecter
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-[var(--muted)]">
        <Link href="/annonces" className="hover:text-[var(--accent)] hover:underline">
          Annonces
        </Link>
        {" · "}
        <span className="text-[var(--ink-soft)]">Nouvelle demande</span>
      </nav>

      <h1 className="mt-6 font-display text-3xl font-bold text-[var(--ink)]">
        Publier une demande de logement
      </h1>
      <p className="mt-3 text-[var(--ink-soft)]">
        Décris ton besoin pour que la diaspora puisse te proposer des solutions.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Titre de la demande *</span>
          <input
            type="text"
            required
            maxLength={255}
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex: Cherche studio proche université de Lyon"
            className="mt-1 block w-full rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Description *</span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décris ton budget, la durée, tes critères (meublé, colocation, proximité transports...)"
            className="mt-1 block w-full rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
          />
        </label>

        <div className="relative">
          <label className="block">
            <span className="text-sm font-medium text-[var(--ink)]">Ville *</span>
            <input
              type="text"
              required
              value={villeSearch}
              onChange={(e) => {
                setVilleSearch(e.target.value);
                setVilleId(null);
                setVilleName("");
              }}
              placeholder="Tape le nom d'une ville..."
              className="mt-1 block w-full rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
            />
          </label>
          {villeId && (
            <p className="mt-1 text-xs text-[var(--forest)]">✓ {villeName} sélectionnée</p>
          )}
          {showDropdown && (
            <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
              {villes.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => selectVille(v)}
                    className="w-full px-4 py-2 text-left text-sm text-[var(--ink)] transition hover:bg-[var(--surface)]"
                  >
                    {v.ville}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[var(--ink)]">Université (optionnel)</span>
          <input
            type="text"
            value={universite}
            onChange={(e) => setUniversite(e.target.value)}
            placeholder="Ex: Université Lyon 2"
            className="mt-1 block w-full rounded-xl border border-[var(--border-strong)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[var(--forest)] px-4 py-3 text-sm font-semibold text-[var(--card)] transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "Publication en cours…" : "Publier ma demande"}
        </button>
      </form>
    </main>
  );
}
