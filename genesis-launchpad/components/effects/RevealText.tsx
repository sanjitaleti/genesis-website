"use client";

import { motion } from "framer-motion";
import { springSmooth, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface RevealTextProps {
  /** Each string is one masked line. */
  lines: { text: string; className?: string }[];
  className?: string;
  /** Play immediately on mount instead of on scroll. */
  immediate?: boolean;
  delay?: number;
}

/**
 * Per-line mask reveal: each line sits in an overflow-hidden track and slides
 * up from 110% with a staggered spring. The signature hero text move.
 */
export function RevealText({ lines, className, immediate = false, delay = 0 }: RevealTextProps) {
  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: delay } },
  };
  const child = {
    hidden: { y: "115%" },
    show: { y: "0%", transition: springSmooth },
  };

  return (
    <motion.span
      variants={parent}
      initial="hidden"
      animate={immediate ? "show" : undefined}
      whileInView={immediate ? undefined : "show"}
      viewport={immediate ? undefined : viewportOnce}
      className={cn("block", className)}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={child} className={cn("block", line.className)}>
            {line.text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
