import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { LifeServiceArt, type ArtKind } from "@/components/atoms/LifeServiceArt";
import { cn, type Surface } from "@/lib/cn";
import { contactHref, type ServiceKey } from "@/lib/content";

type Props = {
  service: { key: ServiceKey; title: string; summary: string; details: string[]; cta: string };
  surface?: Surface;
  /** Which side the drawn panel sits on from `lg` up. Alternates down the page. */
  align?: "start" | "end";
  panelColor: "sun" | "azure" | "mustard" | "cream";
  /** Decorative extra pinned to the drawn panel's top corner (on the copy's side), e.g. a graphic element. */
  sticker?: ReactNode;
  testId?: string;
};

const PANEL: Record<Props["panelColor"], { bg: string; ink: string; accent: string }> = {
  sun: { bg: "bg-sun", ink: "var(--lp-forest)", accent: "var(--lp-cream)" },
  azure: { bg: "bg-azure", ink: "var(--lp-forest)", accent: "var(--lp-yellow)" },
  mustard: { bg: "bg-mustard", ink: "var(--lp-forest)", accent: "var(--lp-cream)" },
  cream: { bg: "bg-cream", ink: "var(--lp-forest)", accent: "var(--lp-mustard)" },
};

/** One service: a drawn panel plus its description and a CTA that carries the service to the form. */
export function ServiceCard({ service, surface = "dark", align = "start", panelColor, sticker, testId }: Props) {
  const p = PANEL[panelColor];
  return (
    <article data-testid={testId} data-reveal className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div
        aria-hidden
        className={cn(
          "relative grid aspect-[4/3] place-items-center border-2 shadow-[6px_6px_0_0_var(--lp-mustard)] sm:aspect-[16/9] lg:col-span-5 lg:aspect-square",
          surface === "dark" ? "border-cream" : "border-forest",
          p.bg,
          align === "end" && "lg:order-2 lg:col-start-8",
        )}
      >
        <LifeServiceArt kind={service.key as ArtKind} ink={p.ink} accent={p.accent} className="size-3/5 max-w-60" />
        {sticker && (
          <div className={cn("absolute -top-14 w-20 sm:w-24 lg:-top-20 lg:w-28", align === "end" ? "-left-3 lg:-left-14" : "-right-3 lg:-right-14")}>{sticker}</div>
        )}
      </div>
      <div className={cn("lg:col-span-6", align === "end" ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
        <h3 className="lp-title text-2xl sm:text-3xl lg:text-4xl">{service.title}</h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed sm:text-lg">{service.summary}</p>
        <ul className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 font-semibold">
          {service.details.map((d) => (
            <li key={d} className="flex items-center gap-2">
              <span aria-hidden className={cn("size-2 shrink-0 rotate-45", surface === "dark" ? "bg-sun" : "bg-mustard")} />
              {d}
            </li>
          ))}
        </ul>
        <Button href={contactHref(service.key)} surface={surface} className="mt-8 w-full sm:w-auto" data-testid={`home-services-${service.key}-quote-button`}>
          {service.cta}
        </Button>
      </div>
    </article>
  );
}
