"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_GLIDE, DURATION } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades and glides its children up once they scroll into view.
 * The hidden starting state is applied via `motion-safe:` CSS classes, so
 * under prefers-reduced-motion the content simply renders in place and the
 * GSAP tween never runs.
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

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: DURATION,
      ease: EASE_GLIDE,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      clearProps: "opacity,transform",
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
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
