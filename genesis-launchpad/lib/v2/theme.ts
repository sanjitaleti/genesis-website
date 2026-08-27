/**
 * The 4 dashboard accent themes × light/dark mode.
 *
 * This file only holds what the picker UI needs to render swatches — the
 * actual color values every component uses live in v2.css, scoped under
 * `.v2-dash[data-accent][data-mode]`. Keep the two in sync by hand; there
 * are only 4 accents, so that's a manageable amount of duplication in
 * exchange for not needing a CSS-in-JS build step.
 */

export type Accent = "mono" | "punch" | "cyan" | "citrus";
export type Mode = "dark" | "light";

export const ACCENTS: { key: Accent; label: string; swatch: [string, string] }[] = [
  { key: "mono", label: "Black & white", swatch: ["#f5f5f7", "#8a8a92"] },
  { key: "punch", label: "Black & pink/purple", swatch: ["#f72585", "#7b2cbf"] },
  { key: "cyan", label: "Black & blue/cyan", swatch: ["#22d3ee", "#3b82f6"] },
  { key: "citrus", label: "Black & yellow/green", swatch: ["#facc15", "#65a30d"] },
];

export const MODES: { key: Mode; label: string }[] = [
  { key: "dark", label: "Dark" },
  { key: "light", label: "Light" },
];

export const DEFAULT_ACCENT: Accent = "mono";
export const DEFAULT_MODE: Mode = "light";
