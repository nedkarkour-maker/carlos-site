"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { schedule } from "@/config/content";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * The 2026 season. On desktop (motion allowed) the stops travel
 * horizontally as you scroll — a "race course" SVG line draws itself
 * underneath and each stop pops in as it reaches the course. On mobile and
 * under prefers-reduced-motion it falls back to the vertical timeline.
 */
export default function Schedule() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = section.querySelector<HTMLElement>("[data-track]");
        const path = section.querySelector<SVGPathElement>("[data-course]");
        if (!track || !path) return;

        const distance = () => track.scrollWidth - window.innerWidth;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(track, { x: () => -distance() }, 0).to(
          path,
          { strokeDashoffset: 0 },
          0,
        );

        // Each stop pops in as the track carries it toward center.
        gsap.utils.toArray<HTMLElement>("[data-stop]").forEach((stop) => {
          tl.fromTo(
            stop,
            { opacity: 0, y: 40, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out" },
            // Stagger by position along the track.
            (stop.offsetLeft / track.scrollWidth) * 0.85,
          );
        });
      },
    );

    return () => mm.revert();
  }, []);

  const heading = (
    <>
      <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
        {schedule.eyebrow}
      </p>
      <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
        {schedule.title}
      </h2>
    </>
  );

  return (
    <section id="schedule" ref={sectionRef} className="scroll-mt-20">
      {/* ------------------------------------------------ horizontal (md+) */}
      <div className="hidden h-screen flex-col justify-center overflow-hidden py-10 md:motion-safe:flex">
        <div className="wrap w-full">{heading}</div>
        <div data-track className="relative mt-14 flex w-max items-stretch will-change-transform">
          {/* The race-course line, drawn as you scroll. */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-[26px] h-[60px] w-full"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              data-course
              d="M0 45 C 120 10, 220 55, 340 30 S 560 5, 680 35 S 900 55, 1000 20"
              stroke="var(--red)"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="w-[max(calc((100vw-var(--maxw))/2+24px),24px)] shrink-0" />
          {schedule.stops.map((stop) => (
            <article
              data-stop
              key={`${stop.when}-${stop.title}`}
              className={`relative mr-8 w-[340px] shrink-0 rounded-[10px] border bg-white px-7 py-6 pt-[76px] shadow-sm ${
                stop.major ? "border-red/40" : "border-line-dark"
              }`}
            >
              <span
                aria-hidden
                className={`absolute left-7 top-[38px] h-[13px] w-[13px] rounded-full border-2 border-sail bg-red ${
                  stop.major ? "shadow-[0_0_0_5px_rgba(212,46,46,.18)]" : ""
                }`}
              />
              <span className="font-mono text-[13px] tracking-[.04em] text-red-dark">
                {stop.when}
              </span>
              <h3 className="mt-1.5 font-display text-[21px] font-bold leading-tight">
                {stop.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-soft">{stop.where}</p>
              {stop.tag && (
                <span className="mt-3 inline-block rounded-[3px] bg-red px-[7px] py-0.5 font-mono text-[10px] uppercase tracking-[.1em] text-white">
                  {stop.tag}
                </span>
              )}
            </article>
          ))}
          <div className="w-[10vw] shrink-0" />
        </div>
        <div className="wrap mt-12 w-full">
          <p className="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
            Scroll to travel the season →
          </p>
        </div>
      </div>

      {/* --------------------------- vertical (mobile + reduced motion) */}
      <Reveal className="wrap py-[90px] md:motion-safe:hidden">
        {heading}
        <ol className="mt-[46px] border-l-2 border-line-dark pl-7 md:pl-[30px]">
          {schedule.stops.map((stop) => (
            <li
              key={`${stop.when}-${stop.title}`}
              className="relative grid grid-cols-[90px_1fr] gap-3.5 border-b border-line-dark py-5 last:border-b-0 md:grid-cols-[120px_1fr] md:gap-6"
            >
              <span
                aria-hidden
                className={`absolute -left-[35px] top-[26px] h-[11px] w-[11px] rounded-full border-2 border-sail bg-red md:-left-[37px] ${
                  stop.major ? "shadow-[0_0_0_4px_rgba(212,46,46,.2)]" : ""
                }`}
              />
              <span className="pt-0.5 font-mono text-[13px] tracking-[.04em] text-red-dark">
                {stop.when}
              </span>
              <div>
                <h3 className="font-display text-[19px] font-bold">
                  {stop.title}
                </h3>
                <p className="mt-[3px] text-sm text-ink-soft">{stop.where}</p>
                {stop.tag && (
                  <span className="mt-2 inline-block rounded-[3px] bg-red px-[7px] py-0.5 font-mono text-[10px] uppercase tracking-[.1em] text-white">
                    {stop.tag}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Photo strip below the timeline, both layouts. */}
      <Reveal className="wrap pb-[90px]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {schedule.photos.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="origin-top scale-110 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
