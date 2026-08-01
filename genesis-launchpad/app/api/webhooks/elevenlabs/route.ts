import { NextResponse } from "next/server";
import { verifySignature, mapPayload, type PostCallPayload } from "@/lib/v2/elevenlabs";
import { serviceClient } from "@/lib/v2/supabase-server";

/**
 * Receives ElevenLabs post-call webhooks and writes them into the portal.
 *
 * Contract notes that matter:
 *  - the signature is computed over the RAW body, so the body is read as text
 *    and only parsed after verification
 *  - delivery is at-least-once, so the write is an upsert keyed on
 *    conversation_id and processing the same event twice is harmless
 *  - a 200 means "received"; anything else makes ElevenLabs retry, so genuine
 *    bad requests return 4xx and only real server faults return 5xx
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[elevenlabs] ELEVENLABS_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const check = verifySignature(rawBody, req.headers.get("elevenlabs-signature"), secret);
  if (!check.ok) {
    console.warn("[elevenlabs] rejected webhook:", check.reason);
    return NextResponse.json({ error: check.reason }, { status: 401 });
  }

  let payload: PostCallPayload;
  try {
    payload = JSON.parse(rawBody) as PostCallPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Audio and failure webhooks share the endpoint; only transcripts carry the
  // data the dashboard needs. Acknowledge the rest so they aren't retried.
  if (payload.type && payload.type !== "post_call_transcription") {
    return NextResponse.json({ ok: true, ignored: payload.type });
  }

  const call = mapPayload(payload);
  if (!call) {
    return NextResponse.json({ error: "missing conversation_id" }, { status: 400 });
  }

  try {
    const db = serviceClient();

    // Which client this call belongs to is decided by the agent that took it.
    const { data: org, error: orgError } = await db
      .from("organizations")
      .select("id")
      .eq("elevenlabs_agent_id", call.agentId ?? "")
      .maybeSingle();

    if (orgError) throw orgError;
    if (!org) {
      // Acknowledge, or ElevenLabs will retry a call we can never place.
      console.warn("[elevenlabs] no organization for agent", call.agentId);
      return NextResponse.json({ ok: true, ignored: "unknown agent" });
    }

    const { data: row, error: callError } = await db
      .from("calls")
      .upsert(
        {
          org_id: org.id,
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
          raw: payload as unknown as Record<string, unknown>,
        },
        { onConflict: "conversation_id" },
      )
      .select("id")
      .single();

    if (callError) throw callError;

    if (call.appointment) {
      // Keyed on call_id so a redelivered webhook updates rather than
      // duplicating the booking.
      const { error: apptError } = await db.from("appointments").upsert(
        {
          org_id: org.id,
          call_id: row.id,
          starts_at: call.appointment.startsAt,
          duration_mins: call.appointment.durationMins,
          customer_name: call.callerName,
          title: call.appointment.title,
          kind: "book",
        },
        { onConflict: "call_id" },
      );
      if (apptError) throw apptError;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[elevenlabs] failed to store call", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}
