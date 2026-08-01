import type { Metadata } from "next";
import { Dashboard } from "@/components/v2/dashboard/Dashboard";
import { getPortalBundle } from "@/lib/v2/portal";

export const metadata: Metadata = {
  title: { absolute: "Portal — Genesis LP" },
  description: "Your Genesis LP client dashboard.",
};

// The portal reads per-request data behind a session, so it is never
// prerendered at build time.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const bundle = await getPortalBundle();
  return <Dashboard bundle={bundle} />;
}
