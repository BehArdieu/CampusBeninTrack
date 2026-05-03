const forest = "#2a4f44";
const accent = "#b84a34";
const accentSoft = "rgba(184,74,52,0.12)";
const forestSoft = "rgba(42,79,68,0.12)";
const paper = "#f4f1ea";
const card = "#fffcf6";

type IllustrationProps = { className?: string };

export function IllustrationPreparer({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="80" r="60" fill={forestSoft} />
      <rect x="65" y="40" width="70" height="90" rx="8" fill={card} stroke={forest} strokeWidth="2" />
      <rect x="78" y="55" width="44" height="4" rx="2" fill={forest} opacity={0.5} />
      <rect x="78" y="65" width="36" height="4" rx="2" fill={forest} opacity={0.3} />
      <rect x="78" y="75" width="40" height="4" rx="2" fill={forest} opacity={0.3} />
      <rect x="78" y="90" width="30" height="4" rx="2" fill={accent} opacity={0.5} />
      <rect x="78" y="100" width="38" height="4" rx="2" fill={accent} opacity={0.3} />
      <circle cx="73" cy="56" r="3" fill={accent} />
      <circle cx="73" cy="66" r="3" stroke={forest} strokeWidth="1.5" fill="none" />
      <circle cx="73" cy="76" r="3" stroke={forest} strokeWidth="1.5" fill="none" />
      <path d="M45 50 l8 -15 l8 15" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="53" cy="30" r="4" fill={accent} opacity={0.3} />
      <rect x="145" y="60" width="20" height="24" rx="3" fill={paper} stroke={forest} strokeWidth="1.5" />
      <text x="155" y="77" textAnchor="middle" fontSize="12" fill={forest} fontWeight="bold">?</text>
    </svg>
  );
}

export function IllustrationCompteEtef({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="80" r="60" fill={accentSoft} />
      <rect x="50" y="38" width="100" height="72" rx="8" fill={card} stroke={forest} strokeWidth="2" />
      <rect x="50" y="38" width="100" height="20" rx="8" fill={forest} />
      <rect x="50" y="50" width="100" height="8" fill={forest} />
      <circle cx="62" cy="48" r="3" fill={accent} />
      <circle cx="73" cy="48" r="3" fill="#e8c547" />
      <circle cx="84" cy="48" r="3" fill="#5a9e6f" />
      <rect x="62" y="68" width="30" height="6" rx="3" fill={forest} opacity={0.2} />
      <rect x="62" y="80" width="76" height="6" rx="3" fill={forest} opacity={0.15} />
      <rect x="62" y="92" width="50" height="6" rx="3" fill={forest} opacity={0.15} />
      <rect x="112" y="65" width="28" height="14" rx="4" fill={accent} opacity={0.8} />
      <text x="126" y="75" textAnchor="middle" fontSize="7" fill={card} fontWeight="bold">OK</text>
      <path d="M155 95 l10 10 l-5 0 l0 12 l-10 0 l0 -12 l-5 0 Z" fill={accent} opacity={0.3} />
    </svg>
  );
}

export function IllustrationEntretien({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="80" r="60" fill={forestSoft} />
      <circle cx="80" cy="70" r="18" fill={card} stroke={forest} strokeWidth="2" />
      <circle cx="80" cy="64" r="6" fill={forest} opacity={0.6} />
      <path d="M68 78 a12 8 0 0 1 24 0" fill={forest} opacity={0.4} />
      <circle cx="124" cy="70" r="18" fill={card} stroke={accent} strokeWidth="2" />
      <circle cx="124" cy="64" r="6" fill={accent} opacity={0.6} />
      <path d="M112 78 a12 8 0 0 1 24 0" fill={accent} opacity={0.4} />
      <path d="M60 36 h32 l-4 10 H60 a4 4 0 0 1 -4 -4 v-2 a4 4 0 0 1 4 -4 Z" fill={forest} opacity={0.8} />
      <rect x="64" y="40" width="18" height="2" rx="1" fill={card} />
      <path d="M144 36 h-32 l4 10 h28 a4 4 0 0 0 4 -4 v-2 a4 4 0 0 0 -4 -4 Z" fill={accent} opacity={0.8} />
      <rect x="120" y="40" width="18" height="2" rx="1" fill={card} />
      <path d="M92 105 h16 v8 a4 4 0 0 1-4 4 h-8 a4 4 0 0 1-4-4 Z" fill={forest} opacity={0.2} />
      <circle cx="100" cy="105" r="6" fill={accent} opacity={0.5} />
      <path d="M97 105 l2 2 l4-4" stroke={card} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IllustrationVisa({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="80" r="60" fill={accentSoft} />
      <rect x="55" y="35" width="90" height="65" rx="6" fill={card} stroke={forest} strokeWidth="2" />
      <rect x="55" y="35" width="90" height="18" rx="6" fill={forest} />
      <rect x="55" y="47" width="90" height="6" fill={forest} />
      <rect x="65" y="40" width="30" height="3" rx="1.5" fill={card} opacity={0.6} />
      <rect x="65" y="60" width="24" height="28" rx="3" fill={paper} stroke={forest} strokeWidth="1" />
      <circle cx="77" cy="69" r="5" fill={forest} opacity={0.3} />
      <rect x="70" y="78" width="14" height="2" rx="1" fill={forest} opacity={0.3} />
      <rect x="70" y="82" width="10" height="2" rx="1" fill={forest} opacity={0.2} />
      <rect x="96" y="60" width="38" height="3" rx="1.5" fill={forest} opacity={0.4} />
      <rect x="96" y="67" width="32" height="3" rx="1.5" fill={forest} opacity={0.25} />
      <rect x="96" y="74" width="36" height="3" rx="1.5" fill={forest} opacity={0.25} />
      <rect x="96" y="86" width="28" height="8" rx="4" fill={accent} opacity={0.7} />
      <path d="M80 110 l15 -5 l5 20 l-15 5 Z" fill={accent} opacity={0.15} stroke={accent} strokeWidth="1" />
      <circle cx="90" cy="117" r="4" fill={accent} opacity={0.3} />
    </svg>
  );
}

export function IllustrationDepart({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="80" r="60" fill={forestSoft} />
      <rect x="60" y="55" width="55" height="40" rx="6" fill={card} stroke={forest} strokeWidth="2" />
      <rect x="72" y="50" width="30" height="10" rx="5" fill={forest} opacity={0.6} />
      <rect x="70" y="68" width="20" height="3" rx="1.5" fill={forest} opacity={0.3} />
      <rect x="70" y="75" width="15" height="3" rx="1.5" fill={accent} opacity={0.4} />
      <rect x="70" y="82" width="25" height="3" rx="1.5" fill={forest} opacity={0.2} />
      <circle cx="60" cy="95" r="4" fill={forest} opacity={0.4} />
      <circle cx="115" cy="95" r="4" fill={forest} opacity={0.4} />
      <path d="M125 50 l30 -15" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M155 35 l-5 -12 l25 5 Z" fill={accent} opacity={0.6} />
      <path d="M140 42 l-15 8" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="100" cy="130" rx="50" ry="6" fill={forest} opacity={0.08} />
      <path d="M40 120 Q60 110 80 115 Q100 120 120 112 Q140 105 160 115" stroke={forest} strokeWidth="1.5" fill="none" opacity={0.2} strokeDasharray="4 3" />
    </svg>
  );
}

export function IllustrationArrivee({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="80" r="60" fill={accentSoft} />
      <path d="M100 25 L103 55 L110 55 L100 65 L90 55 L97 55 Z" fill={forest} opacity={0.7} />
      <path d="M85 65 L100 45 L115 65" stroke={forest} strokeWidth="2" fill="none" />
      <path d="M90 65 L100 50 L110 65" stroke={forest} strokeWidth="2" fill="none" />
      <rect x="96" y="65" width="8" height="30" fill={forest} opacity={0.5} />
      <rect x="80" y="93" width="40" height="6" rx="3" fill={forest} opacity={0.3} />
      <rect x="50" y="105" width="25" height="20" rx="4" fill={card} stroke={forest} strokeWidth="1.5" />
      <rect x="55" y="110" width="15" height="3" rx="1.5" fill={forest} opacity={0.3} />
      <rect x="55" y="116" width="10" height="3" rx="1.5" fill={accent} opacity={0.4} />
      <rect x="125" y="105" width="25" height="20" rx="4" fill={card} stroke={accent} strokeWidth="1.5" />
      <rect x="130" y="110" width="15" height="3" rx="1.5" fill={accent} opacity={0.3} />
      <rect x="130" y="116" width="10" height="3" rx="1.5" fill={forest} opacity={0.4} />
      <circle cx="45" cy="45" r="8" fill={accent} opacity={0.15} />
      <circle cx="160" cy="50" r="6" fill={forest} opacity={0.15} />
      <path d="M92 135 l3-3 l5 5 l10-10" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IllustrationHero({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 400 300" fill="none" className={className} aria-hidden>
      <circle cx="200" cy="150" r="120" fill={forestSoft} />
      <circle cx="200" cy="150" r="85" fill={accentSoft} />

      <path d="M130 200 Q155 170 180 190 Q200 205 220 185 Q245 165 270 200" stroke={forest} strokeWidth="2" fill="none" opacity={0.3} />
      <circle cx="130" cy="200" r="6" fill={accent} opacity={0.6} />
      <circle cx="180" cy="190" r="6" fill={forest} opacity={0.6} />
      <circle cx="220" cy="185" r="6" fill={accent} opacity={0.6} />
      <circle cx="270" cy="200" r="6" fill={forest} opacity={0.6} />

      <rect x="155" y="80" width="90" height="65" rx="8" fill={card} stroke={forest} strokeWidth="2" />
      <rect x="167" y="93" width="50" height="5" rx="2.5" fill={forest} opacity={0.4} />
      <rect x="167" y="103" width="40" height="5" rx="2.5" fill={forest} opacity={0.25} />
      <rect x="167" y="113" width="55" height="5" rx="2.5" fill={forest} opacity={0.25} />
      <rect x="167" y="126" width="30" height="10" rx="5" fill={accent} opacity={0.7} />

      <path d="M280 100 l20 -10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M300 90 l-4 -10 l20 4 Z" fill={accent} opacity={0.5} />

      <rect x="80" y="120" width="35" height="45" rx="5" fill={card} stroke={forest} strokeWidth="1.5" />
      <circle cx="97" cy="133" r="6" fill={forest} opacity={0.25} />
      <rect x="88" y="143" width="18" height="3" rx="1.5" fill={forest} opacity={0.3} />
      <rect x="88" y="150" width="14" height="3" rx="1.5" fill={forest} opacity={0.2} />

      <path d="M200 225 L203 245 L210 245 L200 255 L190 245 L197 245 Z" fill={forest} opacity={0.4} />
      <rect x="188" y="255" width="24" height="4" rx="2" fill={forest} opacity={0.2} />

      <circle cx="320" cy="140" r="18" fill={card} stroke={accent} strokeWidth="1.5" />
      <path d="M313 140 l4 4 l8-8" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          cx={140 + i * 26}
          cy={220 + (i % 2 === 0 ? 0 : -8)}
          r="3"
          fill={i % 2 === 0 ? accent : forest}
          opacity={0.2}
        />
      ))}
    </svg>
  );
}

const illustrationMap: Record<string, React.FC<IllustrationProps>> = {
  preparer: IllustrationPreparer,
  "compte-etef": IllustrationCompteEtef,
  entretien: IllustrationEntretien,
  visa: IllustrationVisa,
  depart: IllustrationDepart,
  arrivee: IllustrationArrivee,
};

export function PhaseIllustration({
  phaseId,
  className,
}: {
  phaseId: string;
  className?: string;
}) {
  const Component = illustrationMap[phaseId];
  if (!Component) return null;
  return <Component className={className} />;
}
