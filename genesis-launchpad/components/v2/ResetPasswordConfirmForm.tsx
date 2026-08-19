"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "./icons";
import { confirmPasswordReset } from "@/lib/v2/session";

export function ResetPasswordConfirmForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="v2-auth-inner">
        <h1 className="v2-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
          Password updated
        </h1>
        <p style={{ margin: "14px 0 30px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}>
          Sign in with your new password whenever you&rsquo;re ready.
        </p>
        <button type="button" className="v2-btn v2-btn--lg" onClick={() => router.push("/sign-in")}>
          Go to sign in
        </button>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those two passwords don't match.");
      return;
    }

    setBusy(true);
    setError("");
    const result = await confirmPasswordReset(password);
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDone(true);
  };

  return (
    <form className="v2-auth-inner" onSubmit={submit} noValidate>
      <h1 className="v2-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
        Set a new password
      </h1>
      <p style={{ margin: "14px 0 30px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}>
        This link only works once, so pick something you&rsquo;ll remember.
      </p>

      <div className="v2-field">
        <label htmlFor="new-password">New password</label>
        <div className="v2-input-wrap">
          <input
            id="new-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            className="v2-input"
            placeholder="At least 8 characters"
            style={{ paddingRight: 50 }}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
          />
          <button
            type="button"
            className="v2-eye"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>
      </div>

      <div className="v2-field">
        <label htmlFor="confirm-password">Confirm password</label>
        <div className="v2-input-wrap">
          <input
            id="confirm-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            className="v2-input"
            placeholder="Type it again"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
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
        {busy ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
