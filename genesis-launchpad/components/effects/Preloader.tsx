"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, animate, useTransform } from "framer-motion";

/**
 * Cinematic entrance: a 0→100 counter under the brand mark, then a curtain of
 * panels lifts away to reveal the site. Shows once per browser session and
 * locks scroll while active. Reduced-motion users skip straight through.
 */
export function Preloader() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [killed, setKilled] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("gl_intro");
    if (reduce || seen) return;

    setActive(true);
    document.documentElement.style.overflow = "hidden";

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem("gl_intro", "1");
      setActive(false);
      document.documentElement.style.overflow = "";
    };

    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(count, 100, {
      duration: 1.3,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => setTimeout(finish, 300),
    });

    // wall-clock safety: complete on time even if rAF is throttled…
    const safety = setTimeout(finish, 2200);
    // …and a hard escape hatch: if rAF is fully stalled the exit animation
    // can't play, so force-unmount rather than ever trapping the user.
    const escape = setTimeout(() => {
      finish();
      setKilled(true);
    }, 3200);

    return () => {
      controls.stop();
      unsub();
      clearTimeout(safety);
      clearTimeout(escape);
      document.documentElement.style.overflow = "";
    };
  }, [count, rounded]);

  if (!mounted || killed) return null;

  const panels = 5;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          {/* curtain panels that lift on exit */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: panels }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-ink"
                initial={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 0.9,
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.06,
                }}
              />
            ))}
          </div>

          {/* brand + counter */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-baseline gap-2.5"
            >
              <span className="chrome-logo" style={{ fontSize: "2.25rem" }}>
                GENESIS
              </span>
              <span className="text-xl font-semibold tracking-tight text-text-faint">LP</span>
            </motion.div>

            <div className="mt-8 font-mono text-xs tabular-nums tracking-[0.22em] text-text-faint">
              {String(display).padStart(3, "0")}
            </div>

            <div className="mt-4 h-px w-48 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-cyan"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
