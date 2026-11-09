import { TextLink } from "@/components/atoms/TextLink";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { privacy, site } from "@/lib/content";

/**
 * Privacy policy text below its title: shared by the /privacy page (title is the H1, blocks are H2)
 * and the contact form's privacy dialog (title is an H2, blocks are H3).
 */
export function PrivacyBody({ headingAs }: { headingAs: "h2" | "h3" }) {
  return (
    <>
      <p className="mt-3 text-sm font-bold">{privacy.updated}</p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed">{privacy.intro}</p>
      <div className="mt-12 flex max-w-2xl flex-col gap-10">
        {privacy.blocks.map((b) => (
          <div key={b.heading}>
            <SectionHeading as={headingAs} title={b.heading} className="[&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h3]:text-2xl sm:[&_h3]:text-3xl" intro={b.body} />
          </div>
        ))}
      </div>
      <p className="mt-12 text-lg">
        <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink> · <TextLink href={`tel:${site.phone.tel}`}>{site.phone.display}</TextLink>
      </p>
    </>
  );
}
