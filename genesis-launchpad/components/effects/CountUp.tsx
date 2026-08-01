"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  value: number;
  /** Decimal places to keep (e.g. 99.99 → 2). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Animates from 0 to `value` once, when scrolled into view. */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let settled = false;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      if (settled) return;
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else settled = true;
    };
    raf = requestAnimationFrame(tick);
    // wall-clock safety: snap to final value even if rAF is throttled/stalled
    const safety = setTimeout(() => {
      settled = true;
      setDisplay(value);
    }, 1900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
