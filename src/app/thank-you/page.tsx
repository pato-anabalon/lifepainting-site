import { Container } from "@/components/atoms/Container";
import { Button } from "@/components/atoms/Button";
import { TextLink } from "@/components/atoms/TextLink";
import { thankYou, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("thankYou");

export default function ThankYouPage() {
  return (
    <section data-testid="thank-you-section" aria-labelledby="thanks-title" className="py-20 sm:py-32">
      <Container>
        <h1 id="thanks-title" className="lp-title max-w-3xl text-3xl sm:text-5xl">
          {thankYou.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{thankYou.body}</p>
        <p className="mt-4 text-lg">
          <TextLink href={`tel:${site.phone.tel}`}>{site.phone.display}</TextLink>
        </p>
        <div className="mt-10">
          <Button href="/" data-testid="thank-you-home-button">
            {thankYou.back}
          </Button>
        </div>
      </Container>
    </section>
  );
}
