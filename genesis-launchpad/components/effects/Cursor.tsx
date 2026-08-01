"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a blended ring that lerps toward the pointer and swells over
 * interactive elements (a, button, [data-cursor]). mix-blend-difference gives
 * the murdered-out invert read. Only mounts on fine-pointer devices.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { ...pos };
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea",
      );
      hovering = !!el;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) {
        const s = hovering ? 2.6 : 1;
        ring.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) scale(${s})`;
        ring.current.style.opacity = hovering ? "0.6" : "1";
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden>
      <div
        ref={ring}
        className="absolute left-0 top-0 h-8 w-8 rounded-full border border-white mix-blend-difference transition-[opacity] duration-300 will-change-transform"
      />
      <div
        ref={dot}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-cyan will-change-transform"
      />
    </div>
  );
}
