import Image from "next/image";
import Link from "next/link";
import { backers, type Sponsor } from "@/config/content";

/** "Sail Canada" → "SC" — placeholder mark until a real logo file is provided. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  if (sponsor.logo) {
    return (
      <span className="relative h-12 w-24">
        <Image
          src={sponsor.logo}
          alt={`${sponsor.name} logo`}
          fill
          sizes="96px"
          className="object-contain"
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className="flex h-12 w-12 items-center justify-center rounded-full border border-line-dark bg-sail-2 font-mono text-sm font-semibold text-ink-soft"
    >
      {initials(sponsor.name)}
    </span>
  );
}

export default function Backers() {
  return (
    <section className="border-y border-line-dark bg-white py-[42px]">
      <div className="wrap">
        <p className="mb-[22px] text-center font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
          {backers.label}
        </p>
        <ul className="flex flex-wrap justify-center gap-3.5">
          {backers.sponsors.map((sponsor) => (
            <li
              key={sponsor.name}
              className="flex min-h-[120px] w-[150px] flex-col items-center justify-center gap-2.5 rounded-md border border-line-dark bg-sail px-4 py-4 text-center font-mono text-[11px] text-ink-soft"
            >
              <SponsorLogo sponsor={sponsor} />
              {sponsor.name}
            </li>
          ))}
          <li>
            <Link
              href={backers.joinCta.href}
              className="flex min-h-[120px] w-[150px] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-red px-4 py-4 text-center transition-colors hover:bg-red/5"
            >
              <span className="font-display text-base font-extrabold text-red">
                {backers.joinCta.title}
              </span>
              <span className="font-mono text-[11px] text-ink-soft">
                {backers.joinCta.body}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
