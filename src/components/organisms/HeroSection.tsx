import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/atoms/Container";
import { MetaChip } from "@/components/atoms/MetaChip";
import { LifeHeroBackdrop } from "@/components/organisms/LifeHeroBackdrop";
import { LifeHeroReveal } from "@/components/organisms/LifeHeroReveal";
import { hero, sections } from "@/lib/content";

/** Hero: owns the page H1. Dark surface, centred headline, GSAP background (no video → no hls.js). */
export function HeroSection() {
  return (
    <section
      id={sections.hero.anchor}
      data-testid="home-hero-section"
      data-surface="dark"
      className="relative isolate flex min-h-[calc(100svh-var(--lp-header-h))] items-center overflow-hidden bg-forest text-cream"
    >
      <LifeHeroBackdrop />
      <Container className="relative z-10 py-24 sm:py-28">
        <LifeHeroReveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 data-testid="home-hero-title" className="lp-title text-[clamp(1.5rem,6.4vw,3rem)] leading-[1.15] lg:text-6xl xl:text-7xl">
            {hero.titleLines.map((line, i) => (
              <span key={line} data-lp-reveal className={i === 1 ? "block text-sun" : "block"}>
                {line}
              </span>
            ))}
          </h1>
          <p data-lp-reveal className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            {hero.intro}
          </p>
          <ul data-lp-reveal aria-label="Areas we work in" className="mt-7 flex flex-wrap justify-center gap-2">
            {hero.chips.map((c) => (
              <li key={c}>
                <MetaChip surface="dark">{c}</MetaChip>
              </li>
            ))}
          </ul>
          <div data-lp-reveal className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Button href={hero.primaryCta.href} surface="dark" data-testid="home-hero-quote-button">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} surface="dark" variant="secondary" data-testid="home-hero-services-button">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </LifeHeroReveal>
      </Container>
    </section>
  );
}
