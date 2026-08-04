"use client";

import { useContent } from "@/lib/locale";
import funding from "@/data/funding.json";
import Reveal from "./Reveal";
import BudgetDonut from "./motion/BudgetDonut";
import DonateCard from "./DonateCard";

/**
 * The season budget: the "where your support goes" ring chart, with each
 * slice's label, percentage and sub beside it. Slices live in `budget` in
 * config/content.ts; the striking yearly goal in the card header reads
 * data/funding.json (see data/README.md).
 */

// Segment fills, matching breakdown order (largest first) — a calm
// monochrome ramp from sail down toward the card's teal. Checked for
// colour-vision separation against the teal-800 card; the smallest,
// darkest slice leans on the fully-labelled legend beside it.
const RAMP = ["#F6F3EC", "#BFB9A9", "#878983", "#4E5B5E"];

// "$55k" — derived from the funding goal so the two never drift.
function goalAmount() {
  return `$${Math.round(funding.goal / 1000)}k`;
}

export default function Budget() {
  const { budget } = useContent();
  return (
    <section id="budget" className="scroll-mt-20 pb-[90px]">
      <Reveal className="wrap">
        <p className="mb-7 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
          {budget.eyebrow}
        </p>
        {/* Monthly-support card beside the breakdown; they stack below lg,
            matching how the help cards and hero wheels collapse. */}
        <div className="mx-auto grid max-w-[1120px] items-stretch gap-[18px] lg:grid-cols-[minmax(0,340px)_minmax(0,760px)] lg:justify-center">
          <DonateCard />
          <div className="rounded-[10px] bg-teal-800 px-[30px] py-8 text-sail">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-[18px]">
              <p className="font-mono text-xs uppercase tracking-[.18em] text-sail/60">
                {budget.chartTitle}
              </p>
              <p className="font-mono text-[30px] font-semibold leading-none tracking-[-0.02em] md:text-[34px]">
                {goalAmount()}
                <span className="ml-2 text-[13px] font-normal tracking-normal text-sail/60">
                  {funding.currency}/yr
                </span>
              </p>
            </div>
            <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row sm:gap-9">
              <BudgetDonut
                slices={budget.breakdown}
                colors={RAMP}
                className="w-[170px] shrink-0 md:w-[190px]"
              />
              <ul className="grid w-full grid-cols-1 gap-x-8 gap-y-[14px] sm:grid-cols-2">
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
                          {slice.percent}%
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
          </div>
        </div>
      </Reveal>
    </section>
  );
}
