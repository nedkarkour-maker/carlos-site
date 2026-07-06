/**
 * A thin, static sea-swell divider between sections — two layered wave
 * shapes, no animation (deliberately: constant background motion cheapens
 * the page and costs frames). `fill` is the color of the section BELOW the
 * divider, drawn over the section above. Server-rendered, zero JS.
 */
export default function WaveDivider({
  fill,
  className = "",
}: {
  /** CSS color of the next section, e.g. "var(--sail)" or "var(--teal-900)". */
  fill: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={`relative -mb-px h-[60px] overflow-hidden ${className}`}>
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        style={{ fill, opacity: 0.4 }}
      >
        <path d="M0 36 C 150 14, 300 52, 450 34 S 750 10, 900 32 S 1120 50, 1200 28 L1200 60 L0 60 Z" />
      </svg>
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        style={{ fill }}
      >
        <path d="M0 45 C 200 26, 380 55, 560 41 S 880 20, 1040 43 S 1160 53, 1200 39 L1200 60 L0 60 Z" />
      </svg>
    </div>
  );
}
