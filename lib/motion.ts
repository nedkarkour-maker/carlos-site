"use client";

import { useEffect, useState } from "react";

/**
 * Shared animation vocabulary — one place to tune the site's "feel".
 * Motion language: sailing. Smooth acceleration, long glides, no bounce.
 */
export const EASE_GLIDE = "power2.out"; // default settle
export const EASE_INOUT = "power2.inOut"; // for scrubbed / travelling motion
export const DURATION = 0.9;

/** True when the user asked the OS for reduced motion. SSR-safe (false on server). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
