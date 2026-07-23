# FINAL PRE-PUBLISH PROMPT — carlos-site (branch `redesign/structure-v2` → merge to `main`)

Paste everything below the line into Claude Code. Goal: one focused pass to a
**publishable** site tonight, then merge `redesign/structure-v2` into `main`.
Carlos is editing final wording in `config/content.ts` in parallel — see the
"Coordination" note before you start. Delete this file once merged.

---

You are working in this repo: Next.js 16.2.10 (App Router), React 19, Tailwind
v4, TypeScript, GSAP + Lenis. **Before writing any Next-specific code, read the
matching guide in `node_modules/next/dist/docs/` — this Next version differs
from your training data.** Read `HANDOFF.md` first for full context and the
house rules (all visitor copy lives in `config/content.ts`; graceful
degradation everywhere; everything must be secure).

This is the final content/UX/reorder pass before merging to `main`. Keep the
existing visual language and motion — **no new GSAP timelines, no new pinned
sections, no WebGL, no page transitions.** The only new interactivity is a
single email dialog (task 10) reused in two places, and a language toggle.

## Coordination (read before touching `config/content.ts`)
Carlos is hand-editing English wording in `config/content.ts` at the same time.
**You own the *structure* of that file (new fields, the per-locale shape in the
Global section); do not rewrite the *values* of existing copy strings — leave
his English text as you find it.** Where a task needs new copy, add the field
with a short placeholder and a `// TODO copy` comment rather than inventing
final wording. If you must restructure the whole file for i18n, do that step
**last** (see Global/French) so it doesn't collide with his edits.

## Target section order (top → bottom of `app/page.tsx`)
1. Hero
2. Statement (one sentence)
3. About ("This is my project")
4. Numbers
5. **Notable Results** (NEW — replaces PhotoStrip)
6. Schedule ("The season ahead" / calendar)
7. How You Can Help ("Three ways to be part of it")
8. Budget (rebuilt from the attached card)
9. **Newsletter teaser** ("Follow along" — NEW section)
10. Subscribe ("Join / Follow the campaign" — big-button + dialog)
11. Race video ("What a race looks like")
12. Backers (sponsor pyramid)
13. Footer (social icons)

Keep the existing `<WaveDivider>` rhythm between light/dark sections; adjust
which dividers sit where so the light/dark alternation still reads cleanly
after the reorder.

---

## 5. Notable Results (NEW — replaces the PhotoStrip section)
Replace `components/PhotoStrip.tsx` with `components/NotableResults.tsx`. A
small section title **"Notable results"** (mono eyebrow, matching the other
section eyebrows), then **three** photo cards in a row (2 cols mobile, 3 cols
desktop — reuse PhotoStrip's grid + `next/image` `object-cover` pattern). Under
each photo, a caption: bold result line + event line.

- Data-driven from a new `notableResults` array in `config/content.ts`, each
  entry `{ image: ImageRef, result: string, event: string }`, commented for a
  non-technical editor. Pre-fill with the three Carlos gave (confirm/adjust
  photos against what he attaches or picks from `public/images/`):
  - `result: "Gold"`, `event: "2024 ILCA 4 Youth Worlds"`
  - `result: "6th"`, `event: "2023 Worlds"`  *(TODO: confirm exact event name)*
  - `result: "7th"`, `event: "2025 Men's Worlds, Kiel"`
- **Carlos will attach the three result photos in this session.** If a photo
  isn't provided, fall back to an existing `public/images/clean/*` file and
  leave a `// TODO photo` comment — never ship a broken image.
- Order left→right chronologically (2023, 2024, 2025) unless he says otherwise.
- Delete `PhotoStrip.tsx`, remove its import/mount, and remove the now-unused
  `photoStrip` export from `config/content.ts` (grep first).

## 6. Schedule / calendar — make it a fully data-driven, easily-extendable list
Keep the existing Schedule component's look, but move its data onto the same
kind of easy-to-update system the newsletter uses (a simple data source Carlos
can append to without touching component code), and expand what it shows.

- Source the stops from a dedicated data file (e.g. `data/schedule.json` — an
  array of `{ when, title, where, kind, major?, tag? }`), OR keep them in
  `config/content.ts` under `schedule.stops` **if** you make adding a new entry
  a pure copy-paste of one object with a clear comment. Pick whichever is
  genuinely simpler for a non-coder; document it in `CONTENT_GUIDE.md`.
- Add a `kind` field distinguishing event types so they can be styled as
  distinct "widgets": `"event"`, `"training"`, `"olympics"`. Give each a small
  visual differentiator (e.g. a mono tag/pill or dot colour) — reuse the
  existing `tag` pill styling, don't invent a new design language.
- Populate with: the real 2026 events already in config, **plus training
  blocks** (kind `training`), **plus two horizon milestones**: `LA 2028`
  (kind `olympics`, major) and `Los Angeles 2032`→ actually **Brisbane 2032**
  *(TODO: confirm — 2032 Summer Games are in Brisbane, not LA; use the correct
  host)*, both as forward-looking anchor stops at the end of the timeline.
- Leave any real dates Carlos hasn't given as `[DRAFT]` placeholders with a
  comment — do not invent specific dates.

## 7. "Follow the journey" card button → opens the email dialog directly
In `components/HowYouCanHelp.tsx`, card 01 ("Follow & share") CTA currently
links to `#subscribe`. Change it so it **opens the email dialog from task 10
directly** (same popup that collects the email), instead of scrolling to the
section. This means the dialog from task 10 must be an extractable, reusable
trigger — build it that way (see task 10) and wire this card's button to it.

## 8. Budget — rebuild to match the attached card (donut chart, CAD, no bars)
**Reference: the budget card screenshot/PDF ("Untitled design - Card")
attached in this session.** Rebuild the Budget section to match it. Replace the
two animated bar components (`components/motion/BudgetBars.tsx` and
`components/motion/FundingBar.tsx`) — **remove the horizontal percentage
scroll-bars entirely** — with a **donut/pie chart** in the style shown
(a "James's model" ring chart). Keep the overall page design/spacing.

Exact content to encode (all in `config/content.ts` under a rebuilt `budget`
shape + `data/funding.json` for the live number; **currency is now CAD, not
EUR**):

- Headline: **"Most Olympic campaigns don't make it. The ones that do, do it
  on the back of supporters."**
- Body: **"A full year of campaigning costs $55,000 CAD. National funding
  covers part — donations and sponsorship close the gap. Recurring
  monthly support is the most useful as it allows me to plan out my entire
  season."**
  - ⚠️ **NUMBER CHECK:** total is **$55,000 CAD** (Carlos's confirmed figure;
    it supersedes the "$67,000" printed on the attached card). The four
    **percentages stay as shown**; the pillar CAD amounts below were rescaled
    to sum to $55k. The card's **"$39,000 gap"** figure was tied to the old
    $67k total — **it no longer holds and must be recomputed** once Carlos
    confirms how much national funding covers. Until then, treat every "gap"
    figure (body, the `~$39,000` stat column) as **TODO — do not invent one**;
    either leave it out or mark it clearly.
- Three stat columns: `[TODO gap] / Annual supporter gap` · `4 pillars /
  Coaching · regattas · travel · equipment` · `LA 2028 / Olympic Games target`.
  (The gap amount is TODO per the NUMBER CHECK above — leave a placeholder,
  don't reuse the stale $39,000.)
- Donut chart card titled **"WHERE YOUR SUPPORT GOES"**, four segments with
  legend (percent + approx CAD + sub-label), driven by a `breakdown` array so
  it's editable:
  - Coaching + boat — **35%** — ~$19,250 — "Coach fees, charter & freight"
  - Regattas + housing — **35%** — ~$19,250 — "Entry fees, accommodation"
  - Travel — **16%** — ~$8,800 — "Flights, transport to venues"
  - Equipment + other — **14%** — ~$7,700 — "Sails, gear, admin"
  - (Percentages unchanged from the card; amounts rescaled to the $55k total —
    they sum to $55,000.)
- Footer line under the chart: **"$55k CAD/yr — see the full breakdown"** (the
  "see the full breakdown" can be a `#` / TODO link for now).
- Build the donut as **inline SVG** (no chart library — this repo has none and
  isn't adding one). Segment colours: the greyscale ramp in the screenshot, or
  tie to the existing token palette — your call, but match the calm, monochrome
  feel of the card. Reduced-motion: render the ring statically (a gentle
  one-time draw-in on scroll is fine, consistent with existing components).
- `data/funding.json`: set `"currency": "CAD"`, `"goal": 55000` (or the gap
  once confirmed — decide based on what the chart/copy needs; document which
  number it drives), keep `raised` editable per `data/README.md`.

## 9. Newsletter teaser (NEW section — "Follow along")
Session 3 deleted the teaser; bring a real one back. New server component
`components/NewsletterTeaser.tsx`, mounted between Budget and Subscribe.

- Pull posts via `getAllPosts()` (`lib/newsletter.ts`), filter to `!draft`,
  take the latest **3–4**, render as compact cards: cover image (if set),
  title, `displayDate`, short excerpt → link to `/newsletter/[slug]`.
- Eyebrow/title/intro from the existing unused `newsletter` config export;
  "All posts →" link to `/newsletter`.
- **All 4 posts are currently `draft: true`.** If the filtered list is empty,
  render nothing (graceful). ⚠️ For the section to appear on the published
  site, at least one post must be flipped to `draft: false` — flag this to
  Carlos; do not un-draft posts yourself without his say.

## 10. Subscribe ("Join the campaign") — big button + reusable email dialog
Fable's work on this section's copy/direction is strong — **keep the headline,
body, and overall treatment; this section is considered good.** The only change
is the interaction: the always-visible inline field becomes one **big, bold red
button** as the section's focal point; clicking it opens a small **dialog**
containing the actual email form.

- Use the native `<dialog>` element (`showModal()`/`close()`) for a free focus
  trap, ESC-to-close, and backdrop click-to-close — no new dependency.
- **Extract the dialog into a reusable component** (e.g.
  `components/SubscribeDialog.tsx`) exposing a way to open it from elsewhere,
  because task 7's "Follow the journey" card must open the *same* dialog.
  Simplest robust approach: a small client context/provider or a shared
  imperative open function — keep it minimal and secure.
- Move the existing form logic verbatim into the dialog: email input, hidden
  honeypot `company` field, submit button, and the loading/success/error
  states. **Do not change any request-side behaviour** — the `/api/subscribe`
  honeypot, time-trap, same-origin, and rate-limit checks all stay exactly as
  they are.
- **Keep `mountedAt.current ??= Date.now()` firing on the section's mount
  (page load), NOT on dialog-open** — the bot time-trap measures
  time-since-page-load; moving it would break the signal.
- Keep the "Read past updates →" archive link visible on the section, outside
  the dialog.
- New config field for the big button label (e.g. `subscribe.ctaLabel`); keep
  `subscribe.button`/`buttonBusy` for the in-dialog submit.

## 11. "What a race looks like" — video, archive the animation
`components/RaceScroll.tsx` is good but not finished — archive it, don't lose it.
- Create `docs/archive/race-scroll.md`: paste the full current `RaceScroll.tsx`
  source, note the `race.steps` config that drove it and the date, and why it
  was pulled (video placeholder while the animation is finished later).
- Delete `RaceScroll.tsx` from the active tree; remove its import/mount.
- Rework the `race` export in `config/content.ts`: drop `RaceStep`/`steps`,
  keep `eyebrow`/`title`, add `videoUrl` + a short `caption`.
- New `components/RaceVideo.tsx` in the same slot (between Subscribe and
  Backers): responsive 16:9 privacy-embed iframe
  (`youtube-nocookie.com/embed/...`, `loading="lazy"`, real `title`,
  `allowFullScreen`), eyebrow/title above, caption below.
  - Video URL (picked by web search, **not watched end-to-end — swap if it
    doesn't fit once you see it on the page**):
    primary `https://www.youtube-nocookie.com/embed/rwNQ0mbh3qM`
    ("Quick Guide to Olympic Sailing"); backup embed id `IRC6qPMj_XA`.
  - One config field (`race.videoUrl`) so swapping later is trivial — note it
    in `CONTENT_GUIDE.md`.
- **CSP note:** the iframe needs `frame-src https://www.youtube-nocookie.com`
  (and the embed may need `child-src`) added to the CSP in `next.config.ts`.
  Add **only** what the YouTube privacy embed requires; do not loosen anything
  else. Verify the video actually loads with the CSP in place.

## 12. Sponsors — pyramid from the attached screenshot
**Reference: the sponsor-pyramid screenshot Carlos attaches in this session.**
The pyramid system already exists (`components/Backers.tsx` +
`data/sponsors/rank-1.json`…`rank-4.json`, `rank-1` = widest top row). Match the
attached layout by editing the rank JSON files — no component rewrite unless the
structure genuinely differs.

- Read the sponsor names from the screenshot and place each in the correct rank
  to reproduce the pyramid shown.
- For each sponsor **missing a logo file**: search the open web for the
  official logo, download a clean version into `public/images/sponsors/`
  (transparent PNG/SVG preferred), and point its `logo` field at it.
  ⚠️ Web-sourced logos vary in quality and licensing — treat these as
  **draft/placeholder** assets; leave a `// TODO: replace with official asset`
  note in the README so Carlos can swap in authorized files. Do not fabricate a
  logo if none is found — fall back to the existing text-wordmark behaviour
  (empty `logo`).
- Keep the "Maybe you?" tip card.

## 13. Footer — social icons (mail, Instagram, LinkedIn, Facebook)
In `components/Footer.tsx`, replace the text arrow-links under the brand
("→ Send an email to Carlos", "→ Instagram", "→ LinkedIn") with **icon
buttons**: Mail, Instagram, LinkedIn, **and a new Facebook** icon.
- Use inline SVG icons (no icon-library dependency — or if one is already in
  `node_modules`, confirm before using). Each icon needs an accessible label
  (`aria-label`), min 44×44px hit target, and visible focus state.
- The **Mail** icon must keep the existing `EmailLink` behaviour — assemble the
  `mailto:` in JS on click so the address never ships in the HTML (scraper
  protection). Do not regress this.
- Instagram → `site.instagramUrl`, LinkedIn → `site.linkedinUrl`, Facebook →
  new `site.facebookUrl`. Set it in config:
  `facebookUrl: "https://www.facebook.com/profile.php?id=100092780283734"`.
  Still guard the icon to **render only when `facebookUrl` is non-empty**
  (graceful, and future-proof if it's ever cleared).
- External links: `target="_blank" rel="noopener noreferrer"`.

---

## GLOBAL A — Language toggle (FR / EN), scaffold now, French copy later
Build the bilingual **structure and toggle now; ship English tonight with
French as clearly-marked TODO** (full translation is a separate follow-up).
- Add an **EN / FR toggle top-right** (in the Navbar). Persist choice
  (e.g. cookie or `localStorage`) and default to EN.
- Restructure copy so every string has an `en` and `fr` slot. Because all copy
  already lives in `config/content.ts`, the cleanest path is a per-locale
  content object (or Next App-Router i18n with `[locale]` segment routing —
  read `node_modules/next/dist/docs/` for the current pattern before choosing).
  **Fill `en` from the existing strings; set `fr` to the English value with a
  `// TODO fr` marker** so the site is fully functional in both toggle states
  and French can be filled in later with zero code changes.
- **Do this restructure LAST**, after tasks 5–13, to minimise collision with
  Carlos's parallel English edits. Commit his final English first if possible.
- Newsletter MDX posts: leave English-only for now; the toggle can fall back to
  English content for `/newsletter` with a TODO — do not machine-translate
  posts.
- Document the FR/EN editing workflow in `CONTENT_GUIDE.md`.

## GLOBAL B — Olympic-rings motif under the countdown
Add a small graphic **under the "T–NNN" number + label inside the countdown
circle** (`components/Countdown.tsx`), centered below the label.
- ⚠️ **LEGAL — do NOT use the actual Olympic five-rings mark.** The Olympic
  rings are a strictly protected IOC trademark; using them on a
  fundraising/sponsorship site is a real legal risk for Carlos. **Default to a
  safe stand-in**: an "LA28" wordmark, or five plain neutral (single-colour,
  non-interlocking or clearly stylised) circles that evoke without copying the
  protected mark, or the existing red accent motif. Keep it subtle and small so
  it doesn't crowd the number. Flag this choice to Carlos and let him decide if
  he has IOC authorization.
- Must not break the countdown's SVG geometry, the count-up animation, or the
  reduced-motion path.

---

## Editability & housekeeping (ongoing, verify at the end)
- Every new `config/content.ts` field gets a plain-language comment a
  non-coder can follow. No orphaned exports/interfaces left behind
  (`photoStrip`, `RaceStep`, old EUR budget shape, removed hero CTAs — grep and
  remove).
- Remove the hero CTA buttons: in `components/Hero.tsx` delete the
  `<Magnetic><Link>` pair (primary/secondary CTA) and their wrapper; remove
  `primaryCta`/`secondaryCta` from `HeroContent` + the `hero` export (grep for
  other uses first). Keep the "Scroll" cue.
- Update `CONTENT_GUIDE.md` for: notable results, schedule/calendar entries,
  budget numbers + breakdown, race video swap, subscribe button label, FR/EN
  workflow, Facebook URL.
- Update `HANDOFF.md`'s actions log when done.

## Verification (all must pass before you call it done)
1. `npm run lint` && `npm run build` — both green.
2. `npm run dev`, walk the page at 1440 and 390:
   - Section order matches the target list; light/dark rhythm reads cleanly.
   - Hero has no CTA buttons; Scroll cue present.
   - Notable Results: 3 photos + captions, no broken images.
   - Schedule shows events + trainings + 2028/2032 with distinct kinds;
     adding a new entry is a documented one-object edit.
   - Budget: donut chart matches the card, CAD amounts, no percentage bars.
   - Newsletter teaser renders nothing while all posts are draft; flip one to
     `draft:false` to confirm cards render, then revert.
   - Subscribe: one big red button opens the dialog; ESC + backdrop close it;
     focus trapped while open; the "Follow the journey" help-card button opens
     the **same** dialog.
   - Race video plays inline with the CSP in place; no console CSP violations.
   - Footer: mail/IG/LinkedIn/Facebook icons, keyboard-focusable, mail address
     absent from served HTML; Facebook icon hidden while URL empty.
   - EN/FR toggle flips every string's locale; FR shows English-value TODOs,
     nothing crashes or renders blank.
   - Countdown shows the rings-motif stand-in; count-up + reduced-motion intact.
3. `POST /api/subscribe`: honeypot / `elapsedMs:100` → `{ok:true}` with no
   MailerLite call; cross-site → 403; 6th hit in 10 min → 429. Unchanged.
4. Response headers on `/` still include the full security header set; CSP now
   also allows the YouTube privacy-embed frame and nothing more.
5. `node scripts/screenshot-tour.mjs` — eyeball every section, especially the
   new dialog open-state, donut chart, notable results, and video, at both
   widths.

## Merge
Once the above is green and Carlos has confirmed the site looks right, this
branch is ready to merge into `main`. Don't merge without his explicit go —
confirm the production domain points where he expects first.
