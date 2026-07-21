/**
 * Generates the site's atmospheric background art with the Gemini API.
 *
 * Usage:  node scripts/generate-images.mjs [test]
 *   test  — only generates a tiny probe image to verify the API key works.
 *
 * Reads GEMINI_API_KEY from .env.local (never hardcode or commit the key).
 * Output goes to public/images/generated/ — components pick the files up
 * automatically by filename.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public", "images", "generated");

function loadKey() {
  const env = readFileSync(path.join(root, ".env.local"), "utf8");
  const match = env.match(/^GEMINI_API_KEY=(.+)$/m);
  if (!match) throw new Error("GEMINI_API_KEY not found in .env.local");
  // Tolerate surrounding quotes and whitespace.
  return match[1].trim().replace(/^["']|["']$/g, "");
}

const KEY = loadKey();
const MODEL = "gemini-2.5-flash-image";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const STYLE =
  "Palette: deep teal #0A2530 to near-black teal #07222c background, " +
  "off-white #F6F3EC linework, very sparing accents of muted red #D42E2E. " +
  "Minimal, elegant, editorial. Absolutely no text, no letters, no numbers, " +
  "no labels, no watermark, no signature.";

const ASSETS = [
  {
    file: "sailboat-line.png",
    aspectRatio: "1:1",
    prompt:
      "Minimal single-weight line drawing of an ILCA dinghy (small one-person " +
      "racing sailboat with a single tall sail) seen from the side, with two " +
      "thin wake lines under the hull. Dark ink #4a565a linework on a plain " +
      "solid warm off-white #F6F3EC background, nothing else in frame. " +
      "Absolutely no text, no letters, no numbers, no watermark, no signature.",
  },
  {
    file: "stats-topo.png",
    aspectRatio: "16:9",
    prompt:
      "Subtle dark background texture: a nautical bathymetric chart of open " +
      "ocean, thin concentric depth-contour lines only, barely visible, " +
      "low contrast so text can sit on top. " + STYLE,
  },
  {
    file: "wind-flow.png",
    aspectRatio: "21:9",
    prompt:
      "Stylized wind-flow field: smooth flowing streamlines sweeping left to " +
      "right like wind over water, thin elegant curved lines with varying " +
      "spacing, aerodynamic feel, dark teal background. " + STYLE,
  },
  {
    file: "venues-chart.png",
    aspectRatio: "16:9",
    prompt:
      "Minimal nautical-chart-style map of the North Atlantic and Europe, " +
      "thin coastline linework of Portugal, the Baltic near Denmark and " +
      "Germany, the Aegean coast of Turkey, and the Great Lakes of Canada, " +
      "with four small circular markers connected by a thin dashed route " +
      "line (Lisbon coast, Kiel bay, Lake Ontario, southwest Turkey). " +
      "Compass-rose hint in a corner. " + STYLE,
  },
];

async function generate({ file, prompt, aspectRatio }) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio },
      },
    }),
  });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data,
  );
  if (!part) throw new Error(`${file}: no image in response`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, file), Buffer.from(part.inlineData.data, "base64"));
  console.log(`✓ ${file}`);
}

const testOnly = process.argv[2] === "test";
if (testOnly) {
  await generate({
    file: "_probe.png",
    aspectRatio: "1:1",
    prompt: "A single thin off-white circle on a dark teal background. No text.",
  });
} else {
  for (const asset of ASSETS) await generate(asset);
}
