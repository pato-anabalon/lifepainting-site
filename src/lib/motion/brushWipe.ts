/**
 * Brush wipe (kind: PRELOADER). After the monogram, overlapping rows of a painted brush stroke cover
 * the preloader in cream, one after another, from the top-left corner to the bottom-right one.
 * Each row is a sprite sheet (22 frames of a real stroke, already tinted to --lp-cream) stepped with
 * GSAP, so the paint has real bristle texture and sheen instead of a flat wipe.
 * Strokes run along the longer side of the screen: across on landscape, down on portrait.
 */

import { gsap } from "gsap";

export const BRUSH_SPRITE = "/brush/brush-stroke-cream.webp";
/** Sprite sheet: 1000×205 frames stacked vertically (1000×4510). */
export const BRUSH_FRAMES = 22;
const FRAME_RATIO = 1000 / 205;
/** Each row starts this share of a row height below the previous one (rows overlap by 22%). */
const ROW_STEP = 0.78;
/** Extra cover past the short edges, so ragged stroke edges never leave a gap at the borders. */
const BLEED = 0.1;

export type BrushRow = { top: number; left: number; width: number; height: number };
export type BrushLayout = { transpose: boolean; long: number; short: number; rows: BrushRow[] };

/**
 * Rows for a w×h screen. The row count is the one (2–6) whose natural stroke length is closest to
 * the long side, so the sprite is stretched or cropped as little as possible. Rows shorter than the
 * long side are stretched to fit; longer ones are centred and cropped at both ends.
 */
export function brushLayout(w: number, h: number): BrushLayout {
  const transpose = h > w;
  const long = Math.max(w, h);
  const short = Math.min(w, h);
  const covered = short * (1 + BLEED);
  const rowHeight = (n: number) => covered / (1 + ROW_STEP * (n - 1));
  let n = 2;
  for (let k = 3; k <= 6; k++) {
    if (Math.abs(Math.log((rowHeight(k) * FRAME_RATIO) / long)) < Math.abs(Math.log((rowHeight(n) * FRAME_RATIO) / long))) n = k;
  }
  const height = rowHeight(n);
  const width = Math.max(long * 1.02, height * FRAME_RATIO);
  const rows = Array.from({ length: n }, (_, i) => ({
    top: -short * (BLEED / 2) + i * height * ROW_STEP,
    left: (long - width) / 2,
    width,
    height,
  }));
  return { transpose, long, short, rows };
}

/** Each row's stroke time when `totalMs` covers all of them and rows overlap by `overlap` of a stroke. */
export function strokeMs(rows: number, totalMs: number, overlap = 0.15): number {
  return totalMs / (1 + (1 - overlap) * (rows - 1));
}

/**
 * Builds the rows inside `host` (an absolutely positioned, full-screen element) and returns the
 * timeline that paints them. The caller owns playback and cleanup (`tl.kill()`, emptying `host`).
 */
export function buildBrushWipe(host: HTMLElement, totalMs: number): gsap.core.Timeline {
  const { transpose, long, short, rows } = brushLayout(window.innerWidth, window.innerHeight);
  const stage = document.createElement("div");
  // Transpose (swap x and y) on portrait: the same layout then runs down the screen, left to right.
  Object.assign(stage.style, {
    position: "absolute",
    left: "0",
    top: "0",
    width: `${long}px`,
    height: `${short}px`,
    transformOrigin: "0 0",
    transform: transpose ? "matrix(0, 1, 1, 0, 0, 0)" : "none",
  });
  const els = rows.map((r) => {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "absolute",
      top: `${r.top}px`,
      left: `${r.left}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      backgroundImage: `url(${BRUSH_SPRITE})`,
      backgroundSize: `100% ${BRUSH_FRAMES * 100}%`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "0 0%",
    });
    stage.appendChild(el);
    return el;
  });
  host.appendChild(stage);

  const dur = strokeMs(rows.length, totalMs) / 1000;
  const tl = gsap.timeline({ paused: true });
  els.forEach((el, i) => {
    // steps(n) lands on n + 1 values: frame 0 (empty) through the last, fully painted frame.
    tl.to(el, { backgroundPositionY: "100%", duration: dur, ease: `steps(${BRUSH_FRAMES - 1})` }, i * dur * 0.85);
  });
  return tl;
}

/** Resolves once the sprite is decoded (or failed), so the first stroke never paints a blank frame. */
export function loadBrushSprite(): Promise<boolean> {
  const img = new Image();
  img.src = BRUSH_SPRITE;
  return img.decode().then(
    () => true,
    () => false,
  );
}
