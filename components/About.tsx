import Image from "next/image";
import { about } from "@/config/content";
import Reveal from "./Reveal";

/** Renders **double-asterisk** spans from config copy as bold text. */
function BoldText({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-ink">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-[90px]">
      <Reveal className="wrap grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr] md:gap-[54px]">
        <div className="relative min-h-[300px] overflow-hidden rounded-[10px] md:min-h-[440px]">
          <Image
            src={about.image.src}
            alt={about.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
            {about.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(26px,3.6vw,40px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            {about.title}
          </h2>
          <div className="mb-1 mt-[26px] h-1 w-12 bg-red" />
          {about.paragraphs.map((paragraph, i) => (
            <p key={i} className="mt-4 max-w-[560px] text-[17px] text-ink-soft">
              <BoldText text={paragraph} />
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
