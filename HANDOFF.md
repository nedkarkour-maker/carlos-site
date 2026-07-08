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

## Plan status (approved plan: finish-and-harden pass)

Full task list + specs: **`NEXT_STEPS_PROMPT.md`** (paste-able prompt the
user will run in VS Code). Approved plan file also at
`~/.claude/plans/linked-hatching-scott.md`.

DONE (lint + build verified green at this state):
- `config/content.ts`: real links, mailto deck fallback, `site.url`,
  `site.now`, `latestResult` content block, `stops[].coords` for the
  future venue map, footer Contact mailto.
- `app/about/page.tsx`, `app/schedule/page.tsx`: blank placeholders →
  `redirect("/#about")` / `redirect("/#schedule")`.

REMAINING (specced in NEXT_STEPS_PROMPT.md):
1. Security headers in `next.config.ts` (CSP + friends; dev needs
   'unsafe-eval'/ws: or HMR breaks).
2. Awareness layer: layout metadata + `app/opengraph-image.jpg` (sharp
   crop of hero-viana, 1200×630) + alt.txt, `app/sitemap.ts`,
   `app/robots.ts`, JSON-LD Person on homepage, OG on newsletter posts.
3. Subscribe hardening: honeypot `company` field + `elapsedMs` time-trap
   (silent drops), Sec-Fetch-Site/Origin check; enable double opt-in in
   MailerLite dashboard (manual step, not code).
4. Content touches: Now line in hero telemetry, `LatestResult` strip
   (teal-950 band between Hero and Statement), `VenueMap` synced with
   Schedule via lifted React state (NOT inside the pinned section),
   Footer renders non-`/` hrefs as plain `<a>`.
5. Housekeeping: real README, delete unused default svgs + duplicate
   photos (grep first; Vercel is case-sensitive), keep [DRAFT] copy.

Doc findings already made (Next 16 bundled docs, so no re-reading needed):
`redirect()` from `next/navigation` throws, don't wrap in try;
`headers()` in next.config with `source: "/:path*"`; sitemap/robots/
opengraph-image are `app/`-root file conventions; static OG image =
`app/opengraph-image.jpg` + `opengraph-image.alt.txt`; `metadataBase`
required for absolute OG URLs.

## Actions log

- 2026-07-08 (session 1, part 1): Full codebase analysis; this file
  created. Direction set: finish > flourish.
- 2026-07-08 (session 1, part 2): Plan approved in-session. Implemented
  config link fixes + new content fields + redirect pages; verified lint
  and production build pass. User moving to VS Code — wrote
  `NEXT_STEPS_PROMPT.md` with the remaining specced tasks. Nothing
  committed to git yet: current diff = content.ts, about/schedule pages,
  HANDOFF.md, NEXT_STEPS_PROMPT.md.
