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
}

/* ------------------------------------------------------------------ site */

export const site = {
  name: "Carlos Charabati",
  role: "ILCA Sailor",
  country: "CAN",
  sailNumber: "219619",
  supportUrl: "https://www.windathletes.ca/athletes/carlos-charabati",
  instagramUrl: "#", // TODO: real Instagram profile URL
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

export interface HeroContent {
  kicker: string;
  /** One array entry per line of the headline. */
  nameLines: string[];
  /** `highlight` is rendered in Canadian red. */
  thesis: { before: string; highlight: string; after: string };
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  countdown: { target: string; label: string };
  image: ImageRef;
}

export const hero: HeroContent = {
  kicker: "ILCA Sailor · Engineer · Montréal → the Olympics",
  nameLines: ["Carlos", "Charabati"],
  thesis: {
    before:
      "World champion at 18. Engineering student at McGill & CentraleSupélec. ",
    highlight: "Chasing the Olympic Games",
    after: " — one season at a time.",
  },
  primaryCta: { label: "My project", href: "#about" },
  secondaryCta: { label: "How you can help", href: "#help" },
  countdown: { target: "2028-07-14T00:00:00", label: "Days to LA 2028" },
  image: {
    src: "/images/IMG_5623.JPG",
    alt: "Carlos Charabati racing his ILCA dinghy under the CAN sail",
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
    "I'm an 18-year-old ILCA sailor from Montréal, and an engineering student at McGill and CentraleSupélec. I race for Canada — sail number **CAN 219619** — out of Clube Naval de Cascais.",
    "In 2024, I became **ILCA 4 Youth World Champion** in front of 277 sailors. A year later, I lined up against the world's best at the 2025 Men's Worlds in Kiel, and finished **7th of 124**. I treat sailing the way I treat engineering: measure, adjust, repeat — **fail fast, recover methodically.**",
    "2028 and 2032 are on the horizon. This is the long road there. [DRAFT — full story from locked spine; this is the length/tone.]",
  ],
  image: {
    src: "/images/IMG_3906.JPG",
    alt: "Carlos Charabati receiving a medal at a championship ceremony",
  },
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
  /** Highlighted dot on the timeline. */
  major?: boolean;
  /** Optional red pill, e.g. "Key event". */
  tag?: string;
}

export interface ScheduleContent {
  eyebrow: string;
  title: string;
  stops: ScheduleStop[];
  photos: ImageRef[];
}

export const schedule: ScheduleContent = {
  eyebrow: "Where I'm headed · 2026",
  title: "The season ahead.",
  stops: [
    {
      when: "AUG 2026",
      title: "Season restart · training base",
      where: "Building the year's foundation [DRAFT — from your calendar]",
      major: true,
    },
    {
      when: "FALL 2026",
      title: "Senior Canadian Championships",
      where: "Kingston, Ontario",
      major: true,
      tag: "Key event",
    },
    {
      when: "2026",
      title: "Training blocks · Europe",
      where: "Cascais & Mediterranean venues",
    },
    {
      when: "2026",
      title: "U21 Europeans",
      where: "Bodrum, Türkiye",
      major: true,
      tag: "Key event",
    },
  ],
  photos: [
    {
      src: "/images/ZAG_5526.jpg",
      alt: "Carlos hiking upwind in heavy spray at the ILCA 4 Youth Worlds",
    },
    {
      src: "/images/29062024-5P7A0650.jpg",
      alt: "Carlos rounding a mark during a championship race",
    },
    {
      src: "/images/26062024-DJI_0231.jpg",
      alt: "Aerial view of the ILCA fleet rounding a mark",
    },
  ],
};

/* ------------------------------------------------------------ newsletter */

// Posts themselves live as .mdx files in content/newsletter/ — the homepage
// teaser and the archive both read from there (see lib/newsletter.ts).
export interface NewsletterContent {
  eyebrow: string;
  title: string;
  intro: string;
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

export interface BudgetItem {
  label: string;
  share: string;
}

export interface HelpContent {
  eyebrow: string;
  title: string;
  lead: string;
  cards: HelpCard[];
  budget: {
    amount: string;
    note: string;
    breakdown: BudgetItem[];
  };
}

export const help: HelpContent = {
  eyebrow: "How you can help",
  title: "Three ways to be part of it.",
  lead: "Whether you're a company, a fellow sailor, or someone who just likes the story — there's a way in. No pressure; every bit moves the project forward.",
  cards: [
    {
      index: "01",
      title: "Follow & share",
      body: "The simplest help there is: subscribe to the updates, follow on Instagram, and pass the story along to someone who'd care.",
      cta: { label: "Follow the journey", href: "#news" },
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
      cta: { label: "Request the deck", href: "#" }, // TODO: sponsorship-deck link or mailto
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
  budget: {
    amount: "≈ €22,000",
    note: "what the 2026 season takes [DRAFT]",
    breakdown: [
      { label: "Coaching & camps", share: "35%" },
      { label: "Travel", share: "30%" },
      { label: "Boat & gear", share: "20%" },
      { label: "Entries & lodging", share: "15%" },
    ],
  },
};

/* --------------------------------------------------------------- backers */

export interface Sponsor {
  name: string;
  /** Path to a logo image in /public — a monogram placeholder renders until provided. */
  logo?: string;
}

export interface BackersContent {
  label: string;
  sponsors: Sponsor[];
  /** The "maybe you?" card inviting new partners. */
  joinCta: {
    title: string;
    body: string;
    href: string;
  };
}

export const backers: BackersContent = {
  label: "Proudly supported by",
  // TODO: drop logo files into /public/images/sponsors and add logo: "/images/sponsors/…"
  sponsors: [
    { name: "Sail Canada" },
    { name: "Voile Québec" },
    { name: "Wind Athletes Canada" },
    { name: "Peter Kelly Fund" },
    { name: "YC Pointe-Claire" },
    { name: "Clube Naval de Cascais" },
  ],
  joinCta: {
    title: "Maybe you?",
    body: "There's room on the sail.",
    href: "/#help",
  },
};

/* ------------------------------------------------------------- subscribe */

export interface SubscribeContent {
  title: string;
  body: string;
  placeholder: string;
  button: string;
  buttonBusy: string;
  success: string;
  /** Shown if the request fails without a specific error message. */
  errorFallback: string;
}

export const subscribe: SubscribeContent = {
  title: "Follow the campaign.",
  body: "One email when something happens — a result, a training block, a milestone. No spam, ever.",
  placeholder: "you@email.com",
  button: "Subscribe",
  buttonBusy: "Subscribing…",
  success: "Thank you for subscribing!",
  errorFallback: "Something went wrong — please try again later.",
};

/* ---------------------------------------------------------------- footer */

export interface FooterColumn {
  heading: string;
  links: CtaLink[];
}

export interface FooterContent {
  tagline: string;
  columns: FooterColumn[];
  donationNote: string;
}

export const footer: FooterContent = {
  tagline: `${site.role} · ${site.country} ${site.sailNumber}`,
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
        { label: "Contact", href: "#" }, // TODO: contact email or form
      ],
    },
  ],
  donationNote: "Donations via Wind Athletes Canada",
};
