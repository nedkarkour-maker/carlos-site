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
      // Slightly snappier than default so scrolling never feels like wading.
      lerp: 0.14,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);

    // Pinned sections and large photos change the page height as they load;
    // recompute trigger positions once everything has settled.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
