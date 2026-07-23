"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/lib/locale";
import Reveal from "./Reveal";
import rank1 from "@/data/sponsors/rank-1.json";
import rank2 from "@/data/sponsors/rank-2.json";
import rank3 from "@/data/sponsors/rank-3.json";
import rank4 from "@/data/sponsors/rank-4.json";

interface SponsorEntry {
  name: string;
  /** Path under /public; "" renders the name as a text wordmark. */
  logo?: string;
  /** Optional link — opens in a new tab. */
  url?: string;
  /** Invisible slot for a sponsor still to be added (see the README). */
  placeholder?: boolean;
}

/** rank-1 = widest top row; see data/sponsors/README.md for editing. */
const RANKS: SponsorEntry[][] = [rank1, rank2, rank3, rank4];

// Logo box + spacing per rank — each row down is narrower and smaller,
// shaping the inverted pyramid on both mobile and desktop.
const ROW_BOX = [
  "h-10 w-24 md:h-14 md:w-40",
  "h-9 w-20 md:h-11 md:w-32",
  "h-8 w-18 md:h-9 md:w-28",
  "h-7 w-16 md:h-8 md:w-24",
];
const ROW_GAP = [
  "gap-x-7 gap-y-5 md:gap-x-14",
  "gap-x-6 gap-y-4 md:gap-x-11",
  "gap-x-6 gap-y-4 md:gap-x-9",
  "gap-x-5 gap-y-3 md:gap-x-8",
];

function SponsorMark({ entry, box }: { entry: SponsorEntry; box: string }) {
  const mark = entry.logo ? (
    <span className={`relative block ${box}`}>
      <Image
        src={entry.logo}
        alt={`${entry.name} logo`}
        fill
        sizes="160px"
        className="object-contain"
      />
    </span>
  ) : (
    // No logo file (e.g. a memorial fund): the name is the mark.
    <span
      className={`flex items-center justify-center text-center font-display text-sm font-bold leading-tight text-ink-soft md:text-base ${box}`}
    >
      {entry.name}
    </span>
  );

  if (entry.url) {
    return (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        title={entry.name}
        className="block opacity-75 transition hover:opacity-100"
      >
        {mark}
      </a>
    );
  }
  return (
    <span title={entry.name} className="block opacity-75 transition hover:opacity-100">
      {mark}
    </span>
  );
}

/**
 * Sponsors as an inverted pyramid: plain logos on the page background, the
 * widest row on top, funneling down to the "maybe you?" invitation at the
 * tip. Rendered purely from data/sponsors/rank-*.json.
 */
export default function Backers() {
  const { backers } = useContent();
  return (
    <section className="py-[72px]">
      <Reveal className="wrap">
        <p className="mb-10 text-center font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
          {backers.label}
        </p>

        <div className="flex flex-col items-center gap-8 md:gap-10">
          {RANKS.map((rank, i) => {
            const visible = rank.filter((s) => !s.placeholder && s.name);
            if (visible.length === 0) return null;
            return (
              <ul
                key={i}
                className={`flex flex-wrap items-center justify-center ${ROW_GAP[i]}`}
              >
                {visible.map((entry) => (
                  <li key={entry.name}>
                    <SponsorMark entry={entry} box={ROW_BOX[i]} />
                  </li>
                ))}
              </ul>
            );
          })}

          {/* The funnel's endpoint. */}
          <Link
            href={backers.joinCta.href}
            className="flex min-h-[84px] w-[200px] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-red px-4 py-4 text-center transition-colors hover:bg-red/5"
          >
            <span className="font-display text-base font-extrabold text-red">
              {backers.joinCta.title}
            </span>
            <span className="font-mono text-[11px] text-ink-soft">
              {backers.joinCta.body}
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
