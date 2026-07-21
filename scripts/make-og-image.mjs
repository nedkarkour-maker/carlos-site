/**
 * One-off: crops the hero photo into the 1200×630 social-share card at
 * app/opengraph-image.jpg (Next picks it up via the file convention).
 * Re-run if the hero photo changes:  node scripts/make-og-image.mjs
 */
import sharp from "sharp";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.join(root, "public", "images", "clean", "hero-viana.jpg");
const OUT = path.join(root, "app", "opengraph-image.jpg");

// Keep the hero's focal point in frame (~70% across, ~35% down — matches
// hero.image.focus in config/content.ts).
const FOCUS = { x: 0.7, y: 0.35 };
const W = 1200;
const H = 630;

const img = sharp(SRC);
const { width, height } = await img.metadata();

// Largest W:H-shaped window that fits, centered on the focal point.
let cropW = width;
let cropH = Math.round((width * H) / W);
if (cropH > height) {
  cropH = height;
  cropW = Math.round((height * W) / H);
}
const clamp = (v, max) => Math.min(Math.max(v, 0), max);
const left = clamp(Math.round(width * FOCUS.x - cropW / 2), width - cropW);
const top = clamp(Math.round(height * FOCUS.y - cropH / 2), height - cropH);

await img
  .extract({ left, top, width: cropW, height: cropH })
  .resize(W, H)
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);
console.log(`✓ opengraph-image.jpg (${W}×${H} from ${path.basename(SRC)})`);
