import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminPanel } from "@/components/v2/AdminPanel";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/v2/admin-auth";

export const metadata: Metadata = {
  title: { absolute: "Admin — Genesis LP" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await cookies();
  const authed = isValidAdminCookie(store.get(ADMIN_COOKIE_NAME)?.value);
  return <AdminPanel initialAuthed={authed} />;
}
