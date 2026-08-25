import { NextResponse } from "next/server";

/**
 * Server-side only: the ElevenLabs API key never reaches the client.
 *
 * Proxies ElevenLabs' full public Voice Library (GET /v1/shared-voices —
 * ~16,500 voices), not just the ~30 voices sitting in this workspace's own
 * library (that was the original /v2/voices approach, and it's why the
 * picker used to only ever show a couple dozen options). Supports the
 * search/gender/age filters the client-side picker exposes, and is
 * restricted server-side to category=professional so results stay
 * consistently good — the public library also contains raw user uploads
 * and generated voices of wildly varying quality.
 */

export const runtime = "nodejs";

const PAGE_SIZE = 20;

type SharedVoice = {
  voice_id: string;
  name: string;
  preview_url?: string | null;
  category?: string;
  gender?: string;
  age?: string;
  accent?: string;
};

export type ConfiguratorVoice = {
  id: string;
  name: string;
  previewUrl: string | null;
  accent?: string;
  gender?: string;
  age?: string;
};

export async function GET(req: Request) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json({ voices: [], hasMore: false, error: "not_configured" }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);
  const search = searchParams.get("search")?.trim();
  const gender = searchParams.get("gender")?.trim();
  const age = searchParams.get("age")?.trim();

  const upstream = new URL("https://api.elevenlabs.io/v1/shared-voices");
  upstream.searchParams.set("page_size", String(PAGE_SIZE));
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("category", "professional");
  if (search) upstream.searchParams.set("search", search);
  if (gender) upstream.searchParams.set("gender", gender);
  if (age) upstream.searchParams.set("age", age);

  const res = await fetch(upstream.toString(), {
    headers: { "xi-api-key": key },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[voices] ElevenLabs request failed:", res.status, detail);
    const missingPermission = detail.includes("missing_permissions");
    return NextResponse.json(
      { voices: [], hasMore: false, error: missingPermission ? "missing_permission" : "upstream_error" },
      { status: 200 },
    );
  }

  const data = (await res.json()) as { voices?: SharedVoice[]; has_more?: boolean };
  const voices: ConfiguratorVoice[] = (data.voices ?? [])
    .filter((v) => v.preview_url)
    .map((v) => ({
      id: v.voice_id,
      name: v.name,
      previewUrl: v.preview_url ?? null,
      accent: v.accent,
      gender: v.gender,
      age: v.age,
    }));

  return NextResponse.json({ voices, hasMore: data.has_more ?? false, error: null });
}
