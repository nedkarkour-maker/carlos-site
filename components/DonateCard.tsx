"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { site } from "@/config/content";
import { useContent } from "@/lib/locale";

/**
 * The monthly-support card beside the budget chart. Preset amounts and all
 * copy live in `budget.donate` in config/content.ts; adding a tier is a
 * data-only edit there.
 *
 * Giving runs through Donorbox's popup widget (site.donorboxCampaign). The
 * widget's own blue button never shows: its <dbox-widget> host is collapsed
 * to a zero-size box and the internal button is hidden with a style injected
 * into its (open) shadow root. Our buttons open the dialog by clicking that
 * hidden internal button — the widget forwards a numeric `amount` attribute
 * from the host into the inner donation form, which is how each trigger
 * pre-fills its amount (verified against widgets.js + popup_form.js, and
 * empirically in scripts/dbox-probe runs, Aug 2026). If the widget script
 * hasn't loaded when a button is clicked, we fall back to opening the
 * hosted campaign page in a new tab with the same ?amount.
 */

// TS doesn't know Donorbox's custom element. React 19 keeps its JSX types
// under a namespace, so augmenting them needs one too.
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "dbox-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        campaign: string;
        type: string;
      };
    }
  }
}

const AMOUNT_BOX =
  "flex h-12 items-center justify-center rounded-[6px] border font-mono text-[15px] transition-colors";

export default function DonateCard() {
  const { budget } = useContent();
  const donate = budget.donate;

  const [preset, setPreset] = useState(donate.presets[0]?.amount ?? 0);
  const [custom, setCustom] = useState("");
  const widgetRef = useRef<HTMLElement>(null);

  // A typed custom amount wins over the highlighted preset.
  const customAmount = Number.parseInt(custom, 10);
  const amount = custom && customAmount > 0 ? customAmount : preset;

  // Once the campaign form is in the widget's shadow root, hide its own
  // Donate button — ours are the only visible UI. The shadow root is open,
  // and appended nodes survive the widget's own DOM work.
  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;
    const hideInternalButton = () => {
      const shadow = el.shadowRoot;
      if (!shadow || shadow.querySelector("[data-hide-donate]")) return;
      const style = document.createElement("style");
      style.setAttribute("data-hide-donate", "");
      style.textContent = "#donate_button{display:none!important}";
      shadow.appendChild(style);
    };
    hideInternalButton(); // already loaded (e.g. locale switch remount)
    el.addEventListener("dbox:campaign-loaded", hideInternalButton);
    return () =>
      el.removeEventListener("dbox:campaign-loaded", hideInternalButton);
  }, []);

  /**
   * Open the Donorbox popup pre-filled with `amt`, by clicking the widget's
   * hidden internal button. Before the widget is ready, open the hosted
   * campaign page instead so a click never does nothing.
   */
  const openDonorbox = (amt: number) => {
    const el = widgetRef.current;
    const internalButton =
      el?.shadowRoot?.querySelector<HTMLElement>("#donate_button");
    if (el && internalButton) {
      if (amt > 0) el.setAttribute("amount", String(amt));
      internalButton.click();
    } else {
      window.open(
        `https://donorbox.org/${site.donorboxCampaign}${amt > 0 ? `?amount=${amt}` : ""}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <div className="flex flex-col rounded-[10px] bg-teal-800 px-[30px] py-8 text-sail">
      <Script src="https://donorbox.org/widgets.js" type="module" strategy="lazyOnload" />
      {/* Hidden host: the popup dialog lives in this element's shadow root,
          so it must stay rendered — collapsed to nothing instead of
          display:none, which would also swallow the dialog. The inline
          styles also stop the widget's own 320px min-width defaults. */}
      <dbox-widget
        ref={widgetRef}
        campaign={site.donorboxCampaign}
        type="popup"
        aria-hidden
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          minWidth: 0,
          minInlineSize: 0,
          overflow: "hidden",
        }}
      />

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
                openDonorbox(tier.amount);
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && amount > 0) openDonorbox(amount);
            }}
            placeholder={donate.customPlaceholder}
            aria-label={donate.customPlaceholder}
            className="w-full min-w-0 bg-transparent font-mono text-[15px] placeholder:text-[12px] placeholder:text-sail/45 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-auto">
        <button
          type="button"
          onClick={() => openDonorbox(amount)}
          className="mt-5 block w-full rounded-[2px] bg-red px-[18px] py-2.5 text-center text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright"
        >
          {donate.ctaLabel} · ${amount}
          {donate.perMonth}
        </button>
      </div>
    </div>
  );
}
