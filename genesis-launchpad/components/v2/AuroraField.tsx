"use client";

import { useEffect, useRef } from "react";

/**
 * The living background: five blurred gradient fields drifting on their own
 * clocks, a soft light that follows the cursor, film grain, and a vignette so
 * text always reads. Pure CSS transforms — the cursor light is the only JS,
 * and it lerps through a rAF loop so it never jitters.
 */
export function AuroraField() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    const cur = { x: window.innerWidth / 2, y: window.innerHeight * 0.24 };
    const target = { ...cur };

    // The loop parks itself once the light has caught up with the pointer,
    // so an idle page costs nothing instead of burning a frame forever.
    const loop = () => {
      const dx = target.x - cur.x;
      const dy = target.y - cur.y;
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        raf = 0;
        return;
      }
      cur.x += dx * 0.08;
      cur.y += dy * 0.08;
      el.style.setProperty("--mx", `${cur.x}px`);
      el.style.setProperty("--my", `${cur.y}px`);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div aria-hidden>
      <div className="v2-aurora">
        <span className="v2-blob v2-blob--a" />
        <span className="v2-blob v2-blob--b" />
        <span className="v2-blob v2-blob--c" />
        <span className="v2-blob v2-blob--d" />
        <span className="v2-blob v2-blob--e" />
      </div>
      <div className="v2-spot" ref={spotRef} />
      <div className="v2-vignette" />
      <div className="v2-grain" />
    </div>
  );
}
