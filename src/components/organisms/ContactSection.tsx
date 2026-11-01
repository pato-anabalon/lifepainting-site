import { Suspense } from "react";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { ShapeDivider } from "@/components/atoms/ShapeDivider";
import { Button } from "@/components/atoms/Button";
import { ContactForm } from "@/components/organisms/ContactForm";
import { Marquee } from "@/components/molecules/Marquee";
import { ScrollReveal } from "@/components/molecules/ScrollReveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { contact, sections, site } from "@/lib/content";

/** Closing CTA: call / email buttons plus the step form. The form needs JS; call and email always work. */
export function ContactSection() {
  return (
    <section id={sections.contact.anchor} data-testid="home-contact-section" data-surface="dark" aria-labelledby="contact-title" className="relative overflow-hidden bg-forest pt-24 text-cream sm:pt-28 lg:pt-48">
      {/* FAQ (cream) → this section: cream waves hang over the top, mirrored and a little wide.
          FAQ precedes contact in every environment, so this one is a plain top divider. */}
      <ShapeDivider
        shape="waves-layered"
        flip
        stretch={1.35}
        height="clamp(3.5rem, 10vw, 8.75rem)"
        fills={[{ color: "var(--lp-cream)", opacity: 0.25 }, { color: "var(--lp-cream)", opacity: 0.5 }, { color: "var(--lp-cream)" }]}
        testId="home-contact-divider"
      />
      <Container>
        <ScrollReveal className="grid gap-12 pb-16 sm:pb-20 lg:grid-cols-12 lg:gap-16 lg:pb-28">
          <div className="flex flex-col items-start gap-8 lg:col-span-6">
            <div data-reveal>
              <SectionHeading id="contact-title" surface="dark" title={contact.title} intro={contact.intro} className="[&_h2]:lg:text-4xl xl:[&_h2]:text-5xl" />
            </div>
            <p data-reveal className="max-w-2xl text-base leading-relaxed sm:text-lg">
              {contact.note}
            </p>
            <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:gap-5 lg:flex-col xl:flex-row">
              <Button surface="dark" href={`tel:${site.phone.tel}`} data-testid="home-contact-call-button">
                <Phone aria-hidden className="size-5" />
                {contact.callLabel}
              </Button>
              <Button surface="dark" variant="secondary" href={`mailto:${site.email}`} data-testid="home-contact-email-button">
                <Mail aria-hidden className="size-5" />
                {contact.emailLabel}
              </Button>
            </div>
          </div>
          <div data-reveal className="lg:col-span-6">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>
          </div>
        </ScrollReveal>
      </Container>
      <Marquee items={contact.marquee} testId="home-contact-marquee" />
    </section>
  );
}
