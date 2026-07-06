/**
 * Pure-SVG fallback art, used until a generated image with the matching
 * filename is dropped into public/images/generated/ (see IMAGE_PROMPTS.md).
 * Server-rendered, zero JS.
 */

/** Bathymetric-chart contour lines — stats section backdrop. */
export function TopoLines({ className = "" }: { className?: string }) {
  const rings = [1, 0.82, 0.65, 0.5, 0.37, 0.26, 0.17];
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="var(--sail)"
      strokeWidth="1"
    >
      {rings.map((r, i) => (
        <path
          key={`a${i}`}
          opacity={0.05 + i * 0.008}
          d={`M ${260 - r * 240} 300
              C ${260 - r * 240} ${300 - r * 210}, ${260 + r * 130} ${300 - r * 260}, ${260 + r * 260} ${300 - r * 150}
              S ${260 + r * 300} ${300 + r * 190}, ${260 + r * 90} ${300 + r * 230}
              S ${260 - r * 240} ${300 + r * 160}, ${260 - r * 240} 300 Z`}
        />
      ))}
      {rings.map((r, i) => (
        <path
          key={`b${i}`}
          opacity={0.045 + i * 0.007}
          d={`M ${920 - r * 220} 420
              C ${920 - r * 220} ${420 - r * 180}, ${920 + r * 120} ${420 - r * 240}, ${920 + r * 240} ${420 - r * 120}
              S ${920 + r * 270} ${420 + r * 170}, ${920 + r * 70} ${420 + r * 190}
              S ${920 - r * 220} ${420 + r * 140}, ${920 - r * 220} 420 Z`}
        />
      ))}
    </svg>
  );
}

/** Wind streamlines — subscribe band backdrop. */
export function WindLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="var(--sail)"
      strokeWidth="1"
    >
      {Array.from({ length: 9 }, (_, i) => {
        const y = 30 + i * 30;
        const amp = 14 + (i % 3) * 8;
        return (
          <path
            key={i}
            opacity={0.05 + (i % 4) * 0.012}
            d={`M -20 ${y} C 200 ${y - amp}, 400 ${y + amp}, 620 ${y - amp / 2} S 1020 ${y + amp}, 1240 ${y - amp}`}
          />
        );
      })}
    </svg>
  );
}
