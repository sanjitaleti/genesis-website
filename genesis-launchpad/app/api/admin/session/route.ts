import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  adminCookieValue,
  adminPasswordConfigured,
  checkAdminPassword,
} from "@/lib/v2/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json({ error: "admin login is not configured" }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.password || !checkAdminPassword(body.password)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, adminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
