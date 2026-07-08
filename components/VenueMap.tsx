"use client";

import { schedule } from "@/config/content";

/**
 * Abstract season chart: the schedule's stops plotted over nautical-style
 * chartwork (graticule, depth soundings, a dashed passage line, compass
 * rose — same visual language as VenuesChart in art/Backdrops.tsx, and
 * deliberately no real coastlines). Hovering or focusing a venue highlights
 * the matching timeline entry and vice versa, through state lifted into
 * Schedule. Stops opt in via `coords` in config/content.ts; if none have
 * coords, the whole chart stays off the page.
 */

const VIEW_W = 1000;
const VIEW_H = 560;

/** Gently bowed cubic segments through the stops, like a passage line. */
function routePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  return points.slice(1).reduce((d, b, i) => {
    const a = points[i];
    const dx = b.x - a.x;
    const bow = dx * 0.15;
    return `${d} C ${a.x + dx / 3} ${a.y - bow}, ${b.x - dx / 3} ${
      b.y - bow
    }, ${b.x} ${b.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

export default function VenueMap({
  active,
  onActivate,
}: {
  /** Index into schedule.stops of the highlighted stop, or null. */
  active: number | null;
  onActivate: (index: number) => void;
}) {
  const marked = schedule.stops.flatMap((stop, index) =>
    stop.coords ? [{ stop, index, coords: stop.coords }] : [],
  );
  if (marked.length === 0) return null;

  const points = marked.map(({ coords }) => ({
    x: (coords.x / 100) * VIEW_W,
    y: (coords.y / 100) * VIEW_H,
  }));
  const current =
    (active !== null ? schedule.stops[active] : undefined) ?? marked[0].stop;

  return (
    <div>
      <div className="relative overflow-hidden rounded-[10px] border border-line-dark bg-white text-ink">
        <svg
          aria-hidden
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-auto w-full"
          fill="none"
          stroke="currentColor"
        >
          {/* graticule */}
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 125}
              y1="0"
              x2={i * 125}
              y2={VIEW_H}
              strokeWidth="1"
              opacity="0.14"
            />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 140}
              x2={VIEW_W}
              y2={i * 140}
              strokeWidth="1"
              opacity="0.14"
            />
          ))}
          {/* depth-sounding dots sprinkled like a chart */}
          {[
            [80, 90], [340, 60], [700, 100], [930, 60], [60, 330], [420, 300],
            [640, 250], [820, 200], [180, 520], [500, 500], [760, 480], [950, 520],
          ].map(([x, y], i) => (
            <circle
              key={`d${i}`}
              cx={x}
              cy={y}
              r="1.6"
              fill="currentColor"
              stroke="none"
              opacity="0.3"
            />
          ))}
          {/* dashed passage line through the season's venues, in order */}
          <path
            d={routePath(points)}
            strokeWidth="1.5"
            strokeDasharray="2 7"
            strokeLinecap="round"
            opacity="0.45"
          />
          {/* compass rose */}
          <g transform="translate(920 80)" opacity="0.5">
            <circle r="26" strokeWidth="1" />
            <circle r="3" strokeWidth="1" />
            <path d="M0 -40 L6 -8 L0 -14 L-6 -8 Z" fill="currentColor" stroke="none" />
            <path d="M0 40 L5 10 L0 14 L-5 10 Z" strokeWidth="1" />
            <line x1="-34" y1="0" x2="-12" y2="0" strokeWidth="1" />
            <line x1="12" y1="0" x2="34" y2="0" strokeWidth="1" />
          </g>
        </svg>

        {/* venue marks — real buttons, so the chart works by keyboard too.
            The translate keeps the dot itself centered on the coordinate;
            near the right edge the label flips to the dot's left so it
            can't clip out of the chart. */}
        {marked.map(({ stop, index, coords }) => (
          <button
            key={`${stop.when}-${stop.title}`}
            type="button"
            aria-pressed={active === index}
            onMouseEnter={() => onActivate(index)}
            onFocus={() => onActivate(index)}
            onClick={() => onActivate(index)}
            className={`group absolute flex -translate-y-1/2 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-bright ${
              coords.x > 70
                ? "flex-row-reverse translate-x-[calc(7px-100%)]"
                : "-translate-x-[7px]"
            }`}
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          >
            <span
              aria-hidden
              className={`h-[13px] w-[13px] shrink-0 rounded-full border-2 border-sail bg-red transition-shadow ${
                active === index
                  ? "shadow-[0_0_0_5px_rgba(212,46,46,.18)]"
                  : ""
              }`}
            />
            <span
              className={`font-mono text-[11px] uppercase tracking-[.12em] transition-colors ${
                active === index ? "text-ink" : "text-ink-soft"
              } group-hover:text-ink`}
            >
              {coords.label}
            </span>
          </button>
        ))}
      </div>

      {/* the highlighted stop, spelled out */}
      <div
        aria-live="polite"
        className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1"
      >
        <span className="font-mono text-[13px] tracking-[.04em] text-red-dark">
          {current.when}
        </span>
        <span className="font-display text-[17px] font-bold">
          {current.title}
        </span>
        <span className="text-sm text-ink-soft">{current.where}</span>
      </div>
    </div>
  );
}
