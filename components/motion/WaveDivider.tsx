"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A thin sea-swell divider between sections. Two overlapping wave paths
 * drift slowly in opposite directions (transform-only). `fill` is the color
 * of the section BELOW the divider, drawn over the section above.
 * Static under prefers-reduced-motion.
 */
export default function WaveDivider({
  fill,
  className = "",
}: {
  /** CSS color of the next section, e.g. "var(--sail)" or "var(--teal-900)". */
  fill: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens = [
      gsap.to(el.querySelector("[data-wave-a]"), {
        xPercent: -25,
        duration: 26,
        ease: "none",
        repeat: -1,
        yoyo: true,
      }),
      gsap.to(el.querySelector("[data-wave-b]"), {
        xPercent: 25,
        duration: 34,
        ease: "none",
        repeat: -1,
        yoyo: true,
      }),
    ];
    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`relative -mb-px h-[70px] overflow-hidden ${className}`}
    >
      <svg
        data-wave-a
        className="absolute bottom-0 left-[-50%] h-full w-[200%]"
        viewBox="0 0 1200 70"
        preserveAspectRatio="none"
        style={{ fill, opacity: 0.45 }}
      >
        <path d="M0 42 C 150 18, 300 60, 450 40 S 750 12, 900 38 S 1120 58, 1200 34 L1200 70 L0 70 Z" />
      </svg>
      <svg
        data-wave-b
        className="absolute bottom-0 left-[-50%] h-full w-[200%]"
        viewBox="0 0 1200 70"
        preserveAspectRatio="none"
        style={{ fill }}
      >
        <path d="M0 52 C 200 30, 380 64, 560 48 S 880 24, 1040 50 S 1160 62, 1200 46 L1200 70 L0 70 Z" />
      </svg>
    </div>
  );
}
