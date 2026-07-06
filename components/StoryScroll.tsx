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
      const fills = gsap.utils.toArray<HTMLElement>("[data-story-fill]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // ~90vh of scroll per frame keeps the pace unhurried; the extra
          // half-screen lets the last frame breathe before unpinning.
          end: () =>
            `+=${(frames.length - 0.5) * window.innerHeight * 0.9}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // Story-style progress segments: each fills while its frame is active.
      fills.forEach((fill, i) => {
        tl.fromTo(
          fill,
          { scaleX: 0 },
          { scaleX: 1, duration: i === fills.length - 1 ? 0.5 : 1 },
          i,
        );
      });
      // Dummy tail so the timeline (and pin) extends past the last caption.
      tl.to({}, { duration: 0.01 }, frames.length - 0.5);

      frames.forEach((frame, i) => {
        const photo = frame.querySelector("[data-story-photo]");
        const caption = frame.querySelector("[data-story-caption]");

        if (i > 0) {
          // Incoming frame cross-fades over the previous one with a gentle
          // settle — the only transform in the whole sequence.
          tl.fromTo(
            frame,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            i - 0.5,
          ).fromTo(
            photo,
            { scale: 1.05 },
            { scale: 1, duration: 0.9, ease: "power1.out" },
            i - 0.5,
          );
        }
        tl.fromTo(
          caption,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          i === 0 ? 0.02 : i - 0.25,
        );
        // Caption fades out before the next frame takes over.
        if (i < frames.length - 1) {
          tl.to(caption, { opacity: 0, duration: 0.2 }, i + 0.45);
        }
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const header = (
    <div className="wrap pointer-events-none absolute inset-x-0 top-0 z-20 pt-24">
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
                    style={{ objectPosition: frame.focus ?? "50% 50%" }}
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
          <div data-story-photo className="absolute inset-0">
            <Image
              src={frame.src}
              alt={frame.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: frame.focus ?? "50% 50%" }}
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
            className="wrap absolute inset-x-0 bottom-0 z-10 pb-20"
          >
            <span className="font-mono text-xs uppercase tracking-[.14em] text-red-bright">
              {frame.kicker}
            </span>
            <p className="mt-2 max-w-[680px] font-display text-[clamp(26px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.015em]">
              {frame.caption}
            </p>
          </div>
        </div>
      ))}

      {/* Progress segments — one per frame, filling as the story advances. */}
      <div className="wrap pointer-events-none absolute inset-x-0 bottom-0 z-20 flex gap-2 pb-10">
        {story.frames.map((frame) => (
          <span
            key={frame.src}
            className="h-[3px] w-8 overflow-hidden rounded-full bg-white/25"
          >
            <span
              data-story-fill
              className="block h-full w-full origin-left scale-x-0 bg-red-bright"
            />
          </span>
        ))}
      </div>
    </section>
  );
}
