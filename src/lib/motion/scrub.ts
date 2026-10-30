import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Kind: SCRUB. Progress is bound 1:1 to scroll position; it never autoplays.
 * `layers` move/rotate relative to the trigger section. Transform only.
 */
export type LifeScrubLayer = {
  target: gsap.TweenTarget;
  y?: number;
  rotation?: number;
  svgOrigin?: string;
};

export function lifeScrubLayers(trigger: Element, layers: LifeScrubLayer[]) {
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger, start: "top top", end: "bottom top", scrub: 0.6 },
  });
  layers.forEach(({ target, ...vars }) => tl.to(target, vars, 0));
  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}

export { ScrollTrigger };
