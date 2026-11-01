import { describe, expect, it } from "vitest";
import { faq, sections, site } from "@/lib/content";

describe("content guardrails", () => {
  it("keeps every FAQ item complete (needed for FAQ JSON-LD)", () => {
    expect(faq.items).toHaveLength(5);
    faq.items.forEach((i) => {
      expect(i.q.length).toBeGreaterThan(0);
      expect(i.a.length).toBeGreaterThan(0);
    });
  });

  it("uses the confirmed contact details", () => {
    expect(site.email).toBe("contact@lifepaintingdec.co.nz");
    expect(site.phone.tel).toBe("+64273759093");
  });

  // Mock-up mode (SHOW_PENDING_SECTIONS) is the only way a pending section reaches production.
  // Once the flag goes back to false before launch, this is again a strict "never".
  it("shows pending sections in production only in mock-up mode", async () => {
    const { isSectionVisible, SHOW_PENDING_SECTIONS } = await import("@/lib/content");
    const prev = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    Object.entries(sections).forEach(([id, s]) => {
      if (s.evidence === "pending") expect(isSectionVisible(id as keyof typeof sections)).toBe(SHOW_PENDING_SECTIONS);
    });
    (process.env as Record<string, string>).NODE_ENV = prev ?? "test";
  });
});
