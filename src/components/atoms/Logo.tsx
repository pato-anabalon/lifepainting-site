import Image from "next/image";
import { cn, type Surface } from "@/lib/cn";
import { site } from "@/lib/content";

/**
 * Files and their intrinsic size (keep in sync when a file changes: a wrong ratio stretches the logo).
 * The wide logos were trimmed to 568px tall on 2026-11-01 (were 1563px squares with air above/below).
 */
const sources = {
  stacked: { light: { src: "/logos/logo-for-light.png", w: 1563, h: 1563 }, dark: { src: "/logos/logo-for-dark.png", w: 1563, h: 1563 } },
  wide: { light: { src: "/logos/logo-wide-for-light.png", w: 1556, h: 568 }, dark: { src: "/logos/logo-wide-for-dark.png", w: 1558, h: 568 } },
  icon: { light: { src: "/logos/icon-for-light.png", w: 1563, h: 1563 }, dark: { src: "/logos/icon-for-dark.png", w: 1563, h: 1563 } },
} as const;

type Props = {
  /** `surface` is the background the logo sits on. */
  surface?: Surface;
  variant?: keyof typeof sources;
  className?: string;
  priority?: boolean;
  /** Rendered width hint for the image optimiser; pass it when the logo is shown larger than 160px. */
  sizes?: string;
  testId?: string;
};

export function Logo({ surface = "light", variant = "wide", className, priority, sizes = "(min-width: 1024px) 160px, 120px", testId }: Props) {
  const file = sources[variant][surface];
  return (
    <Image
      src={file.src}
      alt={`${site.name} – ${site.tagline}`}
      width={file.w}
      height={file.h}
      sizes={sizes}
      priority={priority}
      data-testid={testId}
      className={cn("h-auto", className)}
    />
  );
}
