"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { backers, type Sponsor } from "@/config/content";
import { usePrefersReducedMotion } from "@/lib/motion";

/** "Sail Canada" → "SC" — placeholder mark until a real logo file is provided. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (sponsor.logo) {
    return (
      <span className="relative h-12 w-24">
        <Image
          src={sponsor.logo}
          alt={`${sponsor.name} logo`}
          fill
          sizes="96px"
          className="object-contain"
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-12 w-12 items-center justify-center rounded-full border border-line-dark bg-sail-2 font-mono text-sm font-semibold text-ink-soft"
    >
      {initials(sponsor.name)}
    </span>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <li className="flex min-h-[120px] w-[150px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-md border border-line-dark bg-sail px-4 py-4 text-center font-mono text-[11px] text-ink-soft">
      <SponsorLogo sponsor={sponsor} />
      {sponsor.name}
    </li>
  );
}

/**
 * Sponsor wall. When motion is allowed the logos drift in a slow infinite
 * marquee that pauses on hover; otherwise they render as a static wrapped
 * row. The "maybe you?" card sits below in both cases.
 */
export default function Backers() {
  const reduced = usePrefersReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || reduced) return;

    // Slide one full copy's width, then wrap — a seamless loop.
    const tween = gsap.to(row, {
      xPercent: -50,
      duration: backers.sponsors.length * 7,
      ease: "none",
      repeat: -1,
    });
    const pause = () => tween.pause();
    const play = () => tween.play();
    row.addEventListener("mouseenter", pause);
    row.addEventListener("mouseleave", play);
    return () => {
      row.removeEventListener("mouseenter", pause);
      row.removeEventListener("mouseleave", play);
      tween.kill();
    };
  }, [reduced]);

  return (
    <section className="border-y border-line-dark bg-white py-[42px]">
      <p className="mb-[22px] text-center font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
        {backers.label}
      </p>

      {reduced ? (
        <ul className="wrap flex flex-wrap justify-center gap-3.5">
          {backers.sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.name} sponsor={sponsor} />
          ))}
        </ul>
      ) : (
        <div className="overflow-hidden">
          <div ref={rowRef} className="flex w-max will-change-transform">
            <ul className="flex gap-3.5 pr-3.5">
              {backers.sponsors.map((sponsor) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} />
              ))}
            </ul>
            <ul aria-hidden className="flex gap-3.5 pr-3.5">
              {backers.sponsors.map((sponsor) => (
                <SponsorCard key={`${sponsor.name}-copy`} sponsor={sponsor} />
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="wrap mt-6 flex justify-center">
        <Link
          href={backers.joinCta.href}
          className="flex min-h-[90px] w-[220px] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-red px-4 py-4 text-center transition-colors hover:bg-red/5"
        >
          <span className="font-display text-base font-extrabold text-red">
            {backers.joinCta.title}
          </span>
          <span className="font-mono text-[11px] text-ink-soft">
            {backers.joinCta.body}
          </span>
        </Link>
      </div>
    </section>
  );
}
