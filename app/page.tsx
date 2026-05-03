import Link from "next/link";
import { PARCOURS_PHASES } from "@/lib/parcours";
import { GlobalProgressRibbon } from "@/components/global-progress";
import { IllustrationHero, PhaseIllustration } from "@/components/illustrations";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[linear-gradient(-12deg,var(--forest)_33%,transparent_33%,transparent_66%,var(--accent)_66%)]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col-reverse items-start gap-8 lg:flex-row lg:items-center lg:gap-12">
            <div className="max-w-2xl flex-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--forest)]">
                Étudiants béninois • France • Campus France
              </p>
              <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,3.65rem)] font-bold leading-[1.08] text-[var(--ink)]">
                Votre parcours jusqu'à l'installation en France, étape après étape.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)]">
                CampusBeninTrack rassemble une procédure claire depuis la création du dossier sur Études en
                France jusqu'aux démarches d'accueil en France&nbsp;: validation du VLS‑TS en ligne,
                banque française, dossier Caf, inscription à la Sécurité sociale étudiants (numéro, carte Vitale),
                et rappels fiscaux — y compris la première déclaration à revenus nuls lorsque votre situation
                l'impose.
                <strong className="font-medium text-[var(--forest)]">
                  {" "}
                  Hors catalogue immobilier&nbsp;: aucun détail sur la recherche de logement n'est développé
                  ici.
                </strong>
              </p>
              <div className="mt-8 flex max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
                <GlobalProgressRibbon />
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/parcours"
                  className="inline-flex rounded-full bg-[var(--forest)] px-7 py-3 text-sm font-semibold text-[var(--card)] shadow-md transition hover:brightness-110"
                >
                  Explorer le parcours
                </Link>
                <Link
                  href="/suivi"
                  className="inline-flex rounded-full border-2 border-[var(--forest)] bg-transparent px-7 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-[var(--card)]"
                >
                  Ma checklist globale
                </Link>
              </div>
            </div>
            <IllustrationHero className="mx-auto w-full max-w-xs shrink-0 lg:max-w-sm" />
          </div>

          <ol className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
