import Link from "next/link";
import { footer, site } from "@/config/content";
import EmailLink from "./EmailLink";

// Icon buttons under the brand: ≥44px hit target, visible focus ring.
const iconButtonClass =
  "grid h-11 w-11 place-items-center rounded-full text-sail/70 transition hover:bg-white/10 hover:text-sail focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sail";

/* Inline SVG icons (20px, currentColor) — no icon-library dependency. */

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.4 21v-7.75h2.6l.4-3.02h-3V8.29c0-.87.24-1.47 1.5-1.47h1.6V4.11A21.5 21.5 0 0 0 14.16 4c-2.3 0-3.88 1.4-3.88 3.99v2.24H7.67v3.02h2.61V21h3.12z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-teal-950 pb-[30px] pt-[54px] text-sm text-sail/60">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-[30px] md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-display text-xl font-extrabold uppercase text-sail"
            >
              {site.name}
              <span className="text-red-bright">.</span>
            </Link>
            <p className="mt-2.5 font-mono text-[13px]">{footer.tagline}</p>
            <ul className="mt-3 flex items-center gap-1">
              <li>
                {/* Address assembled in JS on click — never in the HTML. */}
                <EmailLink className={iconButtonClass}>
                  <MailIcon />
                  <span className="sr-only">{footer.socialLabels.email}</span>
                </EmailLink>
              </li>
              {site.instagramUrl && (
                <li>
                  <a
                    href={site.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={footer.socialLabels.instagram}
                    className={iconButtonClass}
                  >
                    <InstagramIcon />
                  </a>
                </li>
              )}
              {site.linkedinUrl && (
                <li>
                  <a
                    href={site.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={footer.socialLabels.linkedin}
                    className={iconButtonClass}
                  >
                    <LinkedInIcon />
                  </a>
                </li>
              )}
              {site.facebookUrl && (
                <li>
                  <a
                    href={site.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={footer.socialLabels.facebook}
                    className={iconButtonClass}
                  >
                    <FacebookIcon />
                  </a>
                </li>
              )}
            </ul>
          </div>
          {footer.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-sail/45">
                {column.heading}
              </h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label} className="mb-[9px]">
                    {/* next/link is for in-app routes; external hrefs need a
                        plain anchor; mailto links are assembled in JS so the
                        address stays out of the HTML. */}
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-sail"
                      >
                        {link.label}
                      </Link>
                    ) : link.href.startsWith("mailto:") ? (
                      <EmailLink className="transition-colors hover:text-sail">
                        {link.label}
                      </EmailLink>
                    ) : (
                      <a
                        href={link.href}
                        className="transition-colors hover:text-sail"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-2.5 border-t border-line pt-[22px] font-mono text-xs">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{footer.donationNote}</span>
        </div>
      </div>
    </footer>
  );
}
