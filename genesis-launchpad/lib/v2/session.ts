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

/**
 * Redirects to Google, then back to /v2/welcome once Supabase has a session.
 * Requires the Google provider to be configured in Supabase (Authentication >
 * Providers) with real OAuth credentials — see SETUP.md. Until that's done
 * this errors clearly rather than silently doing nothing.
 */
export async function signInWithGoogle(): Promise<SignInResult> {
  if (!isConfigured()) {
    return { ok: false, message: "Google sign-in isn't available in demo mode." };
  }

  const { error } = await browserClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/v2/welcome` },
  });

  if (error) {
    return { ok: false, message: "Google sign-in isn't set up yet — use email and password." };
  }
  // On success the browser is already navigating away to Google.
  return { ok: true };
}

/** Sends a password-reset email via Supabase's own mailer — no extra service needed. */
export async function requestPasswordReset(email: string): Promise<SignInResult> {
  if (!isConfigured()) {
    return { ok: false, message: "Password reset isn't available in demo mode." };
  }

  const { error } = await browserClient().auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/v2/reset-password/confirm`,
  });

  if (error) {
    // Supabase deliberately doesn't reveal whether the email exists, to avoid
    // leaking which addresses have accounts — so this only fires for actual
    // failures (rate limits, malformed email), not "not found."
    return { ok: false, message: "Something went wrong sending that email. Try again shortly." };
  }
  return { ok: true };
}

/** Sets a new password once the user has followed the reset-email link. */
export async function confirmPasswordReset(password: string): Promise<SignInResult> {
  if (!isConfigured()) {
    return { ok: false, message: "Password reset isn't available in demo mode." };
  }

  const { error } = await browserClient().auth.updateUser({ password });
  if (error) {
    return { ok: false, message: "Couldn't set that password — try a longer one." };
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
 * True once the signed-in user has actually been onboarded — i.e. has a
 * `profiles` row linking them to an organization. A brand-new Google login
 * has none yet, which is exactly the signal that sends them to /v2/onboarding
 * instead of a dashboard full of zeros.
 */
export async function hasProfile(): Promise<boolean> {
  if (!isConfigured()) return true; // demo mode has no real profiles table

  const { data } = await browserClient().auth.getUser();
  if (!data.user) return false;

  const { data: profile } = await browserClient()
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  return Boolean(profile);
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
