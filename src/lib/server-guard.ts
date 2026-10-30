/** Best-effort per-instance rate limit (not a substitute for a shared store; fine for a low-traffic lead form). */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Integrations never fake success in production: with missing keys the routes answer 503.
 * Only outside production do they run in "simulation" mode so the flow can be developed.
 */
export const isProduction = () => process.env.NODE_ENV === "production";
