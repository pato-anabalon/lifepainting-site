/** Mid-century starburst motif (guidelines: Graphic Elements). Decorative SVG. */
function starPath(points: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

const PATH = starPath(9, 49, 17);

export function LifeStarburst({ fill = "var(--lp-yellow)", stroke = "var(--lp-cream)", className }: { fill?: string; stroke?: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden focusable="false" className={className}>
      <path d={PATH} fill={fill} stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}
