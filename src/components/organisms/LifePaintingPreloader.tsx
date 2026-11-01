"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LIFE_MOTION_OK, gsap, registerLifeMotion, useGSAP } from "@/lib/motion/register";
import { markLifePreloaderDone } from "@/lib/motion/preloader";
import { buildBrushWipe, loadBrushSprite } from "@/lib/motion/brushWipe";

registerLifeMotion();

/** Full stacked logo (owner, 2026-11-01; was the monogram `icon-for-dark.png`). */
const LOGO = "/logos/logo-for-dark.png";

/** Brush strokes, all rows (ms). */
const BRUSH_MS = 1500;
/** Longest wait for the brush sprite after the logo; past it the overlay just fades out. */
const SPRITE_WAIT_MS = 2500;
/** Hard deadline from mount: the overlay never stays longer than this, whatever fails. */
const DEADLINE_MS = 1600 + SPRITE_WAIT_MS + BRUSH_MS + 300 + 1500;

/**
 * ~3.4 s intro: logo fades in and a light shimmer sweeps across it; then rows of a real brush
 * stroke paint the page colour (cream) over everything, top-left to bottom-right (brushWipe.ts).
 * The overlay then fades and the preloader is marked done, so the hero (collage + copy) appears on
 * a cream screen that matches the paint. Once per session. Skipped with reduced motion.
 * Decorative: hidden from assistive tech.
 */
export function LifePaintingPreloader() {
  const root = useRef<HTMLDivElement>(null);
  const paint = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      if (document.documentElement.dataset.lpPreloader !== "pending") {
        setGone(true);
        return;
      }
      // JS is running: the boot watchdog is no longer needed; this component keeps its own deadline.
      clearTimeout(window.__lpPreloaderWatchdog);
      // Start loading the sprite now: the logo intro gives it ~1.6 s.
      const sprite = loadBrushSprite();
      let brush: gsap.core.Timeline | undefined;
      let cancelled = false;
      const finish = () => {
        clearTimeout(deadline);
        markLifePreloaderDone();
        setGone(true);
      };
      const deadline = window.setTimeout(finish, DEADLINE_MS);
      const fadeOut = () => void gsap.to(el, { autoAlpha: 0, duration: 0.3, ease: "power1.out", onComplete: finish });
      const startBrush = async () => {
        const host = paint.current;
        const ready = await Promise.race([sprite, new Promise<boolean>((r) => setTimeout(r, SPRITE_WAIT_MS, false))]);
        if (cancelled) return;
        if (!ready || !host) return fadeOut();
        brush = buildBrushWipe(host, BRUSH_MS);
        // Paint, then fade the overlay (and any specks of green between bristles) onto the cream hero.
        brush
          .to(el, { autoAlpha: 0, duration: 0.3, ease: "power1.out" })
          .call(finish)
          .play();
      };
      const mm = gsap.matchMedia();
      mm.add(LIFE_MOTION_OK, () => {
        const tl = gsap.timeline();
        tl.fromTo("[data-lp-mark]", { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" })
          .fromTo("[data-lp-shine]", { backgroundPosition: "160% 0" }, { backgroundPosition: "-60% 0", duration: 1.3, ease: "power1.inOut" }, 0.35)
          // Run outside GSAP's callback scope (see once.ts): the brush owns the rest of the intro.
          .call(() => void requestAnimationFrame(() => void startBrush()), [], 1.6);
      });
      return () => {
        cancelled = true;
        clearTimeout(deadline);
        brush?.kill();
        paint.current?.replaceChildren();
        mm.revert();
      };
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
      <div ref={paint} data-testid="site-preloader-paint" className="pointer-events-none absolute inset-0 z-10 overflow-hidden" />
      <div data-lp-mark className="relative size-60 sm:size-80">
        <Image src={LOGO} alt="" fill sizes="(min-width: 640px) 320px, 240px" priority className="object-contain" />
        <div
          data-lp-shine
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${LOGO})`,
            maskImage: `url(${LOGO})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            // taste-skill-ignore: the shimmer IS the brand intro (masked to the logo, not a background)
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
