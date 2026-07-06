"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { BudgetItem } from "@/config/content";
import { EASE_GLIDE, onEnterViewport } from "@/lib/motion";
import CountUp from "./CountUp";

/**
 * The season budget: total counts up, each line's bar glides from 0 to its
 * share of the budget when the block scrolls into view. Under
 * prefers-reduced-motion the bars render at full width immediately.
 */
export default function BudgetBars({
  amount,
  note,
  breakdown,
}: {
  amount: string;
  note: string;
  breakdown: BudgetItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    return onEnterViewport(el, () => {
      gsap.fromTo(
        el.querySelectorAll("[data-bar-fill]"),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.3, ease: EASE_GLIDE, stagger: 0.15 },
      );
    });
  }, []);

  return (
    <div
      ref={ref}
      className="mt-[46px] flex flex-wrap items-start gap-x-14 gap-y-8 rounded-[10px] bg-teal-800 px-[30px] py-8 text-sail"
    >
      <div className="whitespace-nowrap font-mono text-[34px] font-semibold leading-tight text-red-bright">
        <CountUp value={amount} duration={1.8} />
        <span className="mt-1 block font-sans text-[13px] font-normal text-sail/60">
          {note}
        </span>
      </div>
      <div className="min-w-[260px] flex-1 space-y-[18px] font-mono text-[13px]">
        {breakdown.map((item) => (
          <div key={item.label}>
            <div className="flex items-baseline justify-between uppercase text-sail/60">
              <span>{item.label}</span>
              <span className="text-base normal-case text-sail">
                {item.share}
              </span>
            </div>
            <div className="mt-[7px] h-[6px] overflow-hidden rounded-full bg-white/10">
              <div
                data-bar-fill
                className="h-full origin-left rounded-full bg-red-bright"
                style={{ width: item.share }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
