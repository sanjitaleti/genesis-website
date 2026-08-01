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
  trailingSlash: true,
  // The static export has no image optimizer, so serve images as-is.
  images: { unoptimized: true },
  // This app lives in a subfolder of a larger repo; pin the root so Turbopack
  // doesn't get confused by lockfiles higher up the tree.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
