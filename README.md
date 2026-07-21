# carlos-site

Sponsorship and support site for **Carlos Charabati** — Canadian ILCA sailor
(CAN 219619), 2024 ILCA 4 Youth World Champion, campaigning toward LA 2028.

Next.js (App Router) · React · Tailwind v4 · TypeScript · GSAP + Lenis motion.

## Commands

```bash
npm run dev     # local dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Environment

Create `.env.local` (never committed) with:

| Variable | Required | What it does |
| --- | --- | --- |
| `MAILERLITE_API_KEY` | for the subscribe form | MailerLite API token. Without it the form returns a friendly 503. |
| `MAILERLITE_GROUP_ID` | for the subscribe form | The MailerLite group new subscribers join. |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical production URL used for social-share metadata, the sitemap and structured data. Falls back to Vercel's production URL, then localhost. |
| `GEMINI_API_KEY` | optional | Only for regenerating background art via `scripts/generate-images.mjs`. |

**MailerLite:** enable *double opt-in* in the MailerLite dashboard so every
signup is confirmed by email — the form's honeypot and time-trap stop casual
bots, but confirmed opt-in is what protects sender reputation.

## Editing the site

- **All visitor-facing copy** lives in [`config/content.ts`](config/content.ts)
  — see [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) for a field-by-field guide.
- **Newsletter posts** are MDX files in `content/newsletter/`.
- **Photos** go in `public/images/` (filename case matters in production —
  Vercel is case-sensitive).
- **Working notes for dev/AI sessions** are in [`HANDOFF.md`](HANDOFF.md).

## Scripts

- `node scripts/crop-banners.mjs` — re-crops the press photos into the
  web-ready copies in `public/images/clean/`.
- `node scripts/make-og-image.mjs` — regenerates the 1200×630 social-share
  card (`app/opengraph-image.jpg`) from the hero photo.
- `node scripts/generate-images.mjs` — regenerates the atmospheric background
  art in `public/images/generated/` (needs `GEMINI_API_KEY`).
- `node scripts/screenshot-tour.mjs <baseUrl> <outDir>` — scrolls through the
  running site and screenshots every section at desktop and mobile widths.
