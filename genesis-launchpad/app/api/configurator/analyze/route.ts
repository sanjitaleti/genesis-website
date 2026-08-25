import { NextResponse } from "next/server";

/**
 * Fetches the prospect's website, strips it to readable text, and asks
 * Claude to draft a short illustrative sample call grounded in what the
 * business actually does — used to personalize the configurator's
 * transcript-preview step instead of a generic canned example.
 *
 * Best-effort only: on any failure (bad URL, fetch timeout, no API key,
 * model error) this returns { ok: false } and the client falls back to
 * the generic illustrative transcript. Nothing here blocks form submission.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 400_000;
const MAX_TEXT_CHARS = 6000;
const MODEL = "claude-haiku-4-5-20251001";

const BLOCKED_HOSTS = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|::1$|\[::1\])/i;
const isPrivateIpV4 = (host: string) => {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const a = Number(m[1]);
  return a === 10 || a === 127 || (a === 172 && Number(m[2]) >= 16 && Number(m[2]) <= 31) || (a === 192 && Number(m[2]) === 168);
};

function normalizeUrl(raw: string): URL | null {
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(withScheme);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (BLOCKED_HOSTS.test(url.hostname) || isPrivateIpV4(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

function htmlToText(html: string): string {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const text = withoutNoise
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, MAX_TEXT_CHARS);
}

async function fetchSiteText(url: URL): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "GenesisLP-Configurator/1.0 (+https://www.genesislp.ai)" },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;

    const reader = res.body?.getReader();
    if (!reader) return null;
    let received = 0;
    const chunks: Uint8Array[] = [];
    while (received < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
      }
    }
    reader.cancel().catch(() => {});
    const html = Buffer.concat(chunks).toString("utf8");
    return htmlToText(html);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function draftTranscript(siteText: string, context: Record<string, string>): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;

  const prompt = `You are drafting a SHORT illustrative example of a phone call, to show a prospective client roughly what an AI receptionist could sound like for their specific business. This is a mockup for a sales tool, not a real recording.

Business context (from their own website, truncated):
"""
${siteText}
"""

What they told us in an intake form:
- Business name: ${context.business || "unknown"}
- Industry: ${context.industry || "unknown"}
- What they need the agent to do: ${context.goals || "not specified"}
- What counts as an emergency for them: ${context.emergencyDefinition || "not specified"}

Write a short (120-200 word) sample phone call between a "Caller" and "Agent", grounded in real, specific details from the website content above (their actual services, their actual name) — not generic filler. Do not invent facts that aren't supported by the website content or the intake answers above. Do not claim capabilities beyond: answering, asking clarifying questions, checking availability, booking, and escalating when appropriate. Output ONLY the dialogue, alternating "Caller:" and "Agent:" lines separated by blank lines. No preamble, no notes, no markdown.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      console.error("[configurator/analyze] Anthropic request failed:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((c) => c.type === "text")?.text?.trim();
    return text || null;
  } catch (err) {
    console.error("[configurator/analyze] Anthropic call errored:", err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: Request) {
  let body: { url?: string; business?: string; industry?: string; goals?: string; emergencyDefinition?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const url = body.url ? normalizeUrl(body.url) : null;
  if (!url) return NextResponse.json({ ok: false, reason: "invalid_url" });

  const siteText = await fetchSiteText(url);
  if (!siteText || siteText.length < 40) {
    return NextResponse.json({ ok: false, reason: "fetch_failed" });
  }

  const transcript = await draftTranscript(siteText, {
    business: body.business ?? "",
    industry: body.industry ?? "",
    goals: body.goals ?? "",
    emergencyDefinition: body.emergencyDefinition ?? "",
  });
  if (!transcript) return NextResponse.json({ ok: false, reason: "model_failed" });

  return NextResponse.json({ ok: true, transcript });
}
