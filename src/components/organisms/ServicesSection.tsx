import { Container } from "@/components/atoms/Container";
import { LifeAtomicShapes } from "@/components/atoms/LifeAtomicShapes";
import { LifeLightningBolt } from "@/components/atoms/LifeLightningBolt";
import { ShapeDivider } from "@/components/atoms/ShapeDivider";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ServiceCard } from "@/components/molecules/ServiceCard";
import { sections, services, servicesSection } from "@/lib/content";

const PANELS = ["sun", "azure", "mustard", "cream"] as const;

export function ServicesSection() {
  return (
    <section id={sections.services.anchor} data-testid="home-services-section" data-surface="dark" aria-labelledby="services-title" className="relative z-10 bg-forest py-20 text-cream sm:py-28 lg:py-36">
      <Container>
        <ScrollReveal>
          <div data-reveal className="flex items-center justify-between gap-12">
            <SectionHeading id="services-title" surface="dark" title={servicesSection.title} intro={servicesSection.intro} />
            {/* Desktop only, in the free space beside the heading. */}
            <LifeAtomicShapes className="hidden w-64 shrink-0 lg:block xl:w-80" />
          </div>
        </ScrollReveal>
        <div data-testid="home-services-card-list" className="mt-16 flex flex-col gap-20 lg:mt-24 lg:gap-32">
          {services.map((service, i) => (
            <ScrollReveal key={service.key}>
              <ServiceCard service={service} surface="dark" align={i % 2 === 0 ? "start" : "end"} panelColor={PANELS[i % PANELS.length] as (typeof PANELS)[number]}
                // Preparation: the bolt, for the change a properly prepared surface makes.
                sticker={service.key === "preparation" ? <LifeLightningBolt className="w-full -rotate-12" /> : undefined}
                testId={`home-services-${service.key}-card`}
              />
            </ScrollReveal>
          ))}
        </div>
      </Container>
      {/* → the next cream section (Proof in development, FAQ in production): forest waves hang
          over its top, wide and mirrored. Those sections leave room for it (lg:pt-52). */}
      <ShapeDivider
        shape="waves-layered"
        position="below"
        flip
        stretch={2.31}
        height="clamp(3.5rem, 12vw, 11rem)"
        fills={[{ color: "var(--lp-forest)", opacity: 0.25 }, { color: "var(--lp-forest)", opacity: 0.5 }, { color: "var(--lp-forest)" }]}
        testId="home-services-divider"
      />
    </section>
  );
}
