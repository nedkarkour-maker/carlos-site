import Image from "next/image";
import { photoStrip } from "@/config/content";
import Reveal from "./Reveal";

/**
 * A quiet strip of race photos between the schedule and the support
 * sections — a visual breather, no copy. Edit `photoStrip` in
 * config/content.ts to swap, add or reorder images.
 */
export default function PhotoStrip() {
  return (
    <section>
      <Reveal className="wrap pb-[90px] md:motion-safe:pt-[70px]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {photoStrip.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                style={{ objectPosition: photo.focus ?? "50% 50%" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
