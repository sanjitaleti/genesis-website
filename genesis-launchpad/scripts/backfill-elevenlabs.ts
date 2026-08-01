/**
 * Backfill the portal from an agent's existing ElevenLabs history.
 *
 * The webhook only catches calls from the moment it is switched on. This pulls
 * everything that already happened, so a client's dashboard is populated with
 * their real history on day one rather than starting empty.
 *
 * Run:
 *   npm run backfill -- --agent <agent_id> [--since 2026-01-01] [--dry-run]
 *
 * Needs, in .env.local:
 *   ELEVENLABS_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * It reuses the same mapper the live webhook uses, so a call imported here and
 * a call received later are stored identically. Upserts are keyed on
 * conversation_id, so running it twice is harmless.
 */

import { mapPayload, type PostCallPayload } from "../lib/v2/elevenlabs";
import { createClient } from "@supabase/supabase-js";

const API = "https://api.elevenlabs.io/v1/convai/conversations";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const AGENT_ID = arg("agent");
const SINCE = arg("since");
const DRY_RUN = process.argv.includes("--dry-run");
const INSPECT = process.argv.includes("--inspect");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function fail(message: string): never {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

if (!AGENT_ID) fail("Missing --agent <agent_id>. Find it on the agent's page in ElevenLabs.");
if (!API_KEY) fail("Missing ELEVENLABS_API_KEY in .env.local");
if (!DRY_RUN && !INSPECT && (!SUPABASE_URL || !SERVICE_KEY)) {
  fail("Missing Supabase credentials in .env.local (use --dry-run to preview without writing)");
}

const headers = { "xi-api-key": API_KEY };

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — ${(await res.text()).slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

type ListResponse = {
  conversations: { conversation_id: string }[];
  has_more: boolean;
  next_cursor: string | null;
};

/** Page through every conversation the agent has had. */
async function listConversationIds(): Promise<string[]> {
  const ids: string[] = [];
  let cursor: string | null = null;

  for (;;) {
    const params = new URLSearchParams({
      agent_id: AGENT_ID!,
      page_size: "100",
      summary_mode: "include",
    });
    if (cursor) params.set("cursor", cursor);
    if (SINCE) {
      const t = Math.floor(new Date(SINCE).getTime() / 1000);
      if (!Number.isFinite(t)) fail(`--since "${SINCE}" is not a date I can read (try 2026-01-01)`);
      params.set("call_start_after_unix", String(t));
    }

    const page: ListResponse = await getJson<ListResponse>(`${API}?${params}`);
    ids.push(...page.conversations.map((c) => c.conversation_id));
    process.stdout.write(`\r  found ${ids.length} conversations…`);

    if (!page.has_more || !page.next_cursor) break;
    cursor = page.next_cursor;
  }

  process.stdout.write("\n");
  return ids;
}

/**
 * Print what this agent actually collects, without mapping or writing.
 *
 * The mapper expects particular data-collection field names; every agent is
 * configured differently. This shows the real names and values so the mapping
 * can be matched to them instead of guessed at.
 */
async function inspect(ids: string[]) {
  const sample = ids.slice(0, 5);
  console.log(`\n  Inspecting ${sample.length} of ${ids.length} conversations.\n`);

  const seenFields = new Map<string, string[]>();

  for (const id of sample) {
    const d = await getJson<Record<string, any>>(`${API}/${id}`);
    const meta = d.metadata ?? {};
    const analysis = d.analysis ?? {};
    const collected: Record<string, unknown> = analysis.data_collection_results ?? {};

    console.log(`  ── ${id}`);
    console.log(`     when      ${meta.start_time_unix_secs ? new Date(meta.start_time_unix_secs * 1000).toISOString() : "?"}`);
    console.log(`     duration  ${meta.call_duration_secs ?? "?"}s`);
    console.log(`     caller    ${meta.phone_call?.external_number ?? "(no phone metadata)"}`);
    console.log(`     status    ${d.status ?? "?"}   successful: ${analysis.call_successful ?? "?"}`);
    console.log(`     summary   ${(analysis.transcript_summary ?? "(none)").slice(0, 88)}`);

    const keys = Object.keys(collected);
    if (keys.length === 0) {
      console.log("     collected (none — no data collection fields configured)");
    } else {
      console.log("     collected:");
      for (const k of keys) {
        const v = (collected[k] as { value?: unknown })?.value;
        console.log(`        ${k.padEnd(26)} = ${JSON.stringify(v)}`);
        const list = seenFields.get(k) ?? [];
        list.push(JSON.stringify(v));
        seenFields.set(k, list);
      }
    }
    console.log();
  }

  console.log("  ─────────────────────────────────────────────");
  if (seenFields.size === 0) {
    console.log(`
  This agent collects no structured fields.

  Calls will still import with real times, durations, phone numbers and
  summaries — but every one will read as "Handled", with no bookings or
  values, because there is nothing to read them from.

  Add the fields in ElevenLabs under Analysis > Data collection
  (SETUP.md step 2.2), then new calls will carry them.
`);
  } else {
    console.log("  Field names this agent uses:\n");
    for (const [k, vals] of seenFields) {
      console.log(`     ${k.padEnd(26)} e.g. ${vals.slice(0, 3).join(", ")}`);
    }
    console.log(`
  Send me this list and I will map these exact names into the dashboard.
`);
  }
}

async function main() {
  console.log(`\n  Agent  ${AGENT_ID}`);
  if (SINCE) console.log(`  Since  ${SINCE}`);
  if (INSPECT) console.log("  Mode   inspect only, nothing will be written");
  else if (DRY_RUN) console.log("  Mode   dry run, nothing will be written");
  console.log();

  const ids = await listConversationIds();
  if (ids.length === 0) {
    console.log("\n  No conversations found for that agent.\n");
    return;
  }

  if (INSPECT) {
    await inspect(ids);
    return;
  }

  const db =
    DRY_RUN || !SUPABASE_URL || !SERVICE_KEY
      ? null
      : createClient(SUPABASE_URL, SERVICE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

  // Which client these calls belong to.
  let orgId: string | null = null;
  if (db) {
    const { data, error } = await db
      .from("organizations")
      .select("id, name")
      .eq("elevenlabs_agent_id", AGENT_ID)
      .maybeSingle();
    if (error) fail(`Supabase error: ${error.message}`);
    if (!data) {
      fail(
        `No organization has elevenlabs_agent_id = "${AGENT_ID}".\n` +
          `  Set that column on the client's row first (see SETUP.md step 2.4).`,
      );
    }
    orgId = data.id;
    console.log(`  Writing into  ${data.name}\n`);
  }

  const tally = { imported: 0, skipped: 0, booked: 0, failed: 0 };

  for (const [i, id] of ids.entries()) {
    process.stdout.write(`\r  ${i + 1}/${ids.length}  ${id.slice(0, 24)}…`);

    try {
      // The detail endpoint returns the same shape the webhook posts, so the
      // live mapper can be reused verbatim.
      const detail = await getJson<Record<string, unknown>>(`${API}/${id}`);
      const call = mapPayload({ data: detail } as PostCallPayload);

      if (!call) {
        tally.skipped += 1;
        continue;
      }
      if (call.outcome === "booked") tally.booked += 1;

      if (!db || !orgId) {
        tally.imported += 1;
        continue;
      }

      const { data: row, error } = await db
        .from("calls")
        .upsert(
          {
            org_id: orgId,
            conversation_id: call.conversationId,
            agent_id: call.agentId,
            started_at: call.startedAt,
            duration_secs: call.durationSecs,
            caller_name: call.callerName,
            caller_phone: call.callerPhone,
            reason: call.reason,
            outcome: call.outcome,
            value_cents: call.valueCents,
            summary: call.summary,
            transcript: call.transcript,
            raw: detail,
          },
          { onConflict: "conversation_id" },
        )
        .select("id")
        .single();

      if (error) throw new Error(error.message);

      if (call.appointment) {
        const { error: apptError } = await db.from("appointments").upsert(
          {
            org_id: orgId,
            call_id: row.id,
            starts_at: call.appointment.startsAt,
            duration_mins: call.appointment.durationMins,
            customer_name: call.callerName,
            title: call.appointment.title,
            kind: "book",
          },
          { onConflict: "call_id" },
        );
        if (apptError) throw new Error(apptError.message);
      }

      tally.imported += 1;
    } catch (err) {
      tally.failed += 1;
      console.error(`\n  ! ${id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`\n
  imported   ${tally.imported}
  of which booked  ${tally.booked}
  skipped    ${tally.skipped}
  failed     ${tally.failed}
`);

  if (DRY_RUN) console.log("  Dry run — nothing was written.\n");
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
