"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LIFE_MOTION_OK, gsap, registerLifeMotion, useGSAP } from "@/lib/motion/register";
import { markLifePreloaderDone } from "@/lib/motion/preloader";

registerLifeMotion();

const MONOGRAM = "/logos/icon-for-dark.png";

/**
 * 3 s intro: monogram fades in, a light shimmer sweeps across it, then the overlay fades out (ease-out).
 * Once per session. Skipped with reduced motion. Decorative: hidden from assistive tech.
 */
export function LifePaintingPreloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (document.documentElement.dataset.lpPreloader !== "pending") {
        setGone(true);
        return;
      }
      const mm = gsap.matchMedia();
      mm.add(LIFE_MOTION_OK, () => {
        const tl = gsap.timeline({
          onComplete: () => {
            markLifePreloaderDone();
            setGone(true);
          },
        });
        tl.fromTo("[data-lp-mark]", { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" })
          .fromTo("[data-lp-shine]", { backgroundPosition: "160% 0" }, { backgroundPosition: "-60% 0", duration: 1.9, ease: "power1.inOut" }, 0.4)
          .to(el, { autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 2.4);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden
      data-testid="site-preloader"
      data-surface="dark"
      className="lp-preloader fixed inset-0 z-[100] flex items-center justify-center bg-forest"
    >
      <div data-lp-mark className="relative size-44 sm:size-56">
        <Image src={MONOGRAM} alt="" fill sizes="224px" priority className="object-contain" />
        <div
          data-lp-shine
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${MONOGRAM})`,
            maskImage: `url(${MONOGRAM})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            // taste-skill-ignore: the shimmer IS the brand intro (masked to the monogram, not a background)
            backgroundImage: "linear-gradient(110deg, transparent 38%, rgba(255,255,255,0.9) 50%, transparent 62%)",
            backgroundSize: "250% 100%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "160% 0",
          }}
        />
      </div>
    </div>
  );
}
