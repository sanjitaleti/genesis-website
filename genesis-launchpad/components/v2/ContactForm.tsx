"use client";

import { ConversationalForm, type CFField } from "./ConversationalForm";

const fields: CFField[] = [
  { id: "name", type: "text", label: "What's your name?", placeholder: "Jane Rivera", required: true, autoComplete: "name" },
  { id: "business", type: "text", label: "And your business?", placeholder: "Rivera Plumbing", required: true, autoComplete: "organization" },
  { id: "email", type: "email", label: "Best email to reach you?", placeholder: "you@yourcompany.com", required: true, autoComplete: "email" },
  { id: "phone", type: "tel", label: "Phone number?", placeholder: "(555) 010-0199", autoComplete: "tel" },
  { id: "message", type: "textarea", label: "What's going on with your phones?", placeholder: "Missing a few calls a week, want to see what this looks like for us..." },
];

export function ContactForm() {
  const onSubmit = async (values: Record<string, string>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "contact",
        name: values.name,
        business: values.business,
        email: values.email,
        phone: values.phone,
        message: values.message,
      }),
    });
    if (!res.ok) return { ok: false as const };
    return { ok: true as const };
  };

  return (
    <ConversationalForm
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Send it over"
      successTitle="Got it, thanks."
      successBody="We'll reply within one business day to set up your 20-minute call."
    />
  );
}
