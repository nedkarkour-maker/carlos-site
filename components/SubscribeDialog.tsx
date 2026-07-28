"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/locale";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success" }
  | { state: "error"; message: string };

/**
 * The one email-signup dialog, shared by every "subscribe" button on the
 * page (the big red button in the Subscribe section and the "Follow the
 * journey" help card). Mounted once — inside Subscribe — and opened from
 * anywhere through `openSubscribeDialog()` / `<SubscribeDialogTrigger>`.
 *
 * A native <dialog> gives the focus trap, ESC-to-close and backdrop
 * dimming for free; a press that *starts* on the backdrop closes it.
 */

// The mounted dialog registers its open function here so triggers rendered
// anywhere else in the tree (even in server components) can call it.
let opener: (() => void) | null = null;

/** Opens the shared dialog. Returns false if it isn't mounted yet. */
export function openSubscribeDialog(): boolean {
  if (!opener) return false;
  opener();
  return true;
}

/**
 * A styled link that opens the dialog. Falls back to a plain anchor jump
 * to the Subscribe section while JS hasn't loaded — nothing dead ships.
 */
export function SubscribeDialogTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#subscribe"
      className={className}
      onClick={(e) => {
        if (openSubscribeDialog()) e.preventDefault();
      }}
    >
      {children}
    </a>
  );
}

export default function SubscribeDialog() {
  const { subscribe } = useContent();
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

  useEffect(() => {
    const open = () => {
      // showModal() throws if the dialog is already open.
      if (dialogRef.current?.open) return;
      dialogRef.current?.showModal();
      // The dialog spec would honor an `autofocus` attribute here, but React
      // doesn't render one — focus the field by hand instead.
      emailRef.current?.focus();
    };
    opener = open;

    // A #subscribe deep link opens the dialog outright instead of only
    // scrolling to the section — the newsletter's "Subscribe" button points
    // here, and a reader who got the issue forwarded shouldn't have to hunt
    // for the Join the crew button before seeing an email field. Runs on
    // mount (arriving with the hash already set) and on later hash changes
    // (an in-page anchor jump, e.g. the no-JS trigger fallback).
    const openOnHash = () => {
      if (window.location.hash === "#subscribe") open();
    };
    openOnHash();
    window.addEventListener("hashchange", openOnHash);

    return () => {
      opener = null;
      window.removeEventListener("hashchange", openOnHash);
    };
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
  );
}
