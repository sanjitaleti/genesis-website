"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { staggerChild } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  /** Max rotation in degrees. */
  max?: number;
}

/**
 * Glass card with pointer-driven 3D tilt and a cyan light that tracks the
 * cursor across the surface. Springs back to flat on leave.
 */
export function TiltCard({ children, className, stagger = false, max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 20,
  });

  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      variants={stagger ? staggerChild : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn(
        "glass group relative p-8 [transform-style:preserve-3d]",
        className,
      )}
    >
      {/* cursor-tracking light */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) =>
              `radial-gradient(220px circle at ${gx} ${gy}, rgba(0,229,255,0.12), transparent 70%)`,
          ),
        }}
      />
      <div className="relative [transform:translateZ(20px)]">{children}</div>
    </motion.div>
  );
}
