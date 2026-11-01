/**
 * Paint strokes (ambient loop). Mobile hero backdrop: an invisible painter keeps laying brush strokes
 * in pale brand tints around the headline; each one paints in, rests, then fades as it "dries", so
 * only a few are ever on the wall. Every stroke is drawn fresh on a canvas as a dry brush mark
 * (paintDryStroke): a dense, blunt start that breaks up into streaks and splinters towards the tail.
 * Geometry and drawing here; the loop lives in the component.
 */

export type Zone = { top: number; bottom: number };
export type StrokePlan = { x: number; y: number; w: number; h: number; rotate: number; flip: boolean; color: string };

/** Stroke box height as a share of its width (the mark itself is thinner; the rest is tail spray). */
export const STROKE_RATIO = 0.36;

/** Mixes two #rrggbb colours (t = share of `b`). */
export function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.replace("#", ""), 16);
  const pb = parseInt(b.replace("#", ""), 16);
  const ch = (p: number, sh: number) => (p >> sh) & 255;
  const m = (sh: number) => Math.round(ch(pa, sh) + (ch(pb, sh) - ch(pa, sh)) * t);
  return `#${((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1)}`;
}

/**
 * Free bands above and below the copy (`textTop`…`textBottom`) on a screen `h` tall. A band too thin
 * for a stroke is dropped; if both are, the whole screen is used (the copy then simply sits on top).
 */
export function strokeZones(h: number, textTop: number, textBottom: number, minBand = 60): Zone[] {
  const zones = [
    { top: 0, bottom: Math.max(textTop - 8, 0) },
    { top: Math.min(textBottom + 8, h), bottom: h },
  ].filter((z) => z.bottom - z.top >= minBand);
  return zones.length ? zones : [{ top: 0, bottom: h }];
}

/**
 * One stroke: wide (70–110 % of the screen), centred somewhere in a zone (alternating zones by
 * `index` so they spread out), tilted up to ±14°, painted left→right or right→left.
 */
export function planStroke(w: number, zones: Zone[], colors: string[], index: number, rnd: () => number): StrokePlan {
  const zone = zones[index % zones.length] ?? { top: 0, bottom: w };
  const sw = w * (0.7 + rnd() * 0.4);
  const sh = sw * STROKE_RATIO;
  // Keep the body inside the zone where there is room, so strokes are not cut by the screen edge.
  const pad = Math.max(Math.min(sh * 0.3, (zone.bottom - zone.top) / 2 - 1), 0);
  const cy = zone.top + pad + rnd() * (zone.bottom - zone.top - 2 * pad);
  const cx = w * (0.15 + rnd() * 0.7);
  return {
    x: cx - sw / 2,
    y: cy - sh / 2,
    w: sw,
    h: sh,
    rotate: (rnd() - 0.5) * 28,
    flip: rnd() < 0.5,
    color: colors[index % colors.length] ?? colors[0] ?? "#f8f0da",
  };
}

/**
 * Draws one dry brush stroke, left to right, filling a w×h box (CSS px) on `canvas`.
 * The brush is a row of bristles grouped in clumps (as paint makes them stick together). Each clump
 * carries its own load: solid at first, then skipping (streaks with gaps that grow) as it runs dry,
 * and every bristle in a clump skips with it, so the stroke splits into separate fingers. Edge
 * clumps dry first, so the body tapers; starts are staggered on a curve for a blunt, rounded head.
 */
export function paintDryStroke(canvas: HTMLCanvasElement, w: number, h: number, color: string, rnd: () => number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const tones = [color, mixHex(color, "#ffffff", 0.16), mixHex(color, "#1f4a3a", 0.05)];
  const thick = h * (0.52 + rnd() * 0.12); // brush width across the stroke
  const x0 = w * 0.03;
  const x1 = w * 0.98;
  const len = x1 - x0;
  const bend = (rnd() - 0.5) * h * 0.22; // the whole stroke arcs a little
  const centre = (x: number) => h / 2 + bend * Math.sin(Math.PI * ((x - x0) / len));
  const step = 2;
  const steps = Math.ceil(len / step);

  // Clumps: 6–10 bands of uneven width across the brush, each with its own paint load and skip pattern.
  const clumpCount = 6 + Math.floor(rnd() * 5);
  const cuts = Array.from({ length: clumpCount - 1 }, () => rnd()).sort((a, b) => a - b);
  const bounds = [0, ...cuts, 1];
  const clumps = bounds.slice(1).map((hi, i) => {
    const lo = bounds[i] ?? 0;
    const edge = Math.abs((lo + hi) / 2 - 0.5) * 2; // 0 centre … 1 edge
    const load = len * Math.min(1, (0.55 + (1 - edge) * 0.45) * (0.8 + rnd() * 0.35));
    const solid = load * (0.55 + rnd() * 0.25);
    // Skip pattern along the stroke, shared by the clump's bristles.
    let on = true;
    const pattern = Array.from({ length: steps }, (_, k) => {
      const run = k * step;
      const dryness = run <= solid ? 0 : Math.min((run - solid) / (load - solid), 1);
      if (run > load) return false;
      if (dryness === 0) return (on = true);
      on = on ? rnd() > dryness * 0.12 : rnd() < (1 - dryness) * 0.18;
      return on;
    });
    return { lo, hi, load, solid, pattern };
  });

  const bristles = Math.round(thick * 0.9);
  for (let b = 0; b < bristles; b++) {
    const u = (b + rnd() * 0.8) / bristles; // 0 … 1 across the brush
    const clump = clumps.find((c) => u <= c.hi) ?? clumps[clumps.length - 1]!;
    const v = u * 2 - 1;
    const edge = Math.abs(v);
    // Blunt, rounded head: edge bristles touch down a little later.
    const start = edge * edge * w * 0.04 + rnd() * w * 0.012;
    // Each bristle runs dry at its own point (some strays go much further), and follows its clump's
    // skip pattern a few steps early or late, so gaps and ends are ragged rather than square.
    const stray = rnd() < 0.15;
    const own = stray ? len * (0.8 + rnd() * 0.2) : clump.load * (0.7 + rnd() * 0.45);
    const shift = Math.floor(rnd() * 14) - 7;
    let strayOn = true; // past its clump's load a stray draws long, thin streaks with rare breaks
    const lw0 = (thick / bristles) * (1.8 + rnd() * 1.4);
    const drift = (rnd() - 0.5) * h * 0.06; // bristles fan out slightly as they dry
    const phase = rnd() * 10;
    ctx.strokeStyle = tones[rnd() < 0.75 ? 0 : rnd() < 0.5 ? 1 : 2] ?? color;

    // Draw each painted run as its own path so its width can taper as the bristle dries.
    let run: Array<[number, number]> = [];
    const flush = (dryness: number) => {
      if (run.length > 1) {
        ctx.lineWidth = lw0 * (1 - dryness * 0.55);
        ctx.beginPath();
        run.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();
      }
      run = [];
    };
    let lastDry = 0;
    for (let k = 0; k < steps; k++) {
      const r = k * step;
      if (r < start) continue;
      const x = x0 + r;
      const dryness = r <= clump.solid ? 0 : Math.min((r - clump.solid) / (clump.load - clump.solid), 1);
      // The bristle follows its clump, with a little independence once it is dry.
      const follows = clump.pattern[Math.min(Math.max(k + shift, 0), steps - 1)] ?? false;
      if (stray && r > clump.load) strayOn = strayOn ? rnd() > 0.04 : rnd() < 0.12;
      const painted = r <= own && (stray && r > clump.load ? strayOn : follows) && !(dryness > 0.3 && rnd() < dryness * 0.05);
      if (!painted) {
        flush(lastDry);
        continue;
      }
      const y = centre(x) + v * (thick / 2) * (1 + dryness * 0.25) + drift * dryness + Math.sin(phase + x * 0.04) * 0.5;
      run.push([x, y]);
      lastDry = dryness;
    }
    flush(lastDry);
  }

  // A few specks thrown off the tail.
  ctx.fillStyle = color;
  for (let i = 0; i < 10; i++) {
    const x = x0 + len * (0.6 + rnd() * 0.4);
    const y = centre(x) + (rnd() - 0.5) * thick * 1.2;
    ctx.beginPath();
    ctx.arc(x, y, 0.4 + rnd() * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}
