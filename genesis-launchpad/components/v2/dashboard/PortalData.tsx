"use client";

import { createContext, useContext, useState } from "react";
import type { PortalData } from "@/lib/v2/portal";
import type { Range } from "@/lib/v2/data";
import type { Accent, Mode } from "@/lib/v2/theme";

/**
 * The whole bundle (every range) plus which slice is "current" for the
 * Overview page's picker, plus the active theme. Theme is tracked as its own
 * piece of state — initialized from the org's saved values, but changeable
 * instantly from Settings without waiting on a page reload or a fresh
 * server fetch.
 */
type Ctx = {
  data: PortalData;
  bundle: Record<Range, PortalData>;
  accent: Accent;
  mode: Mode;
  setTheme: (accent: Accent, mode: Mode) => void;
};

const PortalCtx = createContext<Ctx | null>(null);

export function PortalDataProvider({
  value,
  bundle,
  children,
}: {
  value: PortalData;
  bundle: Record<Range, PortalData>;
  children: React.ReactNode;
}) {
  const [accent, setAccent] = useState<Accent>(value.themeAccent);
  const [mode, setMode] = useState<Mode>(value.themeMode);

  const setTheme = (a: Accent, m: Mode) => {
    setAccent(a);
    setMode(m);
  };

  return (
    <PortalCtx.Provider value={{ data: value, bundle, accent, mode, setTheme }}>
      {children}
    </PortalCtx.Provider>
  );
}

export function usePortalData(): PortalData {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error("usePortalData must be used inside the portal");
  return ctx.data;
}

export function usePortalBundle(): Record<Range, PortalData> {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error("usePortalBundle must be used inside the portal");
  return ctx.bundle;
}

export function useTheme(): { accent: Accent; mode: Mode; setTheme: (accent: Accent, mode: Mode) => void } {
  const ctx = useContext(PortalCtx);
  if (!ctx) throw new Error("useTheme must be used inside the portal");
  return { accent: ctx.accent, mode: ctx.mode, setTheme: ctx.setTheme };
}
