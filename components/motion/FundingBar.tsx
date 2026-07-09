"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASE_GLIDE, onEnterViewport } from "@/lib/motion";

/**
 * Amount raised vs. the season goal, as a single horizontal bar. The
 * numbers come from data/funding.json — edit `raised` there and this
 * updates itself. The fill glides to its width once, on scroll into view;
 * under prefers-reduced-motion it renders at full width immediately.
 */
export default function FundingBar({
  goal,
  raised,
  currency,
}: {
  goal: number;
  raised: number;
  currency: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fraction = goal > 0 ? Math.min(1, Math.max(0, raised / goal)) : 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    return onEnterViewport(el, () => {
      gsap.fromTo(
        el.querySelectorAll("[data-funding-fill]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.3, ease: EASE_GLIDE },
      );
    });
  }, []);

  const money = new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return (
    <div ref={ref} className="mt-6">
      <p className="font-mono text-[13px] text-ink-soft">
        <span className="font-semibold text-red-dark">
          {money.format(raised)}
        </span>{" "}
        raised of {money.format(goal)} ({Math.round(fraction * 100)}%)
      </p>
      <div className="mt-[7px] h-[10px] overflow-hidden rounded-full bg-ink/10">
        <div
          data-funding-fill
          className="h-full origin-left rounded-full bg-red"
          style={{ width: `${fraction * 100}%` }}
        />
      </div>
    </div>
  );
}
