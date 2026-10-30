"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Button } from "@/components/atoms/Button";
import { TextLink } from "@/components/atoms/TextLink";
import { readConsent, subscribeConsent, writeConsent, type Consent } from "@/lib/analytics/consent";
import { trackEvent } from "@/lib/analytics/track";
import { consent as copy } from "@/lib/content";

const serverSnapshot = (): Consent | "server" => "server";

/**
 * Consent banner + Vercel Analytics (mounted only after "granted") + one delegated click listener.
 * CTA events use each button's stable data-testid as its id (convention: ends in "-button").
 */
export function AnalyticsGate() {
  const state = useSyncExternalStore<Consent | "server">(subscribeConsent, readConsent, serverSnapshot);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-testid$="-button"]');
      if (!el) return;
      const link = el.closest("a");
      trackEvent("cta_click", { id: el.dataset.testid ?? "", destination: link?.getAttribute("href") ?? "" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {state === "granted" && <Analytics />}
      {state === "unknown" && (
        <div role="region" aria-label={copy.title} data-testid="site-consent-banner" data-surface="dark" className="fixed inset-x-3 bottom-3 z-50 max-w-xl bg-forest p-5 text-cream shadow-[6px_6px_0_0_var(--lp-mustard)] sm:left-6 sm:bottom-6">
          <p className="text-lg font-bold">{copy.title}</p>
          <p className="mt-2 text-sm leading-relaxed">
            {copy.body} <TextLink href="/privacy" surface="dark">Privacy policy</TextLink>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button surface="dark" onClick={() => writeConsent("granted")} data-testid="site-consent-accept-button">
              {copy.accept}
            </Button>
            <Button surface="dark" variant="secondary" onClick={() => writeConsent("denied")} data-testid="site-consent-decline-button">
              {copy.decline}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
