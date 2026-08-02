import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serviceClient } from "@/lib/v2/supabase-server";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/v2/admin-auth";

/**
 * Marks an email as paid, however it needs to work regardless of when the
 * client actually creates their own account:
 *
 *  - account + profile already exist  -> update that org's paid/plan now
 *  - account exists, no profile yet   -> upsert `customers`; picked up
 *                                        when onboarding runs
 *  - no account yet                   -> same as above
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLANS = ["Lunar", "Orbit", "Nova"];

export async function POST(req: Request) {
  const store = await cookies();
  if (!isValidAdminCookie(store.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "not signed in as admin" }, { status: 401 });
  }

  let body: { email?: string; plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const plan = body.plan?.trim();

  if (!email || !plan || !PLANS.includes(plan)) {
    return NextResponse.json({ error: "a valid email and plan are required" }, { status: 400 });
  }

  const db = serviceClient();

  const { data: usersPage, error: usersError } = await db.auth.admin.listUsers({ perPage: 200 });
  if (usersError) {
    console.error("[admin/customers] failed to list users:", usersError);
    return NextResponse.json({ error: "could not check for an existing account" }, { status: 500 });
  }
  const existingUser = usersPage.users.find((u) => u.email?.toLowerCase() === email);

  let claimedOrgId: string | null = null;

  if (existingUser) {
    const { data: profile } = await db
      .from("profiles")
      .select("org_id")
      .eq("id", existingUser.id)
      .maybeSingle();

    if (profile) {
      const { error: orgError } = await db
        .from("organizations")
        .update({ paid: true, plan })
        .eq("id", profile.org_id);

      if (orgError) {
        console.error("[admin/customers] failed to mark org paid:", orgError);
        return NextResponse.json({ error: "could not update the organization" }, { status: 500 });
      }
      claimedOrgId = profile.org_id;
    }
  }

  const { error: upsertError } = await db
    .from("customers")
    .upsert(
      { email, plan, paid_at: new Date().toISOString(), claimed_org_id: claimedOrgId },
      { onConflict: "email" },
    );

  if (upsertError) {
    console.error("[admin/customers] failed to upsert customer:", upsertError);
    return NextResponse.json({ error: "could not save the customer record" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, matchedExistingOrg: Boolean(claimedOrgId) });
}
