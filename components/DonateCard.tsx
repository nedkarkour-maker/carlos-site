"use client";

import { useState } from "react";
import { site } from "@/config/content";
import { useContent } from "@/lib/locale";

/**
 * The monthly-support card beside the budget chart. Preset amounts and all
 * copy live in `budget.donate` in config/content.ts; adding a tier is a
 * data-only edit there.
 *
 * Checkout is not wired yet: while site.donateCheckoutUrl is "" the give
 * button renders visibly inactive with a note underneath. Setting that one
 * string turns it into a live link to checkout with the chosen amount —
 * nothing here needs rebuilding.
 */

const AMOUNT_BOX =
  "flex h-12 items-center justify-center rounded-[6px] border font-mono text-[15px] transition-colors";

export default function DonateCard() {
  const { budget } = useContent();
  const donate = budget.donate;

  const [preset, setPreset] = useState(donate.presets[0]?.amount ?? 0);
  const [custom, setCustom] = useState("");

  // A typed custom amount wins over the highlighted preset.
  const customAmount = Number.parseInt(custom, 10);
  const amount = custom && customAmount > 0 ? customAmount : preset;

  const checkoutHref = site.donateCheckoutUrl
    ? `${site.donateCheckoutUrl}?amount=${amount}`
    : null;

  const ctaClass =
    "mt-5 block w-full rounded-[2px] bg-red px-[18px] py-2.5 text-center text-sm font-semibold text-white transition";

  return (
    <div className="flex flex-col rounded-[10px] bg-teal-800 px-[30px] py-8 text-sail">
      <p className="border-b border-line pb-[18px] font-mono text-xs uppercase tracking-[.18em] text-sail/60">
        {donate.heading}
      </p>
      <p className="mt-6 text-[14.5px] leading-relaxed text-sail/80">
        {donate.body}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {donate.presets.map((tier) => {
          const active = !custom && preset === tier.amount;
          return (
            <button
              key={tier.amount}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setPreset(tier.amount);
                setCustom("");
              }}
              className={`${AMOUNT_BOX} ${
                active
                  ? "border-red-bright bg-red/15 font-semibold"
                  : "border-sail/25 text-sail/75 hover:border-sail/55"
              }`}
            >
              ${tier.amount}
              <span className="ml-0.5 text-[11px] text-sail/55">
                {donate.perMonth}
              </span>
            </button>
          );
        })}
        {/* The custom slot completes the 2×2 grid. */}
        <label
          className={`${AMOUNT_BOX} cursor-text gap-1 px-3 ${
            custom ? "border-red-bright bg-red/15" : "border-sail/25"
          }`}
        >
          <span aria-hidden className="text-sail/55">
            $
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
            placeholder={donate.customPlaceholder}
            aria-label={donate.customPlaceholder}
            className="w-full min-w-0 bg-transparent font-mono text-[15px] placeholder:text-[12px] placeholder:text-sail/45 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-auto">
        {checkoutHref ? (
          <a
            href={checkoutHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ctaClass} hover:-translate-y-px hover:bg-red-bright`}
          >
            {donate.ctaLabel} · ${amount}
            {donate.perMonth}
          </a>
        ) : (
          <>
            <button
              type="button"
              disabled
              aria-disabled
              className={`${ctaClass} cursor-not-allowed opacity-60`}
            >
              {donate.ctaLabel} · ${amount}
              {donate.perMonth}
            </button>
            <p className="mt-2.5 text-center font-mono text-[10.5px] text-sail/50">
              {donate.pendingNote}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
