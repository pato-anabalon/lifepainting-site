import { Fragment } from "react";
import { LifeStarburst } from "@/components/atoms/LifeStarburst";

/**
 * Ambient loop of short phrases. The first track is the accessible one; the duplicate that
 * makes the loop seamless is aria-hidden (and not rendered at all under reduced motion).
 */
export function Marquee({ items, testId }: { items: string[]; testId: string }) {
  const track = (hidden: boolean) => (
    <div className="lp-marquee-track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <Fragment key={item}>
          <span className="lp-title whitespace-nowrap px-6 text-xl sm:text-3xl">{item}</span>
          <LifeStarburst fill="var(--lp-forest)" stroke="var(--lp-mustard)" className="size-6 shrink-0 sm:size-8" />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div data-testid={testId} className="lp-marquee flex overflow-hidden bg-mustard py-4 text-forest">
      {track(false)}
      {track(true)}
    </div>
  );
}
