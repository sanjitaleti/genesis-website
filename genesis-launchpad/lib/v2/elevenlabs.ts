/**
 * ElevenLabs post-call webhook: signature check and payload mapping.
 *
 * Verification follows the documented scheme — an `ElevenLabs-Signature`
 * header of the form `t=<unix>,v0=<hex>`, where the signed string is
 * `<timestamp>.<raw body>` hashed with HMAC-SHA256 using the webhook secret.
 * The raw body must be used, not re-serialised JSON, or the hash will not
 * match.
 */

import crypto from "node:crypto";

/** Reject anything older than this, so a captured request cannot be replayed. */
const TOLERANCE_SECS = 30 * 60;

export function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string,
): { ok: true } | { ok: false; reason: string } {
  if (!header) return { ok: false, reason: "missing signature header" };

  const parts = header.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
  const signatures = parts.filter((p) => p.startsWith("v0=")).map((p) => p.slice(3));

  if (!timestamp || signatures.length === 0) {
    return { ok: false, reason: "malformed signature header" };
  }

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > TOLERANCE_SECS) {
    return { ok: false, reason: "timestamp outside tolerance" };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const match = signatures.some((sig) => {
    const given = Buffer.from(sig, "utf8");
    // timingSafeEqual throws on length mismatch, which is itself a failure
    return given.length === expectedBuf.length && crypto.timingSafeEqual(given, expectedBuf);
  });

  return match ? { ok: true } : { ok: false, reason: "signature mismatch" };
}

/* ------------------------------------------------------------ payload */

type Turn = { role?: string; message?: string | null };

type DataCollectionEntry = { value?: unknown; rationale?: string };

export type PostCallPayload = {
  type?: string;
  event_timestamp?: number;
  data?: {
    conversation_id?: string;
    agent_id?: string;
    status?: string;
    transcript?: Turn[];
    metadata?: {
      start_time_unix_secs?: number;
      call_duration_secs?: number;
      phone_call?: {
        external_number?: string;
        agent_number?: string;
        direction?: string;
      };
    };
    analysis?: {
      call_successful?: string;
      transcript_summary?: string;
      data_collection_results?: Record<string, DataCollectionEntry>;
    };
  };
};

export type MappedCall = {
  conversationId: string;
  agentId: string | null;
  startedAt: string;
  durationSecs: number;
  callerName: string | null;
  callerPhone: string | null;
  reason: string | null;
  outcome: "booked" | "quoted" | "handled" | "passed_on";
  valueCents: number | null;
  summary: string | null;
  transcript: Turn[] | null;
  appointment: { startsAt: string; durationMins: number; title: string } | null;
};

const field = (
  results: Record<string, DataCollectionEntry> | undefined,
  name: string,
): unknown => results?.[name]?.value;

const asString = (v: unknown): string | null => {
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
};

const asNumber = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    // tolerate "$1,150" and "1150.00" alike
    const n = Number(v.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return null;
};

const asBool = (v: unknown): boolean =>
  v === true || (typeof v === "string" && ["true", "yes", "1"].includes(v.toLowerCase()));

/**
 * Turn one webhook body into the row the dashboard reads.
 *
 * The outcome and the booking come from the agent's configured data
 * collection fields; see SETUP.md for the exact field names to create in
 * ElevenLabs. Anything missing degrades to a plain "handled" call rather
 * than failing, so a misconfigured field never drops a call on the floor.
 */
export function mapPayload(payload: PostCallPayload): MappedCall | null {
  const d = payload.data;
  if (!d?.conversation_id) return null;

  const results = d.analysis?.data_collection_results;

  const booked = asBool(field(results, "booking_made"));
  const quoted = asBool(field(results, "quote_given"));
  const passedOn = asBool(field(results, "passed_to_human"));

  const outcome: MappedCall["outcome"] = booked
    ? "booked"
    : quoted
      ? "quoted"
      : passedOn
        ? "passed_on"
        : "handled";

  const startSecs = d.metadata?.start_time_unix_secs;
  const startedAt = new Date((startSecs ? startSecs : Date.now() / 1000) * 1000).toISOString();

  const dollars = asNumber(field(results, "job_value"));
  const apptRaw = asString(field(results, "appointment_time"));
  const apptDate = apptRaw ? new Date(apptRaw) : null;
  const apptValid = apptDate && !Number.isNaN(apptDate.getTime());

  const title =
    asString(field(results, "job_type")) ?? d.analysis?.transcript_summary?.slice(0, 80) ?? "Job";

  return {
    conversationId: d.conversation_id,
    agentId: d.agent_id ?? null,
    startedAt,
    durationSecs: d.metadata?.call_duration_secs ?? 0,
    callerName: asString(field(results, "customer_name")),
    callerPhone: d.metadata?.phone_call?.external_number ?? null,
    reason: asString(field(results, "job_type")) ?? d.analysis?.transcript_summary ?? null,
    outcome,
    valueCents: dollars === null ? null : Math.round(dollars * 100),
    summary: d.analysis?.transcript_summary ?? null,
    transcript: d.transcript ?? null,
    appointment:
      booked && apptValid
        ? {
            startsAt: apptDate.toISOString(),
            durationMins: asNumber(field(results, "job_duration_mins")) ?? 60,
            title,
          }
        : null,
  };
}
