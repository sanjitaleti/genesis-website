"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { IconCheck } from "./icons";
import { tiers } from "@/lib/v2/pricing-tiers";

/**
 * The pricing sequence.
 *
 * The section is a tall scroll runway with a pinned stage inside it. Scrolling
 * moves through four beats:
 *
 *   1. pitch black, nothing but stars
 *   2. Lunar flies into the spotlight, the sky blooms cold blue
 *   3. Lunar slides left, Orbit takes the centre, the sky burns orange
 *   4. Nova arrives on the right, the sky turns violet and all three settle
 *
 * All of the motion is written straight onto three cards and three sky layers
 * from one rAF-throttled scroll read, so the whole sequence costs a single
 * layout measurement per frame.
 */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function PricingStage() {
  const runwayRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway) return;

    const mqNarrow = window.matchMedia("(max-width: 900px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let raf = 0;

    // With no room to fly (or motion turned down) everything simply sits in
    // its final place — the section still reads, it just doesn't perform.
    const settle = () => {
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.transform = "";
        el.style.opacity = "1";
      });
      skyRefs.current.forEach((el) => el && (el.style.opacity = "0.55"));
      if (introRef.current) introRef.current.style.opacity = "0";
    };

    const measure = () => {
      raf = 0;
      const r = runway.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel > 0 ? clamp01(-r.top / travel) : 0;

      // how far a side card sits from the centre
      const off = Math.min(window.innerWidth * 0.3, 380);

      // ---- beat 1: the empty sky, then the intro line clears out
      if (introRef.current) {
        introRef.current.style.opacity = String(1 - easeOut(seg(p, 0.06, 0.16)));
      }

      // ---- Lunar: flies to centre, later slides left
      const l1 = easeOut(seg(p, 0.1, 0.3));
      const l2 = easeOut(seg(p, 0.4, 0.6));
      const lx = lerp(0, -off, l2);
      const ly = lerp(90, 0, l1);
      const ls = lerp(0.78, 1, l1) * lerp(1, 0.93, l2);
      setCard(0, lx, ly, ls, l1);

      // ---- Orbit: arrives as Lunar leaves, holds the centre
      const o1 = easeOut(seg(p, 0.4, 0.62));
      setCard(1, lerp(off * 0.55, 0, o1), lerp(90, 0, o1), lerp(0.78, 1, o1), o1);

      // ---- Nova: settles into the right slot
      const n1 = easeOut(seg(p, 0.68, 0.9));
      setCard(2, lerp(off * 1.6, off, n1), lerp(90, 0, n1), lerp(0.78, 0.93, n1), n1);

      // ---- sky: blue, then fire, then violet, each staying lit underneath
      setSky(0, seg(p, 0.1, 0.32) * 0.95);
      setSky(1, seg(p, 0.4, 0.62) * 0.95);
      setSky(2, seg(p, 0.68, 0.9) * 0.95);
    };

    const setCard = (i: number, x: number, y: number, s: number, o: number) => {
      const el = cardRefs.current[i];
      if (!el) return;
      el.style.transform =
        `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0) ` +
        `scale(${s.toFixed(3)})`;
      el.style.opacity = o.toFixed(3);
    };

    const setSky = (i: number, o: number) => {
      const el = skyRefs.current[i];
      if (el) el.style.opacity = o.toFixed(3);
    };

    // A frame loop, but only while the stage is actually on screen. An
    // IntersectionObserver starts and stops it, so the sequence tracks the
    // scroll exactly without depending on scroll events firing, and costs
    // nothing at all once you've scrolled past.
    let live = false;

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
          measure(); // settle on the final frame
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
    <section id="pricing" className="v2-stage-runway" ref={runwayRef}>
      <div className="v2-stage">
        {/* the sky, lit one layer at a time */}
        <div className="v2-stage-sky" aria-hidden>
          <div className="v2-sky v2-sky--blue" ref={(el) => { skyRefs.current[0] = el; }} />
          <div className="v2-sky v2-sky--fire" ref={(el) => { skyRefs.current[1] = el; }} />
          <div className="v2-sky v2-sky--violet" ref={(el) => { skyRefs.current[2] = el; }} />
        </div>

        {/* beat one: nothing but the invitation */}
        <div className="v2-stage-intro" ref={introRef}>
          <h2 className="v2-display v2-stage-title">Straightforward pricing.</h2>
          <p className="v2-stage-sub">
            Fixed scope, fixed price, no long contracts. Keep scrolling.
          </p>
        </div>

        <div className="v2-stage-cards">
          {tiers.map((t, i) => (
            <div
              key={t.key}
              className="v2-stage-card"
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                ["--glow" as string]: t.glow,
                ["--glow2" as string]: t.glow2,
                ["--edge" as string]: t.edge,
              }}
            >
              <span className="v2-stage-aura" aria-hidden />

              <article className={`v2-tier${t.featured ? " is-featured" : ""}`}>
                <div className="v2-tier-crown" aria-hidden />
                {t.featured ? (
                  <span className="v2-tier-badge">Most clients start here</span>
                ) : null}

                <div className="v2-tier-body">
                  <h3 className="v2-tier-name">{t.name}</h3>
                  <p className="v2-tier-desc">{t.desc}</p>

                  <div className="v2-tier-price">
                    {t.price} <small>{t.unit}</small>
                  </div>
                  {t.retainer ? (
                    <div className="v2-tier-retainer">{t.retainer}</div>
                  ) : null}
                  {t.discount ? (
                    <div className="v2-tier-discount">{t.discount}</div>
                  ) : null}

                  <ul className="v2-tier-list">
                    {t.perks.map((p) => (
                      <li key={p}>
                        <IconCheck />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className="v2-tier-cta">
                    {t.featured ? (
                      <Link href={`/v2/get-started/${t.key}`} className="v2-btn v2-btn--block">
                        {t.cta}
                      </Link>
                    ) : (
                      <Link href={`/v2/get-started/${t.key}`} className="v2-btn-ghost" style={{ width: "100%" }}>
                        {t.cta}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
