# Archived: RaceScroll.tsx — the scroll-driven race animation

**Archived 2026-07-21.** Pulled from the homepage in favor of a YouTube
embed (`components/RaceVideo.tsx`) — not because it was wrong, but because
it wasn't finished, and the section needed to ship. The intent is to come
back and finish the animation later; this file preserves the full working
source so nothing is lost.

## What it was

A top-down ILCA race that played as you scrolled: a sticky full-viewport
SVG under a 600vh track, with a scrubbed GSAP timeline driving an
aspect-aware viewBox "camera", a 7-boat fleet on waypoint choreography
(Carlos is the red sail), per-step monospace captions, a 3-2-1 start
sequence, progress segments, and a time-based wind pulse. Under
`prefers-reduced-motion` it rendered six static framed scenes instead.

## What drove it

- `race.steps` in `config/content.ts` — six `{ kicker, caption }` entries
  (course overview, countdown, start/upwind, windward mark, downwind,
  finish). That storyboard config was removed together with the component;
  `race` now only carries `eyebrow`, `title`, `videoUrl`, `videoTitle` and
  `caption` for the video section. To resurrect the animation, restore the
  `RaceStep`/`steps` config from the code block below (the captions are
  embedded in the git history of `config/content.ts` too, at commit
  `aa0de87`).
- It mounted in `app/page.tsx` between `<Subscribe />` and `<Backers />` —
  the same slot `RaceVideo` occupies now.

## Restoring it

1. Copy the code block below back to `components/RaceScroll.tsx`.
2. Restore `RaceStep` + `steps` to the `race` export in
   `config/content.ts`.
3. Swap `<RaceVideo />` for `<RaceScroll />` in `app/page.tsx`.

## Full source at time of archiving

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { race } from "@/config/content";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------------
 * The course, in world units (x: 0–1000, y: 0 at the windward end, larger
 * y = further downwind). The camera is an animated viewBox over this world.
 * ---------------------------------------------------------------------- */

const MARK = { x: 500, y: 170 }; // windward mark
const GATE = [
  { x: 430, y: 940 },
  { x: 570, y: 940 },
]; // leeward gate
const START = { y: 1040, pinX: 350, boatX: 660 }; // pin → committee boat
const FINISH = { y: 1120, x1: 400, x2: 540, boatX: 556 };

/** Camera keyframes: the content box that must stay in view at step-time t.
 * Boxes get expanded to the real viewport aspect at runtime, so nothing
 * important is ever cropped on tall phones or wide monitors. The overview
 * boxes carry extra headroom so the course sits below the section header. */
const CAMERA: { t: number; cx: number; cy: number; w: number; h: number }[] = [
  { t: 0, cx: 500, cy: 590, w: 1150, h: 1900 }, // whole course
  { t: 1, cx: 500, cy: 590, w: 1150, h: 1900 }, // hold for step 1
  { t: 2, cx: 505, cy: 1035, w: 560, h: 430 }, // the start line
  { t: 3, cx: 505, cy: 660, w: 820, h: 700 }, // mid-upwind
  { t: 3.5, cx: 502, cy: 290, w: 560, h: 470 }, // the mark comes into view
  { t: 4, cx: 500, cy: 215, w: 460, h: 380 }, // tight on the rounding
  { t: 4.5, cx: 490, cy: 640, w: 620, h: 520 }, // chasing the run down
  { t: 5, cx: 470, cy: 860, w: 660, h: 600 }, // the leeward gate
  { t: 6, cx: 500, cy: 590, w: 1150, h: 1900 }, // pull back for the finish
];

/* ------------------------------------------------------------------ boats */

interface Waypoint {
  t: number;
  x: number;
  y: number;
  r: number; // heading, degrees clockwise from "sailing up the screen"
  sail?: number; // boom angle: ~12° sheeted in upwind, ~74° eased downwind
}

interface BoatSpec {
  id: string;
  carlos?: boolean;
  wp: Waypoint[];
}

/**
 * One boat's whole race as waypoints; every segment between them is linear,
 * so the fleet drifts continuously with scroll instead of teleporting.
 * mill = where it sits before the sequence starts; lineX = its spot on the
 * start line; leg1 = how far right it sails before tacking; markT = when it
 * reaches the windward mark (stagger this for mark-rounding traffic).
 */
function boatPath(p: {
  mill: [number, number];
  lineX: number;
  leg1: number;
  leg1T: number; // when it tacks — stagger so the beat isn't a parade
  leg1Y: number; // how high it has climbed by then
  markT: number;
  jib: number; // small per-boat jitter so roundings don't overlap exactly
  gateX: number;
  finishT: number;
  finishX: number;
}): Waypoint[] {
  const roundT = p.markT + 0.18;
  const gateT = roundT + 1.12;
  return [
    { t: 0, x: p.mill[0], y: p.mill[1], r: -20, sail: 12 },
    { t: 0.6, x: (p.mill[0] + p.lineX) / 2 + 16, y: (p.mill[1] + 1075) / 2, r: 14 },
    { t: 1.2, x: p.lineX + 12, y: 1073, r: -16 },
    { t: 2, x: p.lineX, y: 1054, r: 4 }, // luffing on the line, waiting
    { t: p.leg1T, x: p.lineX + p.leg1, y: p.leg1Y, r: 38 }, // first leg, up-right
    { t: p.leg1T + 0.07, x: p.lineX + p.leg1 + 8, y: p.leg1Y - 20, r: -38 }, // the tack
    { t: p.markT, x: MARK.x + 8 + p.jib, y: MARK.y + 26 + p.jib, r: -38 },
    { t: roundT, x: MARK.x - 40 + p.jib, y: MARK.y + 62, r: -178, sail: 74 },
    { t: gateT, x: p.gateX, y: GATE[0].y + 14, r: -180 },
    { t: p.finishT, x: p.finishX, y: FINISH.y + 4, r: -168 },
    { t: 6, x: p.finishX + 10, y: FINISH.y + 62, r: -164 },
  ];
}

const BOATS: BoatSpec[] = [
  {
    id: "carlos",
    carlos: true,
    wp: boatPath({ mill: [560, 1130], lineX: 500, leg1: 95, leg1T: 2.5, leg1Y: 815, markT: 3.6, jib: 0, gateX: 430, finishT: 5.55, finishX: 470 }),
  },
  // b1 rounds just behind Carlos and runs beside him — the downwind pair.
  { id: "b1", wp: boatPath({ mill: [420, 1150], lineX: 398, leg1: 132, leg1T: 2.4, leg1Y: 840, markT: 3.7, jib: 7, gateX: 490, finishT: 5.8, finishX: 505 }) },
  { id: "b2", wp: boatPath({ mill: [632, 1102], lineX: 610, leg1: 62, leg1T: 2.62, leg1Y: 870, markT: 3.95, jib: -6, gateX: 570, finishT: 5.9, finishX: 445 }) },
  { id: "b3", wp: boatPath({ mill: [352, 1096], lineX: 442, leg1: 112, leg1T: 2.55, leg1Y: 795, markT: 4.05, jib: 11, gateX: 588, finishT: 5.98, finishX: 520 }) },
  { id: "b4", wp: boatPath({ mill: [688, 1142], lineX: 562, leg1: 78, leg1T: 2.72, leg1Y: 860, markT: 4.18, jib: -9, gateX: 412, finishT: 6, finishX: 482 }) },
  { id: "b5", wp: boatPath({ mill: [472, 1172], lineX: 366, leg1: 152, leg1T: 2.35, leg1Y: 780, markT: 4.3, jib: 5, gateX: 552, finishT: 6, finishX: 552 }) },
];

/** Linear position along a boat's waypoints at step-time t (SSR-safe). */
function positionsAt(wp: Waypoint[], t: number) {
  let sail = wp[0].sail ?? 12;
  for (const w of wp) if (w.t <= t && w.sail !== undefined) sail = w.sail;
  if (t <= wp[0].t) return { ...wp[0], sail };
  const last = wp[wp.length - 1];
  if (t >= last.t) return { ...last, sail };
  let i = 0;
  while (wp[i + 1].t < t) i++;
  const a = wp[i];
  const b = wp[i + 1];
  const k = (t - a.t) / (b.t - a.t);
  return {
    x: a.x + (b.x - a.x) * k,
    y: a.y + (b.y - a.y) * k,
    r: a.r + (b.r - a.r) * k,
    sail,
  };
}

/* ------------------------------------------------------------------ scene */

function BoatSprite({
  id,
  at,
  carlos,
}: {
  id: string;
  at: number;
  carlos?: boolean;
}) {
  const boat = BOATS.find((b) => b.id === id)!;
  const p = positionsAt(boat.wp, at);
  return (
    <g
      data-boat={id}
      transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}
    >
      <path
        d="M0 -11 C4 -5 4.4 4 2.8 10 L-2.8 10 C-4.4 4 -4 -5 0 -11 Z"
        fill={carlos ? "var(--sail)" : "rgba(246,243,236,0.72)"}
      />
      <path
        data-sail
        transform={`rotate(${p.sail})`}
        d="M0 -8 C5 -4 6.2 1 5.4 6 L0 5 Z"
        fill={carlos ? "var(--red-bright)" : "rgba(246,243,236,0.5)"}
      />
    </g>
  );
}

/** The whole course; `at` places the fleet for static (no-JS/SSR) renders. */
function RaceWorld({ at }: { at: number }) {
  return (
    <>
      {/* Water — oversized so a moving camera never finds an edge. */}
      <rect x={-2200} y={-1600} width={5400} height={4800} fill="var(--teal-950)" />
      {[260, 480, 700, 920, 1140].map((y) => (
        <path
          key={y}
          d={`M-300 ${y} C 120 ${y - 26}, 420 ${y + 22}, 740 ${y - 8} S 1200 ${y + 18}, 1400 ${y - 12}`}
          fill="none"
          stroke="var(--sail)"
          strokeOpacity={0.05}
          strokeWidth={2}
        />
      ))}

      {/* Wind arrow, pointing down the course. */}
      <g data-wind opacity={0.9}>
        <text
          x={500}
          y={-46}
          textAnchor="middle"
          fill="var(--sail)"
          fillOpacity={0.65}
          style={{ font: "600 17px var(--font-mono, monospace)", letterSpacing: 4 }}
        >
          WIND
        </text>
        <line x1={500} y1={-30} x2={500} y2={26} stroke="var(--sail)" strokeWidth={3.5} />
        <polygon points="490,22 510,22 500,44" fill="var(--sail)" />
      </g>

      {/* Windward mark. */}
      <circle cx={MARK.x} cy={MARK.y} r={15} fill="none" stroke="var(--sail)" strokeOpacity={0.3} strokeWidth={2} />
      <circle cx={MARK.x} cy={MARK.y} r={8.5} fill="var(--red-bright)" />

      {/* Leeward gate. */}
      {GATE.map((g) => (
        <circle key={g.x} cx={g.x} cy={g.y} r={7.5} fill="var(--red-bright)" />
      ))}

      {/* Start line: pin buoy → committee boat. */}
      <line
        x1={START.pinX}
        y1={START.y}
        x2={START.boatX}
        y2={START.y}
        stroke="var(--sail)"
        strokeOpacity={0.5}
        strokeWidth={2.5}
        strokeDasharray="13 9"
      />
      <circle cx={START.pinX} cy={START.y} r={6.5} fill="var(--red-bright)" />
      <g transform={`translate(${START.boatX} ${START.y})`}>
        <rect x={-8} y={-26} width={16} height={52} rx={7} fill="var(--sail)" fillOpacity={0.9} />
        <line x1={0} y1={-26} x2={0} y2={-44} stroke="var(--sail)" strokeWidth={2.5} />
        <polygon points="0,-44 16,-39 0,-33" fill="var(--red-bright)" />
      </g>
      <text
        x={START.boatX + 30}
        y={START.y + 6}
        fill="var(--sail)"
        fillOpacity={0.55}
        style={{ font: "600 15px var(--font-mono, monospace)", letterSpacing: 3 }}
      >
        START
      </text>

      {/* Finish line, sailed through downwind. */}
      <line
        x1={FINISH.x1}
        y1={FINISH.y}
        x2={FINISH.x2}
        y2={FINISH.y}
        stroke="var(--sail)"
        strokeOpacity={0.4}
        strokeWidth={2.5}
        strokeDasharray="9 8"
      />
      <g transform={`translate(${FINISH.boatX} ${FINISH.y})`}>
        <rect x={-6} y={-17} width={12} height={34} rx={5.5} fill="var(--sail)" fillOpacity={0.8} />
      </g>
      <text
        x={FINISH.x1 - 26}
        y={FINISH.y + 5}
        textAnchor="end"
        fill="var(--sail)"
        fillOpacity={0.5}
        style={{ font: "600 15px var(--font-mono, monospace)", letterSpacing: 3 }}
      >
        FINISH
      </text>

      {/* The fleet — Carlos is the red sail. */}
      {BOATS.map((b) => (
        <BoatSprite key={b.id} id={b.id} at={at} carlos={b.carlos} />
      ))}
    </>
  );
}

/** Content box → viewBox string matching a given viewport aspect ratio. */
function expandBox(
  box: { cx: number; cy: number; w: number; h: number },
  aspect: number,
) {
  let { w, h } = box;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;
  return { x: box.cx - w / 2, y: box.cy - h / 2, w, h };
}

/* -------------------------------------------------------------- component */

/**
 * "What a race looks like" — a top-down regatta that plays as you scroll.
 * A sticky full-viewport SVG scene under a 600vh scroll track; a scrubbed
 * GSAP timeline drives the camera (viewBox), the fleet, the captions and
 * the 3…2…1 start sequence, so the visitor sets the pace — keyboard, wheel
 * or touch. Under prefers-reduced-motion the six beats render as a static
 * vertical sequence of framed scenes with the same captions.
 */
export default function RaceScroll() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const svg = svgRef.current;
    if (!section || !track || !svg || reduced) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | undefined;
    const build = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        const aspect = window.innerWidth / window.innerHeight;
        const cam = expandBox(CAMERA[0], aspect);
        const applyCam = () =>
          svg.setAttribute("viewBox", `${cam.x} ${cam.y} ${cam.w} ${cam.h}`);
        applyCam();

        // Time-based (not scroll-based): the wind never stops.
        gsap.to("[data-wind]", {
          y: 12,
          opacity: 0.65,
          duration: 1.3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        // Camera glides between keyframes.
        for (let i = 1; i < CAMERA.length; i++) {
          tl.to(
            cam,
            {
              ...expandBox(CAMERA[i], aspect),
              duration: CAMERA[i].t - CAMERA[i - 1].t,
              onUpdate: applyCam,
            },
            CAMERA[i - 1].t,
          );
        }

        // The fleet follows its waypoints; sails trim when the angle is set.
        for (const boat of BOATS) {
          const el = svg.querySelector<SVGGElement>(`[data-boat="${boat.id}"]`);
          const sail = el?.querySelector<SVGPathElement>("[data-sail]");
          if (!el || !sail) continue;
          for (let i = 1; i < boat.wp.length; i++) {
            const a = boat.wp[i - 1];
            const b = boat.wp[i];
            tl.to(
              el,
              { x: b.x, y: b.y, rotation: b.r, duration: b.t - a.t },
              a.t,
            );
            if (b.sail !== undefined && b.sail !== (a.sail ?? undefined)) {
              tl.to(
                sail,
                { attr: { transform: `rotate(${b.sail})` }, duration: 0.15 },
                b.t - 0.1,
              );
            }
          }
        }

        // Captions: one per step. The first is visible by default and only
        // fades out; the rest rise in and out on their step boundaries.
        const captions = gsap.utils.toArray<HTMLElement>("[data-race-caption]");
        captions.forEach((cap, i) => {
          if (i > 0) {
            tl.fromTo(
              cap,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
              i + 0.08,
            );
          }
          if (i < captions.length - 1) {
            tl.to(cap, { opacity: 0, duration: 0.16 }, i + 0.9);
          }
        });

        // 3… 2… 1… over the scene while the fleet lines up.
        gsap.utils
          .toArray<HTMLElement>("[data-race-count]")
          .forEach((el, i) => {
            const at = 1.14 + i * 0.3;
            tl.fromTo(
              el,
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1, duration: 0.11, ease: "power2.out" },
              at,
            ).to(el, { opacity: 0, duration: 0.11 }, at + 0.16);
          });

        // Step progress segments along the bottom.
        gsap.utils
          .toArray<HTMLElement>("[data-race-fill]")
          .forEach((fill, i) => {
            tl.fromTo(
              fill,
              { scaleX: 0 },
              { scaleX: 1, duration: i === 5 ? 0.96 : 1 },
              i,
            );
          });
      }, section);
    };

    build();

    // The camera boxes are fitted to the viewport aspect, so a real resize
    // (not a phone URL-bar collapse) needs a rebuild.
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    let timer: number | undefined;
    const onResize = () => {
      if (
        Math.abs(window.innerWidth - lastW) < 2 &&
        Math.abs(window.innerHeight - lastH) < 140
      ) {
        return;
      }
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
      ctx?.revert();
    };
  }, [reduced]);

  const header = (
    <>
      <p className="font-mono text-xs uppercase tracking-[.18em] text-red-bright">
        {race.eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-sail">
        {race.title}
      </h2>
    </>
  );

  if (reduced) {
    // Reduced motion: the same six beats as a calm vertical sequence.
    return (
      <section className="bg-teal-950 text-sail">
        <div className="wrap py-16">
          {header}
          <div className="mt-10 space-y-12">
            {race.steps.map((step, i) => {
              // Each static frame shows the world as it stands at the END of
              // its step (integer keyframes only — skip the easing ones).
              // The overview beats get a 4:3 box so the whole course
              // survives this crop.
              const box =
                i === 0 || i === 5
                  ? { cx: 500, cy: 575, w: 1680, h: 1260 }
                  : CAMERA.find((k) => k.t === i + 1)!;
              return (
                <figure key={step.kicker}>
                  <div className="overflow-hidden rounded-lg border border-line">
                    <svg
                      viewBox={`${box.cx - box.w / 2} ${box.cy - box.h / 2} ${box.w} ${box.h}`}
                      preserveAspectRatio="xMidYMid slice"
                      className="block aspect-[4/3] w-full"
                      role="img"
                      aria-label={step.caption}
                    >
                      <RaceWorld at={i + 1} />
                    </svg>
                  </div>
                  <figcaption className="mt-3">
                    <span className="font-mono text-xs uppercase tracking-[.14em] text-red-bright">
                      {step.kicker}
                    </span>
                    <p className="mt-1 max-w-[640px] font-mono text-[15px] leading-relaxed">
                      {step.caption}
                    </p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-teal-950 text-sail">
      <div ref={trackRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <svg
            ref={svgRef}
            viewBox="-75 -55 1150 1400"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <RaceWorld at={0} />
          </svg>

          {/* Legibility scrims for the header and captions. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-950/70 via-transparent to-teal-950/75"
          />

          <div className="wrap pointer-events-none absolute inset-x-0 top-0 z-10 pt-24">
            {header}
          </div>

          {/* 3… 2… 1… start ticks. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            {["3", "2", "1"].map((n) => (
              <span
                key={n}
                data-race-count
                className="absolute font-display text-[clamp(120px,30vw,320px)] font-black text-sail opacity-0"
              >
                {n}
              </span>
            ))}
          </div>

          {/* One monospace caption per step. */}
          <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-[74px]">
            <div className="relative min-h-[110px] md:min-h-[92px]">
              {race.steps.map((step, i) => (
                <div
                  key={step.kicker}
                  data-race-caption
                  className="absolute bottom-0 left-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <span className="font-mono text-xs uppercase tracking-[.14em] text-red-bright">
                    {step.kicker}
                  </span>
                  <p className="mt-2 max-w-[640px] font-mono text-[15px] leading-relaxed text-sail md:text-[17px]">
                    {step.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step progress along the bottom. */}
          <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 z-10 flex gap-2 pb-10">
            {race.steps.map((step) => (
              <span
                key={step.kicker}
                className="h-[3px] w-8 overflow-hidden rounded-full bg-white/25"
              >
                <span
                  data-race-fill
                  className="block h-full w-full origin-left scale-x-0 bg-red-bright"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```
