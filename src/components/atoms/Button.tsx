import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn, type Surface } from "@/lib/cn";

type Variant = "primary" | "secondary";

type CommonProps = {
  variant?: Variant;
  surface?: Surface;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

type AsLink = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type AsButton = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/**
 * Button = a primary action. Solid, sign-painter shadow, press feedback.
 * (Informational chips and text links deliberately look different.)
 */
export function buttonClasses(variant: Variant, surface: Surface, className?: string) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-2 border-2 px-6 py-3 text-base font-bold " +
    "transition-[transform,box-shadow] duration-150 ease-out " +
    "hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 " +
    "disabled:pointer-events-none disabled:opacity-50";
  const palette: Record<Surface, Record<Variant, string>> = {
    light: {
      primary: "border-forest bg-sun text-forest shadow-[4px_4px_0_0_var(--lp-forest)] hover:shadow-[6px_6px_0_0_var(--lp-forest)] active:shadow-[2px_2px_0_0_var(--lp-forest)]",
      secondary: "border-forest bg-transparent text-forest shadow-[4px_4px_0_0_var(--lp-mustard)] hover:shadow-[6px_6px_0_0_var(--lp-mustard)] active:shadow-[2px_2px_0_0_var(--lp-mustard)]",
    },
    dark: {
      primary: "border-cream bg-sun text-forest shadow-[4px_4px_0_0_var(--lp-mustard)] hover:shadow-[6px_6px_0_0_var(--lp-mustard)] active:shadow-[2px_2px_0_0_var(--lp-mustard)]",
      secondary: "border-cream bg-transparent text-cream shadow-[4px_4px_0_0_var(--lp-azure)] hover:shadow-[6px_6px_0_0_var(--lp-azure)] active:shadow-[2px_2px_0_0_var(--lp-azure)]",
    },
  };
  return cn(base, palette[surface][variant], className);
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", surface = "light", className, children, ...rest } = props;
  const classes = buttonClasses(variant, surface, className);
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AsLink, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof CommonProps>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
