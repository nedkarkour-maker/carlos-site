"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/content";
import { useContent, useLocale, type Locale } from "@/lib/locale";

const linkClass =
  "text-sm font-medium text-sail/80 transition-colors hover:text-sail";
const ctaClass =
  "inline-block rounded-[2px] bg-red px-[18px] py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright";

/** The EN / FR switch — remembers the choice, defaults to EN. */
function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const option = (value: Locale) => (
    <button
      type="button"
      lang={value}
      aria-pressed={locale === value}
      onClick={() => setLocale(value)}
      className={`px-1 py-2 font-mono text-xs uppercase tracking-[.08em] transition-colors ${
        locale === value ? "text-sail" : "text-sail/45 hover:text-sail/80"
      }`}
    >
      {value.toUpperCase()}
    </button>
  );
  return (
    <div className="flex items-center">
      {option("en")}
      <span aria-hidden className="text-sail/30">
        /
      </span>
      {option("fr")}
    </div>
  );
}

export default function Navbar({
  alwaysSolid = false,
}: {
  /** Solid background from the start — for pages without a dark hero. */
  alwaysSolid?: boolean;
}) {
  const { nav } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = alwaysSolid || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-teal-900/95 py-3 shadow-[0_1px_0_var(--line)]"
          : "bg-transparent py-[18px]"
      }`}
    >
      <div className="wrap relative flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display text-[17px] font-extrabold uppercase text-sail"
        >
          {site.name}
          <span className="text-red-bright">.</span>
        </Link>

        <div className="hidden items-center gap-[26px] md:flex">
          {nav.links.map((link) => (
            <Link key={link.label} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <LanguageToggle />
          <a
            href={nav.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaClass}
          >
            {nav.cta.label}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-1.5"
          >
            <span className="block h-0.5 w-6 bg-sail" />
            <span className="block h-0.5 w-6 bg-sail" />
            <span className="block h-0.5 w-6 bg-sail" />
          </button>
        </div>

        {open && (
          <div className="absolute right-6 top-full mt-2 flex flex-col gap-3.5 rounded-md bg-teal-900 p-[18px] shadow-lg md:hidden">
            {nav.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={nav.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClass}
              onClick={() => setOpen(false)}
            >
              {nav.cta.label}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
