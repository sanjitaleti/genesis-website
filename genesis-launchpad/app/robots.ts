import type { MetadataRoute } from "next";

// /portal is the public read-only preview dashboard (marketing page, in the
// sitemap) — not the same as /dashboard, the real signed-in client portal,
// which is disallowed below along with the rest of the authenticated/utility
// surface.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/sign-in",
          "/create-account",
          "/onboarding",
          "/welcome",
          "/reset-password",
          "/admin",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.genesislp.ai/sitemap.xml",
  };
}
