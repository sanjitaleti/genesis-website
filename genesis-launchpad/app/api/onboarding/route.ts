import { NextResponse } from "next/server";
import { serverClient, serviceClient } from "@/lib/v2/supabase-server";

/**
 * Self-serve onboarding: turns a freshly authenticated user (no org yet)
 * into a real client. Runs once per account — a user who already has a
 * `profiles` row is rejected, so resubmitting this form can't create a
 * second organization for the same login.
 *
 * The caller's identity comes from their own session cookie via
 * `serverClient()`, never from anything the client sends — so nobody can
 * onboard on someone else's behalf. The actual writes go through the
 * service-role client, same pattern as the webhook and the leads route.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCENTS = ["mono", "punch", "cyan", "citrus"] as const;
const MODES = ["dark", "light"] as const;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "business";

export async function POST(req: Request) {
  const auth = await serverClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  let body: { name?: string; business?: string; accent?: string; mode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name = body.name?.trim();
  const business = body.business?.trim();
  const accent = ACCENTS.includes(body.accent as (typeof ACCENTS)[number]) ? body.accent! : "punch";
  const mode = MODES.includes(body.mode as (typeof MODES)[number]) ? body.mode! : "dark";

  if (!name || !business) {
    return NextResponse.json({ error: "name and business are required" }, { status: 400 });
  }

  const db = serviceClient();

  // Already onboarded — don't let a resubmit spawn a second organization.
  const { data: existing } = await db.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "already onboarded" }, { status: 409 });
  }

  // Has this email already been marked paid (e.g. via the admin page after
  // a Calendly call closed)? If so, this org starts unlocked and picks up
  // whatever plan was recorded — never trust a client-supplied "paid" flag.
  const email = user.email?.trim().toLowerCase();
  const { data: customer } = email
    ? await db.from("customers").select("id, plan").eq("email", email).maybeSingle()
    : { data: null };

  // Slugs must be unique; a short random suffix avoids collisions between
  // two businesses that happen to share a name, without asking the user to
  // think about it.
  const slug = `${slugify(business)}-${Math.random().toString(36).slice(2, 7)}`;

  const { data: org, error: orgError } = await db
    .from("organizations")
    .insert({
      name: business,
      slug,
      theme_accent: accent,
      theme_mode: mode,
      paid: Boolean(customer),
      ...(customer ? { plan: customer.plan } : {}),
    })
    .select("id")
    .single();

  if (orgError) {
    console.error("[onboarding] failed to create organization:", orgError);
    return NextResponse.json({ error: "could not create organization" }, { status: 500 });
  }

  const { error: profileError } = await db
    .from("profiles")
    .insert({ id: user.id, org_id: org.id, full_name: name });

  if (profileError) {
    console.error("[onboarding] failed to create profile:", profileError);
    // Best-effort cleanup so a failed onboarding doesn't leave an orphaned org.
    await db.from("organizations").delete().eq("id", org.id);
    return NextResponse.json({ error: "could not link account" }, { status: 500 });
  }

  if (customer) {
    await db.from("customers").update({ claimed_org_id: org.id }).eq("id", customer.id);
  }

  return NextResponse.json({ ok: true });
}
