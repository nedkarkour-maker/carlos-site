"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASE_GLIDE, onEnterViewport } from "@/lib/motion";

// ViewBox geometry — the ring scales with its rendered box.
const SIZE = 200;
const STROKE = 30;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
// Breathing room between segments, in viewBox units (≈px at render size) —
// the "2px surface gap" that keeps adjacent fills readable.
const GAP = 2.5;

/**
 * The "where your support goes" ring, as plain inline SVG — one stroked
 * circle per segment, sized by `percent`. Purely decorative to assistive
 * tech: every number it shows is written out in the legend next to it.
 *
 * On first scroll into view each segment sweeps in clockwise, staggered;
 * under prefers-reduced-motion (or without JS) the ring renders complete.
 */
export default function BudgetDonut({
  slices,
  colors,
  className = "",
}: {
  slices: { label: string; percent: number }[];
  /** One fill per slice, in order (see the ramp in Budget.tsx). */
  colors: string[];
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    return onEnterViewport(el, () => {
      el.querySelectorAll<SVGCircleElement>("[data-segment]").forEach(
        (seg, i) => {
          const visible = Number(seg.dataset.visible);
          gsap.fromTo(
            seg,
            { attr: { "stroke-dasharray": `0 ${CIRCUMFERENCE}` } },
            {
              attr: {
                "stroke-dasharray": `${visible} ${CIRCUMFERENCE - visible}`,
              },
              duration: 1.1,
              delay: i * 0.12,
              ease: EASE_GLIDE,
            },
          );
        },
      );
    });
  }, []);

  // Proportional to the sum, so the ring stays honest even if the
  // percentages drift from an even 100 while being edited.
  const total = slices.reduce((sum, s) => sum + Math.max(0, s.percent), 0);
  const segments: { label: string; color: string; visible: number; offset: number }[] = [];
  let start = 0;
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    if (slice.percent <= 0 || total <= 0) continue;
    const length = (slice.percent / total) * CIRCUMFERENCE;
    segments.push({
      label: slice.label,
      color: colors[i % colors.length],
      visible: Math.max(length - GAP, 0.5),
      offset: -(start + GAP / 2),
    });
    start += length;
  }

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`-rotate-90 ${className}`}
      aria-hidden
    >
      {segments.map((seg) => (
        <circle
          key={seg.label}
          data-segment
          data-visible={seg.visible}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={seg.color}
          strokeWidth={STROKE}
          strokeDasharray={`${seg.visible} ${CIRCUMFERENCE - seg.visible}`}
          strokeDashoffset={seg.offset}
        />
      ))}
    </svg>
  );
}
