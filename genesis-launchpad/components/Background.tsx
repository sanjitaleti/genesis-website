/**
 * Matte-black canvas: filmic grain only. No gradients, no orbs, no shaders —
 * the typography carries the page; this just keeps the black from feeling flat.
 */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="grain absolute inset-0 opacity-[0.05] mix-blend-screen" />
    </div>
  );
}
