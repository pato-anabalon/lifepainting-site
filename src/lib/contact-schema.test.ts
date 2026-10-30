import { describe, expect, it } from "vitest";
import { emptyContact, isAllowedPhotoUrl, validateAll, validateStep } from "./contact-schema";

const valid = { ...emptyContact, service: "interior" as const, area: "Auckland", message: "Repaint two bedrooms please", name: "Sam", email: "sam@example.com", consent: true };

describe("contact schema", () => {
  it("accepts a complete enquiry", () => {
    expect(validateAll(valid)).toEqual({});
  });
  it("flags missing fields per step", () => {
    expect(validateStep(1, emptyContact).service).toBe(true);
    expect(Object.keys(validateStep(2, emptyContact)).sort()).toEqual(["area", "message"]);
    expect(Object.keys(validateStep(3, emptyContact)).sort()).toEqual(["consent", "email", "name"]);
  });
  it("treats phone as optional but checks it when present", () => {
    expect(validateStep(3, { ...valid, phone: "" }).phone).toBeUndefined();
    expect(validateStep(3, { ...valid, phone: "abc" }).phone).toBe(true);
    expect(validateStep(3, { ...valid, phone: "027 375 9093" }).phone).toBeUndefined();
  });
  it("only allows our blob host for photos", () => {
    expect(isAllowedPhotoUrl("https://abc.public.blob.vercel-storage.com/x.jpg")).toBe(true);
    expect(isAllowedPhotoUrl("https://evil.example.com/x.jpg")).toBe(false);
    expect(isAllowedPhotoUrl("javascript:alert(1)")).toBe(false);
  });
});
