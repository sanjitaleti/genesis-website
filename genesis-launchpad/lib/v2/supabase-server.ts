import "server-only";

/**
 * Server-side Supabase clients.
 *
 * `server-only` above makes importing this from a client component a build
 * error rather than a silent leak — which matters, because the service-role
 * client below bypasses row-level security entirely.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Bound to the request's cookies, so RLS sees the signed-in user and a client
 * can only ever read their own organisation's rows.
 */
export async function serverClient() {
  if (!URL || !ANON) throw new Error("Supabase is not configured");
  const store = await cookies();

  return createServerClient(URL, ANON, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          for (const { name, value, options } of list) {
            store.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
        }
      },
    },
  });
}

/**
 * Service-role client for the webhook only. This key ignores row-level
 * security, so it must never reach anything that runs in a browser.
 */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL || !key) throw new Error("Supabase service role is not configured");
  return createClient(URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
