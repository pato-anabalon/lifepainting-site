import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = { id: string; label: string; hint?: string; error?: string; children: ReactNode; className?: string };

/** Label + hint + error wrapper. The control inside must set id, aria-describedby and aria-invalid itself. */
export function FormField({ id, label, hint, error, children, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-base font-bold">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm">
          {hint}
        </p>
      )}
      {children}
      {error && <FormAlert id={`${id}-error`}>{error}</FormAlert>}
    </div>
  );
}

/**
 * Error / warning message in the form: alert icon + text in a pale mustard box with a mustard
 * edge (owner's pick, 2026-11-09), so it reads as a warning and never as a link.
 */
export function FormAlert({ id, children, className, "data-testid": testId }: { id?: string; children: ReactNode; className?: string; "data-testid"?: string }) {
  return (
    <p id={id} role="alert" data-testid={testId} className={cn("flex items-start gap-2.5 border-l-4 border-mustard bg-mustard/25 px-3 py-2.5 text-sm font-bold text-forest", className)}>
      <TriangleAlert aria-hidden fill="var(--lp-mustard)" className="size-5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export const fieldClasses =
  "min-h-12 w-full border-2 border-forest bg-cream px-4 py-3 text-base text-forest placeholder:text-forest/60 aria-[invalid=true]:border-4";
