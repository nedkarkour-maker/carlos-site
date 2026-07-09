"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { onEnterViewport, usePrefersReducedMotion } from "@/lib/motion";

// SVG geometry — all in viewBox units, so the wheel scales with its box.
const SIZE = 220;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * Circular countdown to LA 2028. The red ring shows how much of the road
 * from `start` (this quad's first day) to `target` (opening ceremony) is
 * already behind; the number is days remaining. Both are computed on the
 * client after mount — the server renders the empty ring and "T–0" — so
 * there is no hydration mismatch across timezones.
 *
 * First time the wheel scrolls into view the ring sweeps from zero and the
 * number counts up (~1.5s, once). Under prefers-reduced-motion both render
 * directly in their final state.
 */
export default function Countdown({
  start,
  target,
  label,
}: {
  start: string;
  target: string;
  label: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Real values (recomputed hourly) …
  const [days, setDays] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  // … and what's actually rendered, which lags behind during the sweep.
  const [shownDays, setShownDays] = useState(0);
  const [shownProgress, setShownProgress] = useState(0);
  const swept = useRef(false);

  useEffect(() => {
    const startMs = new Date(start).getTime();
    const targetMs = new Date(target).getTime();
    const compute = () => {
      setDays(Math.max(0, Math.ceil((targetMs - Date.now()) / 86_400_000)));
      setProgress(
        Math.min(1, Math.max(0, (Date.now() - startMs) / (targetMs - startMs))),
      );
    };
    compute();
    const id = setInterval(compute, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [start, target]);

  useEffect(() => {
    if (days === null) return;

    // Already swept (or never will): track the real values directly.
    if (swept.current || reduced) {
      swept.current = true;
      setShownDays(days);
      setShownProgress(progress);
      return;
    }

    const el = rootRef.current;
    if (!el) return;
    let tween: gsap.core.Tween | null = null;
    const disconnect = onEnterViewport(el, () => {
      swept.current = true;
      const proxy = { d: 0, p: 0 };
      tween = gsap.to(proxy, {
        d: days,
        p: progress,
        duration: 1.5,
        delay: 0.5, // let the hero's entrance land first
        ease: "power2.out",
        onUpdate: () => {
          setShownDays(Math.round(proxy.d));
          setShownProgress(proxy.p);
        },
      });
    });
    return () => {
      disconnect();
      tween?.kill();
    };
  }, [days, progress, reduced]);

  return (
    <div
      ref={rootRef}
      className="relative h-[190px] w-[190px] select-none md:h-[230px] md:w-[230px]"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full -rotate-90"
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--sail)"
          strokeOpacity={0.15}
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--red-bright)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - shownProgress)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[40px] font-semibold leading-none md:text-[46px]">
          T–{shownDays.toLocaleString("en-US")}
        </span>
        <span className="mt-2 px-6 text-center font-mono text-[10px] uppercase tracking-[.18em] text-sail/65 md:text-[11px]">
          {label}
        </span>
      </div>
    </div>
  );
}
