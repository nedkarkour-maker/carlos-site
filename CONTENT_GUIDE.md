# How to update your site (no coding needed)

Almost everything you'd ever want to change lives in **one file**:

> **`config/content.ts`**

Open it on GitHub (tap the pencil ✏️ to edit), change the text between the
quotes, and commit. Vercel rebuilds and publishes the site automatically
about a minute after you save. That's the whole workflow:

1. Edit the file on GitHub → **Commit changes**.
2. Wait ~1–2 minutes.
3. Refresh your site.

Rules of thumb:
- Only change text **between the quotes** `"like this"`.
- Don't delete commas, braces `{ }`, or brackets `[ ]`.
- If the site fails to build, Vercel keeps the old version live — nothing
  breaks publicly. Undo your last change and commit again.

---

## Change a number (stats section)

Find `numbers` in `config/content.ts`:

```ts
{ value: "4,000", label: "Nautical miles sailed" },
```

Change `"4,000"` to the new figure. The count-up animation adapts by itself.

## Change the countdown date

Find `countdown` under `hero`:

```ts
countdown: { target: "2028-07-14T00:00:00", label: "Days to LA 2028" },
```

The date format is `YYYY-MM-DD`.

## Add or edit a schedule event

Find `stops` under `schedule`. Each stop is one block. To add one, copy a
whole block (from `{` to `},`), paste it where it belongs in the order,
and edit it:

```ts
{
  when: "MAR 2027",
  title: "ILCA 7 Worlds",
  where: "Cascais, Portugal",
  kind: "event",      // "event", "training" or "olympics" — picks the badge
  major: true,        // bigger dot on the timeline (optional)
  tag: "Key event",   // red badge (optional — delete the line to remove)
},
```

`kind` is required: `"event"` for regattas (red dot), `"training"` for
training blocks (teal dot + a neutral "Training" badge), `"olympics"` for
the Games at the end of the timeline.

## Change the budget

Two places, one job each:

- **`data/funding.json`** — the yearly total. `goal: 55000` renders as
  the "$55k CAD/yr" line under the ring chart.
- **`budget` in `config/content.ts`** — everything written out: the
  headline, the three stat columns, and the four `breakdown` slices
  (label, `percent`, `amount`, sub-line). The ring redraws itself from
  the percentages — keep them adding up to 100, and keep the amounts
  consistent with the total.

The "Annual supporter gap" stat is `"TBC"` until the national-funding
figure is confirmed — replace it then. To make "see the full breakdown"
a real link, set `breakdownUrl` to the PDF/page address.

## Change the notable results

Find `notableResults` in `config/content.ts`. Each card is one block:

```ts
{
  image: {
    src: "/images/clean/fleet-upwind.jpg",
    alt: "Carlos leading a packed ILCA fleet upwind",  // for screen readers
    focus: "75% 60%",                                  // optional crop point
  },
  result: "Gold",                    // the bold line under the photo
  event: "2024 ILCA 4 Youth Worlds", // the line under it
},
```

Three cards keep the row balanced. The current photos are stand-ins
(marked `TODO photo`) — swap `src` when the real result photos are in.

## Swap the race video

The "What a race looks like" section plays a YouTube video. To change it,
find `race` in `config/content.ts`:

```ts
videoUrl: "https://www.youtube-nocookie.com/embed/rwNQ0mbh3qM",
videoTitle: "Quick guide to Olympic sailing (video)",
```

Open the YouTube video you want, copy the 11-character code after
`watch?v=` in its address, and paste it after `/embed/` in `videoUrl`
(keep the `youtube-nocookie.com/embed/` part — it's the privacy-friendly
player). Update `videoTitle` to say what the new video is, and `caption`
(the line under the video) if it no longer fits.

## Change the subscribe button

The big red button in the "Follow the campaign" section is `ctaLabel`
under `subscribe`:

```ts
ctaLabel: "Join the crew",
```

Keep it to a word or three — it renders huge. (`button` and `buttonBusy`
are the smaller submit button inside the signup window that opens when
someone clicks it.)

## French version (EN / FR toggle)

The site has an EN / FR switch in the top-right corner. English lives in
`config/content.ts`; French lives in **`config/content.fr.ts`** — same
structure, one file each. Right now every French string is still the
English text, marked `TODO fr`: to translate, open `content.fr.ts` and
change the text between the quotes, section by section. Don't add or
remove fields — the two files must keep the same shape.

If you change a photo, date, link or percentage in `content.ts`, mirror
it in `content.fr.ts` (those aren't translations, they should match).
Newsletter posts are English-only for now and show as-is in both
languages.

## Social links (footer icons)

The footer's icon buttons read from the top of `config/content.ts`:
`instagramUrl`, `linkedinUrl`, `facebookUrl`. Change an address there, or
set it to `""` to hide that icon. The mail icon needs no setup — it uses
`contactEmail` (assembled on click, invisible to email scrapers).

## Add or swap a photo (anywhere)

1. Put the photo file into the **`public/images/`** folder (on GitHub:
   *Add file → Upload files* inside that folder).
2. In `config/content.ts`, set the matching `src` to
   `"/images/your-file-name.jpg"` — the name must match exactly, including
   capital letters.

Two extras worth knowing:

- **`focus`** — when a photo gets cropped to fill the screen, this decides
  which part stays visible. `focus: "50% 30%"` keeps the point slightly
  above center. Nudge the numbers until the subject sits right.
- **`public/images/clean/`** holds copies of the press photos with the
  event sponsor banners cropped off. Prefer these for big displays. If you
  add new press photos with banners, add a line to
  `scripts/crop-banners.mjs` and run `node scripts/crop-banners.mjs`
  (or ask a developer — it's a 2-minute job).

## Sponsors

Sponsor logos live in **`data/sponsors/`** — one file per pyramid row
(`rank-1.json` is the top, widest row; `rank-4.json` the smallest). Add a
sponsor by adding a block to the right file:

```json
{ "name": "New Sponsor", "logo": "/images/sponsors/new-sponsor.png", "url": "https://sponsor.com" }
```

Upload the logo into `public/images/sponsors/` first. The README inside
`data/sponsors/` walks through the details (moving a sponsor between rows,
what happens when a logo is missing, and so on).

## Newsletter posts

Posts are files in **`content/newsletter/`**. To add one, copy an existing
`.mdx` file, rename it (the filename becomes the web address), and edit the
title/date at the top and the text below.

Each post starts with a few lines between `---` marks. The one that
controls visibility is:

```
draft: true
```

While `draft: true`, the post is invisible to visitors everywhere — the
archive, the homepage, search engines. Change it to `draft: false` to
publish. The homepage "Follow along" section shows the newest three
published posts automatically (and hides itself completely while every
post is still a draft — that's why it may not appear yet).

## Background art (optional)

Three decorative backgrounds can be upgraded from the built-in line art to
generated images — see **`IMAGE_PROMPTS.md`** for exact filenames and the
prompts to use. Drop the images into `public/images/generated/` and they
appear automatically.

---

## If something looks wrong

- **Site didn't update?** Check the "Deployments" tab in Vercel — a red ❌
  means a typo in the file (usually a missing quote or comma). Click the
  deployment to see the error, fix the file, commit again.
- **Photo not showing?** The `src` filename probably doesn't match the
  uploaded file exactly (capital letters count!).
