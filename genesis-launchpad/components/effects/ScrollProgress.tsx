"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin cyan scroll-progress meter pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, originX: 0 }}
      className="fixed inset-x-0 top-0 z-[80] h-px bg-cyan shadow-glow-cyan"
    />
  );
}
