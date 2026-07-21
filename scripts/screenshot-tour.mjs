/**
 * Scrolls through the homepage like a user and screenshots key positions,
 * at desktop and mobile widths. Usage: node shoot.mjs <baseUrl> <outDir>
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3112";
const outDir = process.argv[3] ?? ".";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 780 }],
]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500); // let entrance animations land

  const maxScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  );
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((maxScroll * i) / steps);
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(900); // let scrubbed tweens settle
    await page.screenshot({
      path: path.join(outDir, `${name}-${String(i).padStart(2, "0")}.png`),
    });
  }
  await page.close();
  console.log(`${name}: ${steps + 1} shots, maxScroll=${maxScroll}`);
}

await browser.close();
