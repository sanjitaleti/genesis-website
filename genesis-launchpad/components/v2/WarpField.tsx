"use client";

import { useEffect, useRef } from "react";

/**
 * A starfield that drifts while you read, then accelerates into streaks when
 * the portal opens.
 *
 * Stars are points in a 3D volume projected to the screen; pulling z toward
 * the viewer moves them outward from the centre, and drawing each one as a
 * segment between its previous and current position turns speed into streak
 * length on its own. `launched` ramps the travel speed, so the same loop
 * covers both the calm state and the jump.
 */
export function WarpField({ launched }: { launched: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const launchedRef = useRef(launched);
  launchedRef.current = launched;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const DEPTH = 1000;
    const IDLE = 0.55;
    const WARP = 42;

    type Star = { x: number; y: number; z: number; pz: number };
    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let speed = IDLE;

    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (z?: number) => ({
      // a generous spread so streaks still cross the corners
      x: (Math.random() - 0.5) * w * 2.4,
      y: (Math.random() - 0.5) * h * 2.4,
      z: z ?? Math.random() * DEPTH,
      pz: 0,
    });

    const seed = () => {
      const count = Math.min(460, Math.round((w * h) / 3400));
      stars = Array.from({ length: count }, () => spawn());
      for (const s of stars) s.pz = s.z;
    };

    const draw = () => {
      const cx = w / 2;
      const cy = h / 2;

      // a soft trail rather than a hard clear: streaks smear as speed climbs
      ctx.fillStyle = launchedRef.current ? "rgba(4,3,10,0.32)" : "rgba(4,3,10,1)";
      ctx.fillRect(0, 0, w, h);

      const target = launchedRef.current ? WARP : IDLE;
      speed += (target - speed) * (launchedRef.current ? 0.045 : 0.08);

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z < 1) {
          Object.assign(s, spawn(DEPTH));
          s.pz = s.z;
          continue;
        }

        const k = 320;
        const x = cx + (s.x / s.z) * k;
        const y = cy + (s.y / s.z) * k;
        const px = cx + (s.x / s.pz) * k;
        const py = cy + (s.y / s.pz) * k;

        if (x < -60 || x > w + 60 || y < -60 || y > h + 60) continue;

        // near stars read brighter and thicker
        const depth = 1 - s.z / DEPTH;
        const alpha = Math.min(1, 0.18 + depth * 0.9);
        const width = Math.max(0.5, depth * 2.1);

        ctx.strokeStyle =
          depth > 0.82 ? `rgba(255,214,255,${alpha})` : `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    size();
    seed();

    if (reduce) {
      // one still frame: the field is scenery, not information
      ctx.fillStyle = "rgba(4,3,10,1)";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        const depth = 1 - s.z / DEPTH;
        ctx.fillStyle = `rgba(255,255,255,${0.15 + depth * 0.55})`;
        ctx.fillRect(w / 2 + (s.x / s.z) * 320, h / 2 + (s.y / s.z) * 320, 1.5, 1.5);
      }
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      size();
      seed();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="v2-warp" aria-hidden />;
}
