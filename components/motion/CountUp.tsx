"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASE_GLIDE, onEnterViewport } from "@/lib/motion";

/**
 * Counts a number up from 0 when it scrolls into view, easing out as it
 * settles. Accepts display strings like "4,000", "≈ €22,000" or "42" —
 * anything around the number (currency signs, separators) is preserved.
 * The final value is server-rendered and only replaced once the animation
 * actually starts, so the number is always visible even without JS.
 * Under prefers-reduced-motion it stays static.
 */
export default function CountUp({
  value,
  delay = 0,
  duration = 1.6,
  className = "",
}: {
  /** The final display string, e.g. "4,000" or "≈ €22,000". */
  value: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const match = value.match(/[\d,]+/);
    if (!match) return;
    const target = Number(match[0].replace(/,/g, ""));
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[0].length);

    return onEnterViewport(el, () => {
      const counter = { n: 0 };
      gsap.to(counter, {
        n: target,
        duration,
        delay,
        ease: EASE_GLIDE,
        onUpdate: () => {
          el.textContent =
            prefix + Math.round(counter.n).toLocaleString("en-US") + suffix;
        },
      });
    });
  }, [value, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
