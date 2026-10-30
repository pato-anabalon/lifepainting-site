import type { ServiceKey } from "@/lib/content";

/** Shared by the form (per-step checks) and /api/contact (final check). */
export type ContactService = ServiceKey | "unsure";

export const SERVICE_VALUES: ContactService[] = ["interior", "exterior", "decorative", "preparation", "unsure"];
export const AREA_VALUES = ["Auckland", "North Shore", "Auckland Central", "Somewhere else"];
export const MAX_PHOTOS = 3;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type ContactData = {
  service: ContactService | "";
  area: string;
  message: string;
  photos: string[];
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  origin: string;
  /** Honeypot: real people never fill it. */
  website: string;
};

export type ContactErrors = Partial<Record<keyof ContactData, true>>;

export const emptyContact: ContactData = {
  service: "",
  area: "",
  message: "",
  photos: [],
  name: "",
  email: "",
  phone: "",
  consent: false,
  origin: "/",
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s()+-]{5,19}$/;

/** Validates one step (1-3). Returns the invalid fields. */
export function validateStep(step: 1 | 2 | 3, d: ContactData): ContactErrors {
  const e: ContactErrors = {};
  if (step === 1 && !SERVICE_VALUES.includes(d.service as ContactService)) e.service = true;
  if (step === 2) {
    if (!AREA_VALUES.includes(d.area)) e.area = true;
    if (d.message.trim().length < 10 || d.message.length > 2000) e.message = true;
  }
  if (step === 3) {
    if (d.name.trim().length < 2 || d.name.length > 100) e.name = true;
    if (!EMAIL.test(d.email.trim()) || d.email.length > 200) e.email = true;
    if (d.phone.trim() && !PHONE.test(d.phone.trim())) e.phone = true;
    if (!d.consent) e.consent = true;
  }
  return e;
}

export function validateAll(d: ContactData): ContactErrors {
  return { ...validateStep(1, d), ...validateStep(2, d), ...validateStep(3, d) };
}

/** Photo URLs must come from our blob store, never arbitrary hosts. */
export function isAllowedPhotoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}
