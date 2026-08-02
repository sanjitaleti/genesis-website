"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "./icons";
import { createAccount } from "@/lib/v2/session";

export function CreateAccountForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setBusy(true);
    setError("");

    const result = await createAccount(email, password);
    if (!result.ok) {
      setError(result.message);
      setBusy(false);
      return;
    }

    router.push("/v2/welcome");
  };

  return (
    <form className="v2-auth-inner" onSubmit={submit} noValidate>
      <h1 className="v2-display v2-in" style={{ ["--d" as string]: "0.05s", fontSize: "clamp(2.6rem, 5vw, 3.6rem)" }}>
        Create your account
      </h1>
      <p
        className="v2-in"
        style={{ ["--d" as string]: "0.14s", margin: "14px 0 34px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}
      >
        Use the same email you talked to us with, if you have one — it&rsquo;s how we match you up.
      </p>

      <div className="v2-in" style={{ ["--d" as string]: "0.22s" }}>
        <div className="v2-field">
          <label htmlFor="email">Email address</label>
          <div className="v2-input-wrap">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
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

        <div className="v2-field">
          <label htmlFor="password">Password</label>
          <div className="v2-input-wrap">
            <input
              id="password"
              name="password"
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
          <label htmlFor="confirm">Confirm password</label>
          <div className="v2-input-wrap">
            <input
              id="confirm"
              name="confirm"
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
          {busy ? "Creating your account…" : "Create account"}
        </button>

        <p style={{ textAlign: "center", margin: "30px 0 0", fontSize: 14, color: "var(--text-faint)" }}>
          Already have an account?{" "}
          <Link href="/v2/sign-in" className="v2-link">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
