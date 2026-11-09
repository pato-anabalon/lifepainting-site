import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { ConsentPreferencesButton } from "@/components/atoms/ConsentPreferencesButton";
import { Logo } from "@/components/atoms/Logo";
import { TextLink } from "@/components/atoms/TextLink";
import { footer, heroCollage, nav, services, site } from "@/lib/content";

export function Footer() {
  return (
    <footer data-testid="site-footer" data-surface="dark" className="relative overflow-hidden bg-forest text-cream">
      <Container className="grid gap-12 pb-10 pt-16 md:grid-cols-3 lg:pt-20">
        <div>
          {/* Negative margins take up the file's own air, so the artwork lines up with the column's
              top and left edges (level with the other columns' headings). */}
          <Logo variant="wide" surface="dark" className="-mt-3 -ml-1.5 w-56 lg:w-60" sizes="(min-width: 1024px) 240px, 224px" testId="site-footer-logo" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">{footer.blurb}</p>
        </div>

        <nav aria-label="Footer – services and pages" data-testid="site-footer-nav" className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="mb-4 text-base font-bold text-sun">{footer.columns.explore}</h2>
            <ul className="space-y-2 text-sm">
              {nav.items.map((i) => (
                <li key={i.id}>
                  <TextLink href={i.href} surface="dark">{i.label}</TextLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-base font-bold text-sun">{footer.columns.services}</h2>
            <ul className="space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.key}>{s.title}</li>
              ))}
            </ul>
          </div>
        </nav>

        <div data-testid="site-footer-contact">
          <h2 className="mb-4 text-base font-bold text-sun">{footer.columns.contact}</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone aria-hidden className="size-4 shrink-0 text-sun" />
              <TextLink href={`tel:${site.phone.tel}`} surface="dark">{site.phone.display}</TextLink>
            </li>
            <li className="flex items-center gap-2 break-all">
              <Mail aria-hidden className="size-4 shrink-0 text-sun" />
              <TextLink href={`mailto:${site.email}`} surface="dark">{site.email}</TextLink>
            </li>
            <li className="flex items-start gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-sun" />
              <span>
                <span className="sr-only">{footer.areasLabel}: </span>
                {site.serviceAreas.join(" · ")}
              </span>
            </li>
          </ul>
        </div>
      </Container>

      {heroCollage.photos.some((p) => p.credit) && (
        <Container className="pb-2">
          <details data-testid="site-footer-photo-credits" className="text-sm">
            <summary className="cursor-pointer font-semibold underline decoration-sun decoration-2 underline-offset-4 hover:decoration-cream">{heroCollage.creditsLabel}</summary>
            <p className="mt-3">{heroCollage.creditsIntro}</p>
            <ul className="mt-2 space-y-1">
              {heroCollage.photos.flatMap((p) =>
                p.credit
                  ? [
                      <li key={p.src}>
                        <a href={p.credit.url} className="underline decoration-sun underline-offset-2 hover:decoration-cream">
                          {p.credit.title}
                        </a>{" "}
                        by {p.credit.creator}, {p.credit.license}
                      </li>,
                    ]
                  : [],
              )}
            </ul>
          </details>
        </Container>
      )}

      <Container className="flex flex-col gap-3 pt-6 pb-10 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm">{footer.copyright}</p>
        <p data-testid="site-footer-credit" className="text-sm">
          {footer.credit.before}{" "}
          <span role="img" aria-label={footer.credit.heartLabel}>
            {footer.credit.heart}
          </span>{" "}
          {footer.credit.after}{" "}
          {/* New tab so visitors stay on the Life Painting site. */}
          <TextLink href={footer.credit.href} surface="dark" target="_blank" rel="noopener" data-testid="site-footer-credit-link">
            {footer.credit.label}
            <span className="sr-only"> {footer.credit.newTab}</span>
          </TextLink>
        </p>
        <p className="flex gap-5 text-sm">
          <TextLink href="/privacy" surface="dark">Privacy policy</TextLink>
          <ConsentPreferencesButton className="font-semibold underline decoration-sun decoration-2 underline-offset-4 hover:decoration-cream" />
        </p>
      </Container>
    </footer>
  );
}
