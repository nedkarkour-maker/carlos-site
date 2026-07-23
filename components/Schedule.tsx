"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ScheduleStop } from "@/config/content";
import { useContent } from "@/lib/locale";
import { VenuesChart } from "./art/Backdrops";
import Reveal from "./Reveal";

// Each stop kind gets its own dot colour: training blocks are teal, races
// and the Games keep the campaign red. The halo shows on major stops and on
// hover.
function dotClasses(stop: ScheduleStop) {
  const isTraining = stop.kind === "training";
  const color = isTraining ? "bg-teal-700" : "bg-red";
  const halo = isTraining
    ? "shadow-[0_0_0_5px_rgba(22,80,95,.16)]"
    : "shadow-[0_0_0_5px_rgba(212,46,46,.18)]";
  const hover = isTraining
    ? "group-hover:shadow-[0_0_0_5px_rgba(22,80,95,.16)]"
    : "group-hover:shadow-[0_0_0_5px_rgba(212,46,46,.18)]";
  return `${color} ${stop.major ? halo : ""} ${hover}`;
}

/** The pills under a stop: a neutral "Training" badge and/or the red tag. */
function StopBadges({
  stop,
  trainingLabel,
}: {
  stop: ScheduleStop;
  trainingLabel: string;
}) {
  if (stop.kind !== "training" && !stop.tag) return null;
  const pill =
    "inline-block rounded-[3px] px-[7px] py-0.5 font-mono text-[10px] uppercase tracking-[.1em]";
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {stop.kind === "training" && (
        <span className={`${pill} border border-line-dark text-ink-soft`}>
          {trainingLabel}
        </span>
      )}
      {stop.tag && (
        <span className={`${pill} bg-red text-white`}>{stop.tag}</span>
      )}
    </div>
  );
}

// Left padding that lines the first card up with the page's content column,
// so the timeline starts under the heading. Reused by the axis line.
const GUTTER = "max(calc((100vw-var(--maxw))/2),24px)";

/**
 * The season, laid out as a fixed chronological timeline. On desktop it's a
 * horizontal strip you scroll left/right (drag, trackpad, the ‹ › buttons or
 * the keyboard) — every stop stays fully readable, and a straight axis line
 * runs through the dots to an arrowhead pointing at the seasons ahead. On
 * mobile it's the vertical timeline. No scroll-scrubbed motion, so nothing
 * appears or disappears as you move.
 */
export default function Schedule({
  mapSrc = null,
}: {
  /** Generated nautical venue map (passed from the page); omitted if null. */
  mapSrc?: string | null;
}) {
  const { schedule } = useContent();
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollerRef.current?.scrollBy({
      left: direction * 340,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  const heading = (
    <>
      <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
        {schedule.eyebrow}
      </p>
      <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        {schedule.title}
      </h2>
    </>
  );

  return (
    <section id="schedule" className="scroll-mt-20">
      {/* -------------------------------------------- horizontal strip (md+) */}
      <div className="relative hidden overflow-hidden py-[90px] md:block">
        {mapSrc ? (
          <Image
            src={mapSrc}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="object-cover opacity-[0.08]"
          />
        ) : (
          <VenuesChart className="absolute inset-0 h-full w-full text-ink opacity-[0.08]" />
        )}

        <div className="wrap relative flex items-end justify-between gap-6">
          <div>{heading}</div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Earlier in the season"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-dark text-ink-soft transition hover:border-red hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Later in the season"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-dark text-ink-soft transition hover:border-red hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          tabIndex={0}
          role="group"
          aria-label="Season timeline — scroll left and right"
          className="relative mt-10 overflow-x-auto pb-4 [scrollbar-color:var(--line-dark)_transparent] [scrollbar-width:thin] focus-visible:outline-none"
        >
          <div className="relative flex w-max items-stretch gap-6">
            {/* The chronological axis: a straight line through the dots, ending
                in an arrowhead that points at the seasons still ahead. */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-[13px] z-0 flex items-center"
              style={{ left: GUTTER }}
            >
              <span className="h-0.5 flex-1 rounded-full bg-ink/25" />
              <span className="ml-[-1px] border-y-[7px] border-l-[12px] border-y-transparent border-l-red" />
            </div>

            {/* Leading spacer aligns the first card under the heading. */}
            <div className="shrink-0" style={{ width: GUTTER }} />

            {schedule.stops.map((stop) => (
              <article
                key={`${stop.when}-${stop.title}`}
                className="group relative flex w-[300px] shrink-0 flex-col pt-10"
              >
                <span
                  aria-hidden
                  className={`absolute left-1/2 top-[12px] z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-sail transition-shadow ${dotClasses(stop)}`}
                />
                <div
                  className={`flex-1 rounded-[10px] border bg-white px-6 py-5 shadow-sm transition-colors group-hover:border-red/60 ${
                    stop.major ? "border-red/40" : "border-line-dark"
                  }`}
                >
                  <span className="font-mono text-[13px] tracking-[.04em] text-red-dark">
                    {stop.when}
                  </span>
                  <h3 className="mt-1.5 font-display text-[21px] font-bold leading-tight">
                    {stop.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-soft">{stop.where}</p>
                  <StopBadges stop={stop} trainingLabel={schedule.trainingLabel} />
                </div>
              </article>
            ))}

            {/* Trailing room so the arrow points past the final stop. */}
            <div className="w-[12vw] shrink-0" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------- vertical timeline (mobile) */}
      <Reveal className="wrap py-[90px] md:hidden">
        {heading}
        <ol className="mt-[46px] border-l-2 border-line-dark pl-7">
          {schedule.stops.map((stop) => (
            <li
              key={`${stop.when}-${stop.title}`}
              className="group relative grid grid-cols-[90px_1fr] gap-3.5 border-b border-line-dark py-5 last:border-b-0"
            >
              <span
                aria-hidden
                className={`absolute -left-[35px] top-[26px] h-[11px] w-[11px] rounded-full border-2 border-sail transition-shadow ${dotClasses(stop)}`}
              />
              <span className="pt-0.5 font-mono text-[13px] tracking-[.04em] text-red-dark">
                {stop.when}
              </span>
              <div>
                <h3 className="font-display text-[19px] font-bold">
                  {stop.title}
                </h3>
                <p className="mt-[3px] text-sm text-ink-soft">{stop.where}</p>
                <StopBadges stop={stop} trainingLabel={schedule.trainingLabel} />
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
