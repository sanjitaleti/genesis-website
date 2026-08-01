"use client";

import { useState } from "react";

/** Submissions are forwarded to this inbox via FormSubmit (no backend needed). */
const FORM_ENDPOINT = "https://formsubmit.co/ajax/meridiansocial01@gmail.com";

const fieldBase =
  "w-full border-0 border-b border-rule-2 bg-transparent px-0 py-3 text-[1.05rem] text-ink placeholder:text-ink-3 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-0";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(false);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, _subject: "New message from genesislp.ai", _template: "table" }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[360px] flex-col justify-center border-t border-rule pt-10">
        <div className="meta text-accent">Message received</div>
        <h3 className="mt-4 max-w-lg text-3xl font-semibold tracking-tightish md:text-4xl">
          Thanks. A real person will reply within one business day.
        </h3>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="link mt-8 w-fit text-sm text-ink-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid gap-10 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required placeholder="Your name" className={fieldBase} />
        </Field>
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" required placeholder="you@company.com" className={fieldBase} />
        </Field>
      </div>

      <Field label="What's the manual work you're sick of?" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="A few honest sentences…"
          className={`${fieldBase} resize-none`}
        />
      </Field>

      <div className="space-y-4">
        <button type="submit" disabled={sending} className="btn-primary disabled:opacity-50">
          {sending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
        </button>
        {error && (
          <p className="text-sm text-flag" role="alert">
            Something went wrong — email us directly at{" "}
            <a href="mailto:meridiansocial01@gmail.com" className="underline underline-offset-4">
              meridiansocial01@gmail.com
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="meta mb-2 block">{label}</span>
      {children}
    </label>
  );
}
