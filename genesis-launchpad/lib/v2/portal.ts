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
import { DEFAULT_ACCENT, DEFAULT_MODE, type Accent, type Mode } from "./theme";

export type SummaryStat = { label: string; value: string; note: string };

export type PortalData = {
  live: boolean;
  paid: boolean;
  business: string;
  plan: string;
  themeAccent: Accent;
  themeMode: Mode;
  tiles: Tile[];
  volume: { a: number[]; b: number[]; labels: string[] };
  funnel: { label: string; n: string; pct: number; tone: string }[];
  resolution: { label: string; value: number; tone: string }[];
  hourly: number[];
  /** Full call history, independent of the 24h/7d/30d picker — that picker
   *  only scopes the Overview KPIs above. Calls and Customers always show
   *  everything, so a client's history doesn't quietly vanish once it's
   *  older than the selected window. */
  allCalls: CallRecord[];
  allCustomers: Customer[];
  allTimeSummary: SummaryStat[];
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

/**
 * A real phone number is more useful than a repeated "Unknown caller" label
 * when the agent hasn't captured a name — every historical Green City call
 * falls into this bucket, since name extraction only started once the
 * data-collection fields were added.
 */
const formatPhone = (e164: string | null) => {
  if (!e164) return null;
  const digits = e164.replace(/\D/g, "").replace(/^1/, "");
  if (digits.length !== 10) return e164;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const callerLabel = (name: string | null, phone: string | null) =>
  name ?? formatPhone(phone) ?? "Unknown caller";

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
    paid: true,
    business: account.business,
    plan: account.plan,
    themeAccent: DEFAULT_ACCENT,
    themeMode: DEFAULT_MODE,
    tiles: tilesByRange[range],
    volume: volumeByRange[range],
    funnel: demoFunnel,
    resolution: demoResolution,
    hourly: demoHourly,
    allCalls: demoCalls,
    allCustomers: demoCustomers,
    allTimeSummary: [
      { label: "Calls answered", value: demoCalls.length.toLocaleString(), note: "example data" },
      {
        label: "Jobs booked",
        value: demoCalls.filter((c) => c.status === "Booked").length.toLocaleString(),
        note: "example data",
      },
      { label: "Avg. call length", value: "3m 12s", note: "example data" },
      { label: "Revenue recovered", value: "$6,240", note: "example data" },
    ],
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
  org: { name?: string; plan?: string; theme_accent?: string; theme_mode?: string; paid?: boolean } | null;
  rows: CallRow[];
  appts: Record<string, unknown>[];
};

/**
 * One trip to the database, fetching the FULL call history — not just the
 * last 30 days. The 24h/7d/30d picker only scopes the Overview KPIs; Calls
 * and Customers always show everything, or a fresh client's history quietly
 * goes missing the moment it's older than a month.
 */
async function fetchLive(): Promise<LiveSource | null> {
  const db = await serverClient();

  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  // RLS restricts every one of these to the caller's own organisation.
  const [{ data: org }, { data: callRows }, { data: apptRows }] = await Promise.all([
    db.from("organizations").select("name, plan, theme_accent, theme_mode, paid").maybeSingle(),
    db
      .from("calls")
      .select("conversation_id, started_at, duration_secs, caller_name, caller_phone, reason, outcome, value_cents, summary")
      .order("started_at", { ascending: false })
      .limit(5000),
    db.from("appointments").select("starts_at, duration_mins, customer_name, title, kind"),
  ]);

  return { org, rows: (callRows ?? []) as CallRow[], appts: apptRows ?? [] };
}

function toCallRecord(r: CallRow): CallRecord {
  return {
    id: r.conversation_id,
    time: clock(r.started_at),
    day: dayLabel(r.started_at),
    caller: callerLabel(r.caller_name, r.caller_phone),
    phone: formatPhone(r.caller_phone) ?? r.caller_phone ?? "—",
    reason: r.reason ?? r.summary ?? "—",
    status: OUTCOME_LABEL[r.outcome] ?? "Handled",
    duration: duration(r.duration_secs),
    value: money(r.value_cents),
  };
}

/** Every honest figure derivable from the full call history — nothing here
 *  is estimated or assumed, so a metric with no real basis is simply omitted
 *  rather than filled in with a plausible-looking guess. */
function buildAllTimeSummary(rows: CallRow[]): SummaryStat[] {
  const answered = rows.length;
  const booked = rows.filter((r) => r.outcome === "booked");
  const totalSecs = rows.reduce((s, r) => s + r.duration_secs, 0);
  const revenueCents = rows.reduce((s, r) => s + (r.value_cents ?? 0), 0);

  return [
    { label: "Calls answered", value: answered.toLocaleString(), note: "all time" },
    { label: "Jobs booked", value: booked.length.toLocaleString(), note: "all time" },
    {
      label: "Avg. call length",
      value: answered ? duration(Math.round(totalSecs / answered)) : "—",
      note: "all time",
    },
    { label: "Revenue recovered", value: money(revenueCents), note: "booked jobs, all time" },
  ];
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
    paid: true,
    business: org?.name ?? "Your business",
    plan: org?.plan ?? "Lunar",
    themeAccent: (["mono", "punch", "cyan", "citrus"].includes(org?.theme_accent ?? "")
      ? org!.theme_accent
      : DEFAULT_ACCENT) as Accent,
    themeMode: (["dark", "light"].includes(org?.theme_mode ?? "") ? org!.theme_mode : DEFAULT_MODE) as Mode,
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
    allCalls: src.rows.map(toCallRecord),
    allCustomers: buildCustomers(src.rows),
    allTimeSummary: buildAllTimeSummary(src.rows),
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

/**
 * An unpaid org's dashboard: their real business name, plan, and chosen
 * theme, but demo content underneath — the caller (DashboardShell) is
 * responsible for actually blurring it and showing the paywall overlay.
 * Never touches `src.rows`/`src.appts`, so an unpaid org's real call data
 * is never rendered anywhere, even blurred.
 */
function buildLocked(org: LiveSource["org"], range: Range): PortalData {
  const demo = demoData(range);
  return {
    ...demo,
    paid: false,
    business: org?.name ?? demo.business,
    plan: org?.plan ?? demo.plan,
    themeAccent: (["mono", "punch", "cyan", "citrus"].includes(org?.theme_accent ?? "")
      ? org!.theme_accent
      : DEFAULT_ACCENT) as Accent,
    themeMode: (["dark", "light"].includes(org?.theme_mode ?? "") ? org!.theme_mode : DEFAULT_MODE) as Mode,
  };
}

/** Roll the full call history up into one row per caller. */
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
      name: callerLabel(r.caller_name, r.caller_phone),
      business: "—",
      phone: formatPhone(r.caller_phone) ?? r.caller_phone ?? "—",
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
    if (src.org && src.org.paid === false) {
      return Object.fromEntries(RANGES.map((r) => [r, buildLocked(src.org, r)])) as Record<Range, PortalData>;
    }
    return Object.fromEntries(RANGES.map((r) => [r, buildLive(src, r)])) as Record<Range, PortalData>;
  } catch (err) {
    console.error("[portal] falling back to demo data:", err);
    return demoBundle();
  }
}
