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
  // Donate button (ours are the only visible UI) and make the dialog's
  // long steps scroll inside it. The shadow root is open, and appended
  // nodes survive the widget's own DOM work.
  useEffect(() => {
    const el = widgetRef.current;
    if (!el) return;
    const patchShadow = () => {
      const shadow = el.shadowRoot;
      if (!shadow || shadow.querySelector("[data-dbox-patch]")) return;
      const style = document.createElement("style");
      style.setAttribute("data-dbox-patch", "");
      style.textContent = [
        "#donate_button{display:none!important}",
        // Keep the dialog inside the viewport and scroll it internally —
        // payment methods on the last step must stay reachable. Donorbox's
        // CSS puts pointer-events:none on the dialog and never re-enables
        // it inside (their non-modal flow routed clicks differently);
        // without the auto override the whole modal form is unclickable.
        // overscroll-behavior stops a scroll that reaches the dialog's top
        // or bottom from chaining onward to the document.
        "#dialog{max-height:100dvh!important;max-width:100vw!important;overflow-y:auto!important;overscroll-behavior:contain!important;pointer-events:auto!important}",
        // The widget's own backdrop div would double up with the native
        // ::backdrop, but it cannot be display:none — Donorbox's CSS ties
        // the dialog's rendering to the backdrop being rendered (verified
        // by bisecting: display:none zeroes the dialog, opacity keeps it).
        // Invisible and click-through is enough; in the modal state it is
        // unreachable anyway.
        "#dialog-backdrop{opacity:0!important;pointer-events:none!important}",
      ].join("\n");
      shadow.appendChild(style);

      // With showModal, a click on the native ::backdrop targets the
      // <dialog> itself; clicks inside the form are stopped by the
      // widget's own handlers before they bubble this far.
      const dialog = shadow.querySelector<HTMLDialogElement>("#dialog");

      // Keeping the page still while the dialog is open is this line plus
      // overscroll-behavior above — deliberately NOT a body scroll lock.
      // Lenis drives the page from its own wheel listener, so it ignores
      // overflow:hidden; and applying overflow:hidden mid-glide surfaces a
      // different underlying offset, jumping the page ~500px when someone
      // clicks an amount during momentum scrolling. This attribute is
      // Lenis's own opt-out: wheel and touch inside the dialog fall through
      // to native scrolling, which scrolls the dialog, and
      // overscroll-behavior stops it chaining onward.
      //
      // Load-bearing, and it rests on an implementation detail: Lenis has
      // to test this attribute against the event's composedPath() for it to
      // be seen at all, because the dialog lives inside a shadow root — a
      // plain target/closest() check would never find it. That behaviour is
      // not part of any documented contract, so re-test the popup's
      // scrolling (steps 2 and 3, desktop and mobile) after any Lenis
      // upgrade: if it stops honouring composedPath, wheeling over the
      // dialog silently scrolls the page behind it again.
      dialog?.setAttribute("data-lenis-prevent", "");
      dialog?.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close();
      });
      // The host is aria-hidden while the dialog is closed (it is visually
      // nothing); un-hide it while the dialog is open so the form is
      // exposed to assistive tech, and restore on close.
      // `close` fires however the dialog was dismissed — Escape, the X, a
      // backdrop click, or a programmatic close — so it is the one place
      // that reliably restores the host's closed-state aria-hidden.
      dialog?.addEventListener("close", () => {
        el.setAttribute("aria-hidden", "true");
      });
    };
    patchShadow(); // already loaded (e.g. locale switch remount)
    el.addEventListener("dbox:campaign-loaded", patchShadow);
    return () => el.removeEventListener("dbox:campaign-loaded", patchShadow);
  }, []);

  /**
   * Open the Donorbox popup pre-filled with `amt`. showModal(), not the
   * widget's own show(): the modal top layer takes the dialog out of
   * document flow (no page reflow between form steps), anchors it to the
   * viewport, and stacks it above everything on the site. The backdrop's
   * `visible` class must be set alongside — Donorbox's CSS renders the
   * dialog's content off that class, not off [open] (their close handler
   * removes it again on every close). Escape/close-button wiring is
   * theirs and still applies; the native ::backdrop replaces their
   * hidden backdrop div. Before the widget is ready, open the hosted
   * campaign page instead so a click never does nothing.
   */
  const openDonorbox = (amt: number) => {
    const el = widgetRef.current;
    const dialog =
      el?.shadowRoot?.querySelector<HTMLDialogElement>("#dialog");
    if (el && dialog) {
      if (amt > 0) el.setAttribute("amount", String(amt));
      el.removeAttribute("aria-hidden");
      el.shadowRoot
        ?.querySelector("#dialog-backdrop")
        ?.classList.add("visible");
      if (!dialog.open) dialog.showModal();
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
          display:none, which would also swallow the dialog (the modal top
          layer escapes the 0×0 clip; ancestor clipping doesn't apply
          there). aria-hidden is only the closed state — openDonorbox lifts
          it while the dialog is open. The inline styles also stop the
          widget's own 320px min-width defaults. */}
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
