"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_ACCENT, DEFAULT_MODE, type Accent, type Mode } from "@/lib/v2/theme";
import { isSignedIn, hasProfile } from "@/lib/v2/session";
import { ThemeSwatches } from "./ThemeSwatches";
import { IconArrow } from "./icons";

export function OnboardingWizard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [accent, setAccent] = useState<Accent>(DEFAULT_ACCENT);
  const [mode, setMode] = useState<Mode>(DEFAULT_MODE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const signedIn = await isSignedIn();
      if (!alive) return;
      if (!signedIn) {
        router.replace("/v2/sign-in");
        return;
      }
      const onboarded = await hasProfile();
      if (!alive) return;
      if (onboarded) {
        // Already set up — onboarding isn't something to redo by URL.
        router.replace("/v2/dashboard");
        return;
      }
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, business, accent, mode }),
      });
      if (!res.ok) throw new Error("request failed");
      router.push("/v2/welcome");
    } catch {
      setError("Something went wrong setting that up. Try again.");
      setBusy(false);
    }
  };

  if (!ready) return <div className="v2-welcome-hold" aria-hidden />;

  return (
    <div className="v2-onboard">
      <div className="v2-onboard-steps" aria-hidden>
        <span data-on={step >= 1} />
        <span data-on={step >= 2} />
      </div>

      {step === 1 ? (
        <div className="v2-in">
          <h1 className="v2-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
            Welcome — let&rsquo;s set you up.
          </h1>
          <p style={{ margin: "14px 0 34px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}>
            Two quick things, then your dashboard is ready.
          </p>

          <div className="v2-field">
            <label htmlFor="ob-name">Your name</label>
            <div className="v2-input-wrap">
              <input
                id="ob-name"
                className="v2-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Rivera"
                autoFocus
              />
            </div>
          </div>

          <div className="v2-field">
            <label htmlFor="ob-business">Business name</label>
            <div className="v2-input-wrap">
              <input
                id="ob-business"
                className="v2-input"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="Rivera Plumbing & Heating"
              />
            </div>
          </div>

          <button
            type="button"
            className="v2-btn v2-btn--block v2-btn--lg"
            disabled={!name.trim() || !business.trim()}
            onClick={() => setStep(2)}
          >
            Continue
            <IconArrow style={{ width: 18, height: 18 }} />
          </button>
        </div>
      ) : (
        <div className="v2-in">
          <h1 className="v2-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
            Make it yours.
          </h1>
          <p style={{ margin: "14px 0 30px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}>
            Pick a look for {business || "your"} dashboard. Change this anytime from Settings.
          </p>

          <ThemeSwatches accent={accent} mode={mode} onAccent={setAccent} onMode={setMode} />

          <div className="v2-theme-preview" data-accent={accent} data-mode={mode}>
            <div className="v2-onboard-preview">
              <div className="v2-onboard-preview-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="v2-onboard-preview-kpi">
                <span className="v2-onboard-preview-label">Calls answered</span>
                <span className="v2-onboard-preview-value">248</span>
                <span className="v2-onboard-preview-bar-track">
                  <span />
                </span>
              </div>
              <div className="v2-onboard-preview-btn">Book a call</div>
            </div>
          </div>

          {error ? (
            <p className="v2-auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button type="button" className="v2-btn-ghost" onClick={() => setStep(1)} style={{ flex: "0 0 auto" }}>
              Back
            </button>
            <button type="button" className="v2-btn v2-btn--block v2-btn--lg" onClick={submit} disabled={busy}>
              {busy ? "Setting up…" : "Finish setup"}
              <IconArrow style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
