# Carlos Charabati sailing campaign site

A Next.js 16 App Router site presenting Carlos’s Olympic sailing campaign, season, newsletter, and support options.

## Before editing

- This is Next.js 16.3.0 with breaking changes. Read the relevant installed guide in `node_modules/next/dist/docs/` before writing code and heed deprecations.
- `AGENTS.md` is the single canonical project-instructions file.

## Project map

- `app/` — routes, root layout/styles, newsletter pages, and the MailerLite subscribe API.
- `components/` — homepage sections and shared UI.
- `config/content.ts` — centralized site and homepage copy plus all homepage photo references.
- `content/newsletter/*.mdx` — newsletter titles, excerpts, cover references, and article copy.
- `lib/newsletter.ts` — reads and parses newsletter MDX.
- `public/images/` — site photos; `public/images/sponsors/` — sponsor logos.
- `styles/tokens.css` — color and layout tokens; `app/globals.css` — Tailwind theme mapping and global CSS.
- Root config: `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, and `eslint.config.mjs`.

## Content and photos

- Hero: `hero` and `site` in `config/content.ts`; rendered by `components/Hero.tsx`.
- About: `about` in `config/content.ts`; rendered by `components/About.tsx`.
- Schedule + numbers: `schedule` and `numbers` in `config/content.ts`; rendered by `components/Schedule.tsx` and `components/Numbers.tsx`.
- Newsletter section/subscription copy: `newsletter` and `subscribe` in `config/content.ts`; posts in `content/newsletter/*.mdx`.
- How you can help: `help` in `config/content.ts`; rendered by `components/HowYouCanHelp.tsx`.
- Add photos to `public/images/`, then reference them as `/images/<filename>` in `config/content.ts` or newsletter MDX frontmatter.

## Product rules

- Section order: Hero → About → Schedule + numbers → Newsletter → How you can help.
- Palette: deep teal and off-white; red is the only accent.
- Render all numbers in the mono typeface.
- Do not clone jamesjuhasz.com.

## Maintenance model

- Schedule and season numbers come from a Google Sheet. This integration is not implemented yet; both are currently hardcoded in `config/content.ts`.
- Newsletter signup uses MailerLite via `app/api/subscribe/route.ts`.
- Photos are maintained in `public/images/`.

## Pinned dependencies

`lenis` is pinned to an exact version in `package.json` — no caret. Do not
loosen it. (package.json is strict JSON and cannot carry comments, which is
why this note lives here.)

The donation popup's scrolling depends on Lenis behaviour that is not part of
any documented contract: Lenis consumes wheel events site-wide, and the popup
stays scrollable only because it opts out via `data-lenis-prevent`, which
Lenis matches against the event's `composedPath()` — the only reason it is
seen at all, since the dialog lives inside a shadow root. See the comment at
that attribute in `components/DonateCard.tsx`.

If Lenis stops honouring it, wheeling over the open popup silently scrolls the
page behind it instead, the form's later steps become unreachable, and nobody
can complete a donation. It fails silently — no error, nothing in the build.

So when upgrading Lenis, re-test the popup by hand before merging: open the
donation card, and on a short window (~700px tall) scroll through the
name/address step and the payment step, at desktop width and at 390px. The
dialog must scroll and the page behind it must not move.

## Collaboration

Carlos edits copy and photos on his own branch. Coordinate before touching shared files.
