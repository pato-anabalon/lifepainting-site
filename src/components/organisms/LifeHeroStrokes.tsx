"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/register";
import { whenLifePreloaderDone } from "@/lib/motion/preloader";
import { mixHex, paintDryStroke, planStroke, strokeZones, type StrokePlan } from "@/lib/motion/paintStrokes";

/** Brand colours the strokes are tinted from (share mixed into cream). */
const TINTS: Array<[string, number]> = [
  ["--lp-azure", 0.45],
  ["--lp-yellow", 0.55],
  ["--lp-mustard", 0.45],
];
/** A new stroke every SPAWN_S; each paints in, rests, then dries (fades) away. */
const SPAWN_S = 1.4;
const PAINT_S = 0.65;
const REST_S = 2.2;
const DRY_S = 1.8;

/**
 * Mobile hero backdrop (below 768px; the photo collage takes over above that, see globals.css):
 * an invisible painter keeps laying pale brush strokes above and below the copy. Ambient loop,
 * paused while the hero is off screen or the tab is hidden. Reduced motion: three strokes, still.
 * No JS: plain cream. Decorative.
 */
export function LifeHeroStrokes() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mobile = window.matchMedia("(max-width: 767.98px)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const live = new Set<gsap.core.Timeline>();
    let spawner: gsap.core.Tween | undefined;
    let count = 0;
    let started = false;
    let onScreen = true;

    const palette = () => {
      const css = getComputedStyle(document.documentElement);
      const cream = css.getPropertyValue("--lp-cream").trim() || "#f8f0da";
      return TINTS.map(([token, t]) => mixHex(cream, css.getPropertyValue(token).trim(), t));
    };

    /** Free bands above and below the copy, measured now (the copy is the next sibling). */
    const zones = () => {
      const box = el.getBoundingClientRect();
      const copy = el.nextElementSibling?.firstElementChild?.getBoundingClientRect();
      return { w: box.width, list: strokeZones(box.height, copy ? copy.top - box.top : 0, copy ? copy.bottom - box.top : 0) };
    };

    /** Draws a stroke on its own canvas; `reveal(p)` shows it up to p (0–1) with a soft wet edge. */
    const addStroke = (plan: StrokePlan, painted: boolean, rnd: () => number) => {
      const s = document.createElement("canvas");
      Object.assign(s.style, {
        position: "absolute",
        left: `${plan.x}px`,
        top: `${plan.y}px`,
        width: `${plan.w}px`,
        height: `${plan.h}px`,
        transform: `rotate(${plan.rotate}deg) scaleX(${plan.flip ? -1 : 1})`,
      });
      paintDryStroke(s, plan.w, plan.h, plan.color, rnd);
      const reveal = (p: number) => {
        if (p >= 1) {
          s.style.maskImage = "";
          s.style.setProperty("-webkit-mask-image", "");
          return;
        }
        const at = p * 112; // past 100 so the soft edge clears the tail
        const mask = `linear-gradient(90deg, #000 ${(at - 12).toFixed(2)}%, transparent ${at.toFixed(2)}%)`;
        s.style.maskImage = mask;
        s.style.setProperty("-webkit-mask-image", mask);
      };
      reveal(painted ? 1 : 0);
      el.appendChild(s);
      return { s, reveal };
    };

    const spawn = () => {
      const { w, list } = zones();
      if (!w) return;
      const { s, reveal } = addStroke(planStroke(w, list, palette(), count++, Math.random), false, Math.random);
      const p = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          live.delete(tl);
          s.remove();
        },
      });
      // Fast at first, slowing as the brush lifts off.
      tl.to(p, { v: 1, duration: PAINT_S, ease: "power2.out", onUpdate: () => reveal(p.v) })
        // Drying: the paint fades back into the wall.
        .to(s, { autoAlpha: 0, duration: DRY_S, ease: "power1.in" }, PAINT_S + REST_S);
      live.add(tl);
    };

    const loop = () => {
      spawn();
      spawner = gsap.delayedCall(SPAWN_S, loop);
    };

    const running = () => started && onScreen && !document.hidden && mobile.matches;
    const sync = () => {
      const on = running();
      spawner?.paused(!on);
      live.forEach((t) => t.paused(!on));
    };

    const stop = () => {
      spawner?.kill();
      spawner = undefined;
      live.forEach((t) => t.kill());
      live.clear();
      el.replaceChildren();
    };

    const start = () => {
      if (!mobile.matches) return;
      stop();
      if (!motionOk) {
        const { w, list } = zones();
        const colors = palette();
        for (let i = 0; i < 3; i++) {
          const rnd = mulberry(7 + i);
          addStroke(planStroke(w, list, colors, i, rnd), true, rnd);
        }
        return;
      }
      started = true;
      // Two strokes straight away so the wall is never bare, then the steady rhythm.
      spawn();
      spawner = gsap.delayedCall(0.35, () => {
        spawn();
        spawner = gsap.delayedCall(SPAWN_S - 0.35, loop);
      });
      sync();
    };

    const cancelWait = whenLifePreloaderDone(start);
    const io = new IntersectionObserver(([e]) => {
      onScreen = !!e?.isIntersecting;
      sync();
    });
    io.observe(el);
    const onMedia = () => (mobile.matches ? start() : stop());
    mobile.addEventListener("change", onMedia);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelWait();
      io.disconnect();
      mobile.removeEventListener("change", onMedia);
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, []);

  return <div ref={root} aria-hidden className="lp-strokes" data-testid="home-hero-strokes" />;
}

/** Tiny seeded PRNG for the static (reduced-motion) layout, so it is the same on every visit. */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
