"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and slides its children up once they scroll into view.
 * Under prefers-reduced-motion the content renders immediately with no motion
 * (the hidden state and transition only apply via `motion-safe:`).
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out ${
        inView ? "" : "motion-safe:translate-y-6 motion-safe:opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
