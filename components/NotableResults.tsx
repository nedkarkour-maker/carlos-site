import Image from "next/image";
import { notableResults } from "@/config/content";
import Reveal from "./Reveal";

/**
 * The three headline results as photo cards — photo on top, the result in
 * bold underneath, the event name under that. Edit `notableResults` in
 * config/content.ts to change photos, results or order.
 */
export default function NotableResults() {
  return (
    <section>
      <Reveal className="wrap pb-[90px] md:motion-safe:pt-[70px]">
        <p className="mb-7 font-mono text-xs uppercase tracking-[.18em] text-red-dark">
          {notableResults.eyebrow}
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {notableResults.items.map((item) => (
            <figure key={item.event}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                  style={{ objectPosition: item.image.focus ?? "50% 50%" }}
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3">
                <p className="font-display text-[19px] font-extrabold leading-tight">
                  {item.result}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{item.event}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
