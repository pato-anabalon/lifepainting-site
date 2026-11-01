import { Container } from "@/components/atoms/Container";
import { ShapeDivider } from "@/components/atoms/ShapeDivider";
import { ThumbSlot } from "@/components/atoms/ThumbSlot";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { cn } from "@/lib/cn";
import { sections, work } from "@/lib/content";

/** Three-tier gallery bento; the middle tier (exterior) is the highlighted one. Thumbs until real photos arrive. */
export function WorkSection() {
  return (
    <section id={sections.work.anchor} data-testid="home-work-section" data-surface="dark" aria-labelledby="work-title" className="relative bg-forest pt-24 pb-24 text-cream sm:py-28 lg:pt-48 lg:pb-44">
      {/* Proof (cream) → this section: cream waves hang over the top, stretched (not mirrored, so they
          differ from the contact one). Proof and Work are both pending, so they always appear together. */}
      <ShapeDivider
        shape="waves-layered"
        stretch={1.8}
        height="clamp(3.5rem, 10vw, 8.75rem)"
        fills={[{ color: "var(--lp-cream)", opacity: 0.25 }, { color: "var(--lp-cream)", opacity: 0.5 }, { color: "var(--lp-cream)" }]}
        testId="home-work-divider-top"
      />
      <Container>
        <ScrollReveal className="flex flex-col gap-12 lg:gap-16">
          <div data-reveal>
            <SectionHeading id="work-title" surface="dark" title={work.title} intro={work.intro} />
            <p className="mt-3 text-sm font-bold text-sun">{work.pendingNote}</p>
          </div>
          <div data-reveal data-testid="home-work-grid" className="grid items-stretch gap-6 lg:grid-cols-12">
            {work.tiers.map((tier) => (
              <article
                key={tier.key}
                data-testid={`home-work-tier-${tier.key}`}
                className={cn(
                  "flex flex-col gap-4 p-5 sm:p-6",
                  tier.highlight ? "bg-sun text-forest shadow-[8px_8px_0_0_var(--lp-mustard)] lg:col-span-6 lg:py-10" : "bg-cream text-forest lg:col-span-3",
                )}
              >
                <h3 className="lp-title text-2xl sm:text-3xl">{tier.title}</h3>
                <p className="text-base">{tier.note}</p>
                <div className={cn("grid flex-1 gap-3", tier.highlight ? "grid-cols-2" : "grid-cols-1")}>
                  {Array.from({ length: tier.slots }, (_, i) => (
                    <ThumbSlot
                      key={i}
                      label={`${tier.title} photo`}
                      testId={`home-work-${tier.key}-slot-${i + 1}`}
                      className={cn(tier.highlight && i === 0 ? "col-span-2 min-h-56" : "min-h-32")}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
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
