/** Analytics consent. "unknown" = not decided yet (or storage unavailable): nothing is collected. */
export type Consent = "unknown" | "granted" | "denied";

const KEY = "lp-consent";
const EVENT = "lp:consent-change";

export function readConsent(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : "unknown";
  } catch {
    return "unknown";
  }
}

export function writeConsent(value: Exclude<Consent, "unknown"> | "reset") {
  try {
    if (value === "reset") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, value);
  } catch {
    /* storage blocked: the choice simply isn't remembered */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeConsent(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
