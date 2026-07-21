"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { EASE_GLIDE, DURATION, onEnterViewport } from "@/lib/motion";

/**
 * Fades and glides its children up once they scroll into view.
 * The hidden starting state is applied via `motion-safe:` CSS classes, so
 * under prefers-reduced-motion the content simply renders in place and the
 * tween never runs. Triggered by IntersectionObserver (see lib/motion.ts).
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    return onEnterViewport(el, () => {
      // No clearProps here: the inline end-state must keep overriding the
      // motion-safe hidden classes, or the content re-hides after the tween.
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: EASE_GLIDE,
      });
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} motion-safe:translate-y-6 motion-safe:opacity-0`}
    >
      {children}
    </div>
  );
}
