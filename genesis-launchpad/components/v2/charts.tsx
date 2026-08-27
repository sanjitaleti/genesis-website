/**
 * Chart primitives shared by the marketing preview and the real portal.
 *
 * Everything is plain SVG with no runtime dependency: the same shapes the
 * website advertises are the ones the client actually logs into. Brand
 * colors are optional props (defaulted to the existing pink/purple look)
 * so callers can retone without forking the component — the marketing
 * preview uses this to run a warm red/orange/yellow palette without
 * touching what the real dashboard renders.
 */

/* ---------------------------------------------------------------- sparkline */

export function sparkPath(points: number[], w = 84, h = 26) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  return points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / span) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function Sparkline({ points, tone }: { points: number[]; tone: string }) {
  return (
    <svg viewBox="0 0 84 26" className="v2-spark" preserveAspectRatio="none" aria-hidden>
      <path d={sparkPath(points)} fill="none" stroke={tone} strokeWidth="1.6" />
    </svg>
  );
}

/* ------------------------------------------------------------- volume chart */

export function linePath(values: number[], w: number, h: number, max = 100) {
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / max) * (h - 16) - 8;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function VolumeChart({
  a,
  b,
  labels,
  id = "vol",
  height = 190,
  colorA = "#f72585",
  colorB = "#7b2cbf",
  dotColor = "#ffd6ff",
  gridColor = "rgba(10, 10, 10, 0.08)",
  labelColor = "rgba(10, 10, 10, 0.45)",
}: {
  a: number[];
  b: number[];
  labels: string[];
  id?: string;
  height?: number;
  colorA?: string;
  colorB?: string;
  dotColor?: string;
  gridColor?: string;
  labelColor?: string;
}) {
  const w = 560;
  const h = height;
  const pA = linePath(a, w, h);
  const pB = linePath(b, w, h);
  return (
    <svg
      viewBox={`0 0 ${w} ${h + 22}`}
      className="v2-chart"
      role="img"
      aria-label="Calls answered versus jobs booked over time"
    >
      <defs>
        <linearGradient id={`${id}Fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorA} stopOpacity="0.32" />
          <stop offset="100%" stopColor={colorA} stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}Glow`} x="-20%" y="-40%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          x2={w}
          y1={8 + (i * (h - 16)) / 3}
          y2={8 + (i * (h - 16)) / 3}
          stroke={gridColor}
        />
      ))}

      <path d={`${pA} L ${w} ${h} L 0 ${h} Z`} fill={`url(#${id}Fill)`} />
      <path d={pB} fill="none" stroke={colorB} strokeWidth="2" opacity="0.85" />
      <path d={pA} fill="none" stroke={colorA} strokeWidth="2.4" filter={`url(#${id}Glow)`} />
      <circle cx={w} cy={h - (a[a.length - 1] / 100) * (h - 16) - 8} r="4" fill={dotColor} />

      {labels.map((m, i) => (
        <text
          key={m}
          x={(i / (labels.length - 1)) * w}
          y={h + 16}
          fill={labelColor}
          fontSize="10"
          textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------- radar chart */

export function radarPoints(vals: number[], r: number, cx: number, cy: number) {
  return vals
    .map((v, i) => {
      const a = (Math.PI * 2 * i) / vals.length - Math.PI / 2;
      const rr = (r * v) / 100;
      return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`;
    })
    .join(" ");
}

export function RadarChart({
  axes,
  now,
  prev,
  size = 210,
  nowColor = "#f72585",
  prevColor = "#7b2cbf",
  gridColor = "rgba(10, 10, 10, 0.09)",
  labelColor = "rgba(10, 10, 10, 0.55)",
}: {
  axes: string[];
  now: number[];
  prev: number[];
  size?: number;
  nowColor?: string;
  prevColor?: string;
  gridColor?: string;
  labelColor?: string;
}) {
  const s = size;
  const c = s / 2;
  const r = c - 34;
  return (
    <svg
      viewBox={`0 0 ${s} ${s}`}
      className="v2-chart v2-chart--square"
      role="img"
      aria-label="Performance across six measures, this month versus last"
    >
      {[0.33, 0.66, 1].map((k) => (
        <polygon
          key={k}
          points={radarPoints(axes.map(() => 100 * k), r, c, c)}
          fill="none"
          stroke={gridColor}
        />
      ))}
      {axes.map((label, i) => {
        const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        return (
          <line
            key={label}
            x1={c}
            y1={c}
            x2={c + Math.cos(a) * r}
            y2={c + Math.sin(a) * r}
            stroke={gridColor}
          />
        );
      })}
      <polygon points={radarPoints(prev, r, c, c)} fill={`${prevColor}38`} stroke={prevColor} strokeWidth="1.4" />
      <polygon points={radarPoints(now, r, c, c)} fill={`${nowColor}38`} stroke={nowColor} strokeWidth="1.8" />
      {axes.map((label, i) => {
        const a = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
        return (
          <text
            key={label}
            x={c + Math.cos(a) * (r + 18)}
            y={c + Math.sin(a) * (r + 18)}
            fill={labelColor}
            fontSize="8.5"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* --------------------------------------------------------------- donut ring */

export function DonutChart({
  slices,
  size = 168,
  trackColor = "rgba(10, 10, 10, 0.08)",
  centerColor = "#0a0a0a",
  labelColor = "rgba(10, 10, 10, 0.45)",
}: {
  slices: { label: string; value: number; tone: string }[];
  size?: number;
  trackColor?: string;
  centerColor?: string;
  labelColor?: string;
}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const c = size / 2;
  const r = c - 14;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="v2-chart v2-chart--square"
      role="img"
      aria-label="How calls resolved"
    >
      <circle cx={c} cy={c} r={r} fill="none" stroke={trackColor} strokeWidth="14" />
      {slices.map((s) => {
        const len = (s.value / total) * circumference;
        const dash = `${len} ${circumference - len}`;
        const el = (
          <circle
            key={s.label}
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={s.tone}
            strokeWidth="14"
            strokeDasharray={dash}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${c} ${c})`}
          />
        );
        offset += len;
        return el;
      })}
      <text x={c} y={c - 4} textAnchor="middle" fill={centerColor} fontSize="26" fontWeight="600">
        {total.toLocaleString()}
      </text>
      <text x={c} y={c + 14} textAnchor="middle" fill={labelColor} fontSize="10">
        total calls
      </text>
    </svg>
  );
}

/* ----------------------------------------------------------- hourly columns */

export function ColumnChart({
  values,
  labels,
  height = 150,
  colorStart = "#f72585",
  colorEnd = "#7b2cbf",
  labelColor = "rgba(10, 10, 10, 0.45)",
}: {
  values: number[];
  labels: string[];
  height?: number;
  colorStart?: string;
  colorEnd?: string;
  labelColor?: string;
}) {
  const w = 560;
  const h = height;
  const max = Math.max(...values) || 1;
  const gap = 6;
  const bw = (w - gap * (values.length - 1)) / values.length;

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="v2-chart" role="img" aria-label="Calls by hour of day">
      <defs>
        <linearGradient id="colFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorStart} stopOpacity="0.95" />
          <stop offset="100%" stopColor={colorEnd} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {values.map((v, i) => {
        const bh = (v / max) * (h - 10);
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={h - bh}
            width={bw}
            height={bh}
            rx="3"
            fill="url(#colFill)"
          />
        );
      })}
      {labels.map((l, i) =>
        l ? (
          <text
            key={i}
            x={i * (bw + gap) + bw / 2}
            y={h + 14}
            fill={labelColor}
            fontSize="9.5"
            textAnchor="middle"
          >
            {l}
          </text>
        ) : null,
      )}
    </svg>
  );
}
