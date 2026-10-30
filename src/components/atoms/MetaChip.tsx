import type { ReactNode } from "react";
import { cn, type Surface } from "@/lib/cn";

type Props = { surface?: Surface; icon?: ReactNode; children: ReactNode; className?: string };

/**
 * MetaChip = purely informational. Not interactive: flat, thin outline, plain sentence-case text,
 * no shadow, no hover. It must never read as a button.
 */
export function MetaChip({ surface = "light", icon, children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-1 text-sm font-semibold",
        surface === "light" ? "border-forest/40 text-forest" : "border-cream/50 text-cream",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
