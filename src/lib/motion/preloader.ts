/**
 * Preloader coordination (kind: PRELOADER).
 * `html[data-lp-preloader]` is set before paint by the inline script in the layout:
 *   "pending" → first visit this session, animation will run
 *   "skip"    → seen this session, reduced motion, or storage unavailable
 *   "done"    → set by LifePaintingPreloader when it finishes
 * Absent (no JS) the overlay is hidden by CSS and the site is simply visible.
 * Watchdog: the overlay only leaves when the app's JS finishes it, so if that JS never arrives or
 * fails (chunk error, hydration error, a promise that never settles) the boot script releases it
 * after PRELOADER_WATCHDOG_MS. LifePaintingPreloader clears that timer when it mounts and keeps its
 * own, shorter deadline from there.
 */
export const PRELOADER_STORAGE_KEY = "lp-preloader-seen";
export const PRELOADER_EVENT = "lp:preloader-done";
export const PRELOADER_WATCHDOG_MS = 8000;

declare global {
  interface Window {
    /** Boot-script watchdog timer (see above). */
    __lpPreloaderWatchdog?: number;
  }
}

export const LIFE_PRELOADER_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{d.dataset.lpPreloader=(sessionStorage.getItem("${PRELOADER_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)?"skip":"pending"}catch(e){d.dataset.lpPreloader="skip"}if(d.dataset.lpPreloader==="pending")window.__lpPreloaderWatchdog=setTimeout(function(){if(d.dataset.lpPreloader!=="pending")return;d.dataset.lpPreloader="done";dispatchEvent(new Event("${PRELOADER_EVENT}"))},${PRELOADER_WATCHDOG_MS})})()`;

export function markLifePreloaderDone() {
  if (document.documentElement.dataset.lpPreloader === "done") return;
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
