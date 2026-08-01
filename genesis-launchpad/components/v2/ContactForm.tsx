"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="v2-panel" style={{ padding: "34px 30px" }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>Got it — thanks.</h3>
        <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-dim)" }}>
          We&rsquo;ll reply within one business day to set up your 20-minute
          call.
        </p>
      </div>
    );
  }

  return (
    <form
      className="v2-in"
      style={{ ["--d" as string]: "0.22s" }}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      noValidate
    >
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

      <div className="v2-field">
        <label htmlFor="message">What&rsquo;s going on with your phones?</label>
        <div className="v2-input-wrap">
          <textarea
            id="message"
            name="message"
            className="v2-input"
            placeholder="Missing a few calls a week, want to see what this looks like for us..."
            rows={4}
            style={{ resize: "vertical", paddingTop: 12, paddingBottom: 12, fontFamily: "inherit" }}
          />
        </div>
      </div>

      <button type="submit" className="v2-btn v2-btn--block v2-btn--lg">
        Send it over
      </button>
    </form>
  );
}
