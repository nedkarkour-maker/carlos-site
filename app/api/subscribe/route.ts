import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * True when the browser-sent metadata says the request came from another
 * site. Browsers set these headers themselves — a page elsewhere on the web
 * can't fake them — so this shuts down cross-site form abuse for free.
 */
function isCrossSite(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) {
    return true;
  }
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return true;
    } catch {
      return true;
    }
  }
  return false;
}

/**
 * Best-effort rate limit: a per-IP sliding window in module memory. On
 * serverless this state is per-instance and resets on cold start — that
 * still blunts list-bombing bursts, without adding a KV dependency.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(request: Request): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Drop fully-expired IPs so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(request: Request) {
  if (isCrossSite(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many attempts — please try again in a few minutes." },
      { status: 429 },
    );
  }

  let email: unknown;
  let company: unknown;
  let elapsedMs: unknown;
  try {
    ({ email, company, elapsedMs } = await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // Bot filters: `company` is the form's honeypot (hidden from people, so a
  // value means a form-filler bot), and humans take more than 3 s from page
  // load to submit. Either way the answer is a fake success — a rejection
  // would only teach the bot what to fix.
  const looksLikeBot =
    (typeof company === "string" && company.length > 0) ||
    typeof elapsedMs !== "number" ||
    !Number.isFinite(elapsedMs) ||
    elapsedMs < 3000;
  if (looksLikeBot) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    console.error(
      "Beehiiv is not configured — set BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID in .env.local",
    );
    return NextResponse.json(
      { error: "Subscriptions aren't set up yet — please try again later." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "website",
          utm_medium: "subscribe-form",
        }),
      },
    );

    // 200/201 = accepted. When double opt-in is on, Beehiiv returns the
    // subscription with status "validating" until the person confirms by
    // email — still a success as far as the form is concerned.
    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    if (res.status === 400) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (res.status === 429) {
      return NextResponse.json(
        { error: "Too many attempts — please try again in a few minutes." },
        { status: 429 },
      );
    }

    // 401 (bad key) / 404 (bad publication id) land here — the console line
    // tells you which; the visitor just sees a generic retry message.
    console.error("Beehiiv error:", res.status, await res.text());
    return NextResponse.json(
      { error: "Something went wrong — please try again later." },
      { status: 502 },
    );
  } catch (err) {
    console.error("Beehiiv request failed:", err);
    return NextResponse.json(
      { error: "Something went wrong — please try again later." },
      { status: 502 },
    );
  }
}
