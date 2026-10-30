import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { LifeServiceArt, type ArtKind } from "@/components/atoms/LifeServiceArt";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { cn } from "@/lib/cn";
import { contactHref, sections, servicesOverview } from "@/lib/content";

type Look = { bg: string; text: string; border: string; ink: string; accent: string; span: string; art: string; big?: boolean };

/** Asymmetric 8-tile bento. One look per tile, in the same order as `servicesOverview.tiles`. */
const LOOKS: Look[] = [
  { bg: "bg-sun", text: "text-forest", border: "border-forest", ink: "var(--lp-forest)", accent: "var(--lp-cream)", span: "col-span-2 md:col-span-6 lg:col-span-5 lg:row-span-2", art: "size-36 sm:size-44 lg:size-56", big: true },
  { bg: "bg-forest", text: "text-cream", border: "border-forest", ink: "var(--lp-azure)", accent: "var(--lp-yellow)", span: "col-span-2 md:col-span-3 lg:col-span-4", art: "size-24 lg:size-28", big: true },
  { bg: "bg-cream", text: "text-forest", border: "border-forest", ink: "var(--lp-forest)", accent: "var(--lp-mustard)", span: "col-span-1 md:col-span-3 lg:col-span-4", art: "size-14 lg:size-20" },
  { bg: "bg-mustard", text: "text-forest", border: "border-forest", ink: "var(--lp-forest)", accent: "var(--lp-cream)", span: "col-span-1 md:col-span-3 lg:col-span-2", art: "size-14" },
  { bg: "bg-sun", text: "text-forest", border: "border-forest", ink: "var(--lp-forest)", accent: "var(--lp-cream)", span: "col-span-1 md:col-span-3 lg:col-span-2", art: "size-14" },
  { bg: "bg-cream", text: "text-forest", border: "border-forest", ink: "var(--lp-forest)", accent: "var(--lp-mustard)", span: "col-span-1 md:col-span-3 lg:col-span-2", art: "size-14" },
  { bg: "bg-mustard", text: "text-forest", border: "border-forest", ink: "var(--lp-forest)", accent: "var(--lp-cream)", span: "col-span-2 md:col-span-3 lg:col-span-3 lg:row-span-2", art: "size-28 lg:size-36", big: true },
  { bg: "bg-forest", text: "text-cream", border: "border-forest", ink: "var(--lp-azure)", accent: "var(--lp-yellow)", span: "col-span-2 md:col-span-6 lg:col-span-6", art: "size-20 lg:size-24", big: true },
];

/**
 * The tile order is meaningful for the bento layout at `lg`:
 * interior | exterior | decorative(tall) / weatherboards / masonry roofs fences | preparation.
 * Content order (and DOM/tab order) stays: interior, exterior, weatherboards, masonry, roofs, fences, decorative, preparation.
 */
const ORDER_AT_LG = ["lg:order-1", "lg:order-2", "lg:order-4", "lg:order-5", "lg:order-6", "lg:order-7", "lg:order-3", "lg:order-8"];

const ART_BY_TITLE: Record<string, ArtKind> = {
  "Interior Painting": "interior",
  "Exterior Painting": "exterior",
  Weatherboards: "weatherboards",
  "Masonry & brick": "masonry",
  Roofs: "roofs",
  Fences: "fences",
  "Decorative Finishes": "decorative",
  "Preparation & Repairs": "preparation",
};

export function ServicesOverview() {
  const { title, intro, askLabel, tiles } = servicesOverview;
  return (
    <section id={sections["services-overview"].anchor} data-testid="home-services-overview-section" aria-labelledby="overview-title" className="bg-cream py-20 sm:py-28 lg:py-36">
      <Container>
        <ScrollReveal>
          <div data-reveal>
            <SectionHeading id="overview-title" title={title} intro={intro} />
          </div>
          <ul data-testid="home-services-bento-grid" className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-6 lg:mt-16 lg:grid-cols-12 lg:gap-5 lg:[grid-auto-rows:minmax(11rem,auto)]">
            {tiles.map((tile, i) => {
              const look = LOOKS[i] as Look;
              const kind = ART_BY_TITLE[tile.title] as ArtKind;
              return (
                <li
                  key={tile.title}
                  data-reveal
                  data-testid={`home-services-tile-${kind}`}
                  className={cn(
                    "group relative flex min-h-44 flex-col justify-between overflow-hidden border-2 p-4 shadow-[5px_5px_0_0_var(--lp-forest)] transition-[transform,box-shadow] duration-200 ease-out",
                    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_var(--lp-forest)] sm:p-5",
                    look.bg, look.text, look.border, look.span, ORDER_AT_LG[i],
                    look.big && "min-h-56 lg:min-h-0",
                  )}
                >
                  <LifeServiceArt kind={kind} ink={look.ink} accent={look.accent} className={cn("mb-5 ml-auto shrink-0 transition-transform duration-300 ease-out group-hover:rotate-3", look.art)} />
                  <h3 className={cn("lp-title relative", look.big ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg")}>
                    <Link href={contactHref(tile.key)} className="after:absolute after:inset-0">
                      {tile.title}
                      <span className="sr-only">. {askLabel} {tile.title}</span>
                    </Link>
                  </h3>
                  <p className={cn("relative mt-2 flex items-end justify-between gap-3 text-sm leading-snug sm:text-base", "")}>
                    <span>{tile.note}</span>
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </p>
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      </Container>
    </section>
  );
}
