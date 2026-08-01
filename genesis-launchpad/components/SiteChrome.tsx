"use client";

import { usePathname } from "next/navigation";

/**
 * The v2 concept routes bring their own chrome, so the live site's navbar and
 * footer step aside there. Everything else renders exactly as before.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/v2")) return null;
  return <>{children}</>;
}
