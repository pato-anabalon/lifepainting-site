import { LifeParallelograms } from "@/components/atoms/LifeParallelograms";
import { LifeStarburst } from "@/components/atoms/LifeStarburst";
import { Container } from "@/components/atoms/Container";
import { ThumbSlot } from "@/components/atoms/ThumbSlot";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { proof, sections } from "@/lib/content";

/** "How we work": qualitative standards (ready) + testimonial wall (slots until real comments exist). */
export function ProofSection() {
  return (
    <section id={sections.proof.anchor} data-testid="home-proof-section" aria-labelledby="proof-title" className="py-20 sm:py-28 lg:pt-52 lg:pb-36">
      <Container>
        <ScrollReveal className="flex flex-col gap-14 lg:gap-20">
          <div data-reveal className="flex items-center justify-between gap-12">
            <SectionHeading id="proof-title" title={proof.title} intro={proof.intro} />
            {/* Desktop only, in the free space beside the heading. */}
            <LifeParallelograms className="hidden w-64 shrink-0 lg:block xl:w-80" />
          </div>
          <ul data-reveal data-testid="home-proof-values" className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {proof.values.map((v) => (
              <li key={v.title} className="flex items-start gap-4">
                <LifeStarburst fill="var(--lp-mustard)" stroke="var(--lp-forest)" className="mt-1 size-8 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">{v.title}</h3>
                  <p className="mt-2 text-base leading-relaxed sm:text-lg">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div data-reveal data-testid="home-proof-testimonials">
            <h3 className="lp-title text-2xl sm:text-3xl">{proof.testimonials.title}</h3>
            <p className="mt-3 text-sm font-bold">{proof.testimonials.pending}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {Array.from({ length: proof.testimonials.slots }, (_, i) => (
                <ThumbSlot key={i} label="Client comment" testId={`home-proof-testimonial-slot-${i + 1}`} className="min-h-40" />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
