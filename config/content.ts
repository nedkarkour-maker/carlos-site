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
  /**
   * Link to the sponsorship deck (PDF or Drive). While empty, the
   * "Request the deck" card emails Carlos instead — nothing dead ships.
   */
  sponsorDeckUrl: "",
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
  /**
   * The wheel counts days until `target` and fills its ring with the share
   * of the road already travelled since `start`.
   */
  countdown: { start: string; target: string; label: string };
  image: ImageRef;
}

export const hero: HeroContent = {
  kicker: "ILCA Sailor · Engineer · Montréal → the Olympics",
  nameLines: ["Carlos", "Charabati"],
  // start = the day after Paris 2024 closed: the first day of this quad.
  // target = the LA 2028 opening ceremony.
  countdown: {
    start: "2024-08-12T00:00:00",
    target: "2028-07-14T00:00:00",
    label: "Days to LA 2028",
  },
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
    "I'm an 18-year-old ILCA sailor from Montréal, and an engineering student at McGill and CentraleSupélec. I race for Canada — sail number **CAN 219619** — out of Clube Naval de Cascais.",
    "In 2024, I became **ILCA 4 Youth World Champion** in front of 277 sailors. A year later, I lined up against the world's best at the 2025 Men's Worlds in Kiel, and finished **7th of 124**. I treat sailing the way I treat engineering: measure, adjust, repeat — **fail fast, recover methodically.**",
    "2028 and 2032 are on the horizon. This is the long road there. [DRAFT — full story from locked spine; this is the length/tone.]",
  ],
  image: {
    src: "/images/IMG_3906.JPG",
    alt: "Carlos Charabati receiving a medal at a championship ceremony",
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
    "World champion at 18.",
    "7th of 124 at the Men's Worlds at 19.",
    "LA 2028 isn't a dream. It's the plan.",
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
  /** Highlighted dot on the timeline. */
  major?: boolean;
  /** Optional red pill, e.g. "Key event". */
  tag?: string;
}

export interface ScheduleContent {
  eyebrow: string;
  title: string;
  stops: ScheduleStop[];
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
  /** The event line under it — "2024 ILCA 4 Youth Worlds". */
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
        src: "/images/clean/fleet-upwind.jpg",
        alt: "Carlos's CAN 219619 sail leading a packed ILCA fleet upwind",
        focus: "75% 60%",
      },
      result: "6th",
      // TODO copy — confirm the exact 2023 event name.
      event: "2023 Worlds",
    },
    {
      // TODO photo — confirm this is the right shot for the world title.
      image: {
        src: "/images/clean/story-worldchamp.jpg",
        alt: "Carlos celebrating his ILCA 4 Youth World Championship win",
      },
      result: "Gold",
      event: "2024 ILCA 4 Youth Worlds",
    },
    {
      // TODO photo — stand-in until the real Kiel 2025 photo is added.
      image: {
        src: "/images/clean/upwind-ireland.jpg",
        alt: "Carlos hiking hard upwind under the CAN sail",
      },
      result: "7th",
      event: "2025 Men's Worlds, Kiel",
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
  body: "One email when something happens — a result, a training block, a milestone. No spam, ever.",
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

export interface FooterBrandLink {
  label: string;
  href?: string;
  /**
   * Renders as a button that assembles the mailto in JS on click, so the
   * address never appears in the page HTML for scrapers to harvest.
   */
  email?: boolean;
}

export interface FooterContent {
  tagline: string;
  /** Arrow links under the brand name: contact + socials. */
  brandLinks: FooterBrandLink[];
  columns: FooterColumn[];
  donationNote: string;
}

export const footer: FooterContent = {
  tagline: `${site.role} · ${site.country} ${site.sailNumber}`,
  brandLinks: [
    { label: "Send an email to Carlos", email: true },
    { label: "Instagram", href: site.instagramUrl },
    { label: "LinkedIn", href: site.linkedinUrl },
  ],
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
