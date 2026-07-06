"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_GLIDE } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counts a number up from 0 when it scrolls into view, easing out as it
 * settles. Accepts display strings like "4,000", "≈ €22,000" or "42" —
 * anything around the number (currency signs, separators) is preserved.
 * Under prefers-reduced-motion the final value renders immediately.
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
    const counter = { n: 0 };
    el.textContent = prefix + "0" + suffix;

    const tween = gsap.to(counter, {
      n: target,
      duration,
      delay,
      ease: EASE_GLIDE,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent =
          prefix + Math.round(counter.n).toLocaleString("en-US") + suffix;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, delay, duration]);

  // Server-renders the final value (good for SEO / no-JS); the tween
  // restarts it from 0 on viewport entry.
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
