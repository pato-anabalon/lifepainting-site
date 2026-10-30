import Link from "next/link";
import type { ReactNode } from "react";
import { cn, type Surface } from "@/lib/cn";

type Props = {
  href: string;
  surface?: Surface;
  className?: string;
  children: ReactNode;
  "data-testid"?: string;
};

/** TextLink = navigation or reference. Underlined, no box, no shadow. */
export function TextLink({ href, surface = "light", className, children, ...rest }: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const classes = cn(
    "font-semibold underline decoration-2 underline-offset-4 transition-colors",
    surface === "light" ? "decoration-mustard hover:decoration-forest" : "decoration-sun hover:decoration-cream",
    className,
  );
  return external ? (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
