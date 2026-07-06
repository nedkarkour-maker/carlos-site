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

## Change the big photo story (the full-screen scrolling photos)

Find `story` in `config/content.ts`. Each photo is one block:

```ts
{
  src: "/images/ZAG_5526.jpg",
  alt: "Carlos driving through heavy spray",   // for screen readers
  kicker: "02 · Heavy air",                    // small red label
  caption: "When it blows, the race becomes physical.",
},
```

3–5 photos work best. To add one: copy a block, change the four lines.

## Add or swap a photo (anywhere)

1. Put the photo file into the **`public/images/`** folder (on GitHub:
   *Add file → Upload files* inside that folder).
2. In `config/content.ts`, set the matching `src` to
   `"/images/your-file-name.jpg"` — the name must match exactly, including
   capital letters.

## Sponsors

Find `sponsors` under `backers`:

```ts
{ name: "New Sponsor", logo: "/images/sponsors/new-sponsor.png" },
```

Upload the logo into `public/images/sponsors/` first. If you leave out the
`logo:` line, a circle with the sponsor's initials shows instead. The logos
scroll in a slow loop automatically.

## Newsletter posts

Posts are files in **`content/newsletter/`**. To add one, copy an existing
`.mdx` file, rename it (the filename becomes the web address), and edit the
title/date at the top and the text below.

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
