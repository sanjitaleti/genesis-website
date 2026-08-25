import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/v2/supabase-server";
import { sendLeadEmail } from "@/lib/v2/resend";

/**
 * Shared endpoint for both the contact form and the pricing "Get started"
 * intake page. Every submission is stored in Supabase first — that's the
 * durable record. The email notification is sent on top of that and is
 * allowed to fail without losing the lead itself.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  kind: "contact" | "intake" | "configurator";
  plan?: string;
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  website?: string;
  message?: string;
  answers?: Record<string, string>;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const kind = body.kind === "intake" || body.kind === "configurator" ? body.kind : "contact";
  const name = body.name?.trim();
  const email = body.email?.trim();

  if (!name || !email || !isEmail(email)) {
    return NextResponse.json({ error: "name and a valid email are required" }, { status: 400 });
  }

  const db = serviceClient();
  const { data: row, error: insertError } = await db
    .from("leads")
    .insert({
      kind,
      plan: body.plan ?? null,
      name,
      business: body.business?.trim() || null,
      email,
      phone: body.phone?.trim() || null,
      website: body.website?.trim() || null,
      message: body.message?.trim() || null,
      answers: body.answers ?? null,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[leads] failed to store submission:", insertError);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }

  const rows = [
    ["Name", name],
    ["Business", body.business],
    ["Email", email],
    ["Phone", body.phone],
    ["Website", body.website],
    ["Plan", body.plan],
    ...(body.answers ? Object.entries(body.answers) : []),
    ["Message", body.message],
  ].filter(([, v]) => v);

  const titles = {
    intake: "New pricing intake",
    configurator: "New configurator submission",
    contact: "New contact form submission",
  } as const;

  const html = `
    <h2>${titles[kind]}</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="font-weight:600">${k}</td><td>${v}</td></tr>`).join("")}
    </table>
  `;

  const subjects = {
    intake: `New intake: ${body.plan ?? "unspecified plan"} — ${name}`,
    configurator: `New configurator lead: ${name}`,
    contact: `New contact form: ${name}`,
  } as const;

  const sent = await sendLeadEmail(subjects[kind], html);

  if (sent) {
    await db.from("leads").update({ email_sent: true }).eq("id", row.id);
  }

  return NextResponse.json({ ok: true, emailed: sent });
}
