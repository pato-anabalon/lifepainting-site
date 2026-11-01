import Image from "next/image";
import { ShapeDivider } from "@/components/atoms/ShapeDivider";
import { Button } from "@/components/atoms/Button";
import { LifeHeroCollage } from "@/components/organisms/LifeHeroCollage";
import { LifeHeroReveal } from "@/components/organisms/LifeHeroReveal";
import { LifeHeroStrokes } from "@/components/organisms/LifeHeroStrokes";
import { hero, heroCollage, sections, site } from "@/lib/content";

/**
 * Hero: owns the page H1. Logo and centred headline over a floating photo collage (768px and up;
 * below that brush strokes keep painting the wall instead, LifeHeroStrokes) with
 * mouse parallax and a scroll lift-away. No panel or text backings: headline and intro carry the
 * buttons' hard offset shadow, in cream (`lp-text-offset`). Full screen: the
 * header stays hidden until the hero has been scrolled past (`data-lp-header-auto`).
 */
export function HeroSection() {
  return (
    <section
      id={sections.hero.anchor}
      data-testid="home-hero-section"
      aria-labelledby="home-hero-title"
      data-lp-header-auto
      className="relative bg-cream text-forest"
    >
      <LifeHeroCollage photos={heroCollage.photos} backdrop={<LifeHeroStrokes />}>
        <div className="max-w-[60rem] px-2 py-8 text-center sm:px-8">
          <LifeHeroReveal className="flex flex-col items-center">
            {/* The wide logo file (1556×568) still has a little air; this box crops it to the artwork band,
                exactly as before the file was trimmed (object position 35 % vertically). */}
            <div data-lp-reveal className="mb-6 sm:mb-8">
              <div
                data-testid="home-hero-logo"
                className="relative aspect-[1563/380] w-[clamp(13rem,32vw,22rem)] overflow-hidden"
              >
                <Image
                  src="/logos/logo-wide-for-light.png"
                  alt={site.legalName}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 352px, 208px"
                  className="object-cover object-[50%_35%]"
                />
              </div>
            </div>
            <h1
              id="home-hero-title"
              data-testid="home-hero-title"
              className="lp-title lp-text-offset text-[clamp(1.4rem,6vw,4.25rem)] leading-[1.15]"
            >
              {hero.titleLines.map((line, i) => (
                <span
                  key={line}
                  data-lp-reveal
                  className={i === 1 ? "block text-azure" : "block"}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p
              data-lp-reveal
              className="lp-text-offset mt-5 max-w-xl text-base font-medium leading-relaxed sm:mt-6 sm:text-lg"
            >
              {hero.intro}
            </p>
            <div
              data-lp-reveal
              className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4"
            >
              <Button
                href={hero.primaryCta.href}
                className="whitespace-nowrap"
                data-testid="home-hero-quote-button"
              >
                {hero.primaryCta.label}
              </Button>
              <Button
                href={hero.secondaryCta.href}
                variant="secondary"
                className="whitespace-nowrap bg-cream!"
                data-testid="home-hero-services-button"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>
          </LifeHeroReveal>
        </div>
      </LifeHeroCollage>
      {/* Hero → "What we paint and prepare": the next section's colour rises over the collage /
          brush strokes, so they end on the wave instead of a straight cut. */}
      <ShapeDivider
        shape="waves-layered"
        position="bottom"
        fills={[
          // Lighter azure for the see-through layers: deep azure over cream reads grey.
          { color: "var(--lp-azure)", opacity: 0.35 },
          { color: "var(--lp-azure)", opacity: 0.6 },
          { color: "var(--lp-azure-deep)" },
        ]}
        className="z-20"
        testId="home-hero-divider"
      />
    </section>
  );
}
