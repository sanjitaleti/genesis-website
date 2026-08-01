/**
 * Sign-in artwork: the Pillars of Creation, photographed by Hubble.
 * Public domain (NASA/ESA/STScI). Stored locally so nothing loads off-site.
 *
 * Deliberately a plain <img> with a very slow drift rather than any canvas or
 * JS: a real photograph carries the scene, so the panel costs one decode and
 * then sits still.
 */
export function SpaceScene() {
  return (
    <>
      <div className="v2-space" aria-hidden />
      <img
        src="/v2/pillars.jpg"
        alt="The Pillars of Creation in the Eagle Nebula, photographed by the Hubble Space Telescope"
        className="v2-space-photo"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={1200}
        height={1124}
      />
      <div className="v2-space-veil" aria-hidden />
    </>
  );
}
