# Paste-able implementation prompt (carlos-site, branch `motion-redesign`)

Copy everything below the line into your VS Code assistant. Delete this file
once the work is merged.

---

Work in this repo (Next.js 16.2.10, App Router, Tailwind v4, TypeScript).
**Before writing any Next-specific code, read the matching guide in
`node_modules/next/dist/docs/` — this Next version differs from your training
data.** Read `HANDOFF.md` for full context. An approved plan exists; part of
it is already done. Do NOT redo the done items.

## Already done (verify, don't redo)
- `config/content.ts`: real contact email (`c.charabati@icloud.com`),
  real Instagram URL, mailto fallback for the "Request the deck" card,
  `site.url` (env-driven), `site.now`, `latestResult` content,
  `stops[].coords` for the venue map. Footer "Contact" is a mailto link.
- `/about` and `/schedule` no longer render blank pages — they
  `redirect()` to `/#about` / `/#schedule`.
- `npm run lint` and `npm run build` both pass at this state.

## Hard constraints
- The animation budget is spent: **no new GSAP timelines, no new pinned
  sections, no WebGL/3D, no cursor effects, no page transitions.** The only
  new interactivity allowed is the venue-map hover/focus sync described
  below (plain React state).
- All visitor-facing copy stays in `config/content.ts`.
- Match existing code style (see neighbouring components).
- Everything must be secure; degrade gracefully when optional config is
  empty.

## Tasks

### 1. Security headers — `next.config.ts`
Add an async `headers()` (syntax:
`node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/headers.md`)
applying to `source: "/:path*"`:
- `Content-Security-Policy`: `default-src 'self'; script-src 'self'
  'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:
  blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';
  object-src 'none'; base-uri 'self'; form-action 'self'` — in development
  builds append `'unsafe-eval'` to script-src and `ws:` to connect-src or
  HMR breaks (branch on `process.env.NODE_ENV`).
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
Do NOT build a nonce-based CSP — over-engineering for this site.

### 2. Awareness layer (metadata / OG / sitemap / robots / JSON-LD)
- `app/layout.tsx`: extend `metadata` with `metadataBase: new URL(site.url)`,
  a richer description, `openGraph` (type website, siteName, locale en_CA)
  and `twitter: { card: "summary_large_image" }`.
- OG image via the **file convention** (docs:
  `01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`):
  create `app/opengraph-image.jpg` — a 1200×630 crop of
  `public/images/clean/hero-viana.jpg` made with `sharp` (already in
  node_modules; one-off script, see `scripts/crop-banners.mjs` for the
  pattern) — plus `app/opengraph-image.alt.txt`.
- `app/sitemap.ts` + `app/robots.ts` (file conventions in the same docs
  folder): home, `/newsletter`, and every non-draft post from
  `getAllPosts()` in `lib/newsletter.ts`; robots disallows `/api/`, links
  the sitemap. Build URLs from `site.url`.
- JSON-LD in `app/page.tsx`: a `Person` object (name, url, jobTitle
  "ILCA Sailor", nationality CA, sameAs: [instagramUrl, supportUrl]),
  serialized with `JSON.stringify(...).replace(/</g, "\\u003c")` into a
  `<script type="application/ld+json">`.
- `app/newsletter/[slug]/page.tsx`: extend `generateMetadata` with
  `openGraph` (title, description, and the post `cover` image when set).

### 3. Harden `/api/subscribe` (`app/api/subscribe/route.ts` + `components/Subscribe.tsx`)
- Honeypot: add a text input named `company` to the form — visually hidden
  (absolutely positioned off-screen, `tabIndex={-1}`, `aria-hidden`,
  `autoComplete="off"`), sent with the JSON body. Server: if `company` is a
  non-empty string, return `{ ok: true }` WITHOUT calling MailerLite
  (silent drop — don't teach bots).
- Time-trap: client records `Date.now()` on mount (useRef) and sends
  `elapsedMs`. Server: if `elapsedMs` is not a finite number ≥ 3000,
  silent-drop the same way.
- Same-origin: reject with 403 if `Sec-Fetch-Site` is present and not
  `same-origin`/`same-site`/`none`, or if `Origin` is present and its host
  ≠ the `Host` header (wrap `new URL(origin)` in try/catch → reject on
  failure).
- Keep the existing email validation and MailerLite flow untouched.
- Note (not code): enable double opt-in in the MailerLite dashboard.

### 4. Content-led touches
- **Now line**: in `components/Hero.tsx`, inside the telemetry row (the
  flex container with the sail-number box and `<Countdown>`), render
  `site.now` when non-empty: mono font, matching the Countdown's
  label style (`font-mono text-[11px] uppercase tracking-[.14em]
  text-sail/65` for the label "Now", value above it in mono like the
  countdown digits). Give it `data-hero-fade` treatment consistent with
  siblings (it's inside an existing `data-hero-fade` container, so nothing
  extra needed).
- **Latest-result strip**: new server component
  `components/LatestResult.tsx` rendering a slim `bg-teal-950 text-sail`
  band (it sits between the hero's dim-to-dark exit and the dark Statement
  section, so teal-950 keeps the hand-off seamless): mono eyebrow
  "Latest result", `latestResult.result` in `text-red-bright` display font,
  `latestResult.event`, and an optional arrow link when `href` is set.
  Mount in `app/page.tsx` between `<Hero />` and `<Statement />`.
- **Venue map**: new client component `components/VenueMap.tsx`, rendered
  from `components/Schedule.tsx` in a `wrap` block between the timeline
  layouts and the photo strip (NOT inside the pinned h-screen section —
  it would break the GSAP pin measurements). Architecture:
  - `Schedule` (already `"use client"`) holds
    `const [active, setActive] = useState<number | null>(null)` and passes
    `active`/`setActive` down; timeline cards/list items get
    `onMouseEnter`/`onFocus` → `setActive(i)` and a highlight class when
    active (e.g. `border-red/60`).
  - `VenueMap` draws an abstract nautical chart as inline SVG in the style
    of `VenuesChart` in `components/art/Backdrops.tsx` (graticule lines,
    sprinkled depth dots, dashed route connecting the stops in order,
    small compass rose — reuse that code as the starting point,
    `currentColor` + low opacities). **No map library, no coastlines.**
  - Each stop with `coords` gets an HTML `<button>` absolutely positioned
    at `left: x% / top: y%` over the SVG (real buttons = keyboard
    accessible; `aria-pressed` or `aria-current` for the active one), with
    the `coords.label` in mono text beside the dot. Hover/focus sets
    active; active dot gets the red ring treatment
    (`shadow-[0_0_0_5px_rgba(212,46,46,.18)]` like timeline dots).
  - A small caption panel under the chart shows the active stop's
    `when / title / where` (default to the first stop).
  - If NO stop has coords, render nothing (component returns null).
- **Footer link rendering** (`components/Footer.tsx`): column links render
  through `next/link` — `mailto:` hrefs must render as plain `<a>`. Render
  `<a>` when `href` doesn't start with `/`, `<Link>` otherwise.

### 5. Housekeeping
- Rewrite `README.md`: what the site is, `npm run dev/build/lint`, env vars
  `MAILERLITE_API_KEY` / `MAILERLITE_GROUP_ID` (in `.env.local`), optional
  `NEXT_PUBLIC_SITE_URL`, pointers to `CONTENT_GUIDE.md` and `HANDOFF.md`,
  and the MailerLite double-opt-in note.
- Grep before deleting, then remove unused default assets
  (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
  and unreferenced duplicate photos (e.g. `IMG_3906.jpeg` vs `IMG_3906.JPG`
  — keep the exact-case file referenced in `config/content.ts`; Vercel is
  case-sensitive).
- Leave all `[DRAFT]` copy in place.
- Update `HANDOFF.md`'s actions log when done.

## Verification (all must pass)
1. `npm run lint` && `npm run build`.
2. `npm run dev`: `/about`, `/schedule` redirect; Now line + latest-result
   strip render; venue map syncs hover/focus both directions and works by
   keyboard; subscribe form still submits (503 without env keys is the
   expected local path).
3. Response headers on `/` include the CSP set; `/sitemap.xml` and
   `/robots.txt` serve; page source shows og:/twitter: tags and the JSON-LD
   script.
4. POST `/api/subscribe` with `company` filled or `elapsedMs: 100` →
   `{ ok: true }` with no MailerLite attempt (with env unset, the
   "not configured" console.error must NOT appear for dropped requests).
5. `node scripts/screenshot-tour.mjs` — eyeball every section for layout
   regressions, especially around the new strip and map.
