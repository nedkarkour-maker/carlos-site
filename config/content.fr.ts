/**
 * FRENCH COPY — config/content.fr.ts
 *
 * Traduction française de config/content.ts. Pour modifier le texte, changez
 * ce qui est entre les guillemets — rien d'autre. La structure doit rester
 * identique à config/content.ts (mêmes champs, même ordre des étapes du
 * calendrier, des tranches du budget, …).
 *
 * Ce qui n'est PAS du texte (chemins des photos, dates, liens, pourcentages)
 * doit toujours correspondre à config/content.ts — si vous changez l'un
 * là-bas, faites le même changement ici. Les `alt` des photos SONT du texte
 * (lus à voix haute par les lecteurs d'écran) — traduisez-les.
 *
 * [DRAFT] est un marqueur interne (voir content.ts) : gardez-le en anglais
 * pour qu'il reste repérable dans les deux fichiers.
 */

import { site, type ContentBundle } from "./content";

export const fr: ContentBundle = {
  /* ------------------------------------------------------------- nav */
  nav: {
    links: [
      { label: "À propos", href: "/#about" },
      { label: "Calendrier", href: "/#schedule" },
      { label: "Infolettre", href: "/newsletter" },
      { label: "Comment aider", href: "/#help" },
    ],
    cta: { label: "Soutenir", href: site.supportUrl, external: true },
  },

  /* ------------------------------------------------------------ hero */
  hero: {
    kicker: "Marin ILCA · Ingénieur · Montréal → les Jeux olympiques",
    nameLines: ["Carlos", "Charabati"],
    countdown: {
      start: "2024-08-12T00:00:00",
      target: "2028-07-14T00:00:00",
      label: "Jours avant LA 2028",
    },
    image: {
      src: "/images/clean/hero-viana.jpg",
      alt: "Carlos Charabati en régate au Championnat du monde jeunesse ILCA 4",
      focus: "70% 35%",
    },
  },

  /* ----------------------------------------------------------- about */
  about: {
    eyebrow: "Voici mon projet",
    title: "Je vise les Jeux olympiques — par la méthode, pas par chance.",
    paragraphs: [
      "Je suis un **marin de 19 ans** originaire de **Montréal**, animé par une passion profonde pour l'océan et le sport de haut niveau. Je mène actuellement de front ma **campagne olympique** et un **double diplôme d'ingénieur** à **CentraleSupélec et à l'Université McGill**.",
      "Je cours en **ILCA**, autrefois appelé Laser, la classe olympique de dériveur individuel masculin. Ma mission est double : atteindre le **podium olympique** et avoir un **impact positif** sur le monde en chemin.",
    ],
    image: {
      src: "/images/clean/carlos-and-bernardo.jpg",
      alt: "Carlos Charabati, champion du monde, et Bernardo en ILCA 4.",
    },
  },

  /* ------------------------------------------------------- statement */
  statement: {
    lines: [
      "Champion du monde, concentré, dévoué et souriant.",
      "En route vers le rêve olympique.",
    ],
  },

  /* ------------------------------------------------------------ race */
  // Si une vidéo explicative en français existe, remplacez aussi videoUrl.
  race: {
    eyebrow: "Une course, du départ à l'arrivée",
    title: "À quoi ressemble une course.",
    videoUrl: "https://www.youtube-nocookie.com/embed/rwNQ0mbh3qM",
    videoTitle: "Petit guide de la voile olympique (vidéo)",
    caption:
      "Nouveau dans le monde de la voile ? Une courte explication du déroulement d'une course olympique — le parcours, le départ et la lutte pour virer chaque bouée en tête.",
  },

  /* --------------------------------------------------------- numbers */
  numbers: {
    eyebrow: "Ce que j'ai accompli · deux dernières années",
    title: "Le travail, en chiffres.",
    stats: [
      { value: "4 000", label: "Milles nautiques parcourus" },
      { value: "280", label: "Jours sur l'eau" },
      { value: "160", label: "Courses" },
      { value: "42", label: "Podiums" },
      { value: "1", label: "Titre mondial", accent: true },
    ],
  },

  /* -------------------------------------------------------- schedule */
  schedule: {
    eyebrow: "Où je m'en vais · 2026",
    title: "La saison à venir.",
    trainingLabel: "Entraînement",
    stops: [
      {
        when: "AOÛT 2026",
        title: "Reprise de saison · base d'entraînement",
        where: "Cascais (Portugal)",
        kind: "training",
      },
      {
        when: "AUTOMNE 2026",
        title: "Championnats canadiens séniors",
        where: "Kingston (Ontario)",
        kind: "event",
        major: true,
        tag: "Événement clé",
      },
      {
        when: "2026",
        title: "Championnats d'Europe U21",
        where: "Bodrum (Turquie)",
        kind: "event",
        major: true,
        tag: "Événement majeur",
      },
      {
        when: "2026",
        title: "Blocs d'entraînement · Europe",
        where: "Cascais et sites méditerranéens",
        kind: "training",
      },
      {
        when: "2027",
        title: "Championnat du monde U21",
        where: "Melbourne (Australie)",
        kind: "event",
        major: true,
        tag: "Événement majeur",
      },
      {
        when: "2027",
        title: "Blocs d'entraînement · Europe",
        where: "Cascais et sites méditerranéens",
        kind: "training",
      },
      {
        when: "2027",
        title: "Grand Slam Princesse Sofia",
        where: "Palma de Majorque (Espagne)",
        kind: "event",
      },
      {
        // Nom déjà français dans content.ts — rien à traduire.
        when: "2027",
        title: "Semaine Olympique Française",
        where: "Hyères (France)",
        kind: "event",
      },
      {
        when: "2027",
        title: "Grand Slam Kieler Woche",
        where: "Kiel (Allemagne)",
        kind: "event",
      },
      {
        when: "2028",
        title: "À déterminer",
        where: "...",
        kind: "event",
      },
      // Les deux repères à l'horizon — les Jeux vers lesquels mène ce parcours.
      {
        when: "2028",
        title: "LA 2028",
        where: "Los Angeles (États-Unis)",
        kind: "olympics",
        major: true,
        tag: "Jeux olympiques",
      },
      {
        when: "2032",
        title: "Brisbane 2032",
        where: "Brisbane (Australie)",
        kind: "olympics",
        major: true,
        tag: "Jeux olympiques",
      },
    ],
  },

  /* ------------------------------------------------- notable results */
  notableResults: {
    eyebrow: "Résultats marquants",
    items: [
      {
        image: {
          src: "/images/clean/carlos-sixth.jpg",
          alt: "La voile CAN 219619 de Carlos en tête d'une flotte ILCA compacte au près",
          focus: "75% 60%",
        },
        result: "6e",
        event: "Championnats du monde ILCA 4 2023 · Volos, Grèce",
      },
      {
        image: {
          src: "/images/clean/carlos-gold.jpg",
          alt: "Carlos célébrant sa victoire au Championnat du monde jeunesse ILCA 4",
        },
        result: "Or",
        event: "Championnats du monde 2024 · Viana, Portugal",
      },
      {
        image: {
          src: "/images/clean/carlos-seventh.jpg",
          alt: "Carlos au rappel dans le près, sous la voile CAN",
        },
        result: "7e",
        event: "Championnats du monde ILCA 6 2025 · Kiel, Allemagne",
      },
    ],
  },

  /* ------------------------------------------------------ newsletter */
  // Note : les publications elles-mêmes ne sont qu'en anglais pour l'instant ;
  // l'archive les affiche telles quelles dans les deux langues.
  newsletter: {
    eyebrow: "Suivez l'aventure",
    title: "Le parcours, publication par publication.",
    intro:
      "Récits de courses, notes d'entraînement et les coulisses qu'on ne voit pas d'habitude — publiés ici et envoyés par courriel à qui veut suivre.",
    allPostsLabel: "Toutes les publications →",
  },

  /* ------------------------------------------------------------ help */
  help: {
    eyebrow: "Comment vous pouvez aider",
    title: "Faites partie de l'aventure.",
    lead: "Que vous soyez une entreprise, un marin ou simplement amateur d'aventure — bienvenue à bord.",
    cards: [
      {
        index: "01",
        title: "Suivre et partager",
        body: "L'aide la plus simple qui existe : abonnez-vous aux nouvelles, suivez-moi sur Instagram et transmettez l'histoire à quelqu'un que ça pourrait toucher.",
        cta: { label: "Suivre l'aventure", href: "#subscribe" },
      },
      {
        index: "02",
        title: "Devenir partenaire",
        body: "Pour les marques et les entreprises. Votre nom voyage avec moi — bateau, voile, équipement et contenu — au Canada, aux États-Unis et en Europe.",
        cta: site.sponsorDeckUrl
          ? {
              label: "Demander le dossier",
              href: site.sponsorDeckUrl,
              external: true,
            }
          : {
              label: "Demander le dossier",
              href: `mailto:${site.contactEmail}?subject=${encodeURIComponent(
                "Dossier de partenariat — Carlos Charabati",
              )}`,
            },
      },
      {
        index: "03",
        title: "Soutenir la campagne",
        body: "Le soutien direct me garde sur l'eau — et chaque don donne droit à un reçu fiscal au Canada, via Wind Athletes Canada.",

        cta: {
          label: "Soutenir — avec reçu fiscal",
          href: site.supportUrl,
          external: true,
        },
      },
    ],
  },

  /* ---------------------------------------------------------- budget */
  // Les pourcentages doivent rester identiques à ceux de content.ts.
  budget: {
    eyebrow: "Ce que ça coûte",
    chartTitle: "Où va votre soutien",
    breakdown: [
      {
        label: "Entraîneur + bateau",
        percent: 35,
        sub: "Honoraires d'entraîneur, location et transport",
      },
      {
        label: "Régates + hébergement",
        percent: 35,
        sub: "Frais d'inscription, logement",
      },
      {
        label: "Déplacements",
        percent: 16,
        sub: "Vols, transport vers les sites",
      },
      {
        label: "Équipement + divers",
        percent: 14,
        sub: "Voiles, matériel, administration",
      },
    ],
  },

  /* --------------------------------------------------------- backers */
  backers: {
    label: "Fièrement soutenu par",
    joinCta: {
      title: "Vous, peut-être ?",
      body: "Il reste de la place sur la voile.",
      href: "/#help",
    },
  },

  /* ------------------------------------------------------- subscribe */
  subscribe: {
    eyebrow: "Comment vous pouvez soutenir",
    title: "Suivez la campagne.",
    body: "Des histoires de la campagne — aventures, entraînements et leçons apprises.",
    ctaLabel: "Rejoindre l'équipage",
    placeholder: "vous@courriel.com",
    button: "S'abonner",
    buttonBusy: "Abonnement…",
    success: "Merci de vous être abonné !",
    errorFallback: "Une erreur s'est produite — veuillez réessayer plus tard.",
    archive: { label: "Lire les nouvelles précédentes →", href: "/newsletter" },
  },

  /* ---------------------------------------------------------- footer */
  // `site.role` n'existe qu'en anglais ("ILCA Sailor") — le rôle est donc
  // écrit ici en français ; le pays et le numéro de voile viennent de `site`.
  footer: {
    tagline: `Marin ILCA · ${site.country} ${site.sailNumber}`,
    socialLabels: {
      email: "Envoyer un courriel à Carlos",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      facebook: "Facebook",
    },
    columns: [
      {
        heading: "Parcours",
        links: [
          { label: "À propos", href: "/#about" },
          { label: "Infolettre", href: "/newsletter" },
        ],
      },
      {
        heading: "Campagne",
        links: [
          { label: "Calendrier", href: "/#schedule" },
          { label: "Comment aider", href: "/#help" },
        ],
      },
      {
        heading: "Me joindre",
        links: [
          { label: "S'abonner", href: "/#subscribe" },
          { label: "Contact", href: `mailto:${site.contactEmail}` },
        ],
      },
    ],
    donationNote: "Dons via Wind Athletes Canada",
  },
};
