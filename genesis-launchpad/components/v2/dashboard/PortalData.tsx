"use client";

import { createContext, useContext } from "react";
import type { PortalData } from "@/lib/v2/portal";

/**
 * The current view's data, supplied once by the server component at the top
 * of the portal. Views read it through `usePortalData()` so none of them care
 * whether the numbers came from Supabase or the demo fixtures.
 */
const Ctx = createContext<PortalData | null>(null);

export function PortalDataProvider({
  value,
  children,
}: {
  value: PortalData;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePortalData(): PortalData {
  const data = useContext(Ctx);
  if (!data) throw new Error("usePortalData must be used inside the portal");
  return data;
}
