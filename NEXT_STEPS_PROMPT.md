# Paste-able implementation prompt (carlos-site, pre-merge pass on `redesign/structure-v2`)

Copy everything below the line into your VS Code assistant. Delete this file
once the work is merged to `main`.

---

Work in this repo (Next.js 16.2.10, App Router, Tailwind v4, TypeScript),
branch `redesign/structure-v2`. **Before writing any Next-specific code, read
the matching guide in `node_modules/next/dist/docs/` — this Next version
differs from your training data.** Read `HANDOFF.md` for full context first.

This is the last content/UX pass before merging `redesign/structure-v2` into
`main`. Nothing here is a "flourish" — no new GSAP timelines, no new pinned
sections, no page transitions, no motion beyond a simple open/close on the
one dialog described below. `config/content.ts` stays the single source of
truth for all visitor-facing copy; every new field needs a comment a
non-technical editor (Carlos) can understand, and `CONTENT_GUIDE.md` must be
updated for anything new he'd plausibly want to change himself.

Housekeeping note: a separate cleanup pass already ran this session
(deleted the previous version of this file, deduped `.gitignore`, ignored
`.claude/`, normalized line endings on 4 files). Those changes are
uncommitted on this branch — commit them together with this work, or
separately first; your call.

## Task 1 — Bring back the "Follow along" newsletter section on the homepage

Session 3 deleted the newsletter teaser section entirely and left only a
one-line "Read past updates →" link inside Subscribe. The user wants a real
section back on `main` — the archive page at `/newsletter` and the
`newsletter` export in `config/content.ts` (eyebrow "Follow along", title
"The journey, post by post.", intro, allPostsLabel) already exist and are
unused; build the section around them rather than duplicating copy.

- New server component, e.g. `components/NewsletterTeaser.tsx`. Pull posts
  via `getAllPosts()` from `lib/newsletter.ts`, filter to `!post.draft`, take
  the latest 2–3, render as small cards (title, `displayDate`, excerpt,
  cover image if set) linking to `/newsletter/[slug]`. Eyebrow/title/intro
  from the `newsletter` config; `allPostsLabel` as an "All posts →" link to
  `/newsletter`.
- **All 4 existing posts currently have `draft: true`** (see
  `content/newsletter/*.mdx` frontmatter). If the filtered list is empty,
  render nothing — same graceful-degradation pattern already used elsewhere
  in this codebase (`VenueMap` returned null with no coords, sitemap skips
  drafts). Don't show draft posts to visitors.
- Mount in `app/page.tsx` between `<Budget />` and `<Subscribe />` — matches
  where the old teaser sat before Subscribe in the pre-session-3 order.
- Don't touch `nav.links` — "Newsletter" already points to `/newsletter`
  (the full archive), which is a different page from this homepage preview.
  No conflict, no change needed there.
- Keep it short. The old one was deleted for being "too long, nothing
  sparks attention" — a handful of compact cards, not a wall of text.

## Task 2 — Turn Subscribe into one big red button + popup form

The "Follow the campaign" section (`components/Subscribe.tsx`) keeps its
headline/body copy exactly as-is — only the always-visible inline
field+button changes. Replace it with a single large, high-contrast red
button as the section's dominant visual element (think: the whole point is
that button — big, chunky, impossible to miss, not a standard 13px-padding
CTA). Clicking it opens a small dialog containing the actual email form.

- Use the native `<dialog>` element (`showModal()` / `close()`) — it gives
  you a focus trap, ESC-to-close, and backdrop click-to-close for free, no
  new dependency. This site has zero third-party UI libraries; don't add
  one for this.
- Move the existing form (email input, honeypot `company` field, submit
  button, status/success/error states) into the dialog, unchanged in logic.
- **Do not move `mountedAt.current ??= Date.now()` into the dialog-open
  handler.** It must keep firing on Subscribe's mount (page load), because
  the bot check measures time-since-page-load, not time-since-dialog-open —
  moving it would make the timing signal meaningless (a bot could open and
  fill the dialog instantly and still look human).
- Keep the "Read past updates →" archive link outside the dialog, visible
  under the big button on the section itself — it's navigation, not part of
  the email flow.
- New config field for the big button's label, e.g. `subscribe.ctaLabel`
  (something like "Subscribe" or "Join the crew" — your call); keep
  `subscribe.button`/`buttonBusy` for the submit button inside the dialog.
- Reduced motion: dialog open/close can use the `<dialog>` element's default
  behavior (or a simple opacity fade) — nothing that needs a
  `prefers-reduced-motion` branch given how minimal this is, but double check
  it doesn't fight the existing reduced-motion patterns elsewhere.

## Task 3 — Replace the race animation with a video, archive the code

`components/RaceScroll.tsx` (the scroll-scrubbed race animation) is good
work but not quite right yet. Don't delete it outright — archive it so it
can be finished later, and swap in a YouTube video for now.

- Create `docs/archive/race-scroll.md`. Paste the **full current source** of
  `components/RaceScroll.tsx` into a code block, plus a short note: what
  config (`race.steps` in `config/content.ts`) drove it, why it was pulled
  (video placeholder while the animation gets finished), and the date.
- Delete `components/RaceScroll.tsx` from the active tree (it lives on in
  the archive doc) and remove its import/mount from `app/page.tsx`.
- Replace the `race` export in `config/content.ts` with a leaner shape —
  drop `RaceStep`/`steps` (that was the animation storyboard, not needed for
  a video), keep `eyebrow`/`title` (the copy still works: "One race, start
  to finish" / "What a race looks like."), add `videoUrl` and a short
  `caption`.
- New component, e.g. `components/RaceVideo.tsx`, mounted in the same slot
  in `app/page.tsx` (between Subscribe and Backers). Responsive 16:9
  `youtube-nocookie.com/embed/...` iframe (privacy-enhanced embed domain,
  `loading="lazy"`, a real `title` attribute for accessibility, standard
  `allow`/`allowFullScreen` attributes), eyebrow/title above it, caption
  below.
- **Video URL — picked by web search, not yet watched end-to-end, swap
  freely if it doesn't fit the tone once you see it on the page:**
  - Primary: `https://www.youtube.com/watch?v=rwNQ0mbh3qM` ("Quick Guide to
    Olympic Sailing") → embed as
    `https://www.youtube-nocookie.com/embed/rwNQ0mbh3qM`
  - Backup: `https://www.youtube.com/watch?v=IRC6qPMj_XA` ("Olympic sailing:
    a full-body sport of reading the wind") → embed as
    `https://www.youtube-nocookie.com/embed/IRC6qPMj_XA`
  - Either way it's one config field (`race.videoUrl`) — make swapping it
    later trivial, and say so in `CONTENT_GUIDE.md`.

## Task 4 — Remove the hero buttons

Scrolling isn't reading as intuitive with two competing CTAs sitting right
under the name. Remove both buttons from the hero (`components/Hero.tsx`,
the `<Magnetic><Link>` pair for `hero.primaryCta` / `hero.secondaryCta`,
lines ~139–159) — the whole `data-hero-fade` wrapper div around them goes
too. This is one of several `data-hero-fade` elements the entrance timeline
staggers through; removing one doesn't break the stagger, it just animates
however many are left.

- Remove `primaryCta`/`secondaryCta` from the `HeroContent` interface and
  the `hero` export in `config/content.ts` too — don't leave dead config
  fields behind for Carlos to wonder about (that's exactly the kind of
  clutter the last housekeeping pass was cleaning up).
- Check nothing else imports `hero.primaryCta`/`hero.secondaryCta` before
  deleting (grep first).
- Leave the "Scroll" cue at the bottom of the hero as-is — that's the
  intended affordance now that the buttons are gone.

## Task 5 — Editability pass (do this last, after 1–4)

Carlos edits this site himself via `config/content.ts` on GitHub, per
`CONTENT_GUIDE.md`. After the above changes:

- Re-read `config/content.ts` top to bottom. Every new field (newsletter
  teaser, `subscribe.ctaLabel`, `race.videoUrl`/`caption`) needs the same
  comment style as the rest of the file.
- Update `CONTENT_GUIDE.md` with short sections for: changing/adding
  newsletter posts (already documented? check), swapping the race video
  link, editing the subscribe button label.
- Confirm no orphaned exports/interfaces remain (`RaceStep`, old
  `primaryCta`/`secondaryCta` types) — dead types in a file meant to be
  readable by a non-engineer are worse than dead code anywhere else in the
  repo.

## Verification (all must pass)

1. `npm run lint` && `npm run build`.
2. `npm run dev`: newsletter teaser renders nothing while posts stay draft
   (flip one post's `draft: false` temporarily to confirm cards render, then
   revert); hero shows no buttons under the name; Subscribe shows one big
   red button, opens a dialog on click, ESC and backdrop-click both close
   it, tab focus stays trapped inside while open; race section shows the
   video, plays inline, no console errors.
3. POST `/api/subscribe` still passes all existing checks (honeypot,
   time-trap, same-origin, rate limit) — the dialog move must not change
   any request-side behavior.
4. `node scripts/screenshot-tour.mjs` — eyeball every section, especially
   the new dialog open state and the video section at both breakpoints.
5. Update `HANDOFF.md`'s actions log when done, same convention as every
   prior session.
