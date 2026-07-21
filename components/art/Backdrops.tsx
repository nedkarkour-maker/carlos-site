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

/** Minimal ILCA dinghy line art — About section accent. */
export function SailboatLine({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 300 260"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {/* mast */}
      <path d="M150 28 L150 196" />
      {/* sail with a hint of camber */}
      <path d="M150 34 C 196 92, 216 148, 224 188 L153 188" />
      <path d="M150 44 L96 188 L147 188" opacity="0.55" />
      {/* boom */}
      <path d="M150 150 L228 162" opacity="0.7" />
      {/* hull */}
      <path d="M74 196 L238 196 C 232 214, 214 226, 188 228 L112 228 C 92 224, 80 212, 74 196 Z" />
      {/* waterline wake */}
      <path d="M46 238 C 90 232, 130 244, 170 238 S 240 232, 264 238" opacity="0.5" />
      <path d="M70 250 C 110 245, 150 254, 190 249" opacity="0.3" />
    </svg>
  );
}

/**
 * Abstract nautical route chart — season timeline backdrop. Graticule grid,
 * a dashed route through four venue marks, and a compass rose. Deliberately
 * abstract (no real coastlines) so it reads as chartwork, not a wrong map.
 */
export function VenuesChart({ className = "" }: { className?: string }) {
  // Venue marks roughly evoking Cascais → Kiel → Kingston → Bodrum.
  const marks = [
    { x: 250, y: 420 },
    { x: 520, y: 150 },
    { x: 130, y: 200 },
    { x: 890, y: 380 },
  ];
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
    >
      {/* graticule */}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={i * 125} y1="0" x2={i * 125} y2="560" strokeWidth="1" opacity="0.16" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 140} x2="1000" y2={i * 140} strokeWidth="1" opacity="0.16" />
      ))}
      {/* depth-sounding dots sprinkled like a chart */}
      {[
        [80, 90], [340, 60], [700, 100], [930, 60], [60, 330], [420, 300],
        [640, 250], [820, 200], [180, 520], [500, 500], [760, 480], [950, 520],
      ].map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="1.6" fill="currentColor" stroke="none" opacity="0.35" />
      ))}
      {/* dashed route through the venues */}
      <path
        d={`M ${marks[0].x} ${marks[0].y} C 320 300, 420 180, ${marks[1].x} ${marks[1].y}
            S 260 120, ${marks[2].x} ${marks[2].y}
            M ${marks[2].x} ${marks[2].y} C 400 320, 680 460, ${marks[3].x} ${marks[3].y}`}
        strokeWidth="1.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* venue marks */}
      {marks.map((m, i) => (
        <g key={`m${i}`}>
          <circle cx={m.x} cy={m.y} r="5" strokeWidth="1.5" opacity="0.8" />
          <circle cx={m.x} cy={m.y} r="12" strokeWidth="1" opacity="0.3" />
        </g>
      ))}
      {/* compass rose */}
      <g transform="translate(910 90)" opacity="0.55">
        <circle r="26" strokeWidth="1" />
        <circle r="3" strokeWidth="1" />
        <path d="M0 -40 L6 -8 L0 -14 L-6 -8 Z" fill="currentColor" stroke="none" />
        <path d="M0 40 L5 10 L0 14 L-5 10 Z" strokeWidth="1" />
        <line x1="-34" y1="0" x2="-12" y2="0" strokeWidth="1" />
        <line x1="12" y1="0" x2="34" y2="0" strokeWidth="1" />
      </g>
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
