"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrow, IconCheck, IconPlay, IconPause } from "./icons";
import type { ConfiguratorVoice } from "@/app/api/voices/route";

/**
 * A Typeform-style one-question-at-a-time form: built in-house rather than
 * pulling in a third-party embed. Enter advances to the next question
 * (Shift+Enter for a newline in the textarea), a thin progress bar tracks
 * position, and every field type this site's forms actually use is
 * supported: text, email, tel, url, textarea, select, multiselect, a voice
 * picker, and a read-only "info" interstitial (used for the transcript
 * preview).
 *
 * `showIf` lets a field branch on an earlier answer (e.g. industry-specific
 * questions only shown once an industry is picked) — the visible field list
 * is recomputed from current values on every render.
 */

export type CFOption = { value: string; label: string };

type CFFieldBase = {
  id: string;
  label: string;
  showIf?: (values: Record<string, string>) => boolean;
};

export type CFField =
  | (CFFieldBase & {
      type: "text" | "email" | "tel" | "url";
      placeholder?: string;
      required?: boolean;
      autoComplete?: string;
    })
  | (CFFieldBase & { type: "textarea"; placeholder?: string; required?: boolean })
  | (CFFieldBase & { type: "select"; placeholder?: string; required?: boolean; options: CFOption[] })
  | (CFFieldBase & { type: "multiselect"; required?: boolean; options: CFOption[] })
  | (CFFieldBase & { type: "voice"; required?: boolean })
  | (CFFieldBase & {
      type: "info";
      body: string | ((values: Record<string, string>) => string);
      continueLabel?: string;
    });

export function ConversationalForm({
  fields,
  onSubmit,
  onValuesChange,
  submitLabel = "Send it over",
  successTitle = "Got it, thanks.",
  successBody,
  successExtra,
}: {
  fields: CFField[];
  onSubmit: (values: Record<string, string>) => Promise<{ ok: boolean; message?: string }>;
  onValuesChange?: (values: Record<string, string>) => void;
  submitLabel?: string;
  successTitle?: string;
  successBody: string;
  successExtra?: React.ReactNode;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null);

  const visibleFields = fields.filter((f) => !f.showIf || f.showIf(values));
  const clampedStep = Math.min(step, visibleFields.length - 1);
  const field = visibleFields[clampedStep];
  const value = values[field?.id ?? ""] ?? "";
  const isLast = clampedStep === visibleFields.length - 1;
  const isInfo = field?.type === "info";
  const canAdvance = isInfo || !field?.required || value.trim().length > 0;

  useEffect(() => {
    if (step !== clampedStep) setStep(clampedStep);
  }, [step, clampedStep]);

  useEffect(() => {
    onValuesChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  useEffect(() => {
    if (field?.type === "text" || field?.type === "email" || field?.type === "tel" || field?.type === "url" || field?.type === "textarea") {
      inputRef.current?.focus();
    }
  }, [clampedStep, field?.type]);

  const setValue = (v: string) => {
    setValues((prev) => ({ ...prev, [field.id]: v }));
    if (error) setError("");
  };

  const toggleMulti = (optionValue: string) => {
    const current = value ? value.split(",") : [];
    const next = current.includes(optionValue)
      ? current.filter((v) => v !== optionValue)
      : [...current, optionValue];
    setValue(next.join(","));
  };

  const advance = async () => {
    if (!canAdvance || busy) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await onSubmit(values);
      if (!result.ok) {
        setError(result.message ?? "Something went wrong sending that. Try again, or email us directly.");
        setBusy(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong sending that. Try again, or email us directly.");
      setBusy(false);
    }
  };

  const back = () => {
    if (clampedStep > 0) setStep((s) => s - 1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !(field.type === "textarea" && !e.metaKey && !e.ctrlKey)) {
      e.preventDefault();
      advance();
    }
  };

  if (sent) {
    return (
      <div className="v2-panel" style={{ padding: "34px 30px" }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{successTitle}</h3>
        <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-dim)" }}>
          {successBody}
        </p>
        {successExtra}
      </div>
    );
  }

  return (
    <div className="v2-cform">
      <div className="v2-cform-progress">
        <span style={{ transform: `scaleX(${(clampedStep + 1) / visibleFields.length})` }} />
      </div>

      <div key={field.id} className="v2-cform-step">
        <label htmlFor={field.id} className="v2-cform-label">
          {field.label}
          {field.type !== "info" && !field.required ? <span className="v2-cform-optional">Optional</span> : null}
        </label>

        <div className="v2-input-wrap">
          {field.type === "textarea" ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              id={field.id}
              className="v2-input v2-cform-input"
              placeholder={field.placeholder}
              rows={4}
              style={{ resize: "vertical", paddingTop: 12, paddingBottom: 12, fontFamily: "inherit" }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
          ) : field.type === "select" ? (
            <select
              ref={inputRef as React.RefObject<HTMLSelectElement>}
              id={field.id}
              className="v2-input v2-cform-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            >
              <option value="" disabled>
                {field.placeholder ?? "Pick one"}
              </option>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : field.type === "multiselect" ? (
            <MultiSelect options={field.options} value={value} onToggle={toggleMulti} />
          ) : field.type === "voice" ? (
            <VoicePicker value={value} onChange={setValue} />
          ) : field.type === "info" ? (
            <div className="v2-cform-info">
              {typeof field.body === "function" ? field.body(values) : field.body}
            </div>
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              id={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              className="v2-input v2-cform-input"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
            />
          )}
        </div>

        {error ? (
          <p className="v2-auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="v2-cform-actions">
          {clampedStep > 0 ? (
            <button type="button" className="v2-btn-ghost" onClick={back}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="v2-btn v2-cform-next"
            onClick={advance}
            disabled={!canAdvance || busy}
          >
            {busy
              ? "Sending…"
              : isLast
                ? submitLabel
                : field.type === "info"
                  ? field.continueLabel ?? "Continue"
                  : "Next"}
            {isLast ? (busy ? null : <IconCheck style={{ width: 16, height: 16 }} />) : <IconArrow style={{ width: 16, height: 16 }} />}
          </button>
        </div>

        {field.type !== "info" ? <p className="v2-cform-hint">Press Enter ↵</p> : null}
      </div>
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onToggle,
}: {
  options: CFOption[];
  value: string;
  onToggle: (v: string) => void;
}) {
  const selected = new Set(value ? value.split(",") : []);
  return (
    <div className="v2-multiselect">
      {options.map((o) => {
        const active = selected.has(o.value);
        return (
          <button
            key={o.value}
            type="button"
            className="v2-multiselect-item"
            data-active={active}
            onClick={() => onToggle(o.value)}
            aria-pressed={active}
          >
            <span className="v2-multiselect-check">{active ? <IconCheck style={{ width: 13, height: 13 }} /> : null}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function VoicePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [voices, setVoices] = useState<ConfiguratorVoice[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/voices")
      .then((r) => r.json())
      .then((data: { voices: ConfiguratorVoice[]; error: string | null }) => {
        if (cancelled) return;
        setVoices(data.voices);
        if (data.error) setFetchError(data.error);
      })
      .catch(() => {
        if (!cancelled) setFetchError("upstream_error");
      });
    return () => {
      cancelled = true;
      audioRef.current?.pause();
    };
  }, []);

  const togglePreview = (voice: ConfiguratorVoice) => {
    if (!voice.previewUrl) return;
    if (playingId === voice.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = voice.previewUrl;
    audioRef.current.play();
    audioRef.current.onended = () => setPlayingId(null);
    setPlayingId(voice.id);
  };

  if (fetchError || (voices && voices.length === 0)) {
    return (
      <div className="v2-voice-empty">
        <p>
          Voice picker isn&rsquo;t hooked up yet on this preview — we&rsquo;ll pick a voice together on the call
          instead.
        </p>
      </div>
    );
  }

  if (!voices) {
    return <div className="v2-voice-empty">Loading voices…</div>;
  }

  return (
    <div className="v2-voice-grid">
      {voices.map((v) => {
        const active = value === v.id;
        const playing = playingId === v.id;
        return (
          <div key={v.id} className="v2-voice-card" data-active={active}>
            <button
              type="button"
              className="v2-voice-play"
              onClick={() => togglePreview(v)}
              aria-label={playing ? `Pause ${v.name} preview` : `Play ${v.name} preview`}
              disabled={!v.previewUrl}
            >
              {playing ? <IconPause style={{ width: 16, height: 16 }} /> : <IconPlay style={{ width: 16, height: 16 }} />}
            </button>
            <button type="button" className="v2-voice-select" onClick={() => onChange(v.id)}>
              <span className="v2-voice-name">{v.name}</span>
              <span className="v2-voice-meta">
                {[v.gender, v.accent, v.age].filter(Boolean).join(" · ") || "ElevenLabs voice"}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
