"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrow, IconCheck } from "./icons";

/**
 * A Typeform-style one-question-at-a-time form: built in-house rather than
 * pulling in a third-party embed. Enter advances to the next question
 * (Shift+Enter for a newline in the textarea), a thin progress bar tracks
 * position, and every field type this site's forms actually use (text,
 * email, tel, url, textarea, select) is supported.
 */

export type CFOption = { value: string; label: string };

export type CFField =
  | { id: string; type: "text" | "email" | "tel" | "url"; label: string; placeholder?: string; required?: boolean; autoComplete?: string }
  | { id: string; type: "textarea"; label: string; placeholder?: string; required?: boolean }
  | { id: string; type: "select"; label: string; placeholder?: string; required?: boolean; options: CFOption[] };

export function ConversationalForm({
  fields,
  onSubmit,
  submitLabel = "Send it over",
  successTitle = "Got it, thanks.",
  successBody,
  successExtra,
}: {
  fields: CFField[];
  onSubmit: (values: Record<string, string>) => Promise<{ ok: boolean; message?: string }>;
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

  const field = fields[step];
  const value = values[field?.id ?? ""] ?? "";
  const isLast = step === fields.length - 1;
  const canAdvance = !field?.required || value.trim().length > 0;

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const setValue = (v: string) => {
    setValues((prev) => ({ ...prev, [field.id]: v }));
    if (error) setError("");
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
    if (step > 0) setStep((s) => s - 1);
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
        <span style={{ transform: `scaleX(${(step + 1) / fields.length})` }} />
      </div>

      <div key={field.id} className="v2-cform-step">
        <label htmlFor={field.id} className="v2-cform-label">
          {field.label}
          {field.required ? null : <span className="v2-cform-optional">Optional</span>}
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
          {step > 0 ? (
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
            {busy ? "Sending…" : isLast ? submitLabel : "Next"}
            {isLast ? (busy ? null : <IconCheck style={{ width: 16, height: 16 }} />) : <IconArrow style={{ width: 16, height: 16 }} />}
          </button>
        </div>

        <p className="v2-cform-hint">Press Enter ↵</p>
      </div>
    </div>
  );
}
