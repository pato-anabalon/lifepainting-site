"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { nav } from "@/lib/content";

/**
 * Sticky header. Client Component only for the mobile menu state.
 * Tracking for the CTA is added in Phase 3 through a small wrapper.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      data-testid="site-header"
      data-surface="dark"
      className="sticky top-0 z-50 bg-forest text-cream"
      style={{ height: "var(--lp-header-h)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Life Painting – home" data-testid="site-header-logo" className="flex items-center">
          <Logo variant="wide" surface="dark" priority className="-my-3 w-24 sm:w-28" />
        </Link>

        <nav aria-label="Primary" data-testid="site-nav" className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {nav.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  data-testid={`site-nav-${item.id}-link`}
                  className="text-base font-bold underline decoration-transparent decoration-2 underline-offset-8 transition-colors hover:decoration-sun"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href={nav.cta.href} surface="dark" data-testid="site-header-quote-button" className="min-h-11 px-5 py-2">
            {nav.cta.label}
          </Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? nav.mobileMenuClose : nav.mobileMenuOpen}
          data-testid="site-nav-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-12 items-center justify-center border-2 border-cream md:hidden"
        >
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>
      </div>

      {open && (
        <nav
          id={panelId}
          aria-label="Mobile"
          data-testid="site-nav-mobile-panel"
          className="absolute inset-x-0 top-full bg-forest px-5 pb-6 pt-2 shadow-[0_12px_0_0_var(--lp-mustard)] md:hidden"
        >
          <ul>
            {nav.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center text-lg font-bold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href={nav.cta.href} surface="dark" onClick={() => setOpen(false)} className="mt-5 w-full" data-testid="site-nav-mobile-quote-button">
            {nav.cta.label}
          </Button>
        </nav>
      )}
    </header>
  );
}
