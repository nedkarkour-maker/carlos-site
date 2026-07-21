# Generated imagery — prompts & instructions

The site currently renders built-in SVG placeholder art. To upgrade to
generated images, create each image below (e.g. with Gemini at
https://aistudio.google.com, or by fixing the `GEMINI_API_KEY` in `.env.local`
and running `node scripts/generate-images.mjs`), then save it into
**`public/images/generated/`** with the **exact filename** given. The site
picks the file up automatically on the next build/deploy — no code changes.

> The API key currently in `.env.local` was rejected by Google
> ("API key not valid"). Get a fresh key at https://aistudio.google.com/apikey.

Shared style for all three prompts (append to each):

> Palette: deep teal `#0A2530` to near-black teal `#07222c` background,
> off-white `#F6F3EC` linework, very sparing accents of muted red `#D42E2E`.
> Minimal, elegant, editorial. Absolutely no text, no letters, no numbers,
> no labels, no watermark, no signature.

---

## 1. `sailboat-line.png` — About section accent

- **Dimensions:** 1024 × 1024 (aspect ratio 1:1)
- **Used in:** bottom-right corner of the About section, at 14% opacity.
- **Prompt:** Minimal single-weight line drawing of an ILCA dinghy (small
  one-person racing sailboat with a single tall sail) seen from the side,
  with two thin wake lines under the hull. Dark ink `#4a565a` linework on a
  plain solid warm off-white `#F6F3EC` background, nothing else in frame.
  Absolutely no text, no letters, no numbers, no watermark, no signature.
  *(don't append the shared dark-teal style to this one)*

## 2. `stats-topo.png` — stats section background

- **Dimensions:** 1600 × 900 (aspect ratio 16:9)
- **Used in:** "The work, in numbers" section, at 20% opacity behind the stats.
- **Prompt:** Subtle dark background texture: a nautical bathymetric chart of
  open ocean, thin concentric depth-contour lines only, barely visible, low
  contrast so text can sit on top. *(+ shared style)*

## 3. `wind-flow.png` — subscribe band background

- **Dimensions:** 2100 × 900 (aspect ratio 21:9)
- **Used in:** the teal "Follow the campaign" subscribe band, at 15% opacity.
- **Prompt:** Stylized wind-flow field: smooth flowing streamlines sweeping
  left to right like wind over water, thin elegant curved lines with varying
  spacing, aerodynamic feel, dark teal background. *(+ shared style)*

## 4. `venues-chart.png` — season timeline background

- **Dimensions:** 1600 × 900 (aspect ratio 16:9)
- **Used in:** behind the horizontal 2026 season timeline, at 8% opacity.
- **Prompt:** Minimal nautical-chart-style map of the North Atlantic and
  Europe, thin coastline linework of Portugal (Cascais), the Baltic near Kiel,
  the Aegean coast of Türkiye (Bodrum), and the Great Lakes of Canada
  (Kingston), with four small circular markers connected by a thin dashed
  route line. Compass-rose hint in a corner. *(+ shared style)*

---

**Rule:** never use generated images of Carlos himself — real photos only.
These three assets are abstract/atmospheric art.
