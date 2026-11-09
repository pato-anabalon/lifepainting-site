import { Container } from "@/components/atoms/Container";
import { ShapeDivider } from "@/components/atoms/ShapeDivider";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { WorkGallery } from "@/components/organisms/WorkGallery";
import { sections, work } from "@/lib/content";

/** Our work: section shell (dividers, heading); the bento and its shuffle button are the WorkGallery island. */
export function WorkSection() {
  return (
    <section id={sections.work.anchor} data-testid="home-work-section" data-surface="dark" aria-labelledby="work-title" className="relative bg-forest pt-24 pb-24 text-cream sm:py-28 lg:pt-48 lg:pb-44">
      {/* Proof (cream) → this section: cream waves hang over the top, stretched (not mirrored, so they
          differ from the contact one). Assumes Proof (cream) comes right before; see PROJECT_CONTEXT. */}
      <ShapeDivider
        shape="waves-layered"
        stretch={1.8}
        height="clamp(3.5rem, 10vw, 8.75rem)"
        fills={[{ color: "var(--lp-cream)", opacity: 0.25 }, { color: "var(--lp-cream)", opacity: 0.5 }, { color: "var(--lp-cream)" }]}
        testId="home-work-divider-top"
      />
      <Container>
        <ScrollReveal className="flex flex-col gap-12 lg:gap-16">
          <WorkGallery heading={<SectionHeading id="work-title" surface="dark" title={work.title} intro={work.intro} />} />
        </ScrollReveal>
      </Container>
      {/* → FAQ (cream): cream rises from the bottom, mirrored, so FAQ needs no extra room. */}
      <ShapeDivider
        shape="waves-layered"
        position="bottom"
        flip
        stretch={1.6}
        height="clamp(3.5rem, 9vw, 8rem)"
        fills={[{ color: "var(--lp-cream)", opacity: 0.25 }, { color: "var(--lp-cream)", opacity: 0.5 }, { color: "var(--lp-cream)" }]}
        testId="home-work-divider-bottom"
      />
    </section>
  );
}
