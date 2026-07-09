import { help } from "@/config/content";
import Reveal from "./Reveal";
import BudgetBars from "./motion/BudgetBars";

/** The season budget block, standing on its own between help and support. */
export default function Budget() {
  return (
    <section id="budget" className="scroll-mt-20 pb-[90px]">
      <Reveal className="wrap">
        <BudgetBars
          amount={help.budget.amount}
          note={help.budget.note}
          breakdown={help.budget.breakdown}
        />
      </Reveal>
    </section>
  );
}
