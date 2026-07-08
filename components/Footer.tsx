import Link from "next/link";
import { footer, site } from "@/config/content";

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
            <p className="mt-3.5">
              <a
                href={site.instagramUrl}
                className="font-mono text-[13px] transition-colors hover:text-sail"
              >
                → Instagram
              </a>
            </p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-3.5 font-mono text-[11px] uppercase tracking-[.14em] text-sail/45">
                {column.heading}
              </h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label} className="mb-[9px]">
                    {/* next/link is for in-app routes; mailto: and other
                        external hrefs need a plain anchor. */}
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-sail"
                      >
                        {link.label}
                      </Link>
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
