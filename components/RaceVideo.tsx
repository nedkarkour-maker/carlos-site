import { race } from "@/config/content";
import Reveal from "./Reveal";

/**
 * "What a race looks like" — a YouTube explainer standing in for the
 * scroll-driven race animation while that gets finished (the animation's
 * full source is preserved in docs/archive/race-scroll.md). The
 * youtube-nocookie.com domain is YouTube's privacy-enhanced embed: no
 * tracking cookies until the visitor actually plays the video.
 */
export default function RaceVideo() {
  return (
    <section className="bg-teal-950 text-sail">
      <Reveal className="wrap py-[90px]">
        <p className="font-mono text-xs uppercase tracking-[.18em] text-red-bright">
          {race.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-[clamp(28px,4.4vw,50px)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          {race.title}
        </h2>
        <div className="mt-9 overflow-hidden rounded-[10px] border border-line">
          <iframe
            src={race.videoUrl}
            title={race.videoTitle}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="aspect-video w-full"
          />
        </div>
        <p className="mt-4 max-w-[640px] font-mono text-[13px] text-sail/60">
          {race.caption}
        </p>
      </Reveal>
    </section>
  );
}
