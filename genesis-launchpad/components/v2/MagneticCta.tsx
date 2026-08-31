"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const MAX_OFFSET = 9; // px — the cap the design brief asks for
const RADIUS = 110; // px — how close the cursor must get before it pulls

/**
 * A primary CTA that leans toward the cursor.
 *
 * Exists as a small client island so the pages using it can stay server
 * components (they render JSON-LD via dangerouslySetInnerHTML, which is
 * simplest to keep on the server).
 *
 * The effect is genuinely inert — not merely invisible — on coarse
 * pointers and under prefers-reduced-motion: the listeners are never
 * attached, so there is no work happening on a phone. `.v2-magnetic`
 * carries a matching CSS guard so a stale inline transform can't survive
 * a change of input device either.
 */
export function MagneticCta({
  href,
  children,
  className = "v2-btn v2-btn--lg",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Bail before attaching anything. Touch devices have no hover to
    // track, and reduced-motion users asked not to be moved at.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist > RADIUS + Math.max(r.width, r.height) / 2) {
          el.style.transform = "";
          return;
        }
        // falls off with distance so the pull eases in rather than snapping
        const pull = Math.min(1, RADIUS / Math.max(dist, 1)) * 0.32;
        const x = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx * pull));
        const y = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy * pull));
        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
    };

    const release = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      el.style.transform = "";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", release);
    el.addEventListener("pointerleave", release);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", release);
      el.removeEventListener("pointerleave", release);
      release();
    };
  }, []);

  return (
    <Link ref={ref} href={href} className={`${className} v2-magnetic`}>
      {children}
    </Link>
  );
}
