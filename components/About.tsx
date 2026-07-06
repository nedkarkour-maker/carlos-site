import Image from "next/image";
import { about } from "@/config/content";
import { generatedImage } from "@/lib/generated";
import { SailboatLine } from "./art/Backdrops";
import Parallax from "./motion/Parallax";
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
  const boat = generatedImage("sailboat-line.png");
  return (
    <section id="about" className="relative scroll-mt-20 overflow-hidden py-[90px]">
      {/* Quiet sailing-boat accent in the corner; upgraded automatically when
          public/images/generated/sailboat-line.png exists. */}
      {boat ? (
        <Image
          src={boat}
          alt=""
          aria-hidden
          width={300}
          height={260}
          className="pointer-events-none absolute -right-8 bottom-6 hidden w-[280px] opacity-[0.14] lg:block"
        />
      ) : (
        <SailboatLine className="pointer-events-none absolute -right-8 bottom-6 hidden w-[280px] text-ink-soft opacity-[0.14] lg:block" />
      )}
      <Reveal className="wrap relative grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr] md:gap-[54px]">
        <Parallax className="relative min-h-[300px] rounded-[10px] md:min-h-[440px]">
          <Image
            src={about.image.src}
            alt={about.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
            style={{ objectPosition: about.image.focus ?? "50% 50%" }}
          />
        </Parallax>
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
