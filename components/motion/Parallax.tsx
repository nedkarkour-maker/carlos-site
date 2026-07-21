"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Subtle scroll parallax for a framed photo: the child layer is slightly
 * oversized and drifts vertically as the frame crosses the viewport.
 * Transform-only, scrubbed, inert under prefers-reduced-motion.
 */
export default function Parallax({
  children,
  className = "",
  amount = 6,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max drift in percent of the frame height. */
  amount?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      layer,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.4,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      {/* Oversized so the drift never exposes the frame edges. */}
      <div ref={layerRef} className="absolute inset-0 scale-[1.14]">
        {children}
      </div>
    </div>
  );
}
