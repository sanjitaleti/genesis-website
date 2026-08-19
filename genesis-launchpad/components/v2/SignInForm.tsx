"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff, IconGoogle } from "./icons";
import { signInWith, signInWithGoogle } from "@/lib/v2/session";
import { isConfigured } from "@/lib/v2/supabase";

export function SignInForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setError("");

    const result = await signInWith(email, password);
    if (!result.ok) {
      setError(result.message);
      setBusy(false);
      return;
    }

    router.push("/welcome");
  };

  return (
    <form className="v2-auth-inner" onSubmit={submit} noValidate>
      <h1
        className="v2-display v2-in"
        style={{ ["--d" as string]: "0.05s", fontSize: "clamp(2.6rem, 5vw, 3.6rem)" }}
      >
        Welcome
      </h1>
      <p
        className="v2-in"
        style={{
          ["--d" as string]: "0.14s",
          margin: "14px 0 34px",
          fontSize: "1.02rem",
          lineHeight: 1.6,
          color: "var(--text-dim)",
        }}
      >
        Sign in to see how your receptionist is doing and what we&rsquo;re working
        on.
      </p>

      <div className="v2-in" style={{ ["--d" as string]: "0.22s" }}>
        <div className="v2-field">
          <label htmlFor="email">Email address</label>
          <div className="v2-input-wrap">
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              className="v2-input"
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={error ? true : undefined}
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
              autoComplete="current-password"
              className="v2-input"
              placeholder="Enter your password"
              style={{ paddingRight: 50 }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={error ? true : undefined}
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

        {error ? (
          <p className="v2-auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="v2-auth-row">
          <label className="v2-check">
            <input type="checkbox" defaultChecked />
            <span className="v2-check-box" aria-hidden />
            Keep me signed in
          </label>
          <Link href="/reset-password" className="v2-link">
            Reset password
          </Link>
        </div>

        <button type="submit" className="v2-btn v2-btn--block v2-btn--lg" disabled={busy}>
          {busy ? "Signing you in…" : "Sign in"}
        </button>

        {isConfigured() ? null : (
          <p className="v2-auth-demo">
            Demo access: email <code>Test123</code>, password <code>Test123</code>
          </p>
        )}

        <div className="v2-or">Or continue with</div>

        <button
          type="button"
          className="v2-google"
          disabled={googleBusy}
          onClick={async () => {
            setGoogleBusy(true);
            setError("");
            const result = await signInWithGoogle();
            // On success the page is already navigating to Google — nothing
            // left to do here. Only a failure returns control to this code.
            if (!result.ok) {
              setError(result.message);
              setGoogleBusy(false);
            }
          }}
        >
          <IconGoogle />
          {googleBusy ? "Redirecting…" : "Continue with Google"}
        </button>

        <p
          style={{
            textAlign: "center",
            margin: "30px 0 0",
            fontSize: 14,
            color: "var(--text-faint)",
          }}
        >
          New to Genesis LP?{" "}
          <Link href="/create-account" className="v2-link">
            Create an account
          </Link>{" "}
          or{" "}
          <Link href="/contact" className="v2-link">
            talk to us
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
