"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { TextLink } from "@/components/atoms/TextLink";
import { FormField, fieldClasses } from "@/components/molecules/FormField";
import { trackEvent } from "@/lib/analytics/track";
import { emptyContact, MAX_PHOTOS, MAX_PHOTO_BYTES, PHOTO_TYPES, SERVICE_VALUES, validateStep, type ContactData, type ContactErrors, type ContactService } from "@/lib/contact-schema";
import { contactForm as t, site } from "@/lib/content";
import { cn } from "@/lib/cn";

type Photo = { id: string; name: string; url: string | null; status: "uploading" | "done" | "error" };
type Status = "idle" | "sending" | "error" | "unavailable";

/**
 * Three-step enquiry form (service → project → details). Dark surface (lives in the contact section).
 * Reads `?service=` from the CTAs, records the route (pathname) it was started from, uploads photos on pick,
 * and posts to /api/contact. Never shows success unless the API answered ok.
 */
export function ContactForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<ContactData>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Prefill the service from `?service=` (state adjusted during render, per React guidance).
  const serviceParam = params.get("service");
  const [appliedParam, setAppliedParam] = useState<string | null | undefined>(undefined);
  if (serviceParam !== appliedParam) {
    setAppliedParam(serviceParam);
    if (serviceParam && SERVICE_VALUES.includes(serviceParam as ContactService)) {
      setData((d) => ({ ...d, service: serviceParam as ContactService }));
    }
  }

  // Move focus to the step heading when the step changes (not on first render).
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => {
    if (!started.current) {
      started.current = true;
      trackEvent("form_start");
    }
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const goNext = () => {
    const e = validateStep(step, data);
    setErrors(e);
    if (Object.keys(e).length) return;
    trackEvent("form_step", { step });
    setStep((s) => (s < 3 ? ((s + 1) as 2 | 3) : s));
  };

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    setPhotoError("");
    for (const file of Array.from(files)) {
      if (photos.length >= MAX_PHOTOS) return setPhotoError(t.project.photoErrors.limit);
      if (!PHOTO_TYPES.includes(file.type)) {
        setPhotoError(t.project.photoErrors.type);
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        setPhotoError(t.project.photoErrors.size);
        continue;
      }
      const id = crypto.randomUUID();
      setPhotos((p) => [...p, { id, name: file.name, url: null, status: "uploading" }]);
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const json = (await res.json()) as { ok: boolean; url?: string | null };
        if (!res.ok || !json.ok) throw new Error("upload");
        setPhotos((p) => p.map((x) => (x.id === id ? { ...x, url: json.url ?? null, status: "done" } : x)));
      } catch {
        setPhotos((p) => p.map((x) => (x.id === id ? { ...x, status: "error" } : x)));
        setPhotoError(t.project.photoErrors.failed);
      }
    }
  }

  const removePhoto = (id: string) => setPhotos((p) => p.filter((x) => x.id !== id));

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validateStep(3, data);
    setErrors(e);
    if (Object.keys(e).length || status === "sending") return;
    if (photos.some((p) => p.status === "uploading")) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, origin: window.location.pathname, photos: photos.flatMap((p) => (p.status === "done" && p.url ? [p.url] : [])) }),
      });
      if (res.ok) {
        trackEvent("form_submit", { result: "success", service: data.service });
        router.push("/thank-you");
        return;
      }
      const code = ((await res.json().catch(() => ({}))) as { error?: string }).error;
      trackEvent("form_submit", { result: code ?? "error", service: data.service });
      setStatus(res.status === 503 ? "unavailable" : "error");
    } catch {
      trackEvent("form_submit", { result: "network", service: data.service });
      setStatus("error");
    }
  }

  const err = (k: keyof ContactData, msg: string) => (errors[k] ? msg : undefined);
  const describe = (id: string, hint: boolean, error: boolean) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={submit} noValidate data-testid="home-contact-form" className="relative w-full max-w-2xl bg-cream p-5 text-forest shadow-[8px_8px_0_0_var(--lp-mustard)] sm:p-8" data-surface="light">
      <h3 ref={heading} tabIndex={-1} className="lp-title text-2xl outline-none sm:text-3xl">
        {step === 1 ? t.service.legend : step === 2 ? t.title : t.steps[2]}
      </h3>
      <p className="mt-2 text-sm font-bold" aria-live="polite" data-testid="home-contact-form-progress">
        {t.stepOf(step, 3)} · {t.steps[step - 1]}
      </p>

      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => setData((d) => ({ ...d, website: e.target.value }))} />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {step === 1 && (
          <fieldset data-testid="home-contact-step-service" aria-describedby={errors.service ? "service-error" : undefined}>
            <legend className="sr-only">{t.service.legend}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {t.service.options.map((o) => (
                <label key={o.value} className={cn("flex min-h-14 cursor-pointer items-center gap-3 border-2 border-forest px-4 py-3 text-base font-bold has-[:checked]:bg-sun has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2")}>
                  <input type="radio" name="service" value={o.value} checked={data.service === o.value} onChange={() => set("service", o.value as ContactService)} className="size-5 accent-forest" />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.service && (
              <p id="service-error" role="alert" className="mt-3 text-sm font-bold underline decoration-mustard decoration-2 underline-offset-4">
                {t.service.error}
              </p>
            )}
          </fieldset>
        )}

        {step === 2 && (
          <div data-testid="home-contact-step-project" className="flex flex-col gap-6">
            <FormField id="cf-area" label={t.project.areaLabel} error={err("area", t.project.areaError)}>
              <select id="cf-area" value={data.area} onChange={(e) => set("area", e.target.value)} aria-invalid={!!errors.area} aria-describedby={describe("cf-area", false, !!errors.area)} className={fieldClasses}>
                <option value="">Choose…</option>
                {t.project.areaOptions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField id="cf-message" label={t.project.messageLabel} hint={t.project.messageHint} error={err("message", t.project.messageError)}>
              <textarea id="cf-message" rows={5} maxLength={2000} value={data.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={describe("cf-message", true, !!errors.message)} className={fieldClasses} />
            </FormField>
            <div>
              <p className="text-base font-bold">{t.project.photosLabel}</p>
              <p className="mt-2 text-sm">{t.project.photosHint}</p>
              <ul className="mt-3 flex flex-col gap-2" data-testid="home-contact-photo-list">
                {photos.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 border-2 border-forest px-3 py-2 text-sm">
                    <span className="truncate">
                      {p.name} · {p.status === "uploading" ? "uploading…" : p.status === "error" ? "failed" : "attached"}
                    </span>
                    <button type="button" onClick={() => removePhoto(p.id)} aria-label={`${t.project.photoRemove} ${p.name}`} className="inline-flex size-8 shrink-0 items-center justify-center">
                      <X aria-hidden className="size-5" />
                    </button>
                  </li>
                ))}
              </ul>
              {photos.length < MAX_PHOTOS && (
                <label className="mt-3 inline-flex min-h-12 cursor-pointer items-center gap-2 border-2 border-forest px-4 py-2 text-base font-bold has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2">
                  <ImagePlus aria-hidden className="size-5" />
                  {t.project.photosAdd}
                  <input type="file" accept={PHOTO_TYPES.join(",")} multiple className="sr-only" data-testid="home-contact-photo-input" onChange={(e) => { void addPhotos(e.target.files); e.target.value = ""; }} />
                </label>
              )}
              {photoError && (
                <p role="alert" className="mt-2 text-sm font-bold underline decoration-mustard decoration-2 underline-offset-4">
                  {photoError}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div data-testid="home-contact-step-details" className="flex flex-col gap-6">
            <FormField id="cf-name" label={t.details.nameLabel} error={err("name", t.details.nameError)}>
              <input id="cf-name" type="text" autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describe("cf-name", false, !!errors.name)} className={fieldClasses} />
            </FormField>
            <FormField id="cf-email" label={t.details.emailLabel} error={err("email", t.details.emailError)}>
              <input id="cf-email" type="email" autoComplete="email" inputMode="email" value={data.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describe("cf-email", false, !!errors.email)} className={fieldClasses} />
            </FormField>
            <FormField id="cf-phone" label={t.details.phoneLabel} error={err("phone", t.details.phoneError)}>
              <input id="cf-phone" type="tel" autoComplete="tel" inputMode="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={describe("cf-phone", false, !!errors.phone)} className={fieldClasses} />
            </FormField>
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-base">
                <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "cf-consent-error" : undefined} className="mt-1 size-5 shrink-0 accent-forest" data-testid="home-contact-consent" />
                <span>{t.details.consentLabel}</span>
              </label>
              {errors.consent && (
                <p id="cf-consent-error" role="alert" className="mt-2 text-sm font-bold underline decoration-mustard decoration-2 underline-offset-4">
                  {t.details.consentError}
                </p>
              )}
              <p className="mt-3 text-sm">
                {t.details.privacyLead} <TextLink href="/privacy">{t.details.privacyLink}</TextLink>
              </p>
            </div>
          </div>
        )}
      </div>

      {status === "error" && (
        <p role="alert" data-testid="home-contact-form-error" className="mt-6 text-base font-bold">
          {t.genericError}
        </p>
      )}
      {status === "unavailable" && (
        <p role="alert" data-testid="home-contact-form-unavailable" className="mt-6 text-base font-bold">
          {t.unavailable} <TextLink href={`tel:${site.phone.tel}`}>{site.phone.display}</TextLink> · <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink>
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {step > 1 && (
          <Button variant="secondary" onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2) : s))} data-testid="home-contact-back-button">
            {t.back}
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={goNext} data-testid="home-contact-next-button">
            {t.next}
          </Button>
        ) : (
          <Button type="submit" disabled={status === "sending"} data-testid="home-contact-submit-button">
            {status === "sending" ? t.sending : t.submit}
          </Button>
        )}
      </div>
    </form>
  );
}
