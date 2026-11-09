"use client";

import { X } from "lucide-react";
import { useRef } from "react";
import { TextLink } from "@/components/atoms/TextLink";
import { PrivacyBody } from "@/components/molecules/PrivacyBody";
import { privacy } from "@/lib/content";

/**
 * "Privacy policy" link that opens the policy in a modal <dialog>, so leaving the form never loses
 * what was typed (owner, 2026-11-09). The native dialog traps focus, closes on Esc and returns focus
 * to the link. Without JS the link still goes to /privacy.
 */
export function PrivacyDialog({ label, closeLabel }: { label: string; closeLabel: string }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <TextLink
        href="/privacy"
        aria-haspopup="dialog"
        onClick={(e) => {
          e.preventDefault();
          dialog.current?.showModal();
        }}
        data-testid="home-contact-privacy-link"
      >
        {label}
      </TextLink>
      <dialog
        ref={dialog}
        aria-labelledby="privacy-dialog-title"
        // A click on the backdrop lands on the <dialog> itself; clicks on the content land on its children.
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        data-testid="home-contact-privacy-dialog"
        className="m-auto max-h-[min(85svh,52rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain border-2 border-forest bg-cream p-0 text-forest shadow-[8px_8px_0_0_var(--lp-mustard)] backdrop:bg-forest/75"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-cream px-5 pt-5 pb-3 sm:px-8 sm:pt-8">
          <h2 id="privacy-dialog-title" className="lp-title text-2xl sm:text-3xl">
            {privacy.title}
          </h2>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={closeLabel}
            className="inline-flex size-11 shrink-0 items-center justify-center border-2 border-forest transition-transform hover:-translate-y-0.5"
            data-testid="home-contact-privacy-close"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="px-5 pb-8 sm:px-8 sm:pb-10">
          <PrivacyBody headingAs="h3" />
        </div>
      </dialog>
    </>
  );
}
