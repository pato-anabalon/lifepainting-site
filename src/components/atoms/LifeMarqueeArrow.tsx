/**
 * Marquee sign arrow (owner's graphic elements, redrawn in brand colours): an L-shaped arrow that
 * climbs from the bottom-left and turns right, lined with bulbs that light up in sequence (CSS,
 * `.lp-bulb`; still with reduced motion). Decorative SVG.
 */

/** Centre line of the arrow body: up the slanted stem, then right to the head. */
const STEM_FOOT = { x: 62, y: 196 };
const CORNER = { x: 24, y: 40 };
const HEAD_BASE = { x: 130, y: 40 };

function bulbs(): Array<{ x: number; y: number }> {
  const pts: Array<{ x: number; y: number }> = [];
  const along = (a: { x: number; y: number }, b: { x: number; y: number }, n: number, skipFirst: boolean) => {
    for (let i = skipFirst ? 1 : 0; i <= n; i++) pts.push({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n });
  };
  along({ x: STEM_FOOT.x - 3, y: STEM_FOOT.y - 12 }, CORNER, 9, false);
  along(CORNER, { x: HEAD_BASE.x + 6, y: HEAD_BASE.y }, 6, true);
  return pts;
}

const BULBS = bulbs();
/** Unit vector down the stem, to run the lit edge a little past the foot (closing it off). */
const LEN = Math.hypot(STEM_FOOT.x - CORNER.x, STEM_FOOT.y - CORNER.y);
const DOWN = { x: (STEM_FOOT.x - CORNER.x) / LEN, y: (STEM_FOOT.y - CORNER.y) / LEN };
const EDGE = `M${(STEM_FOOT.x + DOWN.x * 6).toFixed(1)} ${(STEM_FOOT.y + DOWN.y * 6).toFixed(1)} L${CORNER.x} ${CORNER.y} L${HEAD_BASE.x} ${HEAD_BASE.y}`;
// The body runs a little into the head, so the head's lit edge does not cross it.
const BODY = `M${STEM_FOOT.x} ${STEM_FOOT.y} L${CORNER.x} ${CORNER.y} L${HEAD_BASE.x + 12} ${HEAD_BASE.y}`;
const HEAD = `M${HEAD_BASE.x} ${HEAD_BASE.y - 30} L${HEAD_BASE.x + 50} ${HEAD_BASE.y} L${HEAD_BASE.x} ${HEAD_BASE.y + 30} Z`;

export function LifeMarqueeArrow({
  body = "var(--lp-mustard)",
  edge = "var(--lp-yellow)",
  bulb = "var(--lp-cream)",
  className,
}: {
  body?: string;
  edge?: string;
  bulb?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 190 210" aria-hidden focusable="false" className={className}>
      {/* Edge first (wider), then the body on top: a sign with a lit border. */}
      <path d={EDGE} fill="none" stroke={edge} strokeWidth={40} strokeLinejoin="miter" strokeLinecap="butt" />
      <path d={HEAD} fill={body} stroke={edge} strokeWidth={6} strokeLinejoin="miter" />
      <path d={BODY} fill="none" stroke={body} strokeWidth={28} strokeLinejoin="miter" strokeLinecap="butt" />
      {BULBS.map((p, i) => (
        <circle
          key={i}
          cx={p.x.toFixed(1)}
          cy={p.y.toFixed(1)}
          r={4}
          fill={bulb}
          className="lp-bulb"
          style={{ animationDelay: `${(i * 0.12).toFixed(2)}s` }}
        />
      ))}
    </svg>
  );
}
