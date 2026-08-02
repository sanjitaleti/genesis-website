"use client";

import Script from "next/script";
import { ConversationalForm, type CFField } from "./ConversationalForm";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export function IntakeForm({ planLabel }: { planLabel: string }) {
  const fields: CFField[] = [
    { id: "name", type: "text", label: "What's your name?", placeholder: "Jane Rivera", required: true, autoComplete: "name" },
    { id: "business", type: "text", label: "And your business?", placeholder: "Rivera Plumbing", required: true, autoComplete: "organization" },
    { id: "email", type: "email", label: "Best email to reach you?", placeholder: "you@yourcompany.com", required: true, autoComplete: "email" },
    { id: "phone", type: "tel", label: "Phone number?", placeholder: "(555) 010-0199", autoComplete: "tel" },
    { id: "website", type: "url", label: "Your website, if you have one?", placeholder: "yourbusiness.com" },
    {
      id: "volume",
      type: "select",
      label: "Roughly how many calls do you get in a week?",
      placeholder: "Pick one",
      required: true,
      options: [
        { value: "Under 20", label: "Under 20" },
        { value: "20–50", label: "20–50" },
        { value: "50–100", label: "50–100" },
        { value: "100+", label: "100+" },
        { value: "Not sure", label: "Not sure" },
      ],
    },
    {
      id: "bottleneck",
      type: "textarea",
      label: "What's the biggest bottleneck with your phones right now?",
      placeholder: "Missing after-hours calls, staff too busy to pick up, losing quotes to slower follow-up...",
      required: true,
    },
    { id: "tools", type: "text", label: "What do you currently use for scheduling or booking jobs?", placeholder: "Google Calendar, ServiceTitan, paper and a whiteboard..." },
    {
      id: "timeline",
      type: "select",
      label: "When do you want this live?",
      placeholder: "Pick one",
      required: true,
      options: [
        { value: "As soon as possible", label: "As soon as possible" },
        { value: "2–4 weeks", label: "2–4 weeks" },
        { value: "1–3 months", label: "1–3 months" },
        { value: "Just exploring for now", label: "Just exploring for now" },
      ],
    },
    { id: "more", type: "textarea", label: "Anything else we should know?", placeholder: "Optional" },
  ];

  const onSubmit = async (values: Record<string, string>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "intake",
        plan: planLabel,
        name: values.name,
        business: values.business,
        email: values.email,
        phone: values.phone,
        website: values.website,
        message: values.more,
        answers: {
          "Weekly call volume": values.volume,
          "Biggest bottleneck": values.bottleneck,
          "Current tools": values.tools,
          Timeline: values.timeline,
        },
      }),
    });
    if (!res.ok) return { ok: false as const };
    return { ok: true as const };
  };

  return (
    <ConversationalForm
      fields={fields}
      onSubmit={onSubmit}
      submitLabel={`Send my ${planLabel} details`}
      successTitle="Got it, thanks."
      successBody={
        CALENDLY_URL
          ? "Grab a time below and let's talk it through."
          : "We'll go through this and reply within one business day to set up your call."
      }
      successExtra={
        CALENDLY_URL ? (
          <>
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            <div
              className="calendly-inline-widget"
              data-url={CALENDLY_URL}
              style={{ minWidth: 320, width: "100%", height: 700, marginTop: 20 }}
            />
          </>
        ) : null
      }
    />
  );
}
