import { cn } from "@/lib/cn";

/**
 * No-op wrapper. This system composes the page — no scroll-triggered reveals
 * (see design.md § Motion). Kept as a component so existing pages compile;
 * it only forwards className.
 */
export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "item" | "group";
}) {
  return <div className={cn(className)}>{children}</div>;
}
