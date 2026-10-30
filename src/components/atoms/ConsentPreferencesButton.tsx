"use client";

import { writeConsent } from "@/lib/analytics/consent";
import { consent } from "@/lib/content";

/** Re-opens the consent banner (clears the stored choice). */
export function ConsentPreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => writeConsent("reset")} data-testid="site-footer-cookie-preferences" className={className}>
      {consent.manage}
    </button>
  );
}
