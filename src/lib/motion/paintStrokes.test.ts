import { describe, expect, it } from "vitest";
import { mixHex, planStroke, strokeZones } from "./paintStrokes";

describe("paint strokes", () => {
  it("keeps the free bands above and below the copy", () => {
    expect(strokeZones(844, 240, 650)).toEqual([
      { top: 0, bottom: 232 },
      { top: 658, bottom: 844 },
    ]);
    // A band too thin is dropped; with no room at all the whole screen is used.
    expect(strokeZones(844, 30, 650)).toEqual([{ top: 658, bottom: 844 }]);
    expect(strokeZones(600, 20, 590)).toEqual([{ top: 0, bottom: 600 }]);
  });

  it("centres each stroke inside its zone, alternating zones and colours", () => {
    const zones = strokeZones(844, 240, 650);
    const colors = ["#a", "#b", "#c"];
    for (let i = 0; i < 12; i++) {
      const s = planStroke(390, zones, colors, i, Math.random);
      const zone = zones[i % 2]!;
      const cy = s.y + s.h / 2;
      expect(cy).toBeGreaterThanOrEqual(zone.top);
      expect(cy).toBeLessThanOrEqual(zone.bottom);
      expect(s.color).toBe(colors[i % 3]);
      expect(Math.abs(s.rotate)).toBeLessThanOrEqual(14);
    }
  });

  it("mixes brand colours into cream", () => {
    expect(mixHex("#f8f0da", "#ffffff", 0.5)).toBe("#fcf8ed");
  });
});
