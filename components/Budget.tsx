import { help } from "@/config/content";
import funding from "@/data/funding.json";
import Reveal from "./Reveal";
import BudgetBars from "./motion/BudgetBars";
import FundingBar from "./motion/FundingBar";

/**
 * The season budget block, standing on its own between help and support.
 * The funding bar reads data/funding.json — bump `raised` there whenever
 * money comes in (see data/README.md).
 */
export default function Budget() {
  return (
    <section id="budget" className="scroll-mt-20 pb-[90px]">
      <Reveal className="wrap">
        <BudgetBars
          amount={help.budget.amount}
          note={help.budget.note}
          breakdown={help.budget.breakdown}
        />
        <FundingBar
          goal={funding.goal}
          raised={funding.raised}
          currency={funding.currency}
        />
      </Reveal>
    </section>
  );
}
