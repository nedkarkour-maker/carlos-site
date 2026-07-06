/**
 * A thin, static sea-swell divider between sections — one crisp wave shape,
 * no animation (deliberately: constant background motion cheapens the page
 * and costs frames). `fill` is the color of the section BELOW the divider,
 * drawn over the section above. Server-rendered, zero JS.
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
    <div aria-hidden className={`relative -mb-px h-[56px] overflow-hidden ${className}`}>
      <svg
        className="absolute bottom-0 left-0 h-full w-full"
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        style={{ fill }}
      >
        <path d="M0 40 C 180 18, 360 50, 560 34 S 900 12, 1080 34 S 1170 46, 1200 40 L1200 56 L0 56 Z" />
      </svg>
    </div>
  );
}
