"use client";

import { useEffect, useState } from "react";
import { formatContactName, resolveUserContact } from "@/lib/api/contacts";
import type { PublicUserContact, UserProfileEmbed } from "@/lib/api/types";

type Props = {
  title: string;
  userId: number;
  annonceId?: number;
  positionnementId?: number;
  embedded?: UserProfileEmbed | null;
  etudiant?: boolean;
  className?: string;
};

export function UserContactCard({
  title,
  userId,
  annonceId,
  positionnementId,
  embedded,
  etudiant = false,
  className = "",
}: Props) {
  const [contact, setContact] = useState<PublicUserContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    resolveUserContact({
      userId,
      annonceId,
      positionnementId,
      embedded,
      etudiant,
    })
      .then((resolved) => {
        if (!cancelled) setContact(resolved);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, annonceId, positionnementId, embedded, etudiant]);

  const displayName =
    contact
      ? formatContactName(contact)
      : embedded
        ? formatContactName(embedded)
        : null;

  return (
    <section
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 ${className}`}
      aria-busy={loading}
    >
      <h3 className="font-display text-lg font-semibold text-[var(--ink)]">{title}</h3>

      {loading ? (
        <div className="mt-4 animate-pulse space-y-2">
          <div className="h-4 w-40 rounded bg-[var(--surface)]" />
          <div className="h-4 w-56 rounded bg-[var(--surface)]" />
        </div>
      ) : contact?.email || contact?.telephone ? (
        <div className="mt-4 space-y-3">
          {displayName ? (
            <p className="text-sm font-medium text-[var(--ink)]">{displayName}</p>
          ) : null}
          {contact.email ? (
            <p className="text-sm text-[var(--ink-soft)]">
              <span className="font-medium text-[var(--ink)]">E-mail : </span>
              <a
                href={`mailto:${contact.email}`}
                className="text-[var(--forest)] underline decoration-[var(--forest)]/30 underline-offset-2 hover:brightness-110"
              >
                {contact.email}
              </a>
            </p>
          ) : null}
          {contact.telephone ? (
            <p className="text-sm text-[var(--ink-soft)]">
              <span className="font-medium text-[var(--ink)]">Téléphone : </span>
              <a
                href={`tel:${contact.telephone.replace(/\s/g, "")}`}
                className="text-[var(--forest)] underline decoration-[var(--forest)]/30 underline-offset-2 hover:brightness-110"
              >
                {contact.telephone}
              </a>
            </p>
          ) : null}
          <p className="text-xs text-[var(--muted)]">
            {etudiant
              ? "Contacte l’étudiant pour organiser la suite de l’accompagnement."
              : "Contacte ton accompagnant pour organiser la suite de la recherche de logement."}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[var(--ink-soft)]">
          {displayName ? (
            <>
              <span className="font-medium text-[var(--ink)]">{displayName}</span>
              {" — "}
            </>
          ) : null}
          Les coordonnées ne sont pas encore disponibles via l&apos;API. Réessaie après
          rechargement de la page ou utilise le message échangé lors du positionnement.
        </p>
      )}
    </section>
  );
}
