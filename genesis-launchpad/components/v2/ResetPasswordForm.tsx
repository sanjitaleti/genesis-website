"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/v2/session";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="v2-auth-inner">
        <h1 className="v2-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
          Check your email
        </h1>
        <p style={{ margin: "14px 0 0", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}>
          If <strong style={{ color: "var(--text)" }}>{email}</strong> has an account, a reset link is
          on its way. It expires after a while, so use it soon.
        </p>
        <Link href="/sign-in" className="v2-link" style={{ display: "inline-block", marginTop: 24 }}>
          Back to sign in
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    const result = await requestPasswordReset(email);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSent(true);
  };

  return (
    <form className="v2-auth-inner" onSubmit={submit} noValidate>
      <h1 className="v2-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
        Reset your password
      </h1>
      <p style={{ margin: "14px 0 30px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}>
        Enter the email on your account and we&rsquo;ll send you a link to set a
        new password.
      </p>

      <div className="v2-field">
        <label htmlFor="reset-email">Email address</label>
        <div className="v2-input-wrap">
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            className="v2-input"
            placeholder="you@yourcompany.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
          />
        </div>
      </div>

      {error ? (
        <p className="v2-auth-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="v2-btn v2-btn--block v2-btn--lg" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </button>

      <Link
        href="/sign-in"
        className="v2-link"
        style={{ display: "block", textAlign: "center", marginTop: 20 }}
      >
        Back to sign in
      </Link>
    </form>
  );
}
