import Image from "next/image";
import { cn, type Surface } from "@/lib/cn";
import { site } from "@/lib/content";

const sources = {
  stacked: { light: "/logos/logo-for-light.png", dark: "/logos/logo-for-dark.png" },
  wide: { light: "/logos/logo-wide-for-light.png", dark: "/logos/logo-wide-for-dark.png" },
  icon: { light: "/logos/icon-for-light.png", dark: "/logos/icon-for-dark.png" },
} as const;

type Props = {
  /** `surface` is the background the logo sits on. */
  surface?: Surface;
  variant?: keyof typeof sources;
  className?: string;
  priority?: boolean;
  testId?: string;
};

export function Logo({ surface = "light", variant = "wide", className, priority, testId }: Props) {
  return (
    <Image
      src={sources[variant][surface]}
      alt={`${site.name} – ${site.tagline}`}
      width={1563}
      height={1563}
      sizes="(min-width: 1024px) 160px, 120px"
      priority={priority}
      data-testid={testId}
      className={cn("h-auto", className)}
    />
  );
}
