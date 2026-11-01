"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { clamp, smoothToward } from "@/lib/motion/smooth";
import { whenLifePreloaderDone } from "@/lib/motion/preloader";

/**
 * Tile geometry (HeroSection). Aspect ratio (the photo's own, so nothing is cropped), a nudge from the grid cell (vw) and a signed
 * depth: positive tiles float towards the viewer and follow the mouse, negative ones sit behind and
 * move against it. Every tile has its own depth, so the layers separate. Same order as the photos.
 */
const TILES: Array<{
  w: number;
  h: number;
  top: number;
  left: number;
  depth: number;
  focus?: string;
}> = [
  { w: 1264, h: 843, top: -5.4, left: -7.6, depth: -2 },
  { w: 1587, h: 2380, top: 7.1, left: -6.8, depth: 1 },
  { w: 1740, h: 1160, top: -7, left: 2, depth: -3 },
  { w: 1740, h: 1160, top: 4.2, left: -2.1, depth: 3 },
  { w: 1750, h: 1161, top: -8.7, left: -2.1, depth: 4 },
  { w: 1740, h: 1160, top: 9.2, left: -4.3, depth: -1 },
  { w: 960, h: 1091, top: -11.1, left: 10.4, depth: 2 },
  { w: 1171, h: 781, top: -3.7, left: 13.2, depth: 5 },
  { w: 1635, h: 2180, top: -9, left: -10.6, depth: -4 },
  { w: 1635, h: 2180, top: 7.1, left: 1.8, depth: -2 },
  { w: 1170, h: 780, top: -8.2, left: 0.7, depth: 3 },
  { w: 1571, h: 2461, top: 5.4, left: 3.3, depth: 1 },
];

/** How far the whole grid drifts with the mouse, in vw each way (the reference uses 20). */
const GRID_DRIFT = 14;
/** Extra drift per unit of tile depth (vw each way). */
const DEPTH_DRIFT = 1.2;
/** Distance towards / away from the viewer per unit of depth (px, inside a 1200px perspective). */
const DEPTH_Z = 45;
/** Mouse easing time constant (ms): slow and floaty, like the reference's 0.03 lerp at 60 fps. */
const MOUSE_TAU = 520;
const INTRO_DELAY = 200;
const INTRO_MS = 1400;

type Props = { photos: Array<{ src: string }>; children: ReactNode };

/**
 * Mock-up hero: a floating collage that drifts with the mouse (fine pointers only) and, on scroll,
 * lifts, grows and fades away behind the sticky headline. One rAF loop; it stops when everything
 * has caught up. Static (no JS / reduced motion): collage at rest, one screen tall.
 */
export function LifeHeroCollage({ photos, children }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const center = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const tiles = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const motionOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    if (!motionOk.matches) return;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const trackEl = track.current;
    const stageEl = stage.current;
    const layerEl = layer.current;
    const centerEl = center.current;
    const gridEl = grid.current;
    const tileEls = tiles.current;
    if (!trackEl || !stageEl || !layerEl || !centerEl || !gridEl) return;

    let raf = 0;
    let last = 0;
    let introStart = -1;
    let introDone = false;
    const mouseTarget = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    let scroll = -1;

    const scrollTarget = () => {
      const stickyTop = parseFloat(getComputedStyle(stageEl).top) || 0;
      const distance = trackEl.offsetHeight - stageEl.offsetHeight;
      return distance > 0
        ? clamp(
            (stickyTop - trackEl.getBoundingClientRect().top) / distance,
            0,
            1,
          )
        : 0;
    };

    const tick = (now: number) => {
      raf = 0;
      const dt = last ? now - last : 16;

      // ONCE: intro (after the preloader) — fade in and grow from 0.8.
      let scale = 1;
      let opacity = 1;
      if (!introDone) {
        if (introStart < 0) {
          scale = 0.8;
          opacity = 0;
        } else {
          const t = clamp((now - introStart - INTRO_DELAY) / INTRO_MS, 0, 1);
          const e = 1 - Math.pow(1 - t, 3);
          scale = 0.8 + 0.2 * e;
          opacity = e;
          if (t >= 1) introDone = true;
        }
      }

      // HOVER-ish: mouse parallax, eased.
      mouse.x = smoothToward(mouse.x, mouseTarget.x, dt, MOUSE_TAU, 0.0005);
      mouse.y = smoothToward(mouse.y, mouseTarget.y, dt, MOUSE_TAU, 0.0005);
      // mx/my run from -1 (left/top) to 1 (right/bottom).
      const mx = 2 * mouse.x - 1;
      const my = 2 * mouse.y - 1;
      const gx = -GRID_DRIFT * mx;
      const gy = -GRID_DRIFT * my;
      // The grid pans away from the cursor (no tilt); the perspective lives on the centre.
      gridEl.style.transform = `translate3d(${gx.toFixed(3)}vw, ${gy.toFixed(3)}vw, 0) scale3d(${scale}, ${scale}, 1)`;
      // Opacity on the centre, not the grid: opacity < 1 on the grid would flatten its 3D children.
      centerEl.style.opacity = String(opacity);
      TILES.forEach((tile, i) => {
        const el = tileEls[i];
        if (!el) return;
        const ix = -tile.depth * DEPTH_DRIFT * mx;
        const iy = -tile.depth * DEPTH_DRIFT * my;
        el.style.transform = `translate3d(${ix.toFixed(3)}vw, ${iy.toFixed(3)}vw, ${tile.depth * DEPTH_Z}px)`;
      });

      // SCRUB: scroll lifts, grows and fades the collage (eased so it never jumps).
      const target = scrollTarget();
      scroll = scroll < 0 ? target : smoothToward(scroll, target, dt, 180);
      const p = scroll;
      const blur = finePointer ? p * 10 : 0;
      // Never fully gone: what is left of the collage scrolls out with the headline, so no blank screen.
      layerEl.style.transform = `translate3d(0, ${(-p * 70).toFixed(2)}%, 0) scale(${(1 + 0.2 * p).toFixed(4)})`;
      layerEl.style.opacity = String((1 - 0.75 * p).toFixed(3));
      layerEl.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "";

      const settled =
        introDone &&
        mouse.x === mouseTarget.x &&
        mouse.y === mouseTarget.y &&
        scroll === target;
      last = settled ? 0 : now;
      if (!settled) schedule();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseTarget.x = e.clientX / window.innerWidth;
      mouseTarget.y = e.clientY / window.innerHeight;
      schedule();
    };

    const cancelWait = whenLifePreloaderDone(() => {
      introStart = performance.now();
      schedule();
    });
    if (finePointer)
      window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      cancelWait();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      for (const el of [layerEl, centerEl, gridEl, ...tileEls])
        el?.removeAttribute("style");
    };
  }, []);

  return (
    <div ref={track} className="lp-collage" data-testid="home-hero-collage">
      <div ref={stage} className="lp-collage-stage">
        <div ref={layer} className="lp-collage-layer" aria-hidden>
          <div ref={center} className="lp-collage-center">
            <div ref={grid} className="lp-collage-grid">
              {TILES.map((tile, i) => {
                const photo = photos[i];
                if (!photo) return null;
                return (
                  <div
                    key={photo.src}
                    ref={(el) => {
                      tiles.current[i] = el;
                    }}
                    className="lp-collage-tile"
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: `${tile.w} / ${tile.h}`,
                        top: `${tile.top}vw`,
                        left: `${tile.left}vw`,
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        loading="eager"
                        sizes="(min-width: 1024px) 20vw, (min-width: 768px) 30vw, 40vw"
                        className="object-cover"
                        style={{ objectPosition: tile.focus ?? "50% 50%" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative z-10 flex w-full justify-center px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
