import Link from "next/link";
import { latestResult } from "@/config/content";

/**
 * Slim band between the hero's dark exit and the statement — the freshest
 * number on the site. Content comes from `latestResult` in config/content.ts
 * (update it after every regatta); with no result set, nothing renders.
 */
export default function LatestResult() {
  if (!latestResult.result) return null;

  return (
    <section className="bg-teal-950 text-sail">
      <div className="wrap flex flex-wrap items-baseline gap-x-7 gap-y-1.5 py-6">
        <p className="font-mono text-[11px] uppercase tracking-[.16em] text-sail/55">
          Latest result
        </p>
        <p className="font-display text-[clamp(19px,2.4vw,26px)] font-extrabold tracking-[-0.01em] text-red-bright">
          {latestResult.result}
        </p>
        <p className="text-sm text-sail/80">{latestResult.event}</p>
        {latestResult.href && (
          <Link
            href={latestResult.href}
            className="font-mono text-[13px] text-sail/70 transition-colors hover:text-sail"
          >
            {latestResult.linkLabel ?? "Read more"} →
          </Link>
        )}
      </div>
    </section>
  );
}
