import "server-only";
import crypto from "crypto";

/**
 * A single shared password, not a Supabase user role — this gates one
 * internal tool used by one person today. `ADMIN_PASSWORD` unset means the
 * admin page is entirely unreachable (fails closed), same as every other
 * optional integration in this codebase.
 */

export const ADMIN_COOKIE_NAME = "v2-admin";

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

const timingSafeStringEqual = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeStringEqual(sha256(candidate), sha256(expected));
}

const SESSION_SECONDS = 60 * 60 * 8; // 8 hours

/**
 * Derived from the password itself, so no separate signing secret is
 * needed — only someone who already knows ADMIN_PASSWORD can produce this
 * value. httpOnly keeps it out of reach of any client-side script.
 *
 * The value encodes `<expiryUnixSeconds>.<hmac>`, where the hmac binds the
 * expiry to the password. This means (a) a captured cookie by itself isn't
 * a bare password hash sitting in a public/predictable format, and (b) the
 * server actually enforces expiry itself — the cookie's `maxAge` is only a
 * client-side hint and would otherwise be accepted forever.
 */
function hmacFor(expiry: number): string {
  return sha256(`v2-admin:${process.env.ADMIN_PASSWORD ?? ""}:${expiry}`);
}

export function adminCookieValue(): string {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${expiry}.${hmacFor(expiry)}`;
}

export function isValidAdminCookie(value: string | undefined): boolean {
  if (!value || !adminPasswordConfigured()) return false;
  const [expiryStr, mac] = value.split(".");
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;
  return timingSafeStringEqual(mac ?? "", hmacFor(expiry));
}
