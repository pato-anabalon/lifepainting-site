import { describe, expect, it } from "vitest";
import { brushLayout, strokeMs } from "./brushWipe";

const SCREENS: Array<[number, number]> = [
  [1440, 900],
  [1920, 1080],
  [1024, 768],
  [768, 1024],
  [390, 844],
  [375, 667],
];

describe("brush wipe layout", () => {
  it("runs along the long side: across on landscape, down on portrait", () => {
    expect(brushLayout(1440, 900).transpose).toBe(false);
    expect(brushLayout(390, 844).transpose).toBe(true);
  });

  it("covers the whole screen with overlapping rows", () => {
    for (const [w, h] of SCREENS) {
      const { long, short, rows } = brushLayout(w, h);
      const first = rows[0]!;
      const last = rows[rows.length - 1]!;
      expect(first.top).toBeLessThan(0);
      expect(last.top + last.height).toBeGreaterThan(short);
      for (let i = 1; i < rows.length; i++) expect(rows[i]!.top).toBeLessThan(rows[i - 1]!.top + rows[i - 1]!.height);
      expect(first.left).toBeLessThan(0);
      expect(first.left + first.width).toBeGreaterThan(long);
    }
  });

  it("keeps the stroke close to its own proportions", () => {
    for (const [w, h] of SCREENS) {
      const { rows } = brushLayout(w, h);
      const r = rows[0]!;
      const stretch = r.width / r.height / (1000 / 205);
      expect(stretch).toBeGreaterThan(0.6);
      expect(stretch).toBeLessThan(1.6);
      expect(rows.length).toBeGreaterThanOrEqual(2);
      expect(rows.length).toBeLessThanOrEqual(6);
    }
  });

  it("fits every stroke into the total time", () => {
    const n = 4;
    const ms = strokeMs(n, 1500);
    // Last stroke starts after (n - 1) overlapped strokes and ends exactly at the total.
    expect((n - 1) * ms * 0.85 + ms).toBeCloseTo(1500);
  });
});
