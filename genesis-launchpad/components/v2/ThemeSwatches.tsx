"use client";

import { ACCENTS, MODES, type Accent, type Mode } from "@/lib/v2/theme";
import { IconCheck } from "./icons";

export function ThemeSwatches({
  accent,
  mode,
  onAccent,
  onMode,
}: {
  accent: Accent;
  mode: Mode;
  onAccent: (a: Accent) => void;
  onMode: (m: Mode) => void;
}) {
  return (
    <>
      <div className="v2-swatch-grid">
        {ACCENTS.map((a) => (
          <button
            key={a.key}
            type="button"
            className="v2-swatch-card"
            data-on={accent === a.key}
            onClick={() => onAccent(a.key)}
          >
            <span className="v2-swatch-preview">
              <i style={{ background: a.swatch[0] }} />
              <i style={{ background: a.swatch[1] }} />
            </span>
            {a.label}
            {accent === a.key ? <IconCheck className="v2-swatch-check" /> : null}
          </button>
        ))}
      </div>

      <div className="v2-mode-toggle" role="group" aria-label="Light or dark mode">
        {MODES.map((m) => (
          <button key={m.key} type="button" data-on={mode === m.key} onClick={() => onMode(m.key)}>
            {m.label}
          </button>
        ))}
      </div>
    </>
  );
}
