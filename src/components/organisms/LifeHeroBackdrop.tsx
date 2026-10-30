"use client";

import { useRef } from "react";
import { LifeStarburst } from "@/components/atoms/LifeStarburst";
import { LIFE_MOTION_OK, gsap, registerLifeMotion, useGSAP } from "@/lib/motion/register";
import { lifeEntranceOnLoad } from "@/lib/motion/once";
import { lifeScrubLayers } from "@/lib/motion/scrub";

registerLifeMotion();

const W = 1440;
const CX = 720;
const CY = 900;

/** Sunburst wedges radiating from the bottom centre. Computed once at module load. */
const RAYS = Array.from({ length: 18 }, (_, i) => {
  const start = (Math.PI * (i * 2)) / 36 - Math.PI; // 0..π half-circle, 10° per ray pair
  const end = start + Math.PI / 36;
  const R = 1700;
  const p = (a: number) => `${(CX + R * Math.cos(a)).toFixed(1)},${(CY + R * Math.sin(a)).toFixed(1)}`;
  return `M${CX},${CY}L${p(start)}L${p(end)}Z`;
});

const PENNANT_COLORS = ["var(--lp-yellow)", "var(--lp-azure)", "var(--lp-mustard)", "var(--lp-cream)"];
const PENNANTS = Array.from({ length: 19 }, (_, i) => {
  const x = i * 80 - 40;
  const sag = Math.sin((i / 18) * Math.PI) * 26; // gentle catenary
  return { x, y: 6 + sag, color: PENNANT_COLORS[i % PENNANT_COLORS.length] as string };
});

/**
 * Hero background: sunburst + pennant string + starburst.
 *  - ONCE: pennants drop in after the preloader.
 *  - SCRUB: rays rotate slightly and the starburst drifts, bound to scroll. Nothing autoplays.
 * With reduced motion every layer is simply static and fully visible.
 */
export function LifeHeroBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const section = el?.parentElement;
      if (!el || !section) return;
      const mm = gsap.matchMedia();
      mm.add(LIFE_MOTION_OK, () => {
        const stopScrub = lifeScrubLayers(section, [
          { target: "[data-lp-rays]", rotation: 8, svgOrigin: `${CX} ${CY}` },
          { target: "[data-lp-star]", y: -60, rotation: 24 },
        ]);
        const stopEntrance = lifeEntranceOnLoad("[data-lp-pennant]", { y: -30, stagger: 0.04, duration: 0.7, ease: "back.out(1.4)" });
        return () => {
          stopScrub();
          stopEntrance();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden data-testid="home-hero-backdrop" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${CY}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" focusable="false">
        <g data-lp-rays>
          {RAYS.map((d, i) => (
            <path key={i} d={d} fill="var(--lp-cream)" opacity={0.06} />
          ))}
        </g>
      </svg>

      <svg viewBox={`0 0 ${W} 130`} preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-16 w-full sm:h-24" focusable="false">
        <path d={`M0,6 Q${CX},58 ${W},6`} fill="none" stroke="var(--lp-cream)" strokeWidth={2} opacity={0.5} />
        {PENNANTS.map((p, i) => (
          <polygon key={i} data-lp-pennant points={`${p.x},${p.y} ${p.x + 56},${p.y} ${p.x + 28},${p.y + 54}`} fill={p.color} stroke="var(--lp-forest)" strokeWidth={2} />
        ))}
      </svg>

      <div data-lp-star className="absolute -bottom-10 -right-12 w-32 opacity-95 sm:bottom-10 sm:right-[6%] sm:w-56 lg:w-72">
        <LifeStarburst />
      </div>
      <div className="absolute -left-6 bottom-[28%] size-16 rounded-full bg-mustard sm:left-[7%] sm:size-24" />
    </div>
  );
}
