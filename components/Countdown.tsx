"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { EASE_GLIDE } from "@/lib/motion";

const DIGITS = "0123456789";

/** One rolling column: a stack of 0–9 that slides to show the target digit. */
function RollingDigit({ digit, delay }: { digit: number; delay: number }) {
  const colRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const col = colRef.current;
    if (!col) return;
    gsap.fromTo(
      col,
      { yPercent: 0 },
      { yPercent: -digit * 10, duration: 1.4, delay, ease: EASE_GLIDE },
    );
  }, [digit, delay]);

  return (
    <span className="inline-block h-[1em] overflow-hidden align-baseline">
      <span ref={colRef} className="flex flex-col leading-none">
        {DIGITS.split("").map((d) => (
          <span key={d} className="h-[1em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Live day countdown to the target date (LA 2028). Computed on the client
 * after mount — the server renders an em dash — so there is no hydration
 * mismatch across timezones. Digits roll into place like a race clock;
 * under prefers-reduced-motion they render as plain text.
 */
export default function Countdown({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  const [days, setDays] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const targetMs = new Date(target).getTime();
    const compute = () =>
      setDays(Math.max(0, Math.ceil((targetMs - Date.now()) / 86_400_000)));
    compute();
    const id = setInterval(compute, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [target]);

  const text = days === null ? null : days.toLocaleString("en-US");

  return (
    <div>
      <div className="font-mono text-3xl font-semibold">
        {text === null ? (
          "—"
        ) : reduced ? (
          `T–${text}`
        ) : (
          <span className="whitespace-nowrap">
            T–
            {text.split("").map((ch, i) =>
              /\d/.test(ch) ? (
                <RollingDigit
                  key={`${i}-${ch}`}
                  digit={Number(ch)}
                  delay={0.9 + i * 0.12}
                />
              ) : (
                <span key={`${i}-${ch}`}>{ch}</span>
              ),
            )}
          </span>
        )}
      </div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[.14em] text-sail/65">
        {label}
      </div>
    </div>
  );
}
