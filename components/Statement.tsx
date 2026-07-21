"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { statement } from "@/config/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Full-viewport statement: the lines sit dim on dark teal and light up word
 * by word as you scroll through the pinned section — the classic product-
 * launch beat between the opening image and the story.
 *
 * Under prefers-reduced-motion (or without JS) the text simply renders at
 * full strength with no pinning.
 */
export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", section);
      gsap.set(words, { opacity: 0.16 });
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-screen items-center bg-teal-950 text-sail"
    >
      <div className="wrap py-24">
        {statement.lines.map((line, i) => (
          <p
            key={i}
            className={`max-w-[900px] font-display text-[clamp(30px,5.2vw,64px)] font-extrabold leading-[1.14] tracking-[-0.02em] ${
              i > 0 ? "mt-5" : ""
            } ${i === statement.lines.length - 1 ? "text-red-bright" : ""}`}
          >
            {/* Only opacity animates, so plain inline spans keep natural
                spaces and line wrapping. */}
            {line.split(" ").map((word, j) => (
              <span key={j}>
                <span data-word>{word}</span>{" "}
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
