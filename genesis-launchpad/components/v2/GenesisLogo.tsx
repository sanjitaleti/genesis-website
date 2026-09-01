/**
 * The Genesis LP monogram — "the open line".
 *
 * A geometric G drawn as one continuous stroke that deliberately never
 * closes: circle r=16 on a 48-unit grid, a 52° aperture at the upper
 * right, and a bar stopping four units short of centre. The gap is the
 * idea — the line is always open. Do not close it, rotate it, or crowd
 * it (clear space = one aperture width). See DIRECTION.md.
 *
 * Defaults to `currentColor` so it inherits from context and stays crisp
 * at small sizes. The gradient variant needs a unique `gradientId` when
 * more than one appears on a page.
 */

const PATH = "M 33.85 11.4 A 16 16 0 1 0 40 24 L 28 24";

/** Below ~24px the hairline closes up optically, so the stroke thickens. */
function strokeFor(size: number) {
  if (size <= 18) return 6.5;
  if (size <= 26) return 6;
  return 5.5;
}

export function GenesisLogo({
  size = 24,
  variant = "mono",
  gradientId = "genesis-mark",
  className,
  style,
}: {
  size?: number;
  variant?: "mono" | "gradient";
  gradientId?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const stroke = variant === "gradient" ? `url(#${gradientId})` : "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      style={{ display: "block", flexShrink: 0, ...style }}
      role="img"
      aria-label="Genesis LP"
    >
      {variant === "gradient" ? (
        <defs>
          <linearGradient id={gradientId} x1="8%" y1="0%" x2="92%" y2="100%">
            <stop offset="0%" stopColor="var(--violet, #5a189a)" />
            <stop offset="55%" stopColor="var(--magenta, #f72585)" />
            <stop offset="100%" stopColor="#ff7ab8" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        d={PATH}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeFor(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Mark + wordmark, horizontal. The standard signature. */
export function GenesisLockup({
  size = 22,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.5),
        color: "var(--text)",
        ...style,
      }}
    >
      <GenesisLogo size={size} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: Math.round(size * 0.95),
          letterSpacing: "-0.025em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Genesis LP
      </span>
    </span>
  );
}
