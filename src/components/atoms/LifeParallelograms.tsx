/**
 * Parallelograms with stars (owner's graphic elements, redrawn in brand colours): three tilted
 * paint-chip quads (mustard, yellow, forest) and three sign-painter stars, the big one with dotted
 * arms. The chips drift and the stars twinkle (CSS `.lp-drift` / `.lp-twinkle`; still with reduced
 * motion). Decorative SVG.
 */

type Pt = [number, number];
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;

/** Four-point star centred on (cx, cy): concave sides, `r` long, slim. */
function star(cx: number, cy: number, r: number) {
  const w = r * 0.12;
  return `M${cx} ${cy - r} Q${cx + w} ${cy - w} ${cx + r} ${cy} Q${cx + w} ${cy + w} ${cx} ${cy + r} Q${cx - w} ${cy + w} ${cx - r} ${cy} Q${cx - w} ${cy - w} ${cx} ${cy - r} Z`;
}

export function LifeParallelograms({
  chips = ["var(--lp-mustard)", "var(--lp-yellow)", "var(--lp-forest)"],
  ink = "var(--lp-forest)",
  className,
}: {
  chips?: [string, string, string] | string[];
  ink?: string;
  className?: string;
}) {
  const quads: Pt[][] = [
    [[40, 73], [122, 85], [125, 152], [48, 158]],
    [[126, 26], [202, 38], [208, 104], [133, 110]],
    [[219, 94], [285, 103], [288, 162], [226, 165]],
  ];
  return (
    <svg viewBox="20 10 280 165" aria-hidden focusable="false" className={className}>
      {quads.map((q, i) => (
        <path key={i} d={poly(q)} fill={chips[i]} className="lp-drift" style={{ animationDelay: `${-i * 2}s` }} />
      ))}
      {/* The big star: a four-point star, a smaller one turned 45°, and dotted arms. */}
      <g className="lp-twinkle">
        {([[72, 34], [72, 102], [38, 68], [106, 68]] as Pt[]).map(([x, y], i) => (
          <g key={i}>
            <line x1={72} y1={68} x2={x} y2={y} stroke={ink} strokeWidth={1.6} />
            <circle cx={x} cy={y} r={3} fill={ink} />
          </g>
        ))}
        <path d={star(72, 68, 22)} fill={ink} />
        <path d={star(72, 68, 12)} fill={ink} transform="rotate(45 72 68)" />
      </g>
      <path d={star(268, 69, 17)} fill={ink} className="lp-twinkle" style={{ animationDelay: "-0.9s" }} />
      <path d={star(211, 129, 15)} fill={ink} className="lp-twinkle" style={{ animationDelay: "-1.7s" }} />
    </svg>
  );
}
