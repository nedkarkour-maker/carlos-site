import { numbers } from "@/config/content";
import Reveal from "./Reveal";
import CountUp from "./motion/CountUp";

export default function Numbers() {
  return (
    <section className="bg-teal-900 py-[90px] text-sail">
      <Reveal className="wrap">
        <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-bright">
          {numbers.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {numbers.title}
        </h2>
        <div className="mt-11 grid grid-cols-2 gap-[22px] md:grid-cols-5">
          {numbers.stats.map((stat, i) => (
            <div key={stat.label} className="border-t border-line pt-[18px]">
              <div
                className={`font-mono text-[clamp(32px,4.4vw,50px)] font-semibold tracking-[-0.02em] ${
                  stat.accent ? "text-red-bright" : ""
                }`}
              >
                <CountUp value={stat.value} delay={i * 0.12} />
              </div>
              <div className="mt-2 text-[13px] text-sail/65">{stat.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
