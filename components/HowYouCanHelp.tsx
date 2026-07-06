import Link from "next/link";
import { help } from "@/config/content";
import Reveal from "./Reveal";

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
              ) : (
                <Link href={card.cta.href} className={ctaClass}>
                  {card.cta.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-[46px] flex flex-wrap items-center gap-9 rounded-[10px] bg-teal-800 px-[30px] py-7 text-sail">
          <div className="whitespace-nowrap font-mono text-[34px] font-semibold leading-tight text-red-bright">
            {help.budget.amount}
            <span className="mt-1 block font-sans text-[13px] font-normal text-sail/60">
              {help.budget.note}
            </span>
          </div>
          <div className="flex flex-wrap gap-[26px] font-mono text-[13px]">
            {help.budget.breakdown.map((item) => (
              <div key={item.label} className="uppercase text-sail/60">
                {item.label}
                <span className="mt-[3px] block text-xl normal-case text-sail">
                  {item.share}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
