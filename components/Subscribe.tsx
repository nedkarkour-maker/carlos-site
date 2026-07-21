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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  // Second bot signal: humans don't submit within 3 s of the page mounting.
  // Must stay tied to mount (page load), NOT to the dialog opening — the
  // server checks time-since-page-load, so seeding it on open would let a
  // bot that pops the dialog and submits instantly look human.
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current ??= Date.now();
  }, []);

  function openDialog() {
    dialogRef.current?.showModal();
    // The dialog spec would honor an `autofocus` attribute here, but React
    // doesn't render one — focus the field by hand instead.
    emailRef.current?.focus();
  }

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
      {/* The visual anchor of the lower page: one oversized headline and one
          huge red button — the email form itself lives in a dialog. */}
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

        <button
          type="button"
          onClick={openDialog}
          className="mt-9 block w-full max-w-[620px] rounded-[6px] bg-red px-8 py-[26px] text-center font-display text-[clamp(21px,3.2vw,32px)] font-black uppercase tracking-[-0.01em] text-white shadow-[0_18px_44px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-red-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sail"
        >
          {subscribe.ctaLabel}
        </button>

        <Link
          href={subscribe.archive.href}
          className="mt-7 inline-block font-mono text-[13px] text-sail/70 transition-colors hover:text-sail"
        >
          {subscribe.archive.label}
        </Link>
      </div>

      {/* The email form, in a native modal dialog: focus stays trapped inside,
          ESC closes it, and a press on the dimmed backdrop closes it too. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="subscribe-dialog-title"
        // Mousedown (not click) on the backdrop: the dialog element itself is
        // only the press target when the press starts outside the content box,
        // so dragging out of the email field can't accidentally dismiss it.
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[min(92vw,440px)] rounded-[10px] bg-white p-0 text-ink shadow-2xl backdrop:bg-teal-950/70"
      >
        <div className="relative p-7">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full text-xl leading-none text-ink-soft transition hover:bg-line-dark hover:text-ink"
          >
            ×
          </button>

          <h3
            id="subscribe-dialog-title"
            className="pr-9 font-display text-[22px] font-extrabold leading-tight"
          >
            {subscribe.title}
          </h3>
          <p className="mt-2 text-sm text-ink-soft">{subscribe.body}</p>

          {status.state === "success" ? (
            <p className="mt-6 font-mono text-base font-semibold" role="status">
              {subscribe.success}
            </p>
          ) : (
            <form className="mt-6" onSubmit={onSubmit}>
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
                ref={emailRef}
                id="newsletter-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={subscribe.placeholder}
                disabled={status.state === "loading"}
                className="w-full rounded-[3px] border border-line-dark bg-white px-3.5 py-[13px] font-mono text-sm text-ink placeholder:text-ink-soft focus:outline-2 focus:outline-red-bright disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={status.state === "loading"}
                className="mt-2.5 w-full rounded-[2px] bg-red px-[22px] py-[13px] text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status.state === "loading" ? subscribe.buttonBusy : subscribe.button}
              </button>
              {status.state === "error" && (
                <p className="mt-2.5 font-mono text-xs text-red-dark" role="alert">
                  {status.message}
                </p>
              )}
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
