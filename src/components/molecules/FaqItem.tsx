"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = { question: string; answer: string; testId: string; defaultOpen?: boolean };

/**
 * One accordion row. Height animates via a 0fr → 1fr grid track (no measured heights, no JS
 * animation), the closed answer is `inert` so it never takes focus, and reduced motion is
 * handled by the global rule in globals.css.
 */
export function FaqItem({ question, answer, testId, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const panelId = `${uid}-panel`;
  return (
    <div data-testid={testId} data-open={open} className="border-b-2 border-forest last:border-b-0">
      <h3 className="text-lg sm:text-xl">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          data-testid={`${testId}-trigger`}
          className="flex min-h-14 w-full items-center justify-between gap-4 py-5 text-left font-bold hover:text-forest/80"
        >
          <span>{question}</span>
          <ChevronDown aria-hidden className={cn("size-6 shrink-0 transition-transform duration-300 ease-out", open && "rotate-180")} />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        inert={!open}
        className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-6 text-base leading-relaxed sm:text-lg">{answer}</p>
        </div>
      </div>
    </div>
  );
}
