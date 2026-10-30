import { Container } from "@/components/atoms/Container";
import { FaqItem } from "@/components/molecules/FaqItem";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { faq, sections } from "@/lib/content";

export function FaqSection() {
  return (
    <section id={sections.faq.anchor} data-testid="home-faq-section" aria-labelledby="faq-title" className="py-20 sm:py-28 lg:py-36">
      <Container>
        <ScrollReveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-5">
            <SectionHeading id="faq-title" title={faq.title} />
          </div>
          <div data-reveal data-testid="home-faq-list" className="border-y-2 border-forest lg:col-span-7">
            {faq.items.map((item, i) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} testId={`home-faq-item-${i + 1}`} defaultOpen={i === 0} />
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
