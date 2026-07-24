/**
 * One-off: crops the baked-in event sponsor banners off the press photos and
 * saves clean, web-sized copies to public/images/clean/. Originals are never
 * touched. Re-run any time with:  node scripts/crop-banners.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = (f) => path.join(root, "public", "images", f);
const outDir = path.join(root, "public", "images", "clean");
mkdirSync(outDir, { recursive: true });

// cropBottom / cropTop are fractions of image height to remove.
const JOBS = [
  { in: "img_4.jpg", out: "hero-viana.jpg", cropBottom: 0.115 },
  { in: "img_32.jpg", out: "story-spray.jpg", cropBottom: 0.25 },
  { in: "img_2.jpg", out: "story-aerial.jpg", cropBottom: 0.145 },
  { in: "img_20.jpg", out: "story-worldchamp.jpg", cropBottom: 0.11 },
  { in: "img_31.jpg", out: "fleet-upwind.jpg", cropBottom: 0.2 },
  { in: "img_6.jpg", out: "race-viana-1.jpg", cropBottom: 0.11 },
  { in: "img_5.jpg", out: "race-viana-2.jpg", cropBottom: 0.11 },
  { in: "img_27.jpg", out: "upwind-ireland.jpg", cropTop: 0.045 },
];

for (const job of JOBS) {
  const img = sharp(src(job.in));
  const { width, height } = await img.metadata();
  const top = Math.round(height * (job.cropTop ?? 0));
  const cropped = height - top - Math.round(height * (job.cropBottom ?? 0));
  await img
    .extract({ left: 0, top, width, height: cropped })
    .resize({ width: Math.min(width, 2800), withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(outDir, job.out));
  console.log(`✓ ${job.out}`);
}
