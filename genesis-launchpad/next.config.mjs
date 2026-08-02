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
  // Now that genesislp.ai points at this deployment, the root path should be
  // the finished v2 site rather than the original placeholder homepage — the
  // old page still exists (nothing was deleted), it's just no longer the
  // default landing experience.
  async redirects() {
    return [{ source: "/", destination: "/v2", permanent: false }];
  },
};

export default nextConfig;
