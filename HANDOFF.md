# HANDOFF.md — working notes for Claude sessions on carlos-site

Purpose: structure the thinking and log actions so a fresh conversation can
continue without re-deriving everything. Update this file at the end of any
session that changes direction or ships work.

## Conversation rules the user set (2026-07-08)

- Never open with agreement; challenge assumptions first.
- Tag claims: [Certain] / [Likely] / [Guessing].
- No filler praise ("Great question", "Absolutely", …).
- Disagree with structure: reason → alternative → risk of user's approach.
- Uncomfortable truth goes in the first line.
- Hold positions unless genuinely new information arrives.
- Everything built must be secure.
- Keep this handoff file updated.

## What the site is

Sponsorship/support site for **Carlos Charabati**, 18-year-old Canadian ILCA
sailor (CAN 219619), 2024 ILCA 4 Youth World Champion, campaigning toward
LA 2028. Conversion goals, inferred from content [Likely]:
1. sponsor contact ("Request the deck"), 2. donations via Wind Athletes
Canada, 3. newsletter signups (MailerLite).

## Stack & architecture (verified 2026-07-08) [Certain]

- Next.js 16.2.10 (App Router), React 19, Tailwind v4, TypeScript.
  **AGENTS.md warning applies: consult `node_modules/next/dist/docs/` before
  writing Next code — training-data APIs may be wrong.**
- All copy in `config/content.ts` (owner-editable; see CONTENT_GUIDE.md).
- Motion: GSAP + ScrollTrigger + Lenis (`components/motion/*`,
  `lib/motion.ts`). Reduced-motion fallbacks exist everywhere checked.
- Newsletter: MDX in `content/newsletter/`, rendered with next-mdx-remote/rsc,
  static params + `dynamicParams = false`, slug regex-guarded in
  `lib/newsletter.ts`.
- Subscribe: `app/api/subscribe/route.ts` → MailerLite, keys in env, input
  validated server-side.
- Branch `motion-redesign`, clean tree; three motion passes already committed.

## State assessment (2026-07-08)

Already good — do NOT re-add or pile onto: hero entrance/exit, pinned
scrollytelling (StoryScroll), statement section, count-up stats, timeline,
budget bars, sponsor marquee, wave dividers, magnetic buttons, smooth scroll.
The motion budget is **spent**. [Certain from reading components]

Real gaps found:
1. `/about` and `/schedule` pages render `null` → blank white pages, linked
   nowhere but reachable/indexable. [Certain]
2. Dead links in production copy: `site.instagramUrl = "#"`, footer Contact
   `"#"`, sponsor card "Request the deck" `"#"`. These are the site's main
   conversion CTAs. [Certain]
3. No share/SEO layer: no `metadataBase`, no Open Graph/Twitter image, no
   sitemap/robots, no JSON-LD. Sponsors will first see this site as a link
   pasted in WhatsApp/LinkedIn/email — the preview card is the first
   impression. [Certain about absence; Likely about impact]
4. No security headers: `next.config.ts` is empty — no frame-ancestors/
   X-Frame-Options, Referrer-Policy, Permissions-Policy,
   X-Content-Type-Options. [Certain]
5. `/api/subscribe` has no abuse protection (no honeypot, no rate limit).
   Risk: bots list-bomb strangers' emails through the form → MailerLite
   sender-reputation damage. [Likely]
6. `[DRAFT]` markers ship in visible copy (about, schedule, budget). Content
   task for Carlos, not code. [Certain]
7. Housekeeping: default create-next-app README; duplicate photos
   (`IMG_3906.jpeg` + `IMG_3906.JPG` etc.); unused default SVGs in /public.
   Vercel (Linux) is case-sensitive — filename case in content.ts must match
   exactly. [Certain]

## Direction decided

**Finish > flourish.** No new big animations, no WebGL/3D/cursor effects, no
more pinned sections. Uniqueness comes from content-led touches:
- "Now" status line in hero telemetry (one config field, human, cheap).
- Latest-result strip (config-driven).
- Interactive SVG venue map for the schedule (hover/timeline sync) — the one
  genuinely new interactive element; plain inline SVG, no map library.

## Real-world values (user-provided 2026-07-08)

- Contact email: `c.charabati@icloud.com` (wired into config).
- Instagram: `https://www.instagram.com/carlos_charabati` (tracking params
  stripped; wired into config).
- Sponsorship deck: does not exist yet → `site.sponsorDeckUrl = ""`, card
  falls back to mailto. When the deck exists, set that one field.
- Production domain: unknown → `site.url` reads `NEXT_PUBLIC_SITE_URL`,
  then Vercel's production-URL env, then localhost.

## Structure v2 redesign (2026-07-09, session 3) — IN PROGRESS

User pasted a full overhaul prompt (deletions, countdown wheel, new
section order, funding bar, big newsletter CTA, scroll-driven race
animation, sponsor pyramid, footer). Branch: **`redesign/structure-v2`**
(cut from motion-redesign tip). One commit per section, all verified by
tsc + eslint; `npm run build` green at wrap-up. Pushed for Vercel preview.

### Decisions the user made in-session (AskUserQuestion)

1. **Venue map**: deleted (VenueMap.tsx + coords config); timeline kept.
   "Do not modify Season ahead" applies to the timeline only.
2. **Newsletter teaser**: deleted entirely ("too long, nothing sparks
   attention"); a one-line "Read past updates →" link now sits in the
   Subscribe section; archive stays in the navbar.
3. **Footer 4E — SPEC CHANGED, NOT the icon circles from the prompt.**
   User's words: under "Carlos Charabati" in the footer, add arrow links
   for "Send an email to carlos", "instagram" and "linkedin" (like the
   existing "→ Instagram" line). LinkedIn URL:
   https://www.linkedin.com/in/carlos-charabati/ . Keep the rest of the
   footer as-is. Assemble the mailto in JS on click (scraper resistance,
   from the original 4E spec) — needs a small client component.

### Shipped (commits, oldest first)

- `2c48608` Part 1 deletions: hero bio/thesis, sail badge, Now line,
  LatestResult strip, VenueMap — components, config and imports.
- `8c0d1d1` Part 2: Countdown.tsx rewritten as SVG ring wheel (props
  start/target/label; ring = elapsed share of 2024-08-12 → 2028-07-14,
  ~48.6% today, T-736 verified). Hero is now a lg: 2-col grid — wheel
  right on desktop, below the name on mobile. IO + gsap count-up once;
  reduced motion renders final state.
- `cb2d22e` Part 3: order = hero, statement, about, numbers, schedule,
  PhotoStrip (new, config `photoStrip`, 6 reused photos), help, Budget
  (extracted BudgetBars), subscribe, race, backers, footer. Teaser
  deleted; `#news` → `#subscribe` (help card 01).
- `bbf768a` 4A: data/funding.json {goal, raised, currency} →
  FundingBar (motion/) under BudgetBars; data/README.md explains the
  one-line raised edit.
- `edd1aae` 4B: Subscribe reworked — eyebrow "How you can support",
  oversized red display title, one field + button, archive link.
  Route: added per-IP sliding-window rate limit (5/10min, in-memory,
  best-effort on serverless) BEFORE body parse; 429 on trip.
- `aa0de87` 4C: RaceScroll.tsx replaces StoryScroll.tsx (deleted, story
  config → race config). Sticky 100vh SVG under a 600vh track, scrubbed
  GSAP timeline: aspect-aware viewBox camera (CAMERA keyframes at t 0,1,
  2,3,3.5,4,4.5,5,6; expandBox() fits viewport aspect, rebuilt on real
  resizes), 7-boat fleet on waypoint choreography (boatPath generator;
  Carlos red, b1 is the downwind rival), mono captions per step, 3-2-1
  ticks, progress segments, time-based wind pulse. Reduced motion: six
  static SVG frames (positionsAt(t=i+1); steps 1&6 use a 4:3 box).
  Verified with Playwright screenshots, desktop+mobile, zero console
  errors.
- `cc8f861` 4D: Backers.tsx rebuilt as inverted pyramid from
  data/sponsors/rank-1..4.json (+README). Plain logos, no cards, per-row
  shrinking sizes, wordmark fallback (Peter Kelly Fund), 2 placeholder
  slots (rank-2, rank-4), "Maybe you?" at the tip → /#help. Marquee gone;
  `sponsors` removed from config. NOTE: logos ARE fine — an early
  screenshot looked empty only because dev image-optimizer + lazy-load
  needed ~3s after scroll; loaded:true confirmed after waiting.

### 4E + Part 5 — DONE (same session, after token top-up)

- `9fdf8a4` 4E: three arrow links under the footer brand (Send an email
  to Carlos / Instagram / LinkedIn), per the revised spec. New
  `EmailLink` client component assembles the mailto on click from config
  (optional subject prop); footer Contact and the deck-request card use
  it too. Verified: **no `mailto:` and no address anywhere in served
  HTML** — note that passing a mailto href as a prop to a client
  component leaks it via the RSC payload; pass only the subject.
  `site.linkedinUrl` added to config.
- Part 5 verification, all green:
  section order matches the spec at 1440 and 375, zero console errors;
  countdown reads T–736 (correct for 2026-07-09); funding.json edit
  (raised 5500) → "€5,500 raised of €22,000 (25%)" and sponsor moved
  rank-2→rank-3 re-renders the pyramid (both reverted after the test);
  race advances with keyboard PageDown to the finish caption; reduced
  motion → static wheel (ring 48.6%), six static race frames, no bar
  animation; subscribe route: cross-site 403, bad email 400, honeypot
  and <3s submits get fake `{ok:true}`, 6th request in 10 min → 429;
  production build green; client chunks contain no MAILERLITE strings.
- `race-shots.tmp.mjs` deleted. Branch pushed → Vercel preview.
- One oddity: commit `646be60` ("your update message") is the user's own
  commit of the previous handoff update — harmless, but reword it if the
  branch ever gets rebased anyway.

### Still manual / open

1. MailerLite double opt-in: still pending in the dashboard.
2. Sponsor URLs in data/sponsors/*.json are mostly `""` — fill in real
   sites when Carlos confirms them (only Wind Athletes is set).
3. `[DRAFT]` copy still ships (about paragraph 3, schedule stop 1,
   budget note) — content task for Carlos.
4. A dev server from an earlier session still runs on localhost:3113
   (PID 36460); port 3000 is blocked while it lives.

### Session-3 gotchas worth keeping

- Playwright + Lenis/ScrollTrigger: measure the track AFTER ~2s
  (pin-spacers shift layout), re-measure per shot, and pin scroll by
  calling window.scrollTo every rAF for ~240 frames; `networkidle` never
  fires on the dev server (HMR socket) — use `load`.
- The countdown screenshot mid-animation reads a wrong number (581) —
  it's the count-up tween, not a math bug; final value verified 736.
- eslint react-hooks/purity: seed refs in useEffect (Subscribe.tsx
  pattern) — Countdown/RaceScroll follow it.

## Plan status (approved plan: finish-and-harden pass) — COMPLETE

The full finish-and-harden pass from `NEXT_STEPS_PROMPT.md` shipped
2026-07-08 (session 2). That prompt file is now historical — delete it
once the branch is merged. Everything below is implemented and verified:

1. Security headers (`next.config.ts`): CSP (+'unsafe-eval'/ws: only in
   dev), nosniff, X-Frame-Options DENY, Referrer-Policy,
   Permissions-Policy — verified on both `next start` and `next dev`.
2. Awareness layer: `metadataBase`/OG/twitter in layout (description
   lives in `site.description` in config), `app/opengraph-image.jpg`
   (1200×630 crop via `scripts/make-og-image.mjs`, re-runnable) +
   alt.txt, `app/sitemap.ts` (home, /newsletter, non-draft posts — all
   4 posts are still draft:true so none listed yet, by design),
   `app/robots.ts` (disallow /api/), JSON-LD Person on the homepage,
   OG on newsletter posts (cover image when set).
3. Subscribe hardening: honeypot `company` + `elapsedMs` ≥3s time-trap
   (both silently drop with `{ok:true}` BEFORE any MailerLite code),
   Sec-Fetch-Site/Origin same-origin check (403). Verified by POSTing
   all paths. STILL MANUAL: enable double opt-in in the MailerLite
   dashboard. Residual risk [Likely small]: browser autofill could fill
   the hidden "company" field for some users; the fake-success reply
   would hide it — if signups ever look broken, check that first.
4. Content touches: Now line in hero telemetry (`site.now`),
   `LatestResult` teal-950 strip between Hero and Statement,
   `VenueMap` chart synced both directions with the Schedule timeline
   (lifted state, keyboard accessible, labels flip left near the right
   edge so they don't clip), Footer renders non-`/` hrefs as `<a>`.
5. Housekeeping: real README, deleted 5 default SVGs + 3 byte-identical
   duplicate photos (IMG_3906/5623/5624.jpeg; the referenced .JPG
   versions stay), [DRAFT] copy left in place.

Verification run (all green): lint, build, headers/sitemap/robots/OG/
JSON-LD curl checks, /about + /schedule 307s, subscribe drop + 403
paths, Playwright interaction suite (map↔timeline sync both ways,
keyboard, honeypot invisible, no console errors), full screenshot tour
at 1440/390 eyeballed.

Doc findings already made (Next 16 bundled docs, so no re-reading needed):
`redirect()` from `next/navigation` throws, don't wrap in try;
`headers()` in next.config with `source: "/:path*"`; sitemap/robots/
opengraph-image are `app/`-root file conventions; static OG image =
`app/opengraph-image.jpg` + `opengraph-image.alt.txt`; `metadataBase`
required for absolute OG URLs. New this session: the repo's eslint
(react-hooks/purity) rejects `useRef(Date.now())` in render — seed
refs like that inside `useEffect` (see Subscribe.tsx).

## Actions log

- 2026-07-08 (session 1, part 1): Full codebase analysis; this file
  created. Direction set: finish > flourish.
- 2026-07-08 (session 1, part 2): Plan approved in-session. Implemented
  config link fixes + new content fields + redirect pages; verified lint
  and production build pass. User moving to VS Code — wrote
  `NEXT_STEPS_PROMPT.md` with the remaining specced tasks. Nothing
  committed to git yet: current diff = content.ts, about/schedule pages,
  HANDOFF.md, NEXT_STEPS_PROMPT.md.
- 2026-07-08 (session 2, VS Code): Implemented the entire remaining
  pass — security headers, awareness layer (metadata/OG image/sitemap/
  robots/JSON-LD/newsletter OG), subscribe hardening (honeypot +
  time-trap + same-origin), content touches (Now line, LatestResult,
  VenueMap with timeline sync, Footer link fix), housekeeping (README,
  asset cleanup). One in-browser fix after screenshot review: VenueMap
  labels near the right edge flip to the dot's left (Bodrum clipped on
  mobile). Full verification green (see plan status above). Left
  uncommitted for the user's review; MailerLite double opt-in still to
  be enabled in the dashboard by the user.
- 2026-07-21 (session 4, housekeeping only — no feature work): Deleted
  `NEXT_STEPS_PROMPT.md` (self-marked historical, and stale twice over
  since it described VenueMap/LatestResult which session 3 deleted).
  Deduped `.gitignore` (`.vercel`/`.env*` were listed twice) and added
  `.claude/` (untracked local tool config was never ignored). Normalized
  CRLF→LF in `data/funding.json`, `data/sponsors/rank-{2,3}.json`,
  `styles/tokens.css` — these showed as permanently "modified" in `git
  status` with no real content change; confirmed byte-for-byte identical
  content before/after via JSON parse + diff. Left uncommitted, same as
  prior sessions. Did NOT touch: the 23 unreferenced raw photos in
  `public/images/` (content decision, not mine to make — see critique
  delivered in chat), `CONTENT_GUIDE.md` (exists, just wasn't checked
  this session), the stray localhost:3113 dev server (can't see the
  user's actual machine from here — user must kill it themselves).
