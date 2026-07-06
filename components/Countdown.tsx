"use client";

import { useEffect, useState } from "react";

/**
 * Live day countdown to the target date (LA 2028). Computed on the client
 * after mount — the server renders an em dash — so there is no hydration
 * mismatch across timezones.
 */
export default function Countdown({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const targetMs = new Date(target).getTime();
    const compute = () =>
      setDays(Math.max(0, Math.ceil((targetMs - Date.now()) / 86_400_000)));
    compute();
    const id = setInterval(compute, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div>
      <div className="font-mono text-3xl font-semibold">
        {days === null ? "—" : `T–${days.toLocaleString("en-US")}`}
      </div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[.14em] text-sail/65">
        {label}
      </div>
    </div>
  );
}
