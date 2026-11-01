"use client";

import { useEffect, useRef } from "react";

/**
 * Retro stripes (owner's graphic elements, redrawn in brand colours). LifeRetroStripes: parallel
 * bands that run down, curve right, run across, then curve down again, keeping their order.
 * LifeRetroRibbon: bands that come in level from the left, climb a steep diagonal and level off again. When they first scroll into
 * view they are painted in, one band after another (ONCE; CSS `.lp-stripe`, still and fully drawn
 * without JS or with reduced motion). Decorative SVG.
 */

/**
 * Paints `.lp-stripe` paths in once, the first time the svg scrolls into view (motion allowed).
 * `rootMargin` defaults to ignoring the bottom 15 % of the screen, so on the page the paint starts
 * once the stripes are properly in view; pass "0px" for one pinned to the foot of the screen.
 */
function useDrawOnView(rootMargin = "0px 0px -15% 0px") {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
    // Hide only once JS runs, then paint in on first view.
    el.dataset.draw = "pending";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        el.dataset.draw = "in";
        io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return ref;
}

const PITCH = 17; // centre to centre
const WIDTH = 11; // band width (the rest is the gap)
const R = 18; // smallest bend radius
const X0 = 8;
const Y1 = 70; // first straight run down
const RUN = 70; // straight run across
const END = 360; // bottom of the final run down

/** Centre line of band `i` (0 = left / outer at the first bend). */
function band(i: number, n: number) {
  const x = X0 + i * PITCH;
  const r1 = R + (n - 1 - i) * PITCH; // first bend: the right-hand band is on the inside
  const yh = Y1 + r1;
  const x2 = X0 + R + (n - 1) * PITCH + RUN; // all bands leave the run at the same x
  const r2 = R + i * PITCH; // second bend: the lower band is on the inside
  return `M${x} 0 V${Y1} A${r1} ${r1} 0 0 0 ${x + r1} ${yh} H${x2} A${r2} ${r2} 0 0 1 ${x2 + r2} ${yh + r2} V${END}`;
}

export function LifeRetroStripes({
  colors = ["var(--lp-azure)", "var(--lp-forest)", "var(--lp-mustard)", "var(--lp-yellow)"],
  className,
}: {
  colors?: string[];
  className?: string;
}) {
  const ref = useDrawOnView();
  const n = colors.length;
  const width = X0 + R + (n - 1) * PITCH + RUN + R + (n - 1) * PITCH + WIDTH;

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${END}`} aria-hidden focusable="false" className={className}>
      {colors.map((c, i) => (
        <path
          key={i}
          d={band(i, n)}
          pathLength={1}
          fill="none"
          stroke={c}
          strokeWidth={WIDTH}
          className="lp-stripe"
          style={{ transitionDelay: `${(i * 0.12).toFixed(2)}s` }}
        />
      ))}
    </svg>
  );
}

type P = { x: number; y: number };
/** Centre line of the ribbon's bottom band: in level from the left, a steep climb, level again. */
const RIBBON_LINE: P[] = [
  { x: -30, y: 150 },
  { x: 166, y: 150 },
  { x: 208, y: 62 },
  { x: 340, y: 62 },
];
const RIBBON_GAP = 14;
const RIBBON_ROUND = 20;

/**
 * Band `i` of the ribbon: the centre line offset `i × gap` to its left (upwards on the level runs),
 * corners re-intersected so every band stays parallel, then rounded with quadratic curves.
 */
function ribbonBand(i: number) {
  const o = i * RIBBON_GAP;
  const segs = RIBBON_LINE.slice(1).map((b, k) => {
    const a = RIBBON_LINE[k]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const d = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
    const n = { x: d.y, y: -d.x }; // left of travel, in screen coordinates
    return { a: { x: a.x + n.x * o, y: a.y + n.y * o }, b: { x: b.x + n.x * o, y: b.y + n.y * o }, d };
  });
  const cross = (s1: (typeof segs)[number], s2: (typeof segs)[number]): P => {
    // s1.a + t·s1.d = s2.a + u·s2.d
    const den = s1.d.x * s2.d.y - s1.d.y * s2.d.x;
    const t = ((s2.a.x - s1.a.x) * s2.d.y - (s2.a.y - s1.a.y) * s2.d.x) / den;
    return { x: s1.a.x + t * s1.d.x, y: s1.a.y + t * s1.d.y };
  };
  const first = segs[0]!;
  const last = segs[segs.length - 1]!;
  let path = `M${first.a.x.toFixed(1)} ${first.a.y.toFixed(1)}`;
  for (let k = 0; k < segs.length - 1; k++) {
    const s1 = segs[k]!;
    const s2 = segs[k + 1]!;
    const c = cross(s1, s2);
    const inP = { x: c.x - s1.d.x * RIBBON_ROUND, y: c.y - s1.d.y * RIBBON_ROUND };
    const outP = { x: c.x + s2.d.x * RIBBON_ROUND, y: c.y + s2.d.y * RIBBON_ROUND };
    path += ` L${inP.x.toFixed(1)} ${inP.y.toFixed(1)} Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${outP.x.toFixed(1)} ${outP.y.toFixed(1)}`;
  }
  return `${path} L${last.b.x.toFixed(1)} ${last.b.y.toFixed(1)}`;
}

export function LifeRetroRibbon({
  // Bottom band first.
  colors = ["var(--lp-azure-deep)", "var(--lp-azure)", "var(--lp-yellow)", "var(--lp-mustard)", "var(--lp-forest)"],
  rootMargin,
  className,
}: {
  colors?: string[];
  /** See useDrawOnView. */
  rootMargin?: string;
  className?: string;
}) {
  const ref = useDrawOnView(rootMargin);
  return (
    <svg ref={ref} viewBox="0 0 360 160" preserveAspectRatio="xMinYMax meet" aria-hidden focusable="false" className={className}>
      {colors.map((c, i) => (
        <path
          key={i}
          d={ribbonBand(i)}
          pathLength={1}
          fill="none"
          stroke={c}
          strokeWidth={i === 0 ? 12 : 9}
          className="lp-stripe"
          style={{ transitionDelay: `${(i * 0.1).toFixed(2)}s` }}
        />
      ))}
    </svg>
  );
}
