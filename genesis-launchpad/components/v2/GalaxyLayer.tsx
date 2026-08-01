"use client";

import { useEffect, useRef } from "react";

/**
 * The galaxy. Invisible until you scroll toward the pricing section, then it
 * crossfades in as the aurora fades out, so the page travels into open sky
 * rather than swapping backgrounds.
 *
 * Performance notes, because this runs on every page:
 *  - the star canvas stops drawing entirely while the layer is invisible
 *  - the scroll listener is rAF-throttled so it reads layout at most once a
 *    frame, and an IntersectionObserver drives it independently so the value
 *    is still correct if frames are paused
 */
export function GalaxyLayer({ triggerId = "pricing" }: { triggerId?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // shared between both effects: how visible the galaxy currently is
  const visible = useRef(0);

  /* ---- starfield ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; r: number; p: number; s: number };
    let stars: Star[] = [];
    let raf = 0;
    let running = false;

    const seed = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.round((w * h) / 8200));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.25 + 0.35,
        p: Math.random() * Math.PI * 2,
        s: Math.random() * 1.7 + 0.5,
      }));
    };

    const paint = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const tw = reduce ? 0.75 : 0.55 + Math.sin((t / 1000) * st.s + st.p) * 0.45;
        ctx.globalAlpha = Math.max(0.08, tw);
        ctx.fillStyle = st.r > 1.35 ? "#ffd6ff" : st.r > 1.1 ? "#f7c8ff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      // nothing to draw while the layer is faded out
      if (visible.current <= 0.01) {
        running = false;
        raf = 0;
        return;
      }
      paint(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    // let the crossfade effect wake the loop back up
    (canvas as HTMLCanvasElement & { __wake?: () => void }).__wake = start;

    seed();
    paint(0);

    const onResize = () => {
      seed();
      if (visible.current > 0.01) paint(performance.now());
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ---- scroll crossfade ---- */
  useEffect(() => {
    const root = document.documentElement;
    const el = document.getElementById(triggerId);
    if (!el) return;

    let raf = 0;

    const measure = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.85)));
      visible.current = p;
      root.style.setProperty("--galaxy", p.toFixed(3));
      if (p > 0.01) {
        const c = canvasRef.current as
          | (HTMLCanvasElement & { __wake?: () => void })
          | null;
        c?.__wake?.();
      }
    };

    // one layout read per frame at most
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();

    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const io = new IntersectionObserver(measure, { threshold: thresholds });
    io.observe(el);

    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--galaxy");
    };
  }, [triggerId]);

  return (
    <div className="v2-galaxy" aria-hidden>
      <div className="v2-galaxy-deep" />
      <canvas ref={canvasRef} className="v2-galaxy-stars" />
      <div className="v2-nebula v2-nebula--1" />
      <div className="v2-nebula v2-nebula--2" />
    </div>
  );
}
