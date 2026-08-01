"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";

type Variant = "metrics" | "graph" | "deploy" | "regions" | "pipeline";

interface Tile {
  label: string;
  meta: string;
  variant: Variant;
  /** Drop a real image at /public/showcase/<file> and set src to use it. */
  src?: string;
}

/**
 * To swap in real imagery (e.g. Higgsfield renders): save files into
 * `public/showcase/` and set `src: "/showcase/your-file.jpg"` on a tile.
 * When `src` is present the placeholder screen is replaced automatically.
 */
const tiles: Tile[] = [
  { label: "Realtime metrics", meta: "Observability", variant: "metrics" },
  { label: "Latency traces", meta: "Performance", variant: "graph" },
  { label: "Deploy pipeline", meta: "Shipping", variant: "deploy" },
  { label: "Global regions", meta: "Scale", variant: "regions" },
  { label: "Cost intelligence", meta: "FinOps", variant: "pipeline" },
];

export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);

  // Pan the row horizontally as the section travels through the viewport.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-42%"]);

  // Scroll-velocity skew for the liquid, in-motion feel.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const skew = useSpring(
    useTransform(scrollVelocity, [-2500, 0, 2500], [-5, 0, 5]),
    { stiffness: 200, damping: 30 },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-32"
    >
      <div className="container-luxe">
        <SectionHeading
          eyebrow="In production"
          title="A control plane you'll actually want to look at."
          description="Every surface is engineered for calm — dense where it matters, quiet everywhere else."
        />
      </div>

      <motion.div
        style={{ x, skewX: skew }}
        className="mt-16 flex w-max gap-6 pl-6 will-change-transform md:mt-20 md:gap-8 md:pl-8"
      >
        {tiles.map((tile) => (
          <figure
            key={tile.label}
            className="group glass relative w-[72vw] shrink-0 overflow-hidden p-2 sm:w-[360px]"
            data-cursor
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.06] bg-ink-800">
              {tile.src ? (
                <Image
                  src={tile.src}
                  alt={tile.label}
                  fill
                  sizes="(max-width: 640px) 72vw, 360px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <ScreenMock variant={tile.variant} />
              )}
              {/* readability + accent bloom */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            </div>
            <figcaption className="flex items-center justify-between px-3 py-3">
              <span className="text-sm font-medium tracking-tight">{tile.label}</span>
              <span className="text-xs uppercase tracking-[0.14em] text-text-faint">
                {tile.meta}
              </span>
            </figcaption>
          </figure>
        ))}
      </motion.div>

      <div className="container-luxe mt-8">
        <span className="text-xs uppercase tracking-[0.16em] text-text-faint">
          Scroll to pan →
        </span>
      </div>
    </section>
  );
}

/* ---------- In-theme placeholder "product screens" (murdered-out UI) ---------- */

function ScreenMock({ variant }: { variant: Variant }) {
  const cyan = "#00E5FF";
  const pink = "#FF4D8D";
  const line = "rgba(255,255,255,0.08)";
  const faint = "rgba(250,250,250,0.4)";

  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="400" fill="#0A0A0A" />
      {/* window chrome */}
      <g>
        <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.14)" />
        <circle cx="32" cy="20" r="3" fill="rgba(255,255,255,0.14)" />
        <circle cx="44" cy="20" r="3" fill="rgba(255,255,255,0.14)" />
      </g>
      <line x1="0" y1="40" x2="320" y2="40" stroke={line} />

      {variant === "metrics" && (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${20 + i * 96}, 60)`}>
              <rect width="84" height="70" rx="8" fill="rgba(255,255,255,0.03)" stroke={line} />
              <rect x="12" y="14" width="34" height="6" rx="3" fill={faint} />
              <rect x="12" y="30" width="52" height="14" rx="4" fill="#fafafa" />
              <rect x="12" y="52" width="24" height="6" rx="3" fill={cyan} opacity="0.8" />
            </g>
          ))}
          {/* bar chart */}
          <g transform="translate(20, 150)">
            <rect width="280" height="210" rx="10" fill="rgba(255,255,255,0.02)" stroke={line} />
            {[40, 90, 60, 130, 80, 160, 110].map((h, i) => (
              <rect key={i} x={20 + i * 38} y={190 - h} width="20" height={h} rx="4"
                fill={i === 5 ? cyan : "rgba(0,229,255,0.35)"} />
            ))}
          </g>
        </g>
      )}

      {variant === "graph" && (
        <g transform="translate(20, 60)">
          <rect width="280" height="300" rx="10" fill="rgba(255,255,255,0.02)" stroke={line} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="16" y1={60 + i * 60} x2="264" y2={60 + i * 60} stroke={line} />
          ))}
          <path d="M16 220 C 70 180, 90 120, 140 140 S 220 60, 264 80" fill="none" stroke={cyan} strokeWidth="2.5" />
          <path d="M16 220 C 70 180, 90 120, 140 140 S 220 60, 264 80 L264 260 L16 260 Z" fill="url(#g)" opacity="0.25" />
          <circle cx="264" cy="80" r="4" fill={cyan} />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={cyan} />
              <stop offset="1" stopColor={cyan} stopOpacity="0" />
            </linearGradient>
          </defs>
        </g>
      )}

      {variant === "deploy" && (
        <g transform="translate(20, 58)">
          {["build", "test", "canary", "promote", "live", "scale"].map((s, i) => (
            <g key={s} transform={`translate(0, ${i * 50})`}>
              <rect width="280" height="40" rx="8" fill="rgba(255,255,255,0.03)" stroke={line} />
              <circle cx="20" cy="20" r="4" fill={i === 2 ? pink : cyan} />
              <rect x="36" y="12" width="90" height="7" rx="3.5" fill="#fafafa" opacity="0.85" />
              <rect x="36" y="24" width="60" height="6" rx="3" fill={faint} />
              <rect x="230" y="15" width="34" height="10" rx="5" fill={i === 2 ? "rgba(255,77,141,0.15)" : "rgba(0,229,255,0.15)"} />
            </g>
          ))}
        </g>
      )}

      {variant === "regions" && (
        <g transform="translate(20, 60)">
          <rect width="280" height="300" rx="10" fill="rgba(255,255,255,0.02)" stroke={line} />
          {[
            [70, 90], [110, 70], [95, 140], [180, 110], [210, 80],
            [150, 190], [230, 200], [90, 230], [200, 250], [140, 110],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="10" fill={i % 5 === 0 ? "rgba(255,77,141,0.15)" : "rgba(0,229,255,0.12)"} />
              <circle cx={cx} cy={cy} r="3" fill={i % 5 === 0 ? pink : cyan} />
            </g>
          ))}
          <path d="M110 70 L180 110 L150 190 L90 230" fill="none" stroke="rgba(0,229,255,0.3)" strokeWidth="1" strokeDasharray="3 4" />
        </g>
      )}

      {variant === "pipeline" && (
        <g transform="translate(20, 60)">
          {[0, 1, 2].map((col) => (
            <g key={col} transform={`translate(${col * 96}, 0)`}>
              <rect x="0" y="0" width="84" height="18" rx="4" fill="rgba(255,255,255,0.03)" />
              <rect x="8" y="6" width="40" height="6" rx="3" fill={faint} />
              {[0, 1, 2].map((row) => (
                <g key={row} transform={`translate(0, ${30 + row * 60})`}>
                  <rect width="84" height="50" rx="8" fill="rgba(255,255,255,0.03)" stroke={line} />
                  <rect x="10" y="12" width="50" height="6" rx="3" fill="#fafafa" opacity="0.8" />
                  <rect x="10" y="24" width="34" height="5" rx="2.5" fill={faint} />
                  <rect x="10" y="36" width="20" height="5" rx="2.5" fill={col === 2 ? cyan : "rgba(0,229,255,0.4)"} />
                </g>
              ))}
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
