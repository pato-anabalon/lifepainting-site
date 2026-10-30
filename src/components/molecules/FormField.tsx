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
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-bold text-forest underline decoration-mustard decoration-2 underline-offset-4">
          {error}
        </p>
      )}
    </div>
  );
}

export const fieldClasses =
  "min-h-12 w-full border-2 border-forest bg-cream px-4 py-3 text-base text-forest placeholder:text-forest/60 aria-[invalid=true]:border-4";
