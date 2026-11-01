/**
 * Atomic shapes (owner's graphic elements, redrawn in brand colours): two mid-century boomerang
 * panels with inset panels, and two "atom" stars (rays ending in dots). The panels drift gently and
 * the atoms turn slowly (CSS, `.lp-drift` / `.lp-spin`; still with reduced motion). Decorative SVG.
 */

type Pt = [number, number];
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;

const PANEL_A: Pt[] = [[115, 30], [240, 20], [232, 86], [130, 92]];
const INSET_A: Pt[] = [[142, 42], [196, 38], [206, 72], [146, 75]];
const PANEL_B: Pt[] = [[85, 98], [190, 95], [206, 140], [78, 156]];
const INSET_B: Pt[] = [[108, 104], [172, 103], [186, 132], [111, 136]];

/** An atom star: rays from a centre to dotted ends. */
function Atom({ cx, cy, rays, color, delay }: { cx: number; cy: number; rays: Pt[]; color: string; delay?: string }) {
  return (
    <g className="lp-spin" style={delay ? { animationDelay: delay } : undefined}>
      {rays.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth={2} strokeLinecap="round" />
      ))}
      {rays.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.6} fill={color} />
      ))}
    </g>
  );
}

export function LifeAtomicShapes({
  panelA = "var(--lp-mustard)",
  insetA = "var(--lp-yellow)",
  panelB = "var(--lp-azure)",
  insetB = "var(--lp-mustard)",
  atom = "var(--lp-cream)",
  className,
}: {
  panelA?: string;
  insetA?: string;
  panelB?: string;
  insetB?: string;
  atom?: string;
  className?: string;
}) {
  // Same-colour round strokes soften the panels' corners, as in the original.
  const soft = { strokeWidth: 8, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="60 8 200 160" aria-hidden focusable="false" className={className}>
      <g className="lp-drift">
        <path d={poly(PANEL_A)} fill={panelA} stroke={panelA} {...soft} />
        <path d={poly(INSET_A)} fill={insetA} stroke={insetA} {...soft} />
      </g>
      <g className="lp-drift" style={{ animationDelay: "-3s" }}>
        <path d={poly(PANEL_B)} fill={panelB} stroke={panelB} {...soft} />
        <path d={poly(INSET_B)} fill={insetB} stroke={insetB} {...soft} />
      </g>
      <Atom cx={113} cy={72} rays={[[113, 40], [113, 103], [90, 68], [131, 57], [131, 78], [92, 91]]} color={atom} />
      <Atom cx={214} cy={100} rays={[[229, 76], [241, 93], [231, 120], [196, 101], [204, 120]]} color={atom} delay="-9s" />
    </svg>
  );
}
