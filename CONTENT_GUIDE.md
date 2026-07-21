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

Find `stops` under `schedule`. Each event is one block. To add one, copy a
whole block (from `{` to `},`) and edit it:

```ts
{
  when: "MAR 2027",
  title: "ILCA 7 Worlds",
  where: "Cascais, Portugal",
  major: true,        // bigger dot on the timeline (optional)
  tag: "Key event",   // red badge (optional — delete the line to remove)
},
```

## Change the budget

Find `budget` under `help`:

```ts
amount: "≈ €22,000",
breakdown: [
  { label: "Coaching & camps", share: "35%" },
  ...
]
```

Edit the amount, or any label/percentage. Bars resize automatically.
(Keep the percentages adding up to 100 so it reads honestly.)

## Change the photo strip

Find `photoStrip` in `config/content.ts`. Each photo is one block:

```ts
{
  src: "/images/clean/fleet-upwind.jpg",
  alt: "Carlos leading a packed ILCA fleet upwind",  // for screen readers
  focus: "75% 60%",                                  // optional crop point
},
```

Six photos keep the grid balanced; swap, add or remove freely.

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
