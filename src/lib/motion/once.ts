import { gsap } from "gsap";
import { whenLifePreloaderDone } from "./preloader";

/**
 * Kind: ONCE. Plays a single time and is never replayed or reversed.
 * Entrance for above-the-fold content: waits for the preloader, then plays once.
 * Returns a cleanup that cancels the wait and reverts the tween.
 */
export function lifeEntranceOnLoad(targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  let tween: gsap.core.Tween | undefined;
  // Hide immediately (before the preloader ends) so there is no flash of final state.
  gsap.set(targets, { autoAlpha: 0, y: vars.y ?? 24 });
  const cancel = whenLifePreloaderDone(() => {
    tween = gsap.to(targets, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1,
      ...vars,
    });
  });
  return () => {
    cancel();
    tween?.kill();
    gsap.set(targets, { clearProps: "opacity,visibility,transform" });
  };
}

/**
 * Kind: ONCE (on scroll). Reveals `targets` a single time when `trigger` enters the viewport.
 * `once: true` means it never replays when scrolling back. Transforms are cleared on completion
 * so CSS hover transforms keep working afterwards.
 */
export function lifeRevealOnScrollOnce(trigger: Element, targets: gsap.TweenTarget, vars: gsap.TweenVars = {}) {
  gsap.set(targets, { autoAlpha: 0, y: 28 });
  const tween = gsap.to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.08,
    clearProps: "opacity,visibility,transform",
    scrollTrigger: { trigger, start: "top 82%", once: true },
    ...vars,
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(targets, { clearProps: "opacity,visibility,transform" });
  };
}
