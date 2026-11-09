import { put } from "@vercel/blob";
import { MAX_PHOTO_BYTES, PHOTO_TYPES } from "@/lib/contact-schema";
import { clientIp, isProduction, rateLimited } from "@/lib/server-guard";

export const runtime = "nodejs";

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** One photo per request (Vercel function bodies are limited to 4.5 MB; we cap at 4 MB). */
export async function POST(req: Request) {
  if (rateLimited(`upload:${clientIp(req)}`, 12, 10 * 60_000)) return json({ ok: false, error: "rate_limited" }, 429);

  let file: unknown;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return json({ ok: false, error: "invalid" }, 400);
  }
  if (!(file instanceof File)) return json({ ok: false, error: "invalid" }, 400);
  if (!PHOTO_TYPES.includes(file.type)) return json({ ok: false, error: "type" }, 415);
  if (file.size > MAX_PHOTO_BYTES) return json({ ok: false, error: "size" }, 413);

  // Either credential works with @vercel/blob: a store connected today gets BLOB_STORE_ID (OIDC auth on
  // Vercel), older ones a BLOB_READ_WRITE_TOKEN.
  if (!process.env.BLOB_STORE_ID && !process.env.BLOB_READ_WRITE_TOKEN) {
    if (isProduction()) return json({ ok: false, error: "not_configured" }, 503);
    // Simulation: no storage, so there is no URL. The form shows the photo as attached locally only.
    return json({ ok: true, simulated: true, url: null });
  }

  try {
    const blob = await put(`enquiries/${crypto.randomUUID()}.${EXT[file.type]}`, file, { access: "public", contentType: file.type });
    return json({ ok: true, url: blob.url });
  } catch (error) {
    // Logged (no file contents) so a misconfigured store shows up in the Vercel function logs.
    console.error("[upload] blob put failed:", error instanceof Error ? error.message : error);
    return json({ ok: false, error: "failed" }, 502);
  }
}
