import { cn } from "@/lib/cn";

/**
 * Placeholder for a real client photo. Only rendered by sections whose evidence is "pending",
 * which never ship to production (see isSectionVisible). Replace with <Image> when photos arrive.
 */
export function ThumbSlot({ label, className, testId }: { label: string; className?: string; testId?: string }) {
  return (
    <div data-testid={testId} role="img" aria-label={`Placeholder: ${label}`} className={cn("flex items-center justify-center bg-azure/40 p-4 text-center text-sm font-bold text-forest", className)}>
      {label}
    </div>
  );
}
