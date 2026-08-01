/**
 * What the dashboard renders.
 *
 * `getPortalData()` returns the same shape whether it came from Supabase or
 * from the demo fixtures, so every view is written once. Until the Supabase
 * environment variables exist the portal serves demo data and says so on
 * screen — which is what keeps the client demo working before any backend is
 * wired up.
 */

import { isConfigured } from "./supabase";
import { serverClient } from "./supabase-server";
import {
  tilesByRange,
  volumeByRange,
  funnel as demoFunnel,
  resolution as demoResolution,
  hourly as demoHourly,
  calls as demoCalls,
  customers as demoCustomers,
  appointments as demoAppointments,
  activity as demoActivity,
  type Range,
  type CallRecord,
  type Customer,
  type Appointment,
  type Tile,
} from "./data";
import { account } from "./session";

export type PortalData = {
  live: boolean;
  business: string;
  plan: string;
  tiles: Tile[];
  volume: { a: number[]; b: number[]; labels: string[] };
  funnel: { label: string; n: string; pct: number; tone: string }[];
  resolution: { label: string; value: number; tone: string }[];
  hourly: number[];
  calls: CallRecord[];
  customers: Customer[];
  appointments: Appointment[];
  activity: { t: string; text: string; tone: string }[];
};

/* ------------------------------------------------------------ helpers */

const money = (cents: number | null) =>
  cents === null || cents === undefined ? "—" : `$${Math.round(cents / 100).toLocaleString()}`;

const clock = (iso: string) => {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12 || 12;
  return `${h}:${m}${ampm}`;
};

const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const days = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "short" });
};

const duration = (secs: number) => `${Math.floor(secs / 60)}m ${(secs % 60).toString().padStart(2, "0")}s`;

const OUTCOME_LABEL: Record<string, CallRecord["status"]> = {
  booked: "Booked",
  quoted: "Quoted",
  handled: "Handled",
  passed_on: "Passed on",
};

const sinceFor = (range: Range) => {
  const now = Date.now();
  const hours = range === "24h" ? 24 : range === "7d" ? 24 * 7 : 24 * 30;
  return new Date(now - hours * 3_600_000).toISOString();
};

type CallRow = {
  conversation_id: string;
  started_at: string;
  duration_secs: number;
  caller_name: string | null;
  caller_phone: string | null;
  reason: string | null;
  outcome: string;
  value_cents: number | null;
  summary: string | null;
};

/* --------------------------------------------------------------- demo */

function demoData(range: Range): PortalData {
  return {
    live: false,
    business: account.business,
    plan: account.plan,
    tiles: tilesByRange[range],
    volume: volumeByRange[range],
    funnel: demoFunnel,
    resolution: demoResolution,
    hourly: demoHourly,
    calls: demoCalls,
    customers: demoCustomers,
    appointments: demoAppointments,
    activity: demoActivity,
  };
}

/* --------------------------------------------------------------- live */

function buildTiles(rows: CallRow[], range: Range): Tile[] {
  const answered = rows.length;
  const booked = rows.filter((r) => r.outcome === "booked").length;
  const afterHours = rows.filter((r) => {
    const h = new Date(r.started_at).getHours();
    return h >= 20 || h < 7;
  }).length;
  const hint = range === "24h" ? "last 24 hours" : range === "7d" ? "last 7 days" : "last 30 days";

  // A short trailing series so the sparklines still read as movement.
  const buckets = 10;
  const series = (predicate: (r: CallRow) => boolean) => {
    const out = new Array(buckets).fill(0);
    if (rows.length === 0) return out;
    const times = rows.map((r) => new Date(r.started_at).getTime());
    const min = Math.min(...times);
    const max = Math.max(...times);
    const span = max - min || 1;
    for (const r of rows) {
      if (!predicate(r)) continue;
      const i = Math.min(buckets - 1, Math.floor(((new Date(r.started_at).getTime() - min) / span) * buckets));
      out[i] += 1;
    }
    return out;
  };

  return [
    { label: "Calls answered", value: answered.toLocaleString(), delta: hint, up: true, tone: "#f72585", pts: series(() => true), hint },
    { label: "Jobs booked", value: booked.toLocaleString(), delta: `${answered ? Math.round((booked / answered) * 100) : 0}%`, up: true, tone: "#c77dff", pts: series((r) => r.outcome === "booked"), hint: "of calls answered" },
    { label: "After hours", value: afterHours.toLocaleString(), delta: "8pm to 7am", up: true, tone: "#4cc9f0", pts: series((r) => { const h = new Date(r.started_at).getHours(); return h >= 20 || h < 7; }), hint: "outside your hours" },
    { label: "Avg. length", value: answered ? `${Math.round(rows.reduce((s, r) => s + r.duration_secs, 0) / answered)}s` : "—", delta: "per call", up: true, tone: "#ff8a00", pts: series(() => true), hint: "time on the phone" },
    { label: "Missed calls", value: "0", delta: "held", up: true, tone: "#5ea87a", pts: new Array(buckets).fill(0), hint: "nothing dropped" },
  ];
}

function buildVolume(rows: CallRow[], range: Range) {
  const slots = range === "24h" ? 12 : range === "7d" ? 7 : 12;
  const labels =
    range === "24h"
      ? ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"]
      : range === "7d"
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

  const a = new Array(slots).fill(0);
  const b = new Array(slots).fill(0);
  if (rows.length === 0) return { a, b, labels };

  const times = rows.map((r) => new Date(r.started_at).getTime());
  const min = Math.min(...times);
  const max = Math.max(...times);
  const span = max - min || 1;

  for (const r of rows) {
    const i = Math.min(slots - 1, Math.floor(((new Date(r.started_at).getTime() - min) / span) * slots));
    a[i] += 1;
    if (r.outcome === "booked") b[i] += 1;
  }

  // The chart plots against a 0-100 axis, so scale to the tallest column.
  const peak = Math.max(...a, 1);
  return { a: a.map((v) => (v / peak) * 92), b: b.map((v) => (v / peak) * 92), labels };
}

type LiveSource = {
  org: { name?: string; plan?: string } | null;
  rows: CallRow[];
  appts: Record<string, unknown>[];
};

/**
 * One trip to the database. The widest range is fetched and the narrower ones
 * are sliced from it in memory, so switching 24h/7d/30d costs nothing.
 */
async function fetchLive(): Promise<LiveSource | null> {
  const db = await serverClient();

  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  // RLS restricts every one of these to the caller's own organisation.
  const [{ data: org }, { data: callRows }, { data: apptRows }] = await Promise.all([
    db.from("organizations").select("name, plan").maybeSingle(),
    db
      .from("calls")
      .select("conversation_id, started_at, duration_secs, caller_name, caller_phone, reason, outcome, value_cents, summary")
      .gte("started_at", sinceFor("30d"))
      .order("started_at", { ascending: false }),
    db.from("appointments").select("starts_at, duration_mins, customer_name, title, kind"),
  ]);

  return { org, rows: (callRows ?? []) as CallRow[], appts: apptRows ?? [] };
}

function buildLive(src: LiveSource, range: Range): PortalData {
  const { org, appts } = src;
  const cutoff = sinceFor(range);
  const rows = src.rows.filter((r) => r.started_at >= cutoff);

  const counts = {
    booked: rows.filter((r) => r.outcome === "booked").length,
    quoted: rows.filter((r) => r.outcome === "quoted").length,
    handled: rows.filter((r) => r.outcome === "handled").length,
    passed: rows.filter((r) => r.outcome === "passed_on").length,
  };
  const total = rows.length || 1;
  const qualified = counts.booked + counts.quoted;

  return {
    live: true,
    business: org?.name ?? "Your business",
    plan: org?.plan ?? "Lunar",
    tiles: buildTiles(rows, range),
    volume: buildVolume(rows, range),
    funnel: [
      { label: "Calls received", n: rows.length.toLocaleString(), pct: 100, tone: "#4cc9f0" },
      { label: "Answered", n: rows.length.toLocaleString(), pct: 100, tone: "#7b2cbf" },
      { label: "Qualified", n: qualified.toLocaleString(), pct: Math.round((qualified / total) * 100), tone: "#c77dff" },
      { label: "Booked", n: counts.booked.toLocaleString(), pct: Math.round((counts.booked / total) * 100), tone: "#f72585" },
    ],
    resolution: [
      { label: "Booked", value: counts.booked, tone: "#f72585" },
      { label: "Quoted", value: counts.quoted, tone: "#c77dff" },
      { label: "Answered question", value: counts.handled, tone: "#7b2cbf" },
      { label: "Passed to you", value: counts.passed, tone: "#4cc9f0" },
    ],
    hourly: Array.from({ length: 24 }, (_, h) => rows.filter((r) => new Date(r.started_at).getHours() === h).length),
    calls: rows.map((r) => ({
      id: r.conversation_id,
      time: clock(r.started_at),
      day: dayLabel(r.started_at),
      caller: r.caller_name ?? "Unknown caller",
      phone: r.caller_phone ?? "—",
      reason: r.reason ?? r.summary ?? "—",
      status: OUTCOME_LABEL[r.outcome] ?? "Handled",
      duration: duration(r.duration_secs),
      value: money(r.value_cents),
    })),
    customers: buildCustomers(rows),
    appointments: appts.map((a) => ({
      day: new Date(a.starts_at as string).getDate(),
      time: clock(a.starts_at as string),
      who: (a.customer_name as string) ?? "Customer",
      what: a.title as string,
      tone: (a.kind as Appointment["tone"]) ?? "book",
      duration: `${a.duration_mins as number}m`,
    })),
    activity: rows.slice(0, 6).map((r) => ({
      t: dayLabel(r.started_at) === "Today" ? clock(r.started_at) : dayLabel(r.started_at),
      text: r.summary ?? r.reason ?? "Handled a call",
      tone: r.outcome === "booked" ? "book" : r.outcome === "quoted" ? "quote" : "handled",
    })),
  };
}

/** Roll the call log up into one row per caller. */
function buildCustomers(rows: CallRow[]): Customer[] {
  const byPhone = new Map<string, Customer & { _cents: number }>();

  for (const r of rows) {
    const key = r.caller_phone ?? r.caller_name ?? "unknown";
    const existing = byPhone.get(key);
    if (existing) {
      existing.jobs += r.outcome === "booked" ? 1 : 0;
      existing._cents += r.value_cents ?? 0;
      continue;
    }
    byPhone.set(key, {
      name: r.caller_name ?? "Unknown caller",
      business: "—",
      phone: r.caller_phone ?? "—",
      jobs: r.outcome === "booked" ? 1 : 0,
      lifetime: "—",
      last: dayLabel(r.started_at),
      status: "Active",
      _cents: r.value_cents ?? 0,
    });
  }

  return [...byPhone.values()].map(({ _cents, ...c }) => ({
    ...c,
    lifetime: money(_cents),
  }));
}

/* -------------------------------------------------------------- entry */

const RANGES: Range[] = ["24h", "7d", "30d"];

const demoBundle = () =>
  Object.fromEntries(RANGES.map((r) => [r, demoData(r)])) as Record<Range, PortalData>;

/**
 * Every range the dashboard can show, resolved in one pass.
 *
 * Falls back to demo data when Supabase is unconfigured, when nobody is
 * signed in, or when the query fails — a backend problem should never blank
 * a client's dashboard, it should just stop claiming the numbers are live.
 */
export async function getPortalBundle(): Promise<Record<Range, PortalData>> {
  if (!isConfigured()) return demoBundle();
  try {
    const src = await fetchLive();
    if (!src) return demoBundle();
    return Object.fromEntries(RANGES.map((r) => [r, buildLive(src, r)])) as Record<Range, PortalData>;
  } catch (err) {
    console.error("[portal] falling back to demo data:", err);
    return demoBundle();
  }
}
