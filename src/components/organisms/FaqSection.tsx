import { Container } from "@/components/atoms/Container";
import { LifeRetroRibbon } from "@/components/atoms/LifeRetroStripes";
import { LifeStitchedArrow } from "@/components/atoms/LifeStitchedArrow";
import { FaqItem } from "@/components/molecules/FaqItem";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { faq, sections } from "@/lib/content";

export function FaqSection() {
  return (
    <section id={sections.faq.anchor} data-testid="home-faq-section" aria-labelledby="faq-title" className="relative py-20 sm:py-28 lg:pt-52 lg:pb-44">
      <Container>
        <ScrollReveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-5">
            <SectionHeading id="faq-title" title={faq.title} />
            {/* Desktop only, where the questions sit beside the heading: a stitched arrow points to them. */}
            <LifeStitchedArrow className="mt-12 ml-auto hidden w-40 lg:block xl:w-48" />
          </div>
          <div data-reveal data-testid="home-faq-list" className="border-y-2 border-forest lg:col-span-7">
            {faq.items.map((item, i) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} testId={`home-faq-item-${i + 1}`} defaultOpen={i === 0} />
            ))}
          </div>
        </ScrollReveal>
      </Container>
      {/* Desktop only: retro ribbon coming in from the left edge at the foot of the section. */}
      <LifeRetroRibbon className="pointer-events-none absolute bottom-4 left-0 hidden w-[34%] max-w-xl lg:block" />
    </section>
  );
}
