import { describe, expect, it } from "vitest";
import { AREA_VALUES } from "@/lib/contact-schema";
import { contactForm, faq, proof, sections, site } from "@/lib/content";

describe("content guardrails", () => {
  it("keeps every FAQ item complete (needed for FAQ JSON-LD)", () => {
    expect(faq.items).toHaveLength(5);
    faq.items.forEach((i) => {
      expect(i.q.length).toBeGreaterThan(0);
      expect(i.a.length).toBeGreaterThan(0);
    });
  });

  // The form's area options and the API's accepted values are two lists; keep them in step.
  it("offers every service area in the form, and the API accepts each option", () => {
    expect(contactForm.project.areaOptions).toEqual(AREA_VALUES);
    site.serviceAreas.forEach((area) => expect(AREA_VALUES).toContain(area));
  });

  it("uses the confirmed contact details", () => {
    expect(site.email).toBe("contact@lifepaintingdec.co.nz");
    expect(site.phone.tel).toBe("+64273759093");
  });

  // Pending content (placeholders, "PENDING" notes) never reaches production unless mock-up mode is on.
  it("hides pending content in production", async () => {
    const { isEvidenceVisible, isSectionVisible, SHOW_PENDING_SECTIONS } = await import("@/lib/content");
    expect(SHOW_PENDING_SECTIONS).toBe(false);
    const prev = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    Object.entries(sections).forEach(([id, s]) => {
      if (s.evidence === "pending") expect(isSectionVisible(id as keyof typeof sections)).toBe(false);
    });
    expect(isEvidenceVisible(proof.testimonials.evidence)).toBe(proof.testimonials.evidence === "ready");
    (process.env as Record<string, string>).NODE_ENV = prev ?? "test";
  });
});
