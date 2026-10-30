"use client";

import { useRef, type ReactNode } from "react";
import { LIFE_MOTION_OK, gsap, registerLifeMotion, useGSAP } from "@/lib/motion/register";
import { lifeEntranceOnLoad } from "@/lib/motion/once";

registerLifeMotion();

/** ONCE: staggers the hero copy in after the preloader. Children opt in with `data-lp-reveal`. */
export function LifeHeroReveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(LIFE_MOTION_OK, () => lifeEntranceOnLoad("[data-lp-reveal]", { y: 28 }));
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
