"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { subscribe } from "@/config/content";
import { WindLines } from "./art/Backdrops";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

export default function Subscribe({
  windSrc = null,
}: {
  /** Generated wind-flow art (passed from the page); SVG fallback if null. */
  windSrc?: string | null;
}) {
  const [email, setEmail] = useState("");
  // Honeypot — people never see the field, so a value marks a bot.
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // Second bot signal: humans don't submit within 3 s of the page mounting.
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current ??= Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "loading" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          elapsedMs: Date.now() - (mountedAt.current ?? Date.now()),
        }),
      });
      if (res.ok) {
        setStatus({ state: "success" });
        setEmail("");
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      const message =
        data && typeof data === "object" && "error" in data && typeof data.error === "string"
          ? data.error
          : subscribe.errorFallback;
      setStatus({ state: "error", message });
    } catch {
      setStatus({ state: "error", message: subscribe.errorFallback });
    }
  }

  return (
    <section
      id="subscribe"
      className="relative scroll-mt-20 overflow-hidden bg-teal-800 text-sail"
    >
      {windSrc ? (
        <Image
          src={windSrc}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
      ) : (
        <WindLines className="absolute inset-0 h-full w-full" />
      )}
      {/* The visual anchor of the lower page: one oversized headline, one
          field, one button — nothing else competes. */}
      <div className="wrap relative py-[90px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-sail/60">
          {subscribe.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(40px,7.5vw,104px)] font-black uppercase leading-[0.98] tracking-[-0.02em] text-red-bright">
          {subscribe.title}
        </h2>
        <p className="mt-5 max-w-[480px] text-[15px] opacity-90">
          {subscribe.body}
        </p>

        {status.state === "success" ? (
          <p className="mt-8 font-mono text-base font-semibold" role="status">
            {subscribe.success}
          </p>
        ) : (
          <form
            className="mt-8 flex max-w-[560px] flex-wrap items-start gap-2.5"
            onSubmit={onSubmit}
          >
            {/* Honeypot: parked off-screen, out of the tab order and hidden
                from assistive tech. Form-filler bots fill it anyway. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="absolute -left-[9999px] h-px w-px"
            />
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={subscribe.placeholder}
              disabled={status.state === "loading"}
              className="min-w-[240px] flex-1 rounded-[3px] bg-white px-3.5 py-[13px] font-mono text-sm text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-red-bright disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={status.state === "loading"}
              className="rounded-[2px] bg-red px-[22px] py-[13px] text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {status.state === "loading" ? subscribe.buttonBusy : subscribe.button}
            </button>
            {status.state === "error" && (
              <p className="w-full font-mono text-xs" role="alert">
                {status.message}
              </p>
            )}
          </form>
        )}

        <Link
          href={subscribe.archive.href}
          className="mt-7 inline-block font-mono text-[13px] text-sail/70 transition-colors hover:text-sail"
        >
          {subscribe.archive.label}
        </Link>
      </div>
    </section>
  );
}
