import { budget } from "@/config/content";
import funding from "@/data/funding.json";
import Reveal from "./Reveal";
import BudgetDonut from "./motion/BudgetDonut";

/**
 * The season budget: headline + stat columns on the left, the "where your
 * support goes" ring chart on the right. Percentages and amounts live in
 * `budget` in config/content.ts; the yearly total under the chart reads
 * data/funding.json (see data/README.md).
 */

// Segment fills, matching breakdown order (largest first) — a calm
// monochrome ramp from sail down toward the card's teal. Checked for
// colour-vision separation against the teal-800 card; the smallest,
// darkest slice leans on the fully-labelled legend beside it.
const RAMP = ["#F6F3EC", "#BFB9A9", "#878983", "#4E5B5E"];

// "$55k CAD/yr" — derived from the funding goal so the two never drift.
function totalLine() {
  return `$${Math.round(funding.goal / 1000)}k ${funding.currency}/yr`;
}

export default function Budget() {
  return (
    <section id="budget" className="scroll-mt-20 pb-[90px]">
      <Reveal className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[54px]">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
              {budget.eyebrow}
            </p>
            <h2 className="max-w-[560px] font-display text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              {budget.headline}
            </h2>
            <p className="mt-[18px] max-w-[560px] text-[16px] text-ink-soft">
              {budget.body}
            </p>
            <div className="mt-9 grid max-w-[560px] grid-cols-3 gap-[22px]">
              {budget.stats.map((stat) => (
                <div key={stat.label} className="border-t border-line-dark pt-4">
                  <div className="font-mono text-[clamp(17px,2vw,24px)] font-semibold tracking-[-0.01em]">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-[13px] text-ink-soft">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[10px] bg-teal-800 px-[30px] py-8 text-sail">
            <p className="font-mono text-xs uppercase tracking-[.18em] text-sail/60">
              {budget.chartTitle}
            </p>
            <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:gap-9">
              <BudgetDonut
                slices={budget.breakdown}
                colors={RAMP}
                className="w-[170px] shrink-0 md:w-[190px]"
              />
              <ul className="w-full space-y-[14px]">
                {budget.breakdown.map((slice, i) => (
                  <li key={slice.label} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: RAMP[i % RAMP.length] }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold">
                          {slice.label}
                        </span>
                        <span className="whitespace-nowrap font-mono text-[13px] text-sail/80">
                          {slice.percent}% · {slice.amount}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12px] text-sail/55">
                        {slice.sub}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-7 border-t border-line pt-[18px] font-mono text-[13px] text-sail/70">
              <span className="font-semibold text-sail">{totalLine()}</span>{" "}
              —{" "}
              {budget.breakdownUrl ? (
                <a
                  href={budget.breakdownUrl}
                  className="underline underline-offset-2 transition-colors hover:text-sail"
                >
                  {budget.totalNote}
                </a>
              ) : (
                budget.totalNote
              )}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
