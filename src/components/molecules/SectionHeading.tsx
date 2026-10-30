import { cn, type Surface } from "@/lib/cn";

type Props = {
  title: string;
  intro?: string;
  surface?: Surface;
  align?: "start" | "center";
  /** Heading level. The page H1 is owned by the hero only. */
  as?: "h2" | "h3";
  id?: string;
  className?: string;
};

export function SectionHeading({ title, intro, surface = "light", align = "start", as: Tag = "h2", id, className }: Props) {
  return (
    <div data-surface={surface} className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Tag id={id} className="lp-title text-3xl sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">{intro}</p>}
    </div>
  );
}
