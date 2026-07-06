import Image from "next/image";
import { schedule } from "@/config/content";
import Reveal from "./Reveal";

export default function Schedule() {
  return (
    <section id="schedule" className="scroll-mt-20 py-[90px]">
      <Reveal className="wrap">
        <p className="mb-4 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
          {schedule.eyebrow}
        </p>
        <h2 className="font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {schedule.title}
        </h2>

        <ol className="mt-[46px] border-l-2 border-line-dark pl-7 md:pl-[30px]">
          {schedule.stops.map((stop) => (
            <li
              key={`${stop.when}-${stop.title}`}
              className="relative grid grid-cols-[90px_1fr] gap-3.5 border-b border-line-dark py-5 last:border-b-0 md:grid-cols-[120px_1fr] md:gap-6"
            >
              <span
                aria-hidden
                className={`absolute -left-[35px] top-[26px] h-[11px] w-[11px] rounded-full border-2 border-sail bg-red md:-left-[37px] ${
                  stop.major ? "shadow-[0_0_0_4px_rgba(212,46,46,.2)]" : ""
                }`}
              />
              <span className="pt-0.5 font-mono text-[13px] tracking-[.04em] text-red-dark">
                {stop.when}
              </span>
              <div>
                <h3 className="font-display text-[19px] font-bold">
                  {stop.title}
                </h3>
                <p className="mt-[3px] text-sm text-ink-soft">{stop.where}</p>
                {stop.tag && (
                  <span className="mt-2 inline-block rounded-[3px] bg-red px-[7px] py-0.5 font-mono text-[10px] uppercase tracking-[.1em] text-white">
                    {stop.tag}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {schedule.photos.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="origin-top scale-110 object-cover"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
