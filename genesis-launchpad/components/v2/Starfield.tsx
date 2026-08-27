"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; baseAlpha: number; speed: number; phase: number };
type Shooter = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; len: number };

/** Canvas starfield — twinkling stars plus occasional shooting stars, fixed
 *  behind every page's content. Mounted once in the root layout so it never
 *  restarts between route changes. */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let raf = 0;
    let nextShooterAt = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.max(70, Math.round((width * height) / 3200)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.4,
        baseAlpha: Math.random() * 0.5 + 0.35,
        speed: Math.random() * 1.4 + 0.4,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const spawnShooter = () => {
      const fromLeft = Math.random() < 0.5;
      const dir = fromLeft ? 1 : -1;
      const speed = Math.random() * 260 + 380; // px/s
      const angle = (Math.random() * 18 + 18) * (Math.PI / 180); // shallow diagonal
      shooters.push({
        x: fromLeft ? -20 : width + 20,
        y: Math.random() * height * 0.5,
        vx: dir * speed * Math.cos(angle),
        vy: speed * Math.sin(angle),
        life: 0,
        maxLife: Math.random() * 0.4 + 0.7,
        len: Math.random() * 60 + 70,
      });
    };

    const paint = (now: number, dt: number) => {
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, width, height);

      for (const s of stars) {
        const twinkle = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        ctx.globalAlpha = s.baseAlpha * twinkle;
        ctx.fillStyle = "#fafafa";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduced) return;

      if (now >= nextShooterAt) {
        spawnShooter();
        nextShooterAt = now + (Math.random() * 4500 + 3500);
      }
      shooters = shooters.filter((sh) => sh.life < sh.maxLife);
      for (const sh of shooters) {
        sh.life += dt;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        const fade = 1 - sh.life / sh.maxLife;
        const angle = Math.atan2(sh.vy, sh.vx);
        const tx = sh.x - Math.cos(angle) * sh.len;
        const ty = sh.y - Math.sin(angle) * sh.len;
        const grad = ctx.createLinearGradient(sh.x, sh.y, tx, ty);
        grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fade})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      }
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      paint(now, dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduced) {
      paint(performance.now(), 0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", display: "block" }}
    />
  );
}
