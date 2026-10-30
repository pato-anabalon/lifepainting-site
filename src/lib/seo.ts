import type { Metadata } from "next";
import { faq, site } from "@/lib/content";

/** Canonical origin. lifepaintingdec.co.nz is the confirmed production domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lifepaintingdec.co.nz").replace(/\/$/, "");

export type RouteKey = "home" | "privacy" | "thankYou";

type RouteSeo = {
  path: string;
  title: string;
  description: string;
  /** Explicit indexing state per page (see SEO_WORKLOG.md). */
  index: boolean;
  breadcrumb: string;
};

export const routes: Record<RouteKey, RouteSeo> = {
  home: {
    path: "/",
    title: "Painters in Auckland | Interior & Exterior Painting",
    description:
      "Life Painting & Decorating: interior, exterior and decorative painting plus GIB stopping and skimming for homes across Auckland, the North Shore and Auckland Central. Get a free quote.",
    index: true,
    breadcrumb: "Home",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy policy",
    description: "How Life Painting & Decorating handles the details you share through this website: enquiries, photos and analytics.",
    index: true,
    breadcrumb: "Privacy policy",
  },
  // Confirmation page after a lead: useful for conversion tracking, no value in search results.
  thankYou: {
    path: "/thank-you",
    title: "Thanks for your enquiry",
    description: "We have received your enquiry and will be in touch.",
    index: false,
    breadcrumb: "Thank you",
  },
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
}

export function buildMetadata(key: RouteKey): Metadata {
  const r = routes[key];
  const url = absoluteUrl(r.path);
  return {
    title: r.title,
    description: r.description,
    alternates: { canonical: url },
    robots: r.index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_NZ",
      siteName: site.legalName,
      title: r.title,
      description: r.description,
      url,
    },
    twitter: { card: "summary_large_image", title: r.title, description: r.description },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    "@id": `${SITE_URL}/#business`,
    name: site.legalName,
    alternateName: site.name,
    url: SITE_URL,
    slogan: site.slogan,
    foundingDate: String(site.established),
    telephone: site.phone.tel,
    email: site.email,
    logo: `${SITE_URL}/logos/logo-for-light.png`,
    image: `${SITE_URL}/opengraph-image`,
    address: { "@type": "PostalAddress", addressLocality: "Auckland", addressCountry: site.country },
    areaServed: site.serviceAreas.map((name) => ({ "@type": "Place", name })),
    // No streetAddress, ratings or reviews: none are public/verified yet.
  };
}

export function breadcrumbJsonLd(keys: RouteKey[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: keys.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: routes[k].breadcrumb,
      item: absoluteUrl(routes[k].path),
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
