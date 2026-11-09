import { describe, expect, it } from "vitest";
import { nextShown } from "./gallery";

describe("nextShown", () => {
  it("swaps in exactly the photos not on screen", () => {
    const next = nextShown(6, [0, 1, 2]);
    expect([...next].sort()).toEqual([3, 4, 5]);
    expect([...nextShown(6, next)].sort()).toEqual([0, 1, 2]);
  });

  it("tops up from the current set when too few are hidden", () => {
    const next = nextShown(4, [0, 1, 2]);
    expect(next).toHaveLength(3);
    expect(next[0]).toBe(3);
    expect(new Set(next).size).toBe(3);
  });

  it("keeps the same set when nothing is hidden", () => {
    expect([...nextShown(3, [0, 1, 2])].sort()).toEqual([0, 1, 2]);
  });
});
