import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";

/*
 * 'unsafe-inline' for scripts and styles is deliberate: Next inlines its
 * bootstrap scripts and next/font injects style tags — a nonce-based CSP
 * would add real complexity for no gain here. Dev additionally needs eval
 * and websockets or HMR breaks.
 *
 * Everything below tagged [donorbox] exists for the donation popup
 * (DonateCard): the widget script runs in our page, fetches the form from
 * donorbox.org into shadow DOM, loads its stylesheets and the Inter font,
 * and mounts Stripe/PayPal payment machinery. The list was derived from
 * watching the widget's actual requests (scripts/dbox-probe run, Aug 2026)
 * — trim it only if the donation card goes away. rsms.me and
 * cdn.jsdelivr.net are scheme-less because the widget requests them
 * protocol-relative, which is http on the dev server.
 */
const csp = [
  "default-src 'self'",
  // [donorbox] donorbox.org widget+assets, js.stripe.com, paypal.com SDK,
  // cdn.jsdelivr.net fingerprint lib (their fraud check), jspm.dev telemetry.
  `script-src 'self' 'unsafe-inline' https://donorbox.org https://js.stripe.com https://www.paypal.com cdn.jsdelivr.net https://jspm.dev${dev ? " 'unsafe-eval'" : ""}`,
  // [donorbox] widget theme CSS from donorbox.org, Inter CSS from rsms.me.
  "style-src 'self' 'unsafe-inline' https://donorbox.org rsms.me",
  "img-src 'self' data: blob: https://donorbox.org https://www.paypalobjects.com",
  // [donorbox] Inter font files.
  "font-src 'self' rsms.me",
  // The race section's YouTube embed (privacy-enhanced domain) — without
  // this line, default-src 'self' silently blocks the iframe.
  // [donorbox] Stripe/PayPal mount payment iframes; hooks.stripe.com is 3DS.
  "frame-src https://www.youtube-nocookie.com https://donorbox.org https://js.stripe.com https://hooks.stripe.com https://www.paypal.com",
  // [donorbox] form fetch + Stripe API/telemetry + PayPal SDK logger.
  `connect-src 'self' https://donorbox.org https://api.stripe.com https://r.stripe.com https://www.paypal.com${dev ? " ws:" : ""}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // AGENTS.md is hand-maintained and is the canonical project-instructions
  // file — `next dev` otherwise rewrites a block inside it on every version
  // bump. The same warning already lives in its "Before editing" section.
  agentRules: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
