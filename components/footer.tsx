import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
          <strong className="font-medium text-[var(--ink)]">Avis important : </strong>
          CampusBeninTrack est un aide-mémoire et un guide rédigé avec soin ; il{" "}
          <span className="text-[var(--ink-soft)]">
            ne remplace pas Campus France ni les administrations françaises officielles
          </span>
          . Dates, montants et formulaires peuvent changer : vérifiez toujours sur les sites
          officiels avant toute décision.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            href="https://www.campusfrance.org/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            campusfrance.org
          </Link>
          <Link
            href="https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            etudes-en-france.gouv.fr
          </Link>
          <Link
            href="https://france-visas.gouv.fr/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            France-Visas
          </Link>
        </div>
        <p className="text-xs text-[var(--muted)]">© {new Date().getFullYear()} CampusBeninTrack</p>
      </div>
    </footer>
  );
}
