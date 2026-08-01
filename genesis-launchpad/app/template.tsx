/**
 * Pass-through. The design system composes the page with no route-transition
 * curtain (see design.md § Motion). Kept as a no-op so Next's template slot
 * exists without introducing motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
