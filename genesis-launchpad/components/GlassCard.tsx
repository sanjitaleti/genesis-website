"use client";

import { motion } from "framer-motion";
import { springSmooth, staggerChild } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** When true, the card participates in a parent stagger sequence. */
  stagger?: boolean;
  interactive?: boolean;
}

export function GlassCard({
  children,
  className,
  stagger = false,
  interactive = true,
}: GlassCardProps) {
  return (
    <motion.div
      variants={stagger ? staggerChild : undefined}
      whileHover={
        interactive ? { y: -4, transition: springSmooth } : undefined
      }
      className={cn(
        "glass group p-8 transition-colors duration-300",
        interactive && "hover:border-white/[0.16] hover:bg-white/[0.05]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
