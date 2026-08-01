/**
 * Portal sign-in.
 *
 * Two modes, decided by whether Supabase is configured:
 *
 *  - configured: real email/password auth against Supabase, with the session
 *    in an httpOnly cookie and row-level security deciding what the user can
 *    read. This is the real thing.
 *
 *  - not configured: the hard-coded demo login below, so the portal can be
 *    demonstrated before any backend exists. It is a prototype gate, not
 *    security — the credentials are visible to anyone reading the bundle, and
 *    the dashboard shows a "Demo data" badge whenever it is in this mode.
 */

import { isConfigured, browserClient } from "./supabase";

const DEMO_EMAIL = "Test123";
const DEMO_PASSWORD = "Test123";
const KEY = "v2-demo-session";

export type Account = {
  name: string;
  business: string;
  initials: string;
  plan: string;
};

/** Stand-in identity used by the demo; live mode reads the real org instead. */
export const account: Account = {
  name: "Green City",
  business: "Green City Window Door & Siding",
  initials: "GC",
  plan: "Orbit",
};

export type SignInResult = { ok: true } | { ok: false; message: string };

export async function signInWith(email: string, password: string): Promise<SignInResult> {
  if (!isConfigured()) {
    if (email.trim() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* storage disabled; the session just won't persist */
      }
      return { ok: true };
    }
    return { ok: false, message: "That email and password don't match an account." };
  }

  const { error } = await browserClient().auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, message: "That email and password don't match an account." };
  }
  return { ok: true };
}

export async function signOut() {
  if (isConfigured()) {
    await browserClient().auth.signOut();
    return;
  }
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}

/**
 * Client-side check used to keep the portal pages from flashing for signed-out
 * visitors. In live mode the real gate is server-side: RLS returns nothing
 * without a valid session, so this is convenience, not protection.
 */
export async function isSignedIn(): Promise<boolean> {
  if (isConfigured()) {
    const { data } = await browserClient().auth.getSession();
    return Boolean(data.session);
  }
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
