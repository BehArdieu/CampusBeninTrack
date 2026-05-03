export type ChecklistItem = {
  id: string;
  label: string;
  detail?: string;
};

export type ParcoursPhase = {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  icon: string;
  officialHint?: string;
  steps: { title: string; body: string[] }[];
  reflexes: string[];
  checklist: ChecklistItem[];
  links?: { label: string; href: string }[];
};

export const PARCOURS_PHASES: ParcoursPhase[] = [
  {
    id: "preparer",
    shortTitle: "Se préparer",
    title: "Comprendre la procédure Campus France — Bénin",
    summary:
      "Avant tout dépôt, cerner le calendrier, les niveaux concernés et le rôle d’Etudes en France pour les candidatures au Bénin.",
    icon: "◆",
    officialHint:
      "Les dates, documents et niveaux précis peuvent changer chaque saison : vérifiez toujours sur le site officiel Campus France.",
    steps: [
      {
        title: "Vérifier son profil et sa filière",
        body: [
          "Confirmez que votre projet (Licence, Master, prépa, Langue, Doctorat…) passe par Campus France dans votre cas précis.",
          "Repérez la session / campagne officielle dont vous dépendez.",
        ],
      },
      {
        title: "Ressources officielles",
        body: [
          "Consultez régulièrement les pages Campus France relatives au pays (Bénin) et aux procédures Études en France.",
          "Préparez une liste personnelle des documents dont vous disposez ou qu’il vous manque avant d’ouvrir le dossier en ligne.",
        ],
      },
    ],
    reflexes: [
      "Ne vous fiez qu’aux sources officielles pour les modalités précises (frais, calendrier, formats de pièces).",
      "Photocopies numériques nettes, lisibles, au bon format (souvent PDF) : gain de temps énorme.",
    ],
    checklist: [
      {
        id: "preparer-profil",
        label: "J’ai vérifié que mon projet est bien concerné par la procédure Campus France Bénin.",
      },
      {
        id: "preparer-calendrier",
        label: "J’ai noté les dates clés de la campagne en cours (sur le site officiel).",
      },
      {
        id: "preparer-docs-liste",
        label: "J’ai fait la liste des documents à rassembler avant de créer mon compte.",
      },
    ],
    links: [
      { label: "Campus France Bénin", href: "https://benin.campusfrance.org/" },
      { label: "Campus France (international)", href: "https://www.campusfrance.org/" },
      { label: "Études en France", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" },
    ],
  },
  {
    id: "compte-etef",
    shortTitle: "Compte Études en France",
    title: "Création du compte et constitution du dossier en ligne",
    summary:
      "Inscription sur Études en France, choix et ordre des vœux, pièces justificatives : cœur technique du parcours.",
    icon: "◇",
    steps: [
      {
        title: "Compte Études en France",
        body: [
          "Créez votre compte sur la plateforme officielle Études en France si ce n’est pas déjà fait.",
          "Protégez vos identifiants : vous vous en servirez tout au long de la procédure.",
        ],
      },
      {
        title: "Vœux et stratégie",
        body: [
          "Construisez une liste de formations cohérente avec votre parcours, votre niveau de langue et votre projet.",
          "Respectez les règles sur le nombre de vœux et leurs sous-vœux, telles que publiées pour votre campagne.",
        ],
      },
      {
        title: "Documents",
        body: [
          "Scanners propres des diplômes, relevés, pièce d’identité, attestations financières prévisionnelles, etc., selon la liste officielle.",
          "Harmoniser les informations entre CV, lettres de motivation et formulaires évite les incohérences visibles lors de l’analyse.",
        ],
      },
    ],
    reflexes: [
      "Relire chaque champ avant validation : erreurs trop fréquentes sur dates, villes ou intitulés de diplômes.",
      "Une lettre courte, claire, honnète sur le projet pédagogique vaut mieux qu’un cliché très long.",
    ],
    checklist: [
      {
        id: "etef-compte",
        label: "Compte Études en France créé et identifiants sauvegardés.",
      },
      {
        id: "etef-voeux",
        label: "Vœux formulés conformément aux règles de la campagne.",
      },
      {
        id: "etef-docs",
        label: "Toutes les pièces demandées déposées (formats conformes aux consignes).",
      },
      {
        id: "etef-sync",
        label: "Harmonisation vérifiée entre CV, lettres et dossier numérique.",
      },
    ],
    links: [
      { label: "Études en France — connexion", href: "https://pastel.diplomatie.gouv.fr/etudesenfrance/dyn/public/authentification/login.html" },
    ],
  },
  {
    id: "entretien",
    shortTitle: "Entretiens & réponses",
    title: "Entretiens Campus France et réponses des établissements",
    summary:
      "Réussir les entretiens de motivation institutionnels puis suivre les réponses défavorables comme favorables sur la plateforme.",
    icon: "○",
    steps: [
      {
        title: "Préparation à l’entretien",
        body: [
          "Présentez clairement : parcours académique, raisons du pays France, projet de formation, projet professionnel large.",
          "Anticipez les questions pièges : pourquoi cette formation précise, quel niveau à l’issue, prévisions financières.",
        ],
      },
      {
        title: "Réponses formations",
        body: [
          "Sur les écrans Études en France, suivez l’état de chaque vœu (admis en attente, refus…).",
          "Une admission ne remplace pas l’ensemble des étapes administratives suivantes dans la durée prévue.",
        ],
      },
    ],
    reflexes: [
      "Arriver à l’heure, tenue sobre, documents imprimés de secours peuvent éviter stress technique.",
      "Noter vos identifiants de candidature quelque part hors ligne en cas de panne téléphone avant un entretien.",
    ],
    checklist: [
      { id: "ent-prep", label: "Réponses orales préparées (parcours + projet)." },
      { id: "ent-date", label: "Date/heure d’entretien Campus France bien notées." },
      { id: "ent-suivi-voeux", label: "Suivi régulier des réponses des formations sur Études en France." },
    ],
  },
  {
    id: "visa",
    shortTitle: "Visa étudiant",
    title: "Dossier visa VLS-TS après acceptation définitive",
    summary:
      "Après votre admission définitive, constituer la demande de visa étudiant (France-Visas, rendez-vous prestataire) avec des justificatifs à jour.",
    icon: "◇",
    steps: [
      {
        title: "Instruction du dossier",
        body: [
          "Une fois votre admission confirmée aux étapes officielles requises, suivez les instructions pour créer votre demande de visa sur France-Visas.",
          "Réunissez le titre d’acceptation définitive, passeport solide, projet de logement (attestation même provisoire), preuves de ressources conformes aux exigences officielles en vigueur.",
        ],
      },
      {
        title: "Centre TLS / rendez-vous",
        body: [
          "Prenez RDV avec le prestataire désigné (souvent TLS Contact) après constitution du dossier numérique sur France-Visas.",
          "Prévoir des tirages nets des pièces : certains originaux peuvent être exigés le jour du dépôt.",
        ],
      },
    ],
    reflexes: [
      "Les preuves de ressources doivent souvent refléter la situation très récente : vérifiez la limite temporelle des relevés bancaires attestations.",
      "Ne payez aucun faux service officiel tiers en ligne sans vérifier l’authenticité.",
    ],
    checklist: [
      { id: "visa-france-visas", label: "Compte France-Visas complété avant prise de RDV." },
      { id: "visa-docs-recents", label: "Pièces financières et attestation définitives à jour selon les consignes." },
      { id: "visa-rdv", label: "RDV prestataire (TLS ou équivalent) confirmé avec dossier complet." },
    ],
    links: [
      { label: "France-Visas", href: "https://france-visas.gouv.fr/" },
    ],
  },
  {
    id: "depart",
    shortTitle: "Avant départ",
    title: "Dernières vérifications avant de quitter le Bénin",
    summary:
      "Réunir passeport et copies, prévenir sa banque, sécuriser les documents dans le téléphone hors ligne — puis préparer votre arrivée sur le territoire (sans détail sur la recherche de logement).",
    icon: "◈",
    steps: [
      {
        title: "Documents de voyage et numérique",
        body: [
          "Photocopies numériques sécurisées du passeport, attestation inscription, titre de transport, confirmations importantes dans le cloud hors ligne aussi.",
          "Prévenir votre banque pour l’usage de la carte à l’international — éviter un blocage de paiement durant les premières semaines en France.",
        ],
      },
      {
        title: "Arrivée en France",
        body: [
          "Connaissez vos premiers trajets jusqu’à l’adresse d’accueil temporaire (pas le guide logement lui-même, simplement rejoindre le territoire sereinement).",
          "Liste des administrations à prévoir les premières semaines : voir étape suivante.",
        ],
      },
    ],
    reflexes: [
      "Un classeur physique avec quelques tirages évite bien des stress après un jet lag.",
      "Prévenir un proche hors France en cas de panne téléphone ou d’urgence.",
    ],
    checklist: [
      { id: "dep-passeport", label: "Passeport visa et documents académiques originaux préparés dans un classeur voyage." },
      { id: "dep-copies", label: "Copies numériques critiques sauvegardées localement hors connexion aussi." },
      { id: "dep-banque-aff", label: "Banque béninoise prévenue pour usage carte à l'étranger (si pertinent)." },
    ],
  },
  {
    id: "arrivee",
    shortTitle: "Arrivée en France",
    title: "Arrivée, validation séjour, santé sociale fiscalité étudiante",
    summary:
      "Réflexes dès les premières semaines : validation en ligne du VLS‑TS, banque, CAF si éligibilité, sécurité sociale étudiante, déclaration d’impôt — même à revenu nul.",
    icon: "✦",
    steps: [
      {
        title: "Validation du titre de séjour en ligne — VLS-TS",
        body: [
          "Le visa étudiant long séjour valant titre de séjour doit être validé en ligne après arrivée sous le délai officiel français (traditionnellement 3 mois, confirmez la règle en vigueur sur le site officiel de l’administration française).",
          "Conservez l’OFII télépayé jusqu’aux étapes médicales éventuelles si convoqué ultérieurement selon dossier officiel vous concernant personnellement.",
          "Ne traînez pas : une validation oubliée crée ensuite des problèmes lourds de régularité.",
        ],
      },
      {
        title: "Ouverture d’un compte bancaire en France",
        body: [
          "Un RIB français facilite bourses logement CAF abonnements prélèvement frais inscription.",
          "Réunissez passeport titre ou attestation titre en cours titre scolarité attestations financières parfois exigées par la banque choisie.",
        ],
      },
      {
        title: "CAF pour étudiants",
        body: [
          "Ouverture d’un dossier Caf.fr si aides au logement conditions remplies — même petite aide ou simulation utile même si dossier tardif éviter.",
          "Numéro de déclarant numéro allocataire différent suivre impôts parfois liés pour certains dossiers officiels ensuite.",
        ],
      },
      {
        title: "Sécurité sociale française — numéro, carte Vitale étudiante",
        body: [
          "Les études en France généralement passent désormais par l’inscription sur le portail Étudiant de la Sécurité sociale pour obtenir un numéro de sécurité sociale carte Vitale physique ou démat suivant les instructions postales officielles reçues.",
          "Une fois votre numéro connu rattachement mutuelle santé facultative forte recommandée pour tiers payant santé hors remboursement de base seul.",
        ],
      },
      {
        title: "Déclaration d’impôts sur le revenu",
        body: [
          "Même un étudiant sans revenu professionnel en France doit souvent faire une première déclaration pour déclarer 0 euros ou vos seuls minima : c’est un réflexe officiel très utile années suivantes dossiers locatifs aides et perception administration.",
          "Réalisez votre démarche lors de la première campagne fiscale ouverte après votre arrivée sur impots.gouv.fr ou formulaire physique selon consignes de l’année.",
          "Une déclaration même à zéro prouvera votre résidence habituelle française pour la suite dossiers administratifs locaux.",
        ],
      },
    ],
    reflexes: [
      "Installer les applis mobiles officielles (impôts, Ameli si éligible, CAF…) limiter les retard sur les rendez vous administratifs numériques critiques.",
      "Classe papier même minuscule dossier santé titre banque attestations cours université très utile trois ans plus tard encore.",
      "Une attestation inscription année en cours se démarque souvent de la simple ancienne inscription sur les demandes aides.",
    ],
    checklist: [
      {
        id: "arr-validation-vls",
        label: "Validation en ligne du VLS TS effectuée dans le délai officiel après arrivée.",
        detail:
          "Paiement télépay sécurité et numérotation convocation OFII médicale suivant instructions reçues sur votre dossier officiel précis personnel.",
      },
      {
        id: "arr-rib-banque",
        label: "Compte français ouvert et RIB obtenu pour prélèvements et frais fixes.",
      },
      {
        id: "arr-caf",
        label: "Ouverture éventuelle d’un dossier CAF après installation si conditions légales présentes puis simulation ou dépôt dossier.",
      },
      {
        id: "arr-ss-etudiante",
        label: "Démarche sur le site sécurité sociale étudiants poursuivie jusqu’à obtention du numéro et envoi dossier santé officiel physique ou numérique demandé.",
      },
      {
        id: "arr-mutuelle",
        label: "Mutuelle santé facultative envisagée pour complément hospitalier très utile années étudiante.",
      },
      {
        id: "arr-impots-zero",
        label: "Première déclaration d’impôts française réalisée même si tous revenus annuels officiellement déclarés égaux strictement à zéro.",
        detail:
          "Cela crée votre fiche officielle française utile aides logement dossiers suivants années qui viennent et perception droits devoirs officiels précis suivant situation personnelle chaque saison fiscale publiée officiellement sur impots point gouv français.",
      },
    ],
    links: [
      {
        label: "Valider votre VLS-TS / titre (ANEF)",
        href: "https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/vos-demarches/valider-mon-titre-de-sejour",
      },
      { label: "Étudiant.gouv — protection sociale", href: "https://www.etudiant.gouv.fr/fr/teaser/etudiant-etranger-protection-sociale-etudiante-774" },
      { label: "CAF — caf.fr", href: "https://www.caf.fr/" },
      { label: "Impôts particuliers", href: "https://www.impots.gouv.fr/" },
    ],
  },
];

export function getPhaseById(id: string): ParcoursPhase | undefined {
  return PARCOURS_PHASES.find((p) => p.id === id);
}
