"use client";

import { useState } from "react";

const PLANS = ["Lunar", "Orbit", "Nova"];

export function AdminPanel({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState(PLANS[0]);
  const [markBusy, setMarkBusy] = useState(false);
  const [markError, setMarkError] = useState("");
  const [markResult, setMarkResult] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginBusy) return;
    setLoginBusy(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("bad password");
      setAuthed(true);
    } catch {
      setLoginError("That password isn't right.");
    } finally {
      setLoginBusy(false);
    }
  };

  const markPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (markBusy) return;
    setMarkBusy(true);
    setMarkError("");
    setMarkResult("");
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "request failed");
      setMarkResult(
        json.matchedExistingOrg
          ? `${email} already has an account. Unlocked their dashboard now.`
          : `${email} is saved. Their dashboard unlocks as soon as they create an account.`,
      );
      setEmail("");
    } catch (err) {
      setMarkError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setMarkBusy(false);
    }
  };

  if (!authed) {
    return (
      <div className="v2-content">
        <div className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px", maxWidth: 420 }}>
          <form className="v2-panel" style={{ padding: "34px 30px" }} onSubmit={login} noValidate>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Admin</h1>
            <div className="v2-field" style={{ marginTop: 20 }}>
              <label htmlFor="admin-password">Password</label>
              <div className="v2-input-wrap">
                <input
                  id="admin-password"
                  type="password"
                  className="v2-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            {loginError ? (
              <p className="v2-auth-error" role="alert">
                {loginError}
              </p>
            ) : null}
            <button
              type="submit"
              className="v2-btn v2-btn--block v2-btn--lg"
              disabled={loginBusy}
              style={{ marginTop: 14 }}
            >
              {loginBusy ? "Checking…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="v2-content">
      <div className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px", maxWidth: 480 }}>
        <form className="v2-panel" style={{ padding: "34px 30px" }} onSubmit={markPaid} noValidate>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Mark a customer paid</h1>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--text-dim)" }}>
            Unlocks the real dashboard for this email, whether they&rsquo;ve created an account
            yet or not.
          </p>

          <div className="v2-field" style={{ marginTop: 20 }}>
            <label htmlFor="admin-email">Email</label>
            <div className="v2-input-wrap">
              <input
                id="admin-email"
                type="email"
                className="v2-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@theirbusiness.com"
                required
              />
            </div>
          </div>

          <div className="v2-field">
            <label htmlFor="admin-plan">Plan</label>
            <div className="v2-input-wrap">
              <select id="admin-plan" className="v2-input" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {markError ? (
            <p className="v2-auth-error" role="alert">
              {markError}
            </p>
          ) : null}
          {markResult ? <p style={{ fontSize: 13.5, color: "var(--text-dim)", marginTop: 4 }}>{markResult}</p> : null}

          <button
            type="submit"
            className="v2-btn v2-btn--block v2-btn--lg"
            disabled={markBusy}
            style={{ marginTop: 14 }}
          >
            {markBusy ? "Saving…" : "Mark as paid"}
          </button>
        </form>
      </div>
    </div>
  );
}
