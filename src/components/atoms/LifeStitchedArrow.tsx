/**
 * Stitched arrow (owner's graphic elements, redrawn in brand colours): a wedge arrow pointing right
 * with a dashed "stitch" just inside its edge and two four-point sparkles that twinkle (CSS,
 * `.lp-twinkle`; still with reduced motion). Decorative SVG.
 */

/** Wedge body (taller at the tail, slanting in) and head, pointing right. */
const OUTLINE = "M6 12 L108 32 L108 16 L156 52 L108 88 L108 72 L6 76 Z";
/** Same outline, inset ~6 units: the stitching. */
const STITCH = "M12 19.5 L114 39.5 L114 28 L146 52 L114 76 L114 66 L12 70 Z";

/** Four-point sparkle centred on (cx, cy), radius r: concave sides. */
function sparkle(cx: number, cy: number, r: number) {
  return `M${cx} ${cy - r} Q${cx} ${cy} ${cx + r} ${cy} Q${cx} ${cy} ${cx} ${cy + r} Q${cx} ${cy} ${cx - r} ${cy} Q${cx} ${cy} ${cx} ${cy - r} Z`;
}

export function LifeStitchedArrow({
  body = "var(--lp-mustard)",
  ink = "var(--lp-forest)",
  spark = "var(--lp-yellow)",
  className,
}: {
  body?: string;
  ink?: string;
  spark?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 170 112" aria-hidden focusable="false" className={className}>
      <path d={OUTLINE} fill={body} />
      <path d={STITCH} fill="none" stroke={ink} strokeWidth={1.8} strokeDasharray="5 4" strokeLinejoin="round" />
      <path d={sparkle(124, 15, 14)} fill={ink} className="lp-twinkle" />
      {/* Over the tail's corner, as in the original, so the yellow reads against the mustard. */}
      <path d={sparkle(20, 76, 18)} fill={spark} className="lp-twinkle" style={{ animationDelay: "1.1s" }} />
    </svg>
  );
}
