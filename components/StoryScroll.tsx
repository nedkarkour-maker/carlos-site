"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { story } from "@/config/content";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The centerpiece: a full-viewport pinned section that plays through the
 * story frames (config/content.ts → story) as the visitor scrolls. Each
 * frame cross-fades in with a slow push-in; its caption rises with it.
 *
 * Under prefers-reduced-motion it renders as a simple vertical sequence of
 * photos with captions — no pinning, no scroll hijacking.
 */
export default function StoryScroll() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>("[data-story-frame]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // ~90vh of scroll per frame transition keeps the pace unhurried.
          end: () => `+=${(frames.length - 1) * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      frames.forEach((frame, i) => {
        const photo = frame.querySelector("[data-story-photo]");
        const caption = frame.querySelector("[data-story-caption]");

        // Every frame slowly pushes in while it is on screen.
        tl.fromTo(
          photo,
          { scale: i === 0 ? 1 : 1.06 },
          { scale: i === 0 ? 1.06 : 1.12, duration: 1 },
          i,
        );
        if (i > 0) {
          tl.fromTo(frame, { opacity: 0 }, { opacity: 1, duration: 0.45 }, i - 0.45);
        }
        tl.fromTo(
          caption,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          i === 0 ? 0.02 : i - 0.25,
        );
        // Caption drifts out before the next frame takes over.
        if (i < frames.length - 1) {
          tl.to(caption, { opacity: 0, y: -18, duration: 0.2 }, i + 0.5);
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const header = (
    <div className="wrap pointer-events-none absolute inset-x-0 top-0 z-20 pt-14">
      <p className="font-mono text-xs uppercase tracking-[.18em] text-red-bright">
        {story.eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-sail">
        {story.title}
      </h2>
    </div>
  );

  if (reduced) {
    // Reduced-motion fallback: the same story as a calm vertical sequence.
    return (
      <section className="bg-teal-950 text-sail">
        <div className="wrap py-16">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-red-bright">
            {story.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {story.title}
          </h2>
          <div className="mt-10 space-y-10">
            {story.frames.map((frame) => (
              <figure key={frame.src}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes="(max-width: 1180px) 100vw, 1180px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="font-mono text-xs uppercase tracking-[.14em] text-red-bright">
                    {frame.kicker}
                  </span>
                  <p className="mt-1 font-display text-lg font-semibold">
                    {frame.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-teal-950 text-sail"
    >
      {header}
      {story.frames.map((frame, i) => (
        <div
          key={frame.src}
          data-story-frame
          className="absolute inset-0"
          style={{ zIndex: i, opacity: i === 0 ? 1 : 0 }}
        >
          <div data-story-photo className="absolute inset-0 will-change-transform">
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              sizes="100vw"
              className="object-cover"
              loading={i === 0 ? undefined : "lazy"}
            />
          </div>
          {/* Legibility scrim for the caption + header. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-teal-950/70 via-transparent to-teal-950/80"
          />
          <div
            data-story-caption
            className="wrap absolute inset-x-0 bottom-0 z-10 pb-16"
          >
            <span className="font-mono text-xs uppercase tracking-[.14em] text-red-bright">
              {frame.kicker}
            </span>
            <p className="mt-2 max-w-[560px] font-display text-[clamp(22px,3.4vw,38px)] font-extrabold leading-[1.12] tracking-[-0.01em]">
              {frame.caption}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
