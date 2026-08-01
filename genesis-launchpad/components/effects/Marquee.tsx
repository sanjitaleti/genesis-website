"use client";

import { cn } from "@/lib/cn";

interface MarqueeProps {
  items: string[];
  className?: string;
  /** Seconds per full loop. */
  speed?: number;
}

/** Seamless infinite marquee — duplicates the row and translates -50%. */
export function Marquee({ items, className, speed = 28 }: MarqueeProps) {
  const row = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className="flex shrink-0 items-center gap-16 pr-16 [animation:marquee_var(--dur)_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ ["--dur" as string]: `${speed}s` }}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-xl font-medium tracking-tight text-text-muted/70 transition-colors hover:text-text"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
