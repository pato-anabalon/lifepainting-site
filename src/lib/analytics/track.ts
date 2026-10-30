import { track as vercelTrack } from "@vercel/analytics";
import { readConsent } from "@/lib/analytics/consent";

type Props = Record<string, string | number | boolean | null>;

/**
 * Single entry point for custom events. Does nothing unless analytics consent was granted.
 * Event names: cta_click, form_start, form_step, form_submit. Never pass personal data.
 */
export function trackEvent(name: "cta_click" | "form_start" | "form_step" | "form_submit", props: Props = {}) {
  if (typeof window === "undefined" || readConsent() !== "granted") return;
  vercelTrack(name, { origin: window.location.pathname, ...props });
}
