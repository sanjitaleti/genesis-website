import type { MetadataRoute } from "next";

// NOTE: /v2/portal is the public read-only preview dashboard (marketing
// page, in the sitemap) — not the same as /v2/dashboard, the real
// signed-in client portal, which is disallowed below along with the rest
// of the authenticated/utility surface.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/v2/dashboard",
          "/v2/sign-in",
          "/v2/create-account",
          "/v2/onboarding",
          "/v2/welcome",
          "/v2/reset-password",
          "/v2/admin",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.genesislp.ai/sitemap.xml",
  };
}
