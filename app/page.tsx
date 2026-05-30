import Link from "next/link";
import { PARCOURS_PHASES } from "@/lib/parcours";
import { GlobalProgressRibbon } from "@/components/global-progress";
import { IllustrationHero, PhaseIllustration } from "@/components/illustrations";

export default function HomePage() {
  return (
    <main>
      {/* Hero — Recherche de logement */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(-12deg,var(--forest)_33%,transparent_33%,transparent_66%,var(--accent)_66%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col-reverse items-start gap-8 lg:flex-row lg:items-center lg:gap-12">
            <div className="max-w-2xl flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--forest)]">
                Étudiants africains • Diaspora • Logement en France
              </p>
              <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.65rem)] font-bold leading-[1.08] text-[var(--ink)]">
                Trouve ton logement en France grâce à la diaspora.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)]">
                360CampusFrance met en relation les étudiants africains qui arrivent en France
                avec des membres de la diaspora prêts à les aider dans leur recherche de logement.
                Publie ta demande, reçois des propositions concrètes, et installe-toi sereinement.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/annonces"
                  className="inline-flex rounded-full bg-[var(--forest)] px-7 py-3 text-sm font-semibold text-[var(--card)] shadow-md transition hover:brightness-110"
                >
                  Voir les annonces
                </Link>
                <Link
                  href="/annonces/new"
                  className="inline-flex rounded-full border-2 border-[var(--forest)] bg-transparent px-7 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
                >
                  Publier une demande
                </Link>
              </div>
            </div>
            <IllustrationHero className="mx-auto w-full max-w-xs shrink-0 lg:max-w-sm" />
          </div>

          {/* Comment ça marche */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-2xl">
                📝
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--ink)]">Publie ta demande</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Décris ton besoin : ville, université, budget. La diaspora verra ton annonce.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-2xl">
                🤝
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--ink)]">Reçois des propositions</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Des membres de la diaspora se positionnent et te proposent des logements concrets.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-2xl">
                🏠
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-[var(--ink)]">Installe-toi</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Visite, accepte une offre, signe ton contrat. Tu arrives avec un toit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section secondaire — Parcours Campus France */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                Parcours Campus France
              </h2>
              <p className="mt-2 max-w-lg text-[var(--ink-soft)]">
                En parallèle de ta recherche de logement, suis les étapes administratives
                pour arriver sereinement en France.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/parcours"
                className="inline-flex rounded-full bg-[var(--card)] border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--forest)]"
              >
                Explorer le parcours
              </Link>
              <Link
                href="/suivi"
                className="inline-flex rounded-full bg-[var(--card)] border border-[var(--border)] px-5 py-2 text-sm font-semibold text-[var(--accent)] transition hover:border-[var(--accent)]"
              >
                Ma progression
              </Link>
            </div>
          </div>
          <div className="mt-6">
            <GlobalProgressRibbon />
          </div>

          <ol className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {PARCOURS_PHASES.map((phase, i) => (
              <li key={phase.id}>
                <Link
                  href={`/parcours/${phase.id}`}
                  className="group flex h-full flex-col items-center rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-20px_rgb(42_79_68/0.55)]"
                >
                  <span className="self-end rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                    étape {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <PhaseIllustration phaseId={phase.id} className="mt-2 h-24 w-auto" />
                  <h2 className="mt-4 self-start font-display text-xl font-semibold text-[var(--ink)] transition group-hover:text-[var(--forest)]">
                    {phase.shortTitle}
                  </h2>
                  <p className="mt-3 flex-1 self-start text-sm leading-relaxed text-[var(--muted)]">{phase.summary}</p>
                  <span className="mt-6 self-start text-sm font-semibold text-[var(--accent)] underline-offset-4 group-hover:underline">
                    Voir les consignes
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
