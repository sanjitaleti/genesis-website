import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: this used to be `output: "export"` for the IONOS static drop.
  // The client portal needs a server — it receives ElevenLabs webhooks, holds
  // API secrets, and reads per-user data behind auth, none of which a static
  // bundle can do. Marketing pages are still prerendered at build time; only
  // /v2/dashboard and /api/* are dynamic. Deploy to a Node host (Vercel).
  //
  // trailingSlash used to be true for the static export's /about/index.html
  // convention. On a real server it does more harm than good: it 308-redirects
  // POST requests, including the ElevenLabs webhook — and most webhook senders
  // don't follow redirects, so calls would silently never reach the database.
  images: { unoptimized: true },
  // This app lives in a subfolder of a larger repo; pin the root so Turbopack
  // doesn't get confused by lockfiles higher up the tree.
  turbopack: {
    root: __dirname,
  },
  // The old placeholder site and the /v2 concept routes have both been
  // retired now that the receptionist positioning is the whole site — /v2/*
  // content moved to the plain paths. Permanent (301), since this isn't
  // temporary: anyone who still has an old /v2 link should be forwarded for
  // good, and search engines should transfer ranking signal to the new URL.
  async redirects() {
    return [
      { source: "/v2", destination: "/", permanent: true },
      { source: "/v2/:path*", destination: "/:path*", permanent: true },
      // /about and /solutions returned 200 before the consolidation and now
      // 404 — redirect any existing links/citations to their replacements.
      { source: "/about", destination: "/", permanent: true },
      { source: "/solutions", destination: "/features", permanent: true },
    ];
  },
};

export default nextConfig;
