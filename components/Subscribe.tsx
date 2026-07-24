"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/lib/locale";
import { WindLines } from "./art/Backdrops";
import SubscribeDialog, { openSubscribeDialog } from "./SubscribeDialog";

export default function Subscribe({
  windSrc = null,
}: {
  /** Generated wind-flow art (passed from the page); SVG fallback if null. */
  windSrc?: string | null;
}) {
  const { subscribe } = useContent();
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
          big red circular button — text on the left, button on the right on
          desktop; stacked (button below, centred) on mobile. The email form
          itself lives in the shared dialog (components/SubscribeDialog.tsx),
          which mounts here. */}
      <div className="wrap relative flex flex-col items-start gap-12 py-[90px] lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="w-full lg:flex-1">
          <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-sail/60">
            {subscribe.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(40px,7.5vw,104px)] font-black uppercase leading-[0.98] tracking-[-0.02em] text-red-bright">
            {subscribe.title}
          </h2>
          <p className="mt-5 max-w-[480px] text-[15px] opacity-90">
            {subscribe.body}
          </p>

          <Link
            href={subscribe.archive.href}
            className="mt-7 inline-block font-mono text-[13px] text-sail/70 transition-colors hover:text-sail"
          >
            {subscribe.archive.label}
          </Link>
        </div>

        <div className="flex w-full justify-center lg:mr-8 lg:-mt-5 lg:w-auto lg:shrink-0">
          <button
            type="button"
            onClick={() => openSubscribeDialog()}
            className="flex aspect-square w-[clamp(200px,42vw,260px)] items-center justify-center rounded-full bg-red p-6 text-center font-display text-[clamp(20px,3vw,28px)] font-black uppercase leading-[1.05] tracking-[-0.01em] text-white ring-[6px] ring-inset ring-white/90 shadow-[0_9px_0_var(--red-dark),0_22px_40px_rgba(0,0,0,0.42)] transition duration-100 hover:-translate-y-0.5 hover:bg-red-bright hover:shadow-[0_11px_0_var(--red-dark),0_26px_46px_rgba(0,0,0,0.45)] active:translate-y-[7px] active:shadow-[0_2px_0_var(--red-dark),0_8px_16px_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sail"
          >
            {subscribe.ctaLabel}
          </button>
        </div>
      </div>

      <SubscribeDialog />
    </section>
  );
}
