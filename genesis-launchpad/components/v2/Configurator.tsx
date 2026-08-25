"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { ConversationalForm, type CFField } from "./ConversationalForm";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

const INDUSTRIES = [
  { value: "HVAC", label: "HVAC" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Electrical", label: "Electrical" },
  { value: "Dental / Medical", label: "Dental / Medical" },
  { value: "Salon / Spa", label: "Salon / Spa" },
  { value: "Legal", label: "Legal" },
  { value: "Other", label: "Other" },
];

const isHvac = (v: Record<string, string>) => v.industry === "HVAC";
const isOtherIndustry = (v: Record<string, string>) => v.industry === "Other";
const isOtherTool = (v: Record<string, string>) => v.currentTool === "Other";

/** Used when we don't have a real Claude-drafted transcript yet — no
 * website given, the scrape failed, or the model call failed. */
function fallbackTranscript(values: Record<string, string>) {
  const business = values.business?.trim() || "your business";
  const emergency = values.emergencyDefinition?.trim();

  const lines = [
    `Caller: Hey, is this ${business}? My furnace just died and it's freezing in here.`,
    "",
    "Agent: Sorry to hear that — let's get you taken care of. Is the system completely dead, or is it running but not putting out heat?",
    "",
    "Caller: Completely dead. No fan, nothing.",
    "",
    emergency
      ? "Agent: Got it — that counts as urgent for us, so I'm going to get someone out today. Can I grab your address and a callback number?"
      : "Agent: Got it, that sounds urgent. Can I grab your address and a callback number so we can get someone out today?",
    "",
    "Caller: Sure, it's 214 Maple Street, and this number's fine.",
    "",
    "Agent: Perfect — I've got a technician free at 2:30 today. I'll book that now and text you a confirmation. Anything else going on with the system I should pass along?",
    "",
    "Caller: No, that's it. Thank you.",
    "",
    "Agent: You're all set — booked for 2:30, and you'll get a text shortly. Stay warm.",
  ];

  return lines.join("\n");
}

type Analysis =
  | { status: "idle" | "loading" | "error" }
  | { status: "done"; transcript: string };

function transcriptBody(analysis: Analysis) {
  return (values: Record<string, string>) => {
    const disclaimer =
      "This is an illustrative example, not a recording of a real call — it's here to show the shape of the conversation, not a guarantee of exact wording.";
    if (analysis.status === "loading") {
      return `${disclaimer}\n\nStill putting this together from your site — one second.`;
    }
    const body = analysis.status === "done" ? analysis.transcript : fallbackTranscript(values);
    return `${disclaimer}\n\n${body}`;
  };
}

function buildFields(analysis: Analysis): CFField[] {
  return [
    { id: "name", type: "text", label: "What's your name?", placeholder: "Jane Rivera", required: true, autoComplete: "name" },
    { id: "business", type: "text", label: "And your business?", placeholder: "Rivera Plumbing", required: true, autoComplete: "organization" },
    { id: "email", type: "email", label: "Best email to reach you?", placeholder: "you@yourcompany.com", required: true, autoComplete: "email" },
    { id: "phone", type: "tel", label: "Phone number?", placeholder: "(555) 010-0199", autoComplete: "tel" },

    {
      id: "industry",
      type: "select",
      label: "What kind of business is this for?",
      placeholder: "Pick one",
      required: true,
      options: INDUSTRIES,
    },
    {
      id: "industryOther",
      type: "text",
      label: "What kind of business, roughly?",
      placeholder: "e.g. auto repair, pest control...",
      showIf: isOtherIndustry,
    },

    {
      id: "serviceArea",
      type: "text",
      label: "What's your service area or radius?",
      placeholder: "e.g. 20 miles around Austin, TX",
    },

    {
      id: "jobTypes",
      type: "multiselect",
      label: "What kinds of jobs do you take?",
      showIf: isHvac,
      options: [
        { value: "Repairs", label: "Repairs" },
        { value: "Installs", label: "Installs" },
        { value: "Maintenance / tune-ups", label: "Maintenance / tune-ups" },
        { value: "Emergency / no-heat calls", label: "Emergency / no-heat calls" },
      ],
    },

    {
      id: "goals",
      type: "multiselect",
      label: "What do you need the AI receptionist to actually do?",
      required: true,
      options: [
        { value: "Book appointments", label: "Book appointments" },
        { value: "Triage emergencies", label: "Triage emergencies" },
        { value: "Answer FAQs", label: "Answer FAQs" },
        { value: "Take messages", label: "Take messages" },
        { value: "Qualify leads", label: "Qualify leads" },
      ],
    },

    {
      id: "emergencyDefinition",
      type: "textarea",
      label: "What counts as an emergency for your team?",
      placeholder: "e.g. no heat, no AC in extreme weather, a burst pipe...",
    },

    {
      id: "website",
      type: "url",
      label: "What's your website?",
      placeholder: "yourbusiness.com",
      required: true,
      autoComplete: "url",
    },

    {
      id: "afterHours",
      type: "select",
      label: "What happens to calls after hours right now?",
      placeholder: "Pick one",
      options: [
        { value: "Goes to voicemail", label: "Goes to voicemail" },
        { value: "Goes unanswered", label: "Goes unanswered" },
        { value: "An answering service picks up", label: "An answering service picks up" },
        { value: "Someone's on call", label: "Someone's on call" },
      ],
    },

    {
      id: "escalationContact",
      type: "text",
      label: "Who should a real emergency get escalated to?",
      placeholder: "e.g. me, whoever's on call",
    },

    {
      id: "currentTool",
      type: "select",
      label: "What do you use for scheduling or booking jobs today?",
      placeholder: "Pick one",
      options: [
        { value: "Google Calendar", label: "Google Calendar" },
        { value: "Calendly", label: "Calendly" },
        { value: "Jobber", label: "Jobber" },
        { value: "Housecall Pro", label: "Housecall Pro" },
        { value: "ServiceTitan", label: "ServiceTitan" },
        { value: "HubSpot", label: "HubSpot" },
        { value: "Other", label: "Other" },
        { value: "None yet", label: "None yet" },
      ],
    },
    {
      id: "currentToolOther",
      type: "text",
      label: "What do you use for scheduling?",
      placeholder: "Tool name",
      showIf: isOtherTool,
    },

    {
      id: "volume",
      type: "select",
      label: "Roughly how many calls do you get in a week?",
      placeholder: "Pick one",
      options: [
        { value: "Under 20", label: "Under 20" },
        { value: "20–50", label: "20–50" },
        { value: "50–100", label: "50–100" },
        { value: "100+", label: "100+" },
        { value: "Not sure", label: "Not sure" },
      ],
    },

    {
      id: "voice",
      type: "voice",
      label: "Pick a voice for your agent.",
    },

    {
      id: "transcriptPreview",
      type: "info",
      label: "Here's roughly what that sounds like.",
      body: transcriptBody(analysis),
      continueLabel: "Looks good",
    },

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
}

export function Configurator() {
  const [analysis, setAnalysis] = useState<Analysis>({ status: "idle" });
  const [liveValues, setLiveValues] = useState<Record<string, string>>({});

  // Fires once the website field settles (debounced) and we have at least
  // the industry/goals context to ground the draft in. Best-effort: any
  // failure just leaves the fallback illustrative transcript in place.
  useEffect(() => {
    const website = liveValues.website?.trim();
    if (!website || website.length < 4 || analysis.status !== "idle") return;

    const timer = setTimeout(() => {
      setAnalysis({ status: "loading" });
      fetch("/api/configurator/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: website,
          business: liveValues.business,
          industry: liveValues.industry === "Other" ? liveValues.industryOther : liveValues.industry,
          goals: liveValues.goals,
          emergencyDefinition: liveValues.emergencyDefinition,
        }),
      })
        .then((r) => r.json())
        .then((data: { ok: boolean; transcript?: string }) => {
          setAnalysis(data.ok && data.transcript ? { status: "done", transcript: data.transcript } : { status: "error" });
        })
        .catch(() => setAnalysis({ status: "error" }));
    }, 900);

    return () => clearTimeout(timer);
  }, [liveValues.website, analysis.status, liveValues.business, liveValues.industry, liveValues.industryOther, liveValues.goals, liveValues.emergencyDefinition]);

  const onSubmit = async (values: Record<string, string>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        kind: "configurator",
        name: values.name,
        business: values.business,
        email: values.email,
        phone: values.phone,
        website: values.website,
        message: values.more,
        answers: {
          Industry: values.industry === "Other" ? values.industryOther || "Other" : values.industry,
          "Service area": values.serviceArea,
          "Job types": values.jobTypes,
          Goals: values.goals,
          "Emergency definition": values.emergencyDefinition,
          "After-hours handling": values.afterHours,
          "Escalation contact": values.escalationContact,
          "Current scheduling tool": values.currentTool === "Other" ? values.currentToolOther || "Other" : values.currentTool,
          "Weekly call volume": values.volume,
          "Voice picked": values.voice,
          Timeline: values.timeline,
        },
      }),
    });
    if (!res.ok) return { ok: false as const };
    return { ok: true as const };
  };

  return (
    <ConversationalForm
      fields={buildFields(analysis)}
      onSubmit={onSubmit}
      onValuesChange={setLiveValues}
      submitLabel="Set up my details"
      successTitle="Your info's set — you're ready to go."
      successBody={
        CALENDLY_URL
          ? "Grab a time below and we'll go over pricing."
          : "We'll go through this and reach out within one business day to talk pricing."
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
