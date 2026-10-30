import { Container } from "@/components/atoms/Container";
import { TextLink } from "@/components/atoms/TextLink";
import { JsonLd } from "@/components/atoms/JsonLd";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { privacy, site } from "@/lib/content";
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
          <p className="mt-3 text-sm font-bold">{privacy.updated}</p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">{privacy.intro}</p>
          <div className="mt-12 flex max-w-2xl flex-col gap-10">
            {privacy.blocks.map((b) => (
              <div key={b.heading}>
                <SectionHeading as="h2" title={b.heading} className="[&_h2]:text-2xl sm:[&_h2]:text-3xl" intro={b.body} />
              </div>
            ))}
          </div>
          <p className="mt-12 text-lg">
            <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink> · <TextLink href={`tel:${site.phone.tel}`}>{site.phone.display}</TextLink>
          </p>
        </Container>
      </section>
    </>
  );
}
