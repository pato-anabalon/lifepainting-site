/**
 * Preloader coordination (kind: PRELOADER).
 * `html[data-lp-preloader]` is set before paint by the inline script in the layout:
 *   "pending" → first visit this session, animation will run
 *   "skip"    → seen this session, reduced motion, or storage unavailable
 *   "done"    → set by LifePaintingPreloader when it finishes
 * Absent (no JS) the overlay is hidden by CSS and the site is simply visible.
 */
export const PRELOADER_STORAGE_KEY = "lp-preloader-seen";
export const PRELOADER_EVENT = "lp:preloader-done";

export const LIFE_PRELOADER_BOOT_SCRIPT = `try{var d=document.documentElement;d.dataset.lpPreloader=(sessionStorage.getItem("${PRELOADER_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)?"skip":"pending"}catch(e){document.documentElement.dataset.lpPreloader="skip"}`;

export function markLifePreloaderDone() {
  try {
    sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
  } catch {
    /* storage blocked: the preloader simply runs again next visit */
  }
  document.documentElement.dataset.lpPreloader = "done";
  window.dispatchEvent(new Event(PRELOADER_EVENT));
}

/** Runs `cb` once the preloader is finished (or was never going to run). Returns a cleanup. */
export function whenLifePreloaderDone(cb: () => void): () => void {
  const state = document.documentElement.dataset.lpPreloader;
  if (state !== "pending") {
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  }
  window.addEventListener(PRELOADER_EVENT, cb, { once: true });
  return () => window.removeEventListener(PRELOADER_EVENT, cb);
}
