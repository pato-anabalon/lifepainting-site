"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/cn";
import { work } from "@/lib/content";
import { nextShown } from "@/lib/gallery";

const firstSet = Array.from({ length: work.shown }, (_, i) => i);

/**
 * Three-tier bento of real project photos; the middle tier (exterior) is the highlighted one.
 * Each tier shows `work.shown` photos; the shuffle button swaps in the ones not on screen.
 * The first set is fixed so server and client render the same; randomness only starts on click.
 */
export function WorkGallery({ heading }: { heading: ReactNode }) {
  const [shown, setShown] = useState(() => work.tiers.map(() => firstSet));
  const [shuffled, setShuffled] = useState(false);

  const shuffle = () => {
    setShown((current) => work.tiers.map((tier, t) => nextShown(tier.photos.length, current[t] ?? firstSet)));
    setShuffled(true);
  };

  return (
    <>
      <div data-reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        {heading}
        <Button
          variant="secondary"
          surface="dark"
          onClick={shuffle}
          aria-controls="work-grid"
          className="self-start sm:self-auto"
          data-testid="home-work-shuffle-button"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="square">
            <path d="M3 7h4l10 10h4M3 17h4l10-10h4M18 4l3 3-3 3M18 14l3 3-3 3" />
          </svg>
          {work.shuffle.label}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {shuffled ? work.shuffle.announce : ""}
      </p>
      <div id="work-grid" data-reveal data-testid="home-work-grid" className="grid items-stretch gap-6 lg:grid-cols-12">
        {work.tiers.map((tier, t) => (
          <article
            key={tier.key}
            data-testid={`home-work-tier-${tier.key}`}
            className={cn(
              "flex flex-col gap-4 p-5 sm:p-6",
              tier.highlight ? "bg-sun text-forest shadow-[8px_8px_0_0_var(--lp-mustard)] lg:col-span-6 lg:py-10" : "bg-cream text-forest lg:col-span-3",
            )}
          >
            <h3 className="lp-title text-2xl sm:text-3xl">{tier.title}</h3>
            <p className="text-base">{tier.note}</p>
            <ul className={cn("grid flex-1 gap-3", tier.highlight ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-1")}>
              {(shown[t] ?? firstSet).flatMap((index) => tier.photos[index] ?? []).map((photo, i) => (
                  <li
                    key={i}
                    data-testid={`home-work-${tier.key}-photo-${i + 1}`}
                    className={cn(
                      "relative overflow-hidden bg-azure/40",
                      tier.highlight && i === 0 ? "col-span-2 min-h-56 sm:min-h-72" : "aspect-[4/5] sm:aspect-auto sm:min-h-44 lg:min-h-40",
                    )}
                  >
                    <Image
                      // New key per photo, so a swapped-in photo fades in instead of replacing the old one's pixels.
                      key={photo.src}
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={tier.highlight ? "(min-width: 1024px) 40vw, 90vw" : "(min-width: 1024px) 20vw, 30vw"}
                      className={cn("object-cover", shuffled && "lp-photo-in")}
                    />
                  </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  );
}
