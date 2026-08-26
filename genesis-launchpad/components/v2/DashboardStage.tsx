"use client";

import { useEffect, useRef } from "react";
import { PortalPreview } from "./PortalPreview";

/**
 * Scroll-pinned dashboard reveal, same rAF+IntersectionObserver technique
 * as PricingStage: a tall runway holds a sticky 100vh stage, and one
 * scroll-progress read drives everything directly via ref.style — no
 * React re-renders, costs nothing once scrolled past.
 *
 * The beat: the dashboard starts as a small tilted card, grows to fill
 * the screen flat-on as you scroll in, holds there, then tilts the other
 * way and shrinks back down as you scroll out — releasing you back into
 * the normal page flow.
 */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function DashboardStage() {
  const runwayRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    const card = cardRef.current;
    if (!runway || !card) return;

    const mqNarrow = window.matchMedia("(max-width: 900px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;
    let live = false;

    const settle = () => {
      card.style.transform = "";
      card.style.borderRadius = "";
    };

    const measure = () => {
      raf = 0;
      const r = runway.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? clamp01(-r.top / travel) : 0;

      // grow flat + fullscreen, hold, tilt the other way and shrink back
      const grow = easeOut(seg(p, 0, 0.32));
      const shrink = easeInOut(seg(p, 0.62, 1));

      const scale = lerp(lerp(0.62, 1.08, grow), 0.8, shrink);
      const rotateX = lerp(lerp(9, 0, grow), -7, shrink);
      const rotateZ = lerp(lerp(-1, 0, grow), 1.2, shrink);
      const radius = lerp(lerp(20, 0, grow), 20, shrink);

      card.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      card.style.borderRadius = `${radius.toFixed(1)}px`;
    };

    const tick = () => {
      if (!live) {
        raf = 0;
        return;
      }
      measure();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (live) return;
      live = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      live = false;
    };

    const io = new IntersectionObserver(
      (entries) => {
        const onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen) start();
        else {
          stop();
          measure();
        }
      },
      { rootMargin: "120px 0px" },
    );

    const apply = () => {
      if (mqNarrow.matches || mqReduce.matches) {
        stop();
        io.disconnect();
        settle();
      } else {
        io.observe(runway);
        measure();
        start();
      }
    };

    apply();
    mqNarrow.addEventListener("change", apply);
    mqReduce.addEventListener("change", apply);
    window.addEventListener("resize", measure);

    return () => {
      stop();
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      mqNarrow.removeEventListener("change", apply);
      mqReduce.removeEventListener("change", apply);
    };
  }, []);

  return (
    <section className="v2-dash-runway" ref={runwayRef}>
      <div className="v2-dash-stage">
        <div className="v2-dash-card" ref={cardRef}>
          <PortalPreview />
        </div>
      </div>
    </section>
  );
}
