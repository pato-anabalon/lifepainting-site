"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { LifeAtomicShapes } from "@/components/atoms/LifeAtomicShapes";
import { LifeRetroRibbon } from "@/components/atoms/LifeRetroStripes";
import { Logo } from "@/components/atoms/Logo";
import { LIFE_MOTION_OK, gsap } from "@/lib/motion/register";
import { nav, site } from "@/lib/content";

/**
 * Sticky header. Client Component for the mobile menu state and, on pages whose hero is marked
 * `data-lp-header-auto`, to reveal the header once that hero has been scrolled past (CSS in
 * globals.css hides it until `data-shown` is set).
 *
 * Desktop nav (lg+; five links plus the CTA do not fit below 1024px): marks the section in view (scroll-spy) with a sun bar under its link that slides
 * and resizes to the next link as the visitor moves between sections (`aria-current` on the link).
 *
 * Mobile menu (below lg, phones and tablets): full screen under the header bar. It opens as a circle growing from the
 * toggle, then the links rise in one after another and the graphic elements settle in; closing runs
 * the other way. While open: page scroll is locked, the page behind is inert (focus stays in the
 * menu), Escape or the toggle closes it and focus returns to the toggle. Reduced motion: no animation.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  // Stays true while the closing animation runs, so the panel is still there to animate.
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  // Scroll-spy: id of the nav item whose section is in view, and the bar under its link.
  const [active, setActive] = useState<string | null>(null);
  const navListRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const openMenu = () => {
    setMounted(true);
    setOpen(true);
  };
  const closeMenu = () => {
    setOpen(false);
    // Without motion there is no exit animation to wait for.
    if (!window.matchMedia(LIFE_MOTION_OK).matches) setMounted(false);
  };
  const panelId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // The header lives in the layout, so look for the page's hero again on every route change.
  const pathname = usePathname();

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-lp-header-auto]");
    if (!hero) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      // Shown once the next section reaches the header's band.
      setShown(hero.getBoundingClientRect().bottom <= (headerRef.current?.offsetHeight ?? 0));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Scroll-spy: the active section is the one crossing a line a third of the way down the screen.
  useEffect(() => {
    const targets = nav.items
      .map((item) => ({ id: item.id, el: document.getElementById(item.href.split("#")[1] ?? "") }))
      .filter((t): t is { id: (typeof nav.items)[number]["id"]; el: HTMLElement } => !!t.el);
    if (!targets.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = (headerRef.current?.offsetHeight ?? 0) + window.innerHeight * 0.3;
      const hit = targets.find(({ el }) => {
        const r = el.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      });
      setActive(hit?.id ?? null);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Move the bar under the active link (and follow it if the layout changes, e.g. fonts loading).
  useLayoutEffect(() => {
    const list = navListRef.current;
    const bar = barRef.current;
    if (!list || !bar) return;
    const place = () => {
      const link = active ? list.querySelector<HTMLElement>(`[data-nav-id="${active}"]`) : null;
      if (!link) {
        bar.style.opacity = "0";
        return;
      }
      bar.style.opacity = "1";
      bar.style.width = `${link.offsetWidth}px`;
      bar.style.transform = `translateX(${link.offsetLeft}px)`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    // Leaving the mobile layout (rotation, resize) closes the menu.
    const wide = window.matchMedia("(min-width: 1024px)");
    const onWide = () => wide.matches && closeMenu();
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  // Mobile menu: lock the page while open, and run the enter / exit animation.
  useEffect(() => {
    const root = document.documentElement;
    const behind = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean) as HTMLElement[];
    if (!open) {
      // Closing: release the page straight away (a link's own scroll must not be blocked).
      root.style.overflow = "";
      behind.forEach((el) => (el.inert = false));
    }
    const panel = panelRef.current;
    if (!mounted || !panel) return;
    const motionOk = window.matchMedia(LIFE_MOTION_OK).matches;
    const items = panel.querySelectorAll("[data-menu-item]");
    const art = panel.querySelectorAll("[data-menu-art]");
    // The circle grows from the toggle's centre. clip-path is measured from the panel's own box,
    // which starts under the header bar, so the toggle's position is taken relative to the panel
    // (its centre sits above the panel's top edge; both move together with the bar).
    // Radius from the screen size, not the panel's: opened from the hero (keyboard), the bar is still
    // sliding in and the panel is not full height yet when this runs.
    const t = toggleRef.current?.getBoundingClientRect();
    const box = panel.getBoundingClientRect();
    const cx = t ? t.left + t.width / 2 - box.left : box.width;
    const cy = t ? t.top + t.height / 2 - box.top : 0;
    const at = `${cx.toFixed(0)}px ${cy.toFixed(0)}px`;
    const radius = Math.ceil(Math.hypot(Math.max(cx, window.innerWidth - cx), window.innerHeight + Math.abs(cy)));
    const full = `circle(${radius}px at ${at})`;
    const none = `circle(0px at ${at})`;

    if (open) {
      root.style.overflow = "hidden";
      behind.forEach((el) => (el.inert = true));
      const first = panel.querySelector<HTMLElement>("a");
      if (!motionOk) {
        first?.focus();
        return;
      }
      const tl = gsap.timeline({ onComplete: () => first?.focus() });
      tl.fromTo(panel, { clipPath: none }, { clipPath: full, duration: 0.55, ease: "power3.inOut" })
        .fromTo(items, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out", stagger: 0.06 }, 0.22)
        .fromTo(art, { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.1 }, 0.35);
      return () => {
        tl.kill();
      };
    }

    if (!motionOk) return;
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to([...art, ...items].reverse(), { y: -12, autoAlpha: 0, duration: 0.2, ease: "power2.in", stagger: 0.03 })
      .to(panel, { clipPath: none, duration: 0.4, ease: "power3.in" }, 0.15);
    return () => {
      tl.kill();
    };
  }, [open, mounted]);

  // Never leave the page locked if the header unmounts with the menu open.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = "";
      [document.querySelector("main"), document.querySelector("footer")].forEach((el) => el && ((el as HTMLElement).inert = false));
    },
    [],
  );

  return (
    <header
      ref={headerRef}
      data-testid="site-header"
      data-surface="dark"
      // Keep the bar (logo + close button) visible over the hero while the menu is open.
      data-shown={shown || open || undefined}
      className="lp-header sticky top-0 z-50 bg-forest text-cream"
      style={{ height: "var(--lp-header-h)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Life Painting – home"
          data-testid="site-header-logo"
          className="flex items-center"
          onClick={(e) => {
            // Already home: a same-URL navigation does not reliably scroll, so go to the top ourselves.
            if (pathname !== "/") return;
            e.preventDefault();
            closeMenu();
            window.scrollTo({ top: 0 });
          }}
        >
          <Logo variant="wide" surface="dark" priority className="w-24 sm:w-28" />
        </Link>

        <nav aria-label="Primary" data-testid="site-nav" className="hidden items-center gap-8 lg:flex">
          <ul ref={navListRef} className="relative flex items-center gap-8">
            {nav.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  data-nav-id={item.id}
                  aria-current={active === item.id ? "true" : undefined}
                  data-testid={`site-nav-${item.id}-link`}
                  className="text-base font-bold transition-colors hover:text-sun focus-visible:text-sun"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Scroll-spy bar: slides and resizes to the active link (CSS `.lp-nav-bar`). Hover colours the
                text yellow instead of underlining, so it never reads as this bar. */}
            <span ref={barRef} aria-hidden data-testid="site-nav-active-bar" className="lp-nav-bar" />
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
          onClick={() => (open ? closeMenu() : openMenu())}
          className="inline-flex size-12 items-center justify-center border-2 border-cream lg:hidden"
        >
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>
      </div>

      {mounted && (
        <div
          ref={panelRef}
          id={panelId}
          data-testid="site-nav-mobile-panel"
          className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto bg-forest px-5 pb-8 sm:px-8 lg:hidden"
          style={{ top: "var(--lp-header-h)" }}
        >
          {/* Graphic elements: atomic shapes up in the corner, a retro ribbon painting in along the foot. */}
          <div data-menu-art aria-hidden className="pointer-events-none absolute top-3 right-3 w-24 sm:top-6 sm:w-32">
            <LifeAtomicShapes />
          </div>
          <div data-menu-art aria-hidden className="pointer-events-none absolute bottom-0 left-0 w-3/5 max-w-xs">
            <LifeRetroRibbon colors={["var(--lp-azure)", "var(--lp-yellow)", "var(--lp-mustard)", "var(--lp-cream)"]} rootMargin="0px" />
          </div>

          <nav aria-label="Mobile" className="relative mt-10">
            <ul className="flex flex-col gap-2">
              {nav.items.map((item) => (
                <li key={item.id} data-menu-item>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    data-testid={`site-nav-mobile-${item.id}-link`}
                    className="lp-title inline-flex min-h-14 items-center text-4xl font-bold underline decoration-transparent decoration-4 underline-offset-8 transition-colors hover:decoration-sun focus-visible:decoration-sun"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div data-menu-item className="relative mt-8">
            <Button href={nav.cta.href} surface="dark" onClick={closeMenu} className="w-full" data-testid="site-nav-mobile-quote-button">
              {nav.cta.label}
            </Button>
          </div>
          <ul data-menu-item className="relative mt-8 mb-28 flex flex-col gap-3 text-base">
            <li className="flex items-center gap-3">
              <Phone aria-hidden className="size-5 shrink-0 text-sun" />
              <a href={`tel:${site.phone.tel}`} className="font-semibold underline decoration-sun decoration-2 underline-offset-4">
                {site.phone.display}
              </a>
            </li>
            <li className="flex items-center gap-3 break-all">
              <Mail aria-hidden className="size-5 shrink-0 text-sun" />
              <a href={`mailto:${site.email}`} className="font-semibold underline decoration-sun decoration-2 underline-offset-4">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
