import { NextResponse } from "next/server";

/**
 * Backs the "Ask Genesis" floating assistant (components/v2/AiDock.tsx).
 * Public, unauthenticated marketing-site chat — grounded only in real,
 * public facts about the product and pricing. It must never pretend to
 * have access to a specific visitor's account, calls, or dashboard data;
 * that only exists behind sign-in.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are the "Ask Genesis" assistant embedded on the Genesis LP marketing website (genesislp.ai). Genesis LP builds AI receptionists for service businesses of roughly 5–75 people — trades (HVAC, plumbing, electrical), clinics, and salons. The AI receptionist answers every call 24/7, books the job into the business's calendar, and logs everything into a dashboard the owner can read.

Real pricing (do not deviate from these numbers):
- Lunar: $750 one-time setup, $250/mo retainer (first month 50% off, $125). One AI receptionist, phone answering 24/7, live in 2–6 weeks, dashboard included.
- Orbit: $825 one-time setup, $315/mo retainer. Everything in Lunar, plus text messaging, ongoing monitoring/improvement, priority response.
- Nova: custom pricing, add-on once ready. Everything in Orbit, plus invoicing/reporting/onboarding automation and dedicated review calls.

Useful links you can point people to:
- /pricing — full pricing breakdown
- /features — everything the AI receptionist handles
- /configurator — build/preview your own agent, hear a sample voice
- /contact — book a free 20-minute call with the team
- /sign-in — existing customers' dashboard

Rules:
- You are talking to an anonymous website visitor, not a signed-in customer. You have NO access to any real account, call log, or dashboard data. If asked "how many calls did we get" or anything account-specific, say plainly that you can't see their account from here and point them to /sign-in (if they're a customer) or booking a call at /contact (if they're prospective).
- Never invent statistics, testimonials, or capabilities not listed above.
- Keep answers short and conversational — a few sentences, not an essay.
- If you don't know something, say so and suggest booking the free call rather than guessing.`;

export async function POST(req: Request) {
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return NextResponse.json(
        { ok: false, error: "not_configured" },
        { status: 503 }
      );
    }

    const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    const messages: ChatMessage[] = body.messages
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof m === "object" &&
          (m as ChatMessage).role &&
          ["user", "assistant"].includes((m as ChatMessage).role) &&
          typeof (m as ChatMessage).content === "string"
      )
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

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
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!res.ok) {
        console.error("[ai-dock] Anthropic request failed:", res.status, await res.text().catch(() => ""));
        return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
      }

      const data = (await res.json()) as { content?: { type: string; text?: string }[] };
      const text = data.content?.find((c) => c.type === "text")?.text?.trim();
      if (!text) {
        return NextResponse.json({ ok: false, error: "empty" }, { status: 502 });
      }

      return NextResponse.json({ ok: true, reply: text });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    console.error("[ai-dock] errored:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
