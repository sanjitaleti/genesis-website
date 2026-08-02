"use client";

import { useState } from "react";
import Script from "next/script";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export function IntakeForm({ planLabel, planKey }: { planLabel: string; planKey: string }) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className="v2-panel" style={{ padding: "34px 30px" }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>Got it — thanks.</h3>
        <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-dim)" }}>
          {CALENDLY_URL
            ? "Grab a time below and let's talk it through."
            : "We'll go through this and reply within one business day to set up your call."}
        </p>

        {CALENDLY_URL ? (
          <>
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            <div
              className="calendly-inline-widget"
              data-url={CALENDLY_URL}
              style={{ minWidth: 320, width: "100%", height: 700, marginTop: 20 }}
            />
          </>
        ) : null}
      </div>
    );
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const get = (k: string) => (form.get(k) as string) || undefined;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "intake",
          plan: planLabel,
          name: get("name"),
          business: get("business"),
          email: get("email"),
          phone: get("phone"),
          website: get("website"),
          message: get("more"),
          answers: {
            "Weekly call volume": get("volume"),
            "Biggest bottleneck": get("bottleneck"),
            "Current tools": get("tools"),
            Timeline: get("timeline"),
          },
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setSent(true);
    } catch {
      setError("Something went wrong sending that. Try again, or email us directly.");
      setBusy(false);
    }
  };

  return (
    <form className="v2-in" style={{ ["--d" as string]: "0.22s" }} onSubmit={submit} noValidate>
      <input type="hidden" name="plan" value={planKey} />

      <div style={{ display: "grid", gap: 0, gridTemplateColumns: "1fr 1fr", columnGap: 14 }}>
        <div className="v2-field">
          <label htmlFor="name">Name</label>
          <div className="v2-input-wrap">
            <input id="name" name="name" type="text" autoComplete="name" className="v2-input" placeholder="Jane Rivera" required />
          </div>
        </div>
        <div className="v2-field">
          <label htmlFor="business">Business</label>
          <div className="v2-input-wrap">
            <input id="business" name="business" type="text" autoComplete="organization" className="v2-input" placeholder="Rivera Plumbing" required />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 0, gridTemplateColumns: "1fr 1fr", columnGap: 14 }}>
        <div className="v2-field">
          <label htmlFor="email">Email address</label>
          <div className="v2-input-wrap">
            <input id="email" name="email" type="email" autoComplete="email" className="v2-input" placeholder="you@yourcompany.com" required />
          </div>
        </div>
        <div className="v2-field">
          <label htmlFor="phone">Phone</label>
          <div className="v2-input-wrap">
            <input id="phone" name="phone" type="tel" autoComplete="tel" className="v2-input" placeholder="(555) 010-0199" />
          </div>
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="website">Your website (if you have one)</label>
        <div className="v2-input-wrap">
          <input id="website" name="website" type="url" className="v2-input" placeholder="yourbusiness.com" />
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="volume">Roughly how many calls do you get in a week?</label>
        <div className="v2-input-wrap">
          <select id="volume" name="volume" className="v2-input" defaultValue="" required>
            <option value="" disabled>
              Pick one
            </option>
            <option value="Under 20">Under 20</option>
            <option value="20–50">20–50</option>
            <option value="50–100">50–100</option>
            <option value="100+">100+</option>
            <option value="Not sure">Not sure</option>
          </select>
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="bottleneck">What&rsquo;s the biggest bottleneck with your phones right now?</label>
        <div className="v2-input-wrap">
          <textarea
            id="bottleneck"
            name="bottleneck"
            className="v2-input"
            placeholder="Missing after-hours calls, staff too busy to pick up, losing quotes to slower follow-up..."
            rows={3}
            style={{ resize: "vertical", paddingTop: 12, paddingBottom: 12, fontFamily: "inherit" }}
            required
          />
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="tools">What do you currently use for scheduling or booking jobs?</label>
        <div className="v2-input-wrap">
          <input
            id="tools"
            name="tools"
            type="text"
            className="v2-input"
            placeholder="Google Calendar, ServiceTitan, paper and a whiteboard..."
          />
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="timeline">When do you want this live?</label>
        <div className="v2-input-wrap">
          <select id="timeline" name="timeline" className="v2-input" defaultValue="" required>
            <option value="" disabled>
              Pick one
            </option>
            <option value="As soon as possible">As soon as possible</option>
            <option value="2–4 weeks">2–4 weeks</option>
            <option value="1–3 months">1–3 months</option>
            <option value="Just exploring for now">Just exploring for now</option>
          </select>
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="more">Anything else we should know?</label>
        <div className="v2-input-wrap">
          <textarea
            id="more"
            name="more"
            className="v2-input"
            placeholder="Optional"
            rows={3}
            style={{ resize: "vertical", paddingTop: 12, paddingBottom: 12, fontFamily: "inherit" }}
          />
        </div>
      </div>

      {error ? (
        <p className="v2-auth-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="v2-btn v2-btn--block v2-btn--lg" disabled={busy}>
        {busy ? "Sending…" : `Send my ${planLabel} details`}
      </button>
    </form>
  );
}
