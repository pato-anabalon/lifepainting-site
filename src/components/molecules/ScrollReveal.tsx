"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { LIFE_MOTION_OK, gsap, registerLifeMotion, useGSAP } from "@/lib/motion/register";
import { lifeRevealOnScrollOnce } from "@/lib/motion/once";

registerLifeMotion();

/**
 * ONCE on scroll. Descendants marked `data-reveal` rise in, staggered, the first time the
 * wrapper enters the viewport. Without JS or with reduced motion everything is simply visible.
 */
export function ScrollReveal({ as: Tag = "div", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(LIFE_MOTION_OK, () => lifeRevealOnScrollOnce(el, el.querySelectorAll("[data-reveal]")));
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
