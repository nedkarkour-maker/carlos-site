import Link from "next/link";
import { help } from "@/config/content";
import EmailLink from "./EmailLink";
import Reveal from "./Reveal";
import { SubscribeDialogTrigger } from "./SubscribeDialog";

const ctaClass =
  "mt-[22px] inline-block rounded-[2px] bg-red px-[18px] py-2.5 text-center text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright";

export default function HowYouCanHelp() {
  return (
    <section id="help" className="scroll-mt-20 py-[90px]">
      <Reveal className="wrap">
        <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
          {help.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {help.title}
        </h2>
        <p className="mt-[18px] max-w-[660px] text-lg text-ink-soft">
          {help.lead}
        </p>

        <div className="mt-[46px] grid gap-[18px] md:grid-cols-3">
          {help.cards.map((card) => (
            <div
              key={card.index}
              className="flex flex-col rounded-[10px] border border-line-dark bg-white px-[26px] py-[30px]"
            >
              <span className="font-mono text-xs tracking-[.1em] text-red-dark">
                {card.index}
              </span>
              <h3 className="my-2.5 font-display text-[22px] font-extrabold">
                {card.title}
              </h3>
              <p className="flex-1 text-[14.5px] text-ink-soft">{card.body}</p>
              {card.bullets && (
                <ul className="mt-3 text-sm text-ink-soft">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="relative mb-[7px] pl-[18px]">
                      <span
                        aria-hidden
                        className="absolute left-0 font-bold text-red"
                      >
                        ‣
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {card.cta.external ? (
                <a
                  href={card.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaClass}
                >
                  {card.cta.label}
                </a>
              ) : card.cta.href === "#subscribe" ? (
                // Opens the shared email dialog directly (falling back to a
                // plain jump to the Subscribe section without JS).
                <SubscribeDialogTrigger className={ctaClass}>
                  {card.cta.label}
                </SubscribeDialogTrigger>
              ) : card.cta.href.startsWith("mailto:") ? (
                // Assembled in JS on click so the address stays out of the
                // HTML that email scrapers harvest; only the subject line
                // is passed down.
                <EmailLink
                  subject={
                    new URL(card.cta.href).searchParams.get("subject") ??
                    undefined
                  }
                  className={ctaClass}
                >
                  {card.cta.label}
                </EmailLink>
              ) : (
                <Link href={card.cta.href} className={ctaClass}>
                  {card.cta.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
