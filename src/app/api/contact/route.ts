import { Resend } from "resend";
import { isAllowedPhotoUrl, MAX_PHOTOS, validateAll, type ContactData } from "@/lib/contact-schema";
import { clientIp, isProduction, rateLimited } from "@/lib/server-guard";
import { site } from "@/lib/content";

export const runtime = "nodejs";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(req: Request) {
  if (rateLimited(`contact:${clientIp(req)}`, 5, 10 * 60_000)) return json({ ok: false, error: "rate_limited" }, 429);

  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }

  // Honeypot: pretend success so bots learn nothing.
  if (str(raw.website, 200)) return json({ ok: true });

  const photos = Array.isArray(raw.photos) ? raw.photos.filter((p): p is string => typeof p === "string" && isAllowedPhotoUrl(p)).slice(0, MAX_PHOTOS) : [];
  const data: ContactData = {
    service: str(raw.service, 20) as ContactData["service"],
    area: str(raw.area, 40),
    message: str(raw.message, 2000),
    photos,
    name: str(raw.name, 100),
    email: str(raw.email, 200),
    phone: str(raw.phone, 30),
    consent: raw.consent === true,
    origin: str(raw.origin, 120),
    website: "",
  };
  if (Object.keys(validateAll(data)).length > 0) return json({ ok: false, error: "invalid" }, 400);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    if (isProduction()) return json({ ok: false, error: "not_configured" }, 503);
    console.info("[contact:simulated]", { ...data, email: "(redacted)", phone: "(redacted)", name: "(redacted)" });
    return json({ ok: true, simulated: true });
  }

  const text = [
    `New website enquiry for ${site.legalName}`,
    "",
    `Service: ${data.service}`,
    `Area: ${data.area}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "(not given)"}`,
    `Started from: ${data.origin || "/"}`,
    "",
    "Message:",
    data.message,
    "",
    data.photos.length ? `Photos:\n${data.photos.join("\n")}` : "Photos: none",
  ].join("\n");

  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Website enquiry: ${data.service} (${data.area})`,
      text,
    });
    if (error) return json({ ok: false, error: "send_failed" }, 502);
  } catch {
    return json({ ok: false, error: "send_failed" }, 502);
  }
  return json({ ok: true });
}
