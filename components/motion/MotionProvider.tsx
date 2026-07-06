"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide motion runtime:
 * - Lenis smooth scrolling, kept in sync with GSAP ScrollTrigger.
 * - Disabled entirely under prefers-reduced-motion (native scroll instead).
 *
 * Mounted once in app/layout.tsx; renders nothing.
 */
export default function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Gentle glide — a touch longer than default so scrolling feels like
      // carrying momentum through the water.
      lerp: 0.11,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
