import { Container } from "@/components/atoms/Container";
import { JsonLd } from "@/components/atoms/JsonLd";
import { PrivacyBody } from "@/components/molecules/PrivacyBody";
import { privacy } from "@/lib/content";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("privacy");

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(["home", "privacy"])} testId="privacy-jsonld-breadcrumb" />
      <section data-testid="privacy-section" aria-labelledby="privacy-title" className="py-16 sm:py-24">
        <Container>
          <h1 id="privacy-title" className="lp-title text-3xl sm:text-5xl">
            {privacy.title}
          </h1>
          <PrivacyBody headingAs="h2" />
        </Container>
      </section>
    </>
  );
}
