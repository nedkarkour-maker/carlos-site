import type { NextConfig } from "next";

const dev = process.env.NODE_ENV === "development";

/*
 * 'unsafe-inline' for scripts and styles is deliberate: Next inlines its
 * bootstrap scripts and next/font injects style tags, and this site ships no
 * third-party JS — a nonce-based CSP would add real complexity for no gain
 * here. Dev additionally needs eval and websockets or HMR breaks.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // The race section's YouTube embed (privacy-enhanced domain) — without
  // this line, default-src 'self' silently blocks the iframe.
  "frame-src https://www.youtube-nocookie.com",
  `connect-src 'self'${dev ? " ws:" : ""}`,
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
