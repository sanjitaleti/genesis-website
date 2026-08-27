"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Every button/card class in the .v2-* system. liquidGL auto-skips
 *  position:fixed elements (the nav bar, the Ask Genesis FAB) and
 *  auto-resolves z-index across mismatched targets, so this can point
 *  at the whole set without any per-component markup changes. */
const TARGET = ".v2-btn, .v2-btn-ghost, .v2-panel, .v2-tier, .v2-fact";

/** Applies the liquidGL glass-refraction effect to every button and
 *  box across the site. One shared WebGL renderer (from the library
 *  itself) serves every matched element. Re-runs on route change
 *  since the App Router swaps page content without a full reload. */
export function LiquidGL() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    const init = async () => {
      // let layout/paint (and the starfield's first frame) settle before
      // liquidGL snapshots the page as its refraction source
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled) return;
      if (!document.querySelector(TARGET)) return;

      const { default: liquidGL } = await import("liquid-gl");
      if (cancelled) return;

      liquidGL({
        target: TARGET,
        snapshot: "body",
        resolution: 2.0,
        refraction: 0.02,
        aberration: 0,
        bevelDepth: 0.06,
        bevelWidth: 0.12,
        frost: 0,
        shadow: true,
        specular: true,
        reveal: "fade",
      });
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
