"use client";

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
  /** Render on a dark panel — for white/light logos that vanish on the cream page. */
  dark?: boolean;
  /** Invisible slot for a sponsor still to be added (see the README). */
  placeholder?: boolean;
}

/** rank-1 = sponsors, then associations, federations/clubs; see README. */
const RANKS: SponsorEntry[][] = [rank1, rank2, rank3, rank4];

// Every logo renders at the same height (width auto) so wordmarks and crests
// read as one size — a fixed box + object-contain would make wide logos look
// huge and square ones tiny. max-w caps only pathologically wide art;
// max-w-full lets a logo give way when its row is squeezed onto one line.
const LOGO =
  "h-10 w-auto max-w-[190px] object-contain md:h-14 md:max-w-[230px] lg:max-w-full";
// From lg up each rank stays on a single line (lg:flex-nowrap) — logos share
// the width and shrink to fit rather than wrapping. Below that they wrap.
const ROW_GAP = "gap-x-8 gap-y-6 md:gap-x-14 md:gap-y-8 lg:gap-x-10";

function SponsorMark({ entry }: { entry: SponsorEntry }) {
  const logo = (
    // Plain <img>: uniform height with auto width; next/image needs fixed
    // dimensions we don't have for these path-referenced logos.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={entry.logo!} alt={`${entry.name} logo`} className={LOGO} />
  );
  const mark = entry.logo ? (
    // Light logos (e.g. a white wordmark) need a dark backing to stay visible.
    entry.dark ? (
      <span className="inline-flex items-center rounded-md bg-teal-950 px-3 py-2">
        {logo}
      </span>
    ) : (
      logo
    )
  ) : (
    // No logo file (e.g. a memorial fund): the name is the mark.
    <span
      className="flex h-10 items-center justify-center text-center font-display text-sm font-bold leading-tight text-ink-soft md:h-14 md:text-base"
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
        className="block transition hover:opacity-70"
      >
        {mark}
      </a>
    );
  }
  return (
    <span title={entry.name} className="block">
      {mark}
    </span>
  );
}

/**
 * Sponsors grouped by category (sponsors, associations, federations/clubs),
 * plain logos on the page background at a uniform height, funneling down to
 * the "maybe you?" invitation. Rendered purely from data/sponsors/rank-*.json.
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
                className={`flex w-full flex-wrap items-center justify-center lg:flex-nowrap ${ROW_GAP}`}
              >
                {visible.map((entry) => (
                  // min-w-0 is what lets a logo shrink below its natural width
                  // once the row is set to nowrap.
                  <li key={entry.name} className="min-w-0">
                    <SponsorMark entry={entry} />
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
