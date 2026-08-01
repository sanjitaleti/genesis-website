/**
 * Supabase access that is safe to import anywhere, including the browser.
 *
 * The portal runs in two modes. With no Supabase environment variables set it
 * falls back to demo data, so the dashboard demos cleanly before any backend
 * exists. Once the variables are present every read goes to the real database.
 *
 * Server-only clients live in `supabase-server.ts` — keeping them out of this
 * file is what stops `next/headers` and the service-role key from being pulled
 * into a client bundle.
 */

import { createBrowserClient } from "@supabase/ssr";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isConfigured(): boolean {
  return Boolean(URL && ANON);
}

/** Browser client, used for sign-in and sign-out. */
export function browserClient() {
  if (!URL || !ANON) throw new Error("Supabase is not configured");
  return createBrowserClient(URL, ANON);
}
