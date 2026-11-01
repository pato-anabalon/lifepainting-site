import { describe, expect, it } from "vitest";
import { clamp, smoothToward } from "./smooth";

describe("smooth helpers", () => {
  it("clamps to the range", () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.4, 0, 1)).toBe(0.4);
    expect(clamp(2, 0, 1)).toBe(1);
  });

  it("eases toward the target independent of frame rate and snaps at the end", () => {
    const a = smoothToward(0, 1, 16);
    expect(a).toBeGreaterThan(0);
    expect(a).toBeLessThan(1);
    // Two 16 ms steps ≈ one 32 ms step.
    expect(smoothToward(smoothToward(0, 1, 16), 1, 16)).toBeCloseTo(smoothToward(0, 1, 32), 5);
    expect(smoothToward(0.9999, 1, 16)).toBe(1);
  });
});
