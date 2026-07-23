"use client";

import Image from "next/image";
import Link from "next/link";
import { subscribe } from "@/config/content";
import { WindLines } from "./art/Backdrops";
import SubscribeDialog, { openSubscribeDialog } from "./SubscribeDialog";

export default function Subscribe({
  windSrc = null,
}: {
  /** Generated wind-flow art (passed from the page); SVG fallback if null. */
  windSrc?: string | null;
}) {
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
          huge red button — the email form itself lives in the shared dialog
          (components/SubscribeDialog.tsx), which mounts here. */}
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
          onClick={() => openSubscribeDialog()}
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

      <SubscribeDialog />
    </section>
  );
}
