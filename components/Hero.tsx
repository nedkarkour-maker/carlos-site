"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/lib/locale";

gsap.registerPlugin(ScrollTrigger);
import Countdown from "./Countdown";

export default function Hero() {
  const { hero } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Reduced motion: the motion-safe: hidden states never apply, so the
    // hero renders fully visible with no Ken Burns — nothing to animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // One slow settle on the photo as the page opens — then it rests.
      gsap.fromTo(
        "[data-hero-photo]",
        { scale: 1.08 },
        { scale: 1, duration: 6, ease: "power2.out", clearProps: "transform" },
      );

      // Entrance: headline lines rise out of their masks, then the kicker,
      // wheel and scroll cue glide in.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // The hidden state is a CSS percent-translate class, which GSAP parses
      // into its pixel `y` component — so `y: 0` (not yPercent) is what
      // actually raises the lines out of the mask.
      tl.to("[data-hero-line]", {
        y: 0,
        duration: 1.1,
        stagger: 0.14,
        delay: 0.15,
      }).to(
        "[data-hero-fade]",
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
        "-=0.7",
      );

      // Exit: as you scroll away, the copy lifts off and the photo recedes —
      // the page hands over to the statement below.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom 25%",
            scrub: 0.4,
          },
        })
        .to("[data-hero-content]", { yPercent: -14, opacity: 0 }, 0)
        .to("[data-hero-dim]", { opacity: 0.65 }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[94vh] items-center overflow-hidden bg-teal-900 text-sail"
    >
      <div data-hero-photo className="absolute inset-0">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: hero.image.focus ?? "50% 50%" }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-teal-900/60 via-teal-900/40 to-teal-900/90"
      />
      {/* Darkens the text column so copy stays readable over the white sail. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-900/30 to-transparent"
      />
      {/* Scroll-driven dim layer — eases the hand-off into the dark statement. */}
      <div
        aria-hidden
        data-hero-dim
        className="absolute inset-0 bg-teal-950 opacity-0"
      />

      {/* Mobile: kicker + name, then the wheel, in DOM order. Desktop (lg):
          the wheel moves to its own right-hand column beside the name. The
          scroll cue at the bottom is the only onward affordance — no CTA
          buttons compete with it. */}
      <div
        data-hero-content
        className="wrap relative grid w-full items-center gap-y-9 py-28 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12"
      >
        <div>
          <p
            data-hero-fade
            // Generous gap under the kicker so the huge name sits well clear of
            // it (and of the navbar wordmark) instead of crowding underneath.
            className="mb-9 font-sans text-[15px] font-semibold uppercase tracking-[.1em] text-red-bright motion-safe:translate-y-4 motion-safe:opacity-0 md:mb-14"
          >
            {hero.kicker}
          </p>
          <h1 className="font-display text-[clamp(46px,9vw,124px)] font-black uppercase leading-[1.03] tracking-[-0.02em]">
            {hero.nameLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span
                  data-hero-line
                  className="block motion-safe:translate-y-[110%]"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <div
          data-hero-fade
          className="justify-self-center motion-safe:translate-y-4 motion-safe:opacity-0 lg:col-start-2 lg:self-center lg:justify-self-end"
        >
          <Countdown
            start={hero.countdown.start}
            target={hero.countdown.target}
            label={hero.countdown.label}
          />
        </div>
      </div>

      {/* Scroll cue — fades in with the entrance, lifts away with the exit. */}
      <div
        aria-hidden
        data-hero-fade
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 motion-safe:opacity-0"
      >
        <span className="font-mono text-[10px] uppercase tracking-[.3em] text-sail/60">
          Scroll
        </span>
        <span className="h-9 w-px bg-gradient-to-b from-sail/70 to-transparent" />
      </div>
    </section>
  );
}
