"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBackendAuth } from "@/hooks/use-backend-auth";
import { apiFetch } from "@/lib/api/client";
import {
  getMyPositionnementForAnnonce,
  listPositionnementsForAnnonce,
  syncPositionnementWithAnnonce,
  syncPositionnementsWithAnnonce,
} from "@/lib/api/positionnements";
import { isDiasporaRole, isEtudiantRole } from "@/lib/api/user";
import { PositionnementForm } from "@/components/positionnement-form";
import { AnnoncePositionnementsPanel } from "@/components/annonce-positionnements-panel";
import type { Annonce, Positionnement } from "@/lib/api/types";

export default function AnnonceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { backendToken, backendUser, ready } = useBackendAuth();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [positionnements, setPositionnements] = useState<Positionnement[]>([]);
  const [myPositionnement, setMyPositionnement] = useState<Positionnement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const annonceId = Number(id);
  const isOwner =
    annonce && backendUser
      ? Number(annonce.user_id) === Number(backendUser.id)
      : false;
  const isDiaspora = isDiasporaRole(backendUser?.role);
  const isEtudiant = isEtudiantRole(backendUser?.role);

  useEffect(() => {
    if (!ready || !backendToken || !id || !backendUser) return;

    let cancelled = false;

    async function load() {
      const user = backendUser;
      if (!user) return;

      setLoading(true);
      try {
        const data = await apiFetch<Annonce>(`/annonces/${id}`);
        if (cancelled) return;

        setAnnonce(data);
        const owner = Number(data.user_id) === Number(user.id);

        if (owner) {
          const raw = data.positionnements?.length
            ? data.positionnements
            : await listPositionnementsForAnnonce(annonceId).catch(() => [] as Positionnement[]);
          setPositionnements(syncPositionnementsWithAnnonce(data, raw));
          setMyPositionnement(null);
        } else if (isDiasporaRole(user.role)) {
          const mine = await getMyPositionnementForAnnonce(annonceId, user.id, data);
          if (cancelled) return;
          setMyPositionnement(mine);
          setPositionnements([]);
        } else {
          setPositionnements([]);
          setMyPositionnement(null);
        }

        setError(null);
      } catch (err: unknown) {
        if (cancelled) return;
        const status = err instanceof Object && "status" in err ? (err as { status: number }).status : 0;
        setError(status === 404 ? "Annonce introuvable." : "Erreur de chargement.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [ready, backendToken, id, annonceId, backendUser]);

  function handlePositionnementCreated(p: Positionnement) {
    setMyPositionnement(p);
    setPositionnements((prev) => {
      if (prev.some((x) => x.id === p.id)) return prev;
      return [p, ...prev];
    });
  }

  function handlePositionnementUpdated(updated: Positionnement) {
    setPositionnements((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  }

  if (!ready || loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-32 rounded bg-[var(--surface)]" />
          <div className="h-9 w-3/4 rounded bg-[var(--surface)]" />
          <div className="h-4 w-full rounded bg-[var(--surface)]" />
          <div className="h-4 w-2/3 rounded bg-[var(--surface)]" />
          <div className="mt-8 h-40 rounded-2xl bg-[var(--surface)]" />
        </div>
      </main>
    );
  }

  if (!backendToken) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Connexion requise</h1>
        <Link
          href="/connexion"
          className="mt-6 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-[var(--card)]"
        >
          Se connecter
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-red-700">{error}</p>
          <Link href="/annonces" className="mt-4 inline-block text-sm text-[var(--accent)] underline">
            Retour aux annonces
          </Link>
        </div>
      </main>
    );
  }

  if (!annonce) return null;

  const showDiasporaForm = !isOwner && (isDiaspora || !isEtudiant);
  const showStudentPanel = isOwner;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-[var(--muted)]">
        <Link href="/annonces" className="hover:text-[var(--accent)] hover:underline">
          Annonces
        </Link>
        {" · "}
        <span className="text-[var(--ink-soft)]">{annonce.titre}</span>
      </nav>

      <article className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-[var(--ink)]">{annonce.titre}</h1>
          <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {annonce.status ?? "active"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
          {annonce.ville && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
              📍 {annonce.ville.ville}
            </span>
          )}
          {annonce.universite && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
              🎓 {annonce.universite}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1">
            📅{" "}
            {new Date(annonce.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          {(annonce.positionnements_count ?? positionnements.length) > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--forest)]/10 px-3 py-1 text-[var(--forest)]">
              🤝 {annonce.positionnements_count ?? positionnements.length} positionnement
              {(annonce.positionnements_count ?? positionnements.length) > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {annonce.user && !isOwner && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--forest)] text-xs font-bold text-[var(--card)]">
              {annonce.user.prenom?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="text-sm text-[var(--ink-soft)]">
              {annonce.user.prenom} {annonce.user.nom}
            </span>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--ink)]">Description</h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--ink-soft)]">
            {annonce.description}
          </p>
        </div>

        {showStudentPanel && (
          <div className="mt-10">
            <AnnoncePositionnementsPanel
              annonceId={annonce.id}
              positionnements={positionnements}
              canManage={isOwner}
              onUpdate={handlePositionnementUpdated}
              onAnnonceChange={setAnnonce}
            />
          </div>
        )}

        {showDiasporaForm && (
          <div className="mt-10">
            <PositionnementForm
              annonceId={annonce.id}
              annonce={annonce}
              diasporaUserId={backendUser?.id}
              existing={myPositionnement}
              onSuccess={handlePositionnementCreated}
            />
          </div>
        )}

        {isEtudiant && !isOwner && (
          <p className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-3 text-sm text-[var(--muted)]">
            Cette annonce appartient à un autre étudiant. Seuls les membres de la diaspora peuvent s’y
            positionner.
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/annonces"
            className="inline-flex rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium text-[var(--ink-soft)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
          >
            ← Retour aux annonces
          </Link>
          {isDiaspora && (
            <Link
              href="/positionnements"
              className="inline-flex rounded-full border border-[var(--forest)] px-5 py-2 text-sm font-medium text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
            >
              Mes positionnements
            </Link>
          )}
        </div>
      </article>
    </main>
  );
}
