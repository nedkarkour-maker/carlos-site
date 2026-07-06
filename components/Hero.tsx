import Image from "next/image";
import Link from "next/link";
import { hero, site } from "@/config/content";
import Countdown from "./Countdown";

export default function Hero() {
  return (
    <section className="relative flex min-h-[94vh] items-center overflow-hidden bg-teal-900 text-sail">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_35%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-teal-900/60 via-teal-900/40 to-teal-900/90"
      />
      {/* Darkens the text column so copy stays readable over the white sail. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-900/30 to-transparent"
      />

      <div className="wrap relative w-full py-28">
        <p className="mb-[22px] font-mono text-[13px] uppercase tracking-[.2em] text-red-bright">
          {hero.kicker}
        </p>
        <h1 className="font-display text-[clamp(46px,9vw,124px)] font-black uppercase leading-[1.03] tracking-[-0.02em]">
          {hero.nameLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-[680px] font-display text-[clamp(19px,2.6vw,30px)] font-semibold leading-[1.2] tracking-[-0.01em]">
          {hero.thesis.before}
          <b className="text-red-bright">{hero.thesis.highlight}</b>
          {hero.thesis.after}
        </p>

        <div className="mt-[34px] flex flex-wrap gap-3">
          <Link
            href={hero.primaryCta.href}
            className="inline-block rounded-[2px] bg-red px-[18px] py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-red-bright"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="inline-block rounded-[2px] border border-line px-[18px] py-2.5 text-sm font-semibold text-sail transition hover:-translate-y-px hover:bg-white/10"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>

        <div className="mt-[46px] flex flex-wrap items-end gap-[30px]">
          <div className="inline-flex flex-col items-center rounded border-[1.5px] border-sail bg-teal-950/40 px-3 py-[7px] font-mono font-semibold leading-tight">
            <span className="text-xs tracking-[.2em] text-red-bright">
              {site.country}
            </span>
            <span className="text-[22px] tracking-[.12em]">
              {site.sailNumber}
            </span>
          </div>
          <Countdown
            target={hero.countdown.target}
            label={hero.countdown.label}
          />
        </div>
      </div>
    </section>
  );
}
