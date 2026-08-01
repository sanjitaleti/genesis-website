/** Tiny className joiner — no dependency needed for this scale. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
