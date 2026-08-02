import { NextResponse } from "next/server";
import { serverClient, serviceClient } from "@/lib/v2/supabase-server";

/**
 * Lets a signed-in user change their own organization's theme. The caller's
 * org is looked up from their own session (never trusted from the request
 * body), so this can only ever touch the org the caller actually belongs to.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCENTS = ["mono", "punch", "cyan", "citrus"];
const MODES = ["dark", "light"];

export async function PATCH(req: Request) {
  const auth = await serverClient();
  const {
    data: { user },
  } = await auth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not signed in" }, { status: 401 });
  }

  let body: { accent?: string; mode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!ACCENTS.includes(body.accent ?? "") || !MODES.includes(body.mode ?? "")) {
    return NextResponse.json({ error: "invalid theme" }, { status: 400 });
  }

  const db = serviceClient();

  const { data: profile } = await db.from("profiles").select("org_id").eq("id", user.id).maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "no organization linked to this account" }, { status: 404 });
  }

  const { error } = await db
    .from("organizations")
    .update({ theme_accent: body.accent, theme_mode: body.mode })
    .eq("id", profile.org_id);

  if (error) {
    console.error("[settings/theme] failed to update:", error);
    return NextResponse.json({ error: "could not save theme" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
