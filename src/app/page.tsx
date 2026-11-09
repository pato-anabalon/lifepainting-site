import { JsonLd } from "@/components/atoms/JsonLd";
import { ContactSection } from "@/components/organisms/ContactSection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { HeroSection } from "@/components/organisms/HeroSection";
import { ProofSection } from "@/components/organisms/ProofSection";
import { WorkSection } from "@/components/organisms/WorkSection";
import { ServicesOverview } from "@/components/organisms/ServicesOverview";
import { ServicesSection } from "@/components/organisms/ServicesSection";
import { isSectionVisible } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";

export const metadata = buildMetadata("home");

/**
 * Phase 2 in progress: sections are built and validated one at a time.
 * Done: every section. Only the testimonial block inside Proof is pending-evidence (development only).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} testId="home-jsonld-business" />
      <JsonLd data={breadcrumbJsonLd(["home"])} testId="home-jsonld-breadcrumb" />
      {isSectionVisible("faq") && <JsonLd data={faqJsonLd()} testId="home-jsonld-faq" />}

      <HeroSection />
      {isSectionVisible("services-overview") && <ServicesOverview />}
      {isSectionVisible("services") && <ServicesSection />}
      {isSectionVisible("proof") && <ProofSection />}
      {isSectionVisible("work") && <WorkSection />}
      {isSectionVisible("faq") && <FaqSection />}
      {isSectionVisible("contact") && <ContactSection />}
    </>
  );
}
