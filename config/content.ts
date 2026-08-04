/**
 * All site copy lives in this file so it can be edited without touching
 * the components.
 *
 * - [DRAFT] marks placeholder copy that still needs Carlos's final wording.
 * - In `about.paragraphs`, text wrapped in **double asterisks** is rendered bold.
 * - Image paths point into /public/images — swap the filenames to change photos.
 */

export interface CtaLink {
  label: string;
  href: string;
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean;
}

export interface ImageRef {
  src: string;
  alt: string;
  /**
   * Which part of the photo to keep in view when it gets cropped to fit,
   * as "x% y%" — e.g. "50% 30%" keeps the point slightly above center.
   * Leave out for "50% 50%" (center).
   */
  focus?: string;
}

/* ------------------------------------------------------------------ site */

export const site = {
  name: "Carlos Charabati",
  role: "ILCA Sailor",
  country: "CAN",
  sailNumber: "219619",
  /**
   * One-line pitch for search results and social-share previews — the text
   * under the link when the site is pasted into WhatsApp/LinkedIn/email.
   */
  description:
    "Canadian ILCA sailor, 2024 ILCA 4 Youth World Champion, 7th at the 2025 Men's Worlds — campaigning toward LA 2028. Follow the journey, partner with the campaign, or support it directly.",
  /**
   * Canonical production URL — used for social-share metadata, the sitemap
   * and structured data. Set NEXT_PUBLIC_SITE_URL once a custom domain
   * exists; on Vercel the production URL is picked up automatically.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  contactEmail: "c.charabati@icloud.com",
  supportUrl: "https://www.windathletes.ca/athletes/carlos-charabati",
  instagramUrl: "https://www.instagram.com/carlos_charabati",
  linkedinUrl: "https://www.linkedin.com/in/carlos-charabati/",
  /** Leave empty ("") to hide the Facebook icon in the footer. */
  facebookUrl: "https://www.facebook.com/profile.php?id=100092780283734",
  /**
   * Link to the sponsorship deck (PDF or Drive). While empty, the
   * "Request the deck" card emails Carlos instead — nothing dead ships.
   */
  sponsorDeckUrl: "",
  /**
   * Donorbox campaign slug for the monthly-support card — the popup opens
   * this campaign, and https://donorbox.org/<slug> is the hosted fallback
   * if the widget script hasn't loaded yet.
   */
  donorboxCampaign: "monthly-support-955596",
} as const;

/* ------------------------------------------------------------------- nav */

export interface NavContent {
  links: CtaLink[];
  cta: CtaLink;
}

export const nav: NavContent = {
  links: [
    { label: "About", href: "/#about" },
    { label: "Schedule", href: "/#schedule" },
    { label: "Newsletter", href: "/newsletter" },
    { label: "How to help", href: "/#help" },
  ],
  cta: { label: "Support", href: site.supportUrl, external: true },
};

/* ------------------------------------------------------------------ hero */

/**
 * One countdown wheel. The number is days remaining to `target`; the ring
 * fills with the share of the road from `start` to `target` already behind.
 */
export interface CountdownRing {
  start: string;
  target: string;
  label: string;
}

export interface HeroContent {
  kicker: string;
  /** One array entry per line of the headline. */
  nameLines: string[];
  /** One wheel per entry, rendered in order. */
  countdowns: CountdownRing[];
  image: ImageRef;
}

export const hero: HeroContent = {
  kicker: "ILCA Sailor · Engineering student · Montréal → the Olympics",
  nameLines: ["Carlos", "Charabati"],
  // Both rings measure the same road, so both share a start: the day after
  // Paris 2024 closed, the first day of this campaign. Targets are the two
  // opening ceremonies (Brisbane 2032 runs 23 July – 8 August).
  countdowns: [
    {
      start: "2024-08-12T00:00:00",
      target: "2028-07-14T00:00:00",
      label: "Days to LA 2028",
    },
    {
      start: "2024-08-12T00:00:00",
      target: "2032-07-23T00:00:00",
      // Short label so it stays on one line inside the ring.
      label: "Brisbane 2032",
    },
  ],
  // Photos in /images/clean/ are web-ready copies with the event banners
  // cropped off (made by scripts/crop-banners.mjs).
  image: {
    src: "/images/clean/hero-viana.jpg",
    alt: "Carlos Charabati racing at the ILCA 4 Youth World Championship",
    focus: "70% 35%",
  },
};

/* ----------------------------------------------------------------- about */

export interface AboutContent {
  eyebrow: string;
  title: string;
  /** **bold** spans supported. */
  paragraphs: string[];
  image: ImageRef;
}

export const about: AboutContent = {
  eyebrow: "This is my project",
  title: "I'm chasing the Olympics — by method, not luck.",
  paragraphs: [
    "I am a **19-year-old sailor** from **Montréal**, driven by a deep passion for the ocean and high-performance sport. I am currently balancing my **Olympic campaign** with an **engineering dual degree** at **CentraleSupélec and McGill** University.",
    "I compete in the **ILCA**, formerly known as the Laser, the men's individual Olympic dinghy class. My mission is twofold: to reach the **Olympic podium** and to create a **positive impact** on the world along the way.",
  ],
  image: {
    src: "/images/clean/carlos-and-bernardo.jpg",
    alt: "Carlos Charabati, World Champion, and Bernardo at ILCA 4.",
  },
};

/* ------------------------------------------------------------- statement */

export interface StatementContent {
  /** One entry per line. Each line lights up word by word as you scroll. */
  lines: string[];
}

// The full-screen "statement" right after the hero — big, slow, confident.
// Keep it to 2–4 short lines; the last one lands the punch.
export const statement: StatementContent = {
  lines: [
    "World champion, focused, dedicated and smiling.",
    "Working towards the Olympic dream.",
  ],
};

/* ------------------------------------------------------------------ race */

export interface RaceContent {
  eyebrow: string;
  title: string;
  /**
   * The YouTube video shown in this section, as an "embed" link:
   * https://www.youtube-nocookie.com/embed/VIDEO_ID
   * To swap the video: open any YouTube link, copy the part after
   * "watch?v=" (the 11-character ID), and paste it after /embed/ here.
   */
  videoUrl: string;
  /**
   * What the video is, in a few words — read aloud by screen readers and
   * shown while the player loads. Update it when you swap the video.
   */
  videoTitle: string;
  /** One short line under the video. */
  caption: string;
}

export const race: RaceContent = {
  eyebrow: "One race, start to finish",
  title: "What a race looks like.",
  videoUrl: "https://www.youtube-nocookie.com/embed/rwNQ0mbh3qM",
  videoTitle: "Quick guide to Olympic sailing (video)",
  caption:
    "New to sailing? A short explainer of how an Olympic race works — the course, the start, and the fight to round every mark first.",
};

/* --------------------------------------------------------------- numbers */

export interface Stat {
  value: string;
  label: string;
  /** Rendered in Canadian red. */
  accent?: boolean;
}

export interface NumbersContent {
  eyebrow: string;
  title: string;
  stats: Stat[];
}

export const numbers: NumbersContent = {
  eyebrow: "What I've done · last two years",
  title: "The work, in numbers.",
  stats: [
    { value: "4,000", label: "Nautical miles sailed" },
    { value: "280", label: "Days on the water" },
    { value: "160", label: "Races" },
    { value: "42", label: "Podiums" },
    { value: "1", label: "World title", accent: true },
  ],
};

/* -------------------------------------------------------------- schedule */

export interface ScheduleStop {
  when: string;
  title: string;
  where: string;
  /**
   * What kind of stop this is — it controls the small badge and dot colour:
   * "event" (a regatta), "training" (a training block or camp), or
   * "olympics" (the Games themselves, the big anchors at the end).
   */
  kind: "event" | "training" | "olympics";
  /** Highlighted dot on the timeline. */
  major?: boolean;
  /** Optional red pill, e.g. "Key event" or "Olympic Games". */
  tag?: string;
}

/**
 * A "…" marker on the timeline — the stretch of years that isn't planned
 * yet. Written as a single line, `{ gap: true },`, wherever the pause
 * belongs between two stops.
 */
export interface ScheduleGap {
  gap: true;
}

export type ScheduleEntry = ScheduleStop | ScheduleGap;

export interface ScheduleContent {
  eyebrow: string;
  title: string;
  /** The badge shown on every `kind: "training"` stop. */
  trainingLabel: string;
  /**
   * The season, stop by stop. To add one, copy a whole block (from `{` to
   * `},`), paste it where it belongs in the order, and edit the text —
   * nothing else to update. `major` and `tag` are optional; delete those
   * lines to drop the highlight or the pill. `{ gap: true },` inserts the
   * "…" pause marker instead of a card.
   */
  stops: ScheduleEntry[];
}

export const schedule: ScheduleContent = {
  eyebrow: "Where I'm headed · 2026",
  title: "The season ahead.",
  trainingLabel: "Training",
  stops: [
    {
      when: "AUG 2026",
      title: "Season restart · training base",
      where: "Cascais, Portugal",
      kind: "training",
    },
    {
      when: "FALL 2026",
      title: "CORK OCR & Lima 2027 Pan American Games Country Qualifying Event",
      where: "Kingston, Ontario",
      kind: "event",
      major: true,
      tag: "Key event",
    },

    {
      when: "2026",
      title: "U21 Europeans",
      where: "Bodrum, Turkey",
      kind: "event",
      major: true,
      tag: "Major event",
    },
    {
      when: "2026",
      title: "Training blocks · Europe",
      where: "Cascais & Mediterranean venues",
      kind: "training",
    },
    // The two horizon anchors — the Games this whole road leads to.
    {
      when: "2027",
      title: "U21 World Championship",
      where: "Melbourne, Australia",
      kind: "event",
      major: true,
      tag: "Major event",
    },
    {
      when: "2027",
      title: "Training blocks · Europe",
      where: "Cascais & Mediterranean venues",
      kind: "training",
    },
    {
      when: "2027",
      title: "Princess Sofia Grand Slam",
      where: "Palma de Mallorca, Spain",
      kind: "event",
    },
    {
      when: "2027",
      title: "Semaine Olympique Française",
      where: "Hyères, France",
      kind: "event",
    },
    {
      when: "2027",
      title: "Kieler Woche Grand Slam",
      where: "Kiel, Germany",
      kind: "event",
    },
    // The years between the planned season and the Games — still to be filled.
    { gap: true },
    {
      when: "2028",
      title: "LA 2028",
      where: "Los Angeles, USA",
      kind: "olympics",
      major: true,
      tag: "Olympic Games",
    },
    { gap: true },
    {
      when: "2032",
      title: "Brisbane 2032",
      where: "Brisbane, Australia",
      kind: "olympics",
      major: true,
      tag: "Olympic Games",
    },
  ],
};

/* -------------------------------------------------------- notable results */

// The three headline results, shown as photo cards between the numbers and
// the schedule. Each card is a photo with the result in bold underneath and
// the event name under that. To change one, edit the text between the
// quotes; to swap a photo, change `src` (see "Add or swap a photo" in
// CONTENT_GUIDE.md). Keep them in the order they should appear.
export interface NotableResult {
  image: ImageRef;
  /** The result itself, short and bold — "Gold", "6th", "7th". */
  result: string;
  /**
   * The event line under it. Start it with the year, set off by a "·", so the
   * three cards read left to right as a timeline —
   * "2024 · ILCA 4 Youth World Championships · Viana do Castelo, Portugal".
   */
  event: string;
}

export interface NotableResultsContent {
  /** Small mono label above the cards. */
  eyebrow: string;
  items: NotableResult[];
}

export const notableResults: NotableResultsContent = {
  eyebrow: "Notable results",
  items: [
    {
      // TODO photo — stand-in until the real 2023 result photo is added.
      image: {
        src: "/images/clean/carlos-sixth.jpg",
        alt: "Carlos's CAN 219619 sail leading a packed ILCA fleet upwind",
        focus: "75% 60%",
      },
      result: "6th",
      event: "2023 · ILCA 4 Youth World Championships · Volos, Greece",
    },
    {
      // TODO photo — confirm this is the right shot for the world title.
      image: {
        src: "/images/clean/carlos-gold.jpg",
        alt: "Carlos celebrating his ILCA 4 Youth World Championship win",
      },
      result: "Gold",
      event:
        "2024 · ILCA 4 Youth World Championships · Viana do Castelo, Portugal",
    },
    {
      // TODO photo — stand-in until the real Kiel 2025 photo is added.
      image: {
        src: "/images/clean/carlos-seventh.jpg",
        alt: "Carlos hiking hard upwind under the CAN sail",
      },
      result: "7th",
      event: "2025 · ILCA 6 World Championships · Kiel, Germany",
    },
  ],
};

/* ------------------------------------------------------------ newsletter */

// Posts themselves live as .mdx files in content/newsletter/ — the homepage
// "Follow along" section and the /newsletter archive both read from there.
// Posts with `draft: true` in their frontmatter stay hidden everywhere; the
// homepage shows the newest three published ones (and disappears entirely
// while no post is published yet).
export interface NewsletterContent {
  /** Small red label above the title, on the homepage and the archive. */
  eyebrow: string;
  title: string;
  /** One-sentence description under the title. */
  intro: string;
  /** Text of the link from the homepage section to the full archive. */
  allPostsLabel: string;
}

export const newsletter: NewsletterContent = {
  eyebrow: "Follow along",
  title: "The journey, post by post.",
  intro:
    "Race recaps, training notes, and the parts you don't usually see — published here and emailed to anyone who wants to follow.",
  allPostsLabel: "All posts →",
};

/* ---------------------------------------------------------------- help */

export interface HelpCard {
  index: string;
  title: string;
  body: string;
  bullets?: string[];
  cta: CtaLink;
}

export interface HelpContent {
  eyebrow: string;
  title: string;
  lead: string;
  cards: HelpCard[];
}

export const help: HelpContent = {
  eyebrow: "How you can help",
  title: "Be part of the journey.",
  lead: "Whether you're a company, a fellow sailor, or someone who loves the adventure — welcome onboard.",
  cards: [
    {
      index: "01",
      title: "Follow & share",
      body: "The simplest help there is: subscribe to the updates, follow on Instagram, and pass the story along to someone who would care.",
      cta: { label: "Follow the journey", href: "#subscribe" },
    },
    {
      index: "02",
      title: "Partner with me",
      body: "For brands and companies. Your name travels with me — boat, sail, gear, and content — across Canada, US, and Europe.",
      // Until a deck link exists (site.sponsorDeckUrl), this emails Carlos
      // directly with a prefilled subject.
      cta: site.sponsorDeckUrl
        ? { label: "Request the deck", href: site.sponsorDeckUrl, external: true }
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
      body: "Direct support keeps me on the water — and every gift comes with a tax receipt in Canada, through Wind Athletes Canada.",

      cta: {
        label: "Support — with a tax receipt",
        href: site.supportUrl,
        external: true,
      },
    },
  ],
};

/* ---------------------------------------------------------------- budget */

// The budget section: the "where your support goes" ring chart, with each
// slice's label, percentage and one-line sub listed beside it. The big
// "$55k CAD/yr" line under the chart comes from data/funding.json (`goal`)
// — change the total there. Keep the four percentages summing to 100.
export interface BudgetSlice {
  /** Pillar name in the legend — "Coaching + boat". */
  label: string;
  /** Share of the budget as a number (35 = 35%) — draws the ring segment. */
  percent: number;
  /** Small line under it — what the money actually buys. */
  sub: string;
}

/** One preset monthly amount on the support card — its own button. */
export interface DonationPreset {
  /** Whole dollars per month — rendered as "$25" + the /mo suffix. */
  amount: number;
}

/** The monthly-support card beside the budget chart. */
export interface DonateContent {
  heading: string;
  /** One short line under the heading. */
  body: string;
  /** One button per entry, rendered in order; a third tier is a data-only edit. */
  presets: DonationPreset[];
  /** Suffix after every amount — "/mo". */
  perMonth: string;
  /** Placeholder text in the custom-amount input. */
  customPlaceholder: string;
  /** The red give button. */
  ctaLabel: string;
}

export interface BudgetContent {
  /** Section eyebrow above the chart card. */
  eyebrow: string;
  /** Title on the chart card. */
  chartTitle: string;
  breakdown: BudgetSlice[];
  donate: DonateContent;
}

export const budget: BudgetContent = {
  eyebrow: "What it costs",
  chartTitle: "Where your support goes",
  breakdown: [
    {
      label: "Coaching + boat",
      percent: 35,
      sub: "Coach fees, boat charter & shipping",
    },
    {
      label: "Regattas + housing",
      percent: 35,
      sub: "Entry fees, accommodation",
    },
    {
      label: "Travel",
      percent: 16,
      sub: "Flights, transport to venues",
    },
    {
      label: "Equipment + fitness",
      percent: 14,
      sub: "Sails, gear, physical training",
    },
  ],
  // Giving runs through the Donorbox popup (site.donorboxCampaign).
  donate: {
    heading: "Support monthly",
    body: "A steady amount each month keeps the season funded race to race.",
    presets: [{ amount: 20 }, { amount: 50 }, { amount: 100 }],
    perMonth: "/mo",
    customPlaceholder: "Custom amount",
    ctaLabel: "Give monthly",
  },
};

/* --------------------------------------------------------------- backers */

// The sponsor logos themselves live in data/sponsors/rank-*.json (rank-1 =
// top/widest row of the pyramid) — see the README there for how to edit.
export interface BackersContent {
  label: string;
  /** The "maybe you?" card at the pyramid's tip, inviting new partners. */
  joinCta: {
    title: string;
    body: string;
    href: string;
  };
}

export const backers: BackersContent = {
  label: "Proudly supported by",
  joinCta: {
    title: "Maybe you?",
    body: "There's room on the sail.",
    href: "/#help",
  },
};

/* ------------------------------------------------------------- subscribe */

export interface SubscribeContent {
  eyebrow: string;
  /**
   * The section's oversized red headline — also reused as the heading
   * inside the signup window. Keep it to a few words.
   */
  title: string;
  body: string;
  /**
   * The huge red button that opens the signup window. Keep it to a word or
   * three — it renders big.
   */
  ctaLabel: string;
  placeholder: string;
  /** The submit button inside the signup window, and its "working…" state. */
  button: string;
  buttonBusy: string;
  success: string;
  /** Shown if the request fails without a specific error message. */
  errorFallback: string;
  /** Small link to the newsletter archive, under the big red button. */
  archive: CtaLink;
}

export const subscribe: SubscribeContent = {
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
};

/* ---------------------------------------------------------------- footer */

export interface FooterColumn {
  heading: string;
  links: CtaLink[];
}

export interface FooterContent {
  tagline: string;
  /**
   * Screen-reader labels for the icon buttons under the brand name. The
   * links themselves come from `site` above (instagramUrl, linkedinUrl,
   * facebookUrl — an icon hides itself while its URL is empty); the mail
   * icon assembles the address in JS on click so it never appears in the
   * page HTML for scrapers to harvest.
   */
  socialLabels: {
    email: string;
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  columns: FooterColumn[];
  donationNote: string;
}

export const footer: FooterContent = {
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
};

/* ---------------------------------------------- language bundles (EN/FR) */

// Everything a visitor reads, grouped per language. `en` simply collects
// the sections defined above — nothing to edit here. The French version
// lives in config/content.fr.ts and mirrors this shape exactly; the EN/FR
// toggle in the navbar picks one of the two (EN is the default). `site`
// (links, email, sail number) is shared and doesn't fork per language.
export interface ContentBundle {
  nav: NavContent;
  hero: HeroContent;
  about: AboutContent;
  statement: StatementContent;
  race: RaceContent;
  numbers: NumbersContent;
  schedule: ScheduleContent;
  notableResults: NotableResultsContent;
  newsletter: NewsletterContent;
  help: HelpContent;
  budget: BudgetContent;
  backers: BackersContent;
  subscribe: SubscribeContent;
  footer: FooterContent;
}

export const en: ContentBundle = {
  nav,
  hero,
  about,
  statement,
  race,
  numbers,
  schedule,
  notableResults,
  newsletter,
  help,
  budget,
  backers,
  subscribe,
  footer,
};
