import type { MetadataRoute } from "next";
import { absoluteUrl, routes } from "@/lib/seo";

/** Only routes whose indexing state is `index: true` are listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes)
    .filter((r) => r.index)
    .map((r) => ({ url: absoluteUrl(r.path), changeFrequency: "monthly", priority: r.path === "/" ? 1 : 0.6 }));
}
