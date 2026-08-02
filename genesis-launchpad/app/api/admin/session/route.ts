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

/**
 * Simple per-IP throttle for failed admin login attempts. In-memory Map is
 * fine here — this is a single-process dev/small-scale internal tool, not a
 * multi-instance service. Resets per IP on a successful login.
 */
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 10;
const failedAttempts = new Map<string, { count: number; windowStart: number }>();

function clientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.windowStart > LOGIN_WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const entry = failedAttempts.get(ip);
  const now = Date.now();
  if (!entry || now - entry.windowStart > LOGIN_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, windowStart: now });
    return;
  }
  entry.count += 1;
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

export async function POST(req: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json({ error: "admin login is not configured" }, { status: 503 });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    console.warn(`[admin-login] rate limited ip=${ip} at=${new Date().toISOString()}`);
    return NextResponse.json({ error: "too many attempts, try again later" }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.password || !checkAdminPassword(body.password)) {
    recordFailedAttempt(ip);
    console.warn(`[admin-login] failed attempt ip=${ip} at=${new Date().toISOString()}`);
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }

  clearFailedAttempts(ip);

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
