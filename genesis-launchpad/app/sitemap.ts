import type { MetadataRoute } from "next";

const BASE = "https://www.genesislp.ai";

// NOTE: lists the current live /v2/* routes, since Task 0 (promoting /v2 to
// the root paths and retiring the old pages) hasn't happened yet. Once that
// content move is confirmed and done, these paths need to drop the /v2
// prefix to match.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/v2`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/v2/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/v2/features`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/v2/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/v2/portal`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/v2/get-started/lunar`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/v2/get-started/orbit`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/v2/get-started/nova`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/v2/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/v2/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
