/**
 * FRENCH COPY — config/content.fr.ts
 *
 * ⚠️ TODO fr: every string below is still the English text. To translate,
 * change the text between the quotes — nothing else. The structure must
 * stay identical to config/content.ts (same fields, same order of the
 * schedule stops, budget slices, …).
 *
 * Things that are NOT text (photo paths, dates, links, percentages) should
 * always match config/content.ts — if you change one there, mirror it here.
 * Photo `alt` lines ARE text (read aloud by screen readers) — translate them.
 */

import { site, type ContentBundle } from "./content";

export const fr: ContentBundle = {
  /* ------------------------------------------------------------- nav */
  // TODO fr — translate the labels.
  nav: {
    links: [
      { label: "About", href: "/#about" },
      { label: "Schedule", href: "/#schedule" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "How to help", href: "/#help" },
    ],
    cta: { label: "Support", href: site.supportUrl, external: true },
  },

  /* ------------------------------------------------------------ hero */
  // TODO fr — translate kicker, countdown label and the photo alt.
  hero: {
    kicker: "ILCA Sailor · Engineer · Montréal → the Olympics",
    nameLines: ["Carlos", "Charabati"],
    countdown: {
      start: "2024-08-12T00:00:00",
      target: "2028-07-14T00:00:00",
      label: "Days to LA 2028",
    },
    image: {
      src: "/images/clean/hero-viana.jpg",
      alt: "Carlos Charabati racing at the ILCA 4 Youth World Championship",
      focus: "70% 35%",
    },
  },

  /* ----------------------------------------------------------- about */
  // TODO fr — translate title and paragraphs (keep the **bold** marks).
  about: {
    eyebrow: "This is my project",
    title: "I'm chasing the Olympics — by method, not luck.",
    paragraphs: [
      "I am a 19-year-old sailor from Montreal, driven by a deep passion for the ocean and high-performance sport. I am currently balancing my Olympic campaign with an engineering dual degree at CentraleSupélec and McGill University.",
      "I compete in the ILCA, formerly known as the Laser, the men's individual Olympic dinghy class. My mission is twofold: to reach the Olympic podium and to create a positive impact on the world along the way.",
    ],
    image: {
      src: "/images/img_23.jpg",
      alt: "Carlos Charabati receiving a medal at a championship ceremony",
    },
  },

  /* ------------------------------------------------------- statement */
  // TODO fr — translate the three lines.
  statement: {
    lines: [
      "World champion, focused, dedicated and smiling.",
      "The Olympics isn't a dream. It's the plan.",
    ],
  },

  /* ------------------------------------------------------------ race */
  // TODO fr — translate eyebrow, title, videoTitle and caption. If a
  // French-language explainer video exists, swap videoUrl here too.
  race: {
    eyebrow: "One race, start to finish",
    title: "What a race looks like.",
    videoUrl: "https://www.youtube-nocookie.com/embed/rwNQ0mbh3qM",
    videoTitle: "Quick guide to Olympic sailing (video)",
    caption:
      "New to sailing? A short explainer of how an Olympic race works — the course, the start, and the fight to round every mark first.",
  },

  /* --------------------------------------------------------- numbers */
  // TODO fr — translate eyebrow, title and the stat labels.
  numbers: {
    eyebrow: "What I've done · last two years",
    title: "The work, in numbers.",
    stats: [
      { value: "4,000", label: "Nautical miles sailed" },
      { value: "280", label: "Days on the water" },
      { value: "160", label: "Races" },
      { value: "42", label: "Podiums" },
      { value: "1", label: "World title", accent: true },
    ],
  },

  /* -------------------------------------------------------- schedule */
  // TODO fr — translate eyebrow, title, trainingLabel and each stop's
  // title/where/tag. Keep the stops in the same order as content.ts.
  schedule: {
    eyebrow: "Where I'm headed · 2026",
    title: "The season ahead.",
    trainingLabel: "Training",
    stops: [
      {
        when: "AUG 2026",
        title: "Season restart · training base",
        where: "Building the year's foundation [DRAFT — from your calendar]",
        kind: "training",
        major: true,
      },
      {
        when: "FALL 2026",
        title: "Senior Canadian Championships",
        where: "Kingston, Ontario",
        kind: "event",
        major: true,
        tag: "Key event",
      },
      {
        when: "2026",
        title: "Training blocks · Europe",
        where: "Cascais & Mediterranean venues",
        kind: "training",
      },
      {
        when: "2026",
        title: "U21 Europeans",
        where: "Bodrum, Türkiye",
        kind: "event",
        major: true,
        tag: "Key event",
      },
      {
        when: "2028",
        title: "LA 2028",
        where: "Los Angeles, USA",
        kind: "olympics",
        major: true,
        tag: "Olympic Games",
      },
      {
        when: "2032",
        title: "Brisbane 2032",
        where: "Brisbane, Australia",
        kind: "olympics",
        major: true,
        tag: "Olympic Games",
      },
    ],
  },

  /* ------------------------------------------------- notable results */
  // TODO fr — translate eyebrow, results and photo alts.
  notableResults: {
    eyebrow: "Notable results",
    items: [
      {
        image: {
          src: "/images/clean/fleet-upwind.jpg",
          alt: "Carlos's CAN 219619 sail leading a packed ILCA fleet upwind",
          focus: "75% 60%",
        },
        result: "6th",
        event: "ILCA 4 World Championships 2023 · Volos, Greece",
      },
      {
        image: {
          src: "/images/clean/story-worldchamp.jpg",
          alt: "Carlos celebrating his ILCA 4 Youth World Championship win",
        },
        result: "Gold",
        event: "World Championships 2024 · Viana, Portugal",
      },
      {
        image: {
          src: "/images/clean/upwind-ireland.jpg",
          alt: "Carlos hiking hard upwind under the CAN sail",
        },
        result: "7th",
        event: "ILCA 6 World Championships 2025 · Kiel, Germany",
      },
    ],
  },

  /* ------------------------------------------------------ newsletter */
  // TODO fr — translate. Note: the posts themselves are English-only for
  // now; the archive shows them as-is in both languages.
  newsletter: {
    eyebrow: "Follow along",
    title: "The journey, post by post.",
    intro:
      "Race recaps, training notes, and the parts you don't usually see — published here and emailed to anyone who wants to follow.",
    allPostsLabel: "All posts →",
  },

  /* ------------------------------------------------------------ help */
  // TODO fr — translate titles, bodies, bullets and button labels.
  help: {
    eyebrow: "How you can help",
    title: "Be part of the journey.",
    lead: "Whether you're a company, a fellow sailor, or someone who loves the adventure — welcome onboard.",
    cards: [
      {
        index: "01",
        title: "Follow & share",
        body: "The simplest help there is: subscribe to the updates, follow on Instagram, and pass the story along to someone who'd care.",
        cta: { label: "Follow the journey", href: "#subscribe" },
      },
      {
        index: "02",
        title: "Partner with me",
        body: "For brands and companies. Your name travels with me — boat, sail, gear, and content — across Canada, the US, and Europe.",
        bullets: [
          "Logo on boat, sail & gear",
          "Reach across a growing social audience",
          "Talks & appearances at your events",
        ],
        cta: site.sponsorDeckUrl
          ? {
              label: "Request the deck",
              href: site.sponsorDeckUrl,
              external: true,
            }
          : {
              label: "Request the deck",
              href: `mailto:${site.contactEmail}?subject=${encodeURIComponent(
                "Sponsorship deck — Carlos Charabati",
              )}`,
            },
      },
      {
        index: "03",
        title: "Support the campaign",
        body: "Direct support keeps me on the water — and every gift is tax-receipted in Canada, through Wind Athletes Canada.",
        bullets: [
          "One-time or monthly",
          "100% toward the season",
          "Tax receipt for Canadian donors",
        ],
        cta: {
          label: "Support — tax-receipted",
          href: site.supportUrl,
          external: true,
        },
      },
    ],
  },

  /* ---------------------------------------------------------- budget */
  // TODO fr — translate headline, body, stat labels, chart title, slice
  // labels/subs and totalNote. Keep percentages and amounts identical to
  // content.ts.
  budget: {
    eyebrow: "What it costs",
    headline:
      "Most Olympic campaigns don't make it. The ones that do, do it on the back of supporters.",
    body: "A full year of campaigning costs $55,000 CAD. National funding covers part — donations and sponsorship close the gap. Recurring monthly support is the most useful as it allows me to plan out my entire season.",
    stats: [
      { value: "TBC", label: "Annual supporter gap" },
      { value: "4 pillars", label: "Coaching · regattas · travel · equipment" },
      { value: "LA 2028", label: "Olympic Games target" },
    ],
    chartTitle: "Where your support goes",
    breakdown: [
      {
        label: "Coaching + boat",
        percent: 35,
        amount: "~$19,250",
        sub: "Coach fees, charter & freight",
      },
      {
        label: "Regattas + housing",
        percent: 35,
        amount: "~$19,250",
        sub: "Entry fees, accommodation",
      },
      {
        label: "Travel",
        percent: 16,
        amount: "~$8,800",
        sub: "Flights, transport to venues",
      },
      {
        label: "Equipment + other",
        percent: 14,
        amount: "~$7,700",
        sub: "Sails, gear, admin",
      },
    ],
    totalNote: "see the full breakdown",
    breakdownUrl: "",
  },

  /* --------------------------------------------------------- backers */
  // TODO fr — translate.
  backers: {
    label: "Proudly supported by",
    joinCta: {
      title: "Maybe you?",
      body: "There's room on the sail.",
      href: "/#help",
    },
  },

  /* ------------------------------------------------------- subscribe */
  // TODO fr — translate everything except placeholder-style emails.
  subscribe: {
    eyebrow: "How you can support",
    title: "Follow the campaign.",
    body: "Stories from the campaign trail — adventures, training, and lessons.",
    ctaLabel: "Join the crew",
    placeholder: "you@email.com",
    button: "Subscribe",
    buttonBusy: "Subscribing…",
    success: "Thank you for subscribing!",
    errorFallback: "Something went wrong — please try again later.",
    archive: { label: "Read past updates →", href: "/newsletter" },
  },

  /* ---------------------------------------------------------- footer */
  // TODO fr — translate socialLabels, column headings and link labels.
  footer: {
    tagline: `${site.role} · ${site.country} ${site.sailNumber}`,
    socialLabels: {
      email: "Send an email to Carlos",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      facebook: "Facebook",
    },
    columns: [
      {
        heading: "Story",
        links: [
          { label: "About", href: "/#about" },
          { label: "Newsletter", href: "/newsletter" },
        ],
      },
      {
        heading: "Campaign",
        links: [
          { label: "Schedule", href: "/#schedule" },
          { label: "How to help", href: "/#help" },
        ],
      },
      {
        heading: "Connect",
        links: [
          { label: "Subscribe", href: "/#subscribe" },
          { label: "Contact", href: `mailto:${site.contactEmail}` },
        ],
      },
    ],
    donationNote: "Donations via Wind Athletes Canada",
  },
};
