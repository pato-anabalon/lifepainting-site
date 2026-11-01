/** Small numeric helpers for hand-rolled rAF loops (LifeHeroCollage). No React, no GSAP. */

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Frame-rate independent easing of `current` toward `target` (exponential, time constant `tau` ms).
 * Snaps when close enough so the loop can stop.
 */
export function smoothToward(current: number, target: number, dtMs: number, tau = 110, epsilon = 0.0005): number {
  const next = current + (target - current) * (1 - Math.exp(-Math.max(dtMs, 0) / tau));
  return Math.abs(target - next) < epsilon ? target : next;
}
