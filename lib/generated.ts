import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-side helper: returns the public URL of a generated art asset if the
 * file exists in public/images/generated/, otherwise null (components then
 * render their built-in SVG fallback). Drop a file with the right name into
 * that folder and the site uses it automatically on the next build.
 *
 * Expected filenames are documented in IMAGE_PROMPTS.md.
 */
export function generatedImage(filename: string): string | null {
  const filePath = path.join(
    process.cwd(),
    "public",
    "images",
    "generated",
    filename,
  );
  return existsSync(filePath) ? `/images/generated/${filename}` : null;
}
