import { NextResponse } from "next/server";

/**
 * Server-side only: the ElevenLabs API key never reaches the client.
 * Returns ElevenLabs' own curated voices — "premade" (their standard
 * library) and "professional" (studio-recorded) — trimmed to what the
 * configurator's voice picker needs.
 *
 * Originally scoped to voice_verification.is_verified only, but that badge
 * turned out to be near-empty on a typical account (0 of 31 voices here) —
 * it's reserved for licensed/celebrity-tier voices, not the standard
 * library. Category-based filtering still excludes user-uploaded clones,
 * which is the property that actually mattered.
 */

export const runtime = "nodejs";
export const revalidate = 3600;

const ALLOWED_CATEGORIES = new Set(["premade", "professional"]);

type ElevenLabsVoice = {
  voice_id: string;
  name: string;
  preview_url?: string | null;
  labels?: Record<string, string>;
  category?: string;
};

export type ConfiguratorVoice = {
  id: string;
  name: string;
  previewUrl: string | null;
  accent?: string;
  gender?: string;
  age?: string;
};

export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json({ voices: [], error: "not_configured" }, { status: 200 });
  }

  const res = await fetch("https://api.elevenlabs.io/v2/voices?page_size=100", {
    headers: { "xi-api-key": key },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[voices] ElevenLabs request failed:", res.status, detail);
    const missingPermission = detail.includes("missing_permissions");
    return NextResponse.json(
      { voices: [], error: missingPermission ? "missing_permission" : "upstream_error" },
      { status: 200 },
    );
  }

  const data = (await res.json()) as { voices?: ElevenLabsVoice[] };
  const voices: ConfiguratorVoice[] = (data.voices ?? [])
    .filter((v) => v.category && ALLOWED_CATEGORIES.has(v.category) && v.preview_url)
    .map((v) => ({
      id: v.voice_id,
      name: v.name,
      previewUrl: v.preview_url ?? null,
      accent: v.labels?.accent,
      gender: v.labels?.gender,
      age: v.labels?.age,
    }));

  return NextResponse.json({ voices, error: null });
}
