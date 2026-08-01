"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { springHigh } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Magnetic } from "./effects/Magnetic";

type Variant = "primary" | "cyan" | "ghost";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  /** Disable the magnetic pull (e.g. full-width buttons). */
  magnetic?: boolean;
}

const MotionLink = motion.create(Link);

const base =
  "group inline-flex items-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const variants: Record<Variant, string> = {
  // Accent is the glow, not a filled neon block.
  primary:
    "px-6 py-3 border border-white/[0.12] bg-white/[0.06] text-text hover:bg-white/[0.09] hover:border-cyan/40 hover:shadow-glow-cyan",
  // The single most important action on a page.
  cyan: "px-6 py-3 bg-cyan text-ink font-semibold hover:shadow-glow-cyan",
  // Quiet text + arrow.
  ghost: "px-1 py-1 text-text-muted hover:text-text",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  magnetic = true,
}: ButtonProps) {
  const link = (
    <MotionLink
      href={href}
      data-cursor
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={springHigh}
      className={cn(base, variants[variant], className)}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </MotionLink>
  );

  if (!magnetic || variant === "ghost") return link;
  return (
    <Magnetic strength={0.4} className="inline-flex">
      {link}
    </Magnetic>
  );
}
