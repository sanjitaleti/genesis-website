import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy · Genesis LP" },
  description: "How Genesis LP collects, uses, and protects your information.",
  alternates: { canonical: "/v2/privacy" },
};

const sections = [
  {
    h: "1. What this covers",
    body: [
      "This policy explains what information Genesis LP (“we,” “us”) collects when you visit genesislp.ai, sign up for an account, or use our AI receptionist service, and how we handle it.",
      "By using our site or service, you agree to the practices described here. If you don't agree, please don't use the service.",
    ],
  },
  {
    h: "2. Information we collect",
    body: [
      "Account & business information — your name, email address, business name, phone number, and service area, collected when you create an account, sign in with Google, or complete onboarding.",
      "Call data — when your AI receptionist answers a call, we collect and store the caller's name and phone number (if provided), a recording and transcript of the call, an AI-generated summary, the outcome (booked, quoted, handled, or passed on), and any appointment details discussed. This is the core of the service: your dashboard is built entirely from this data.",
      "Form submissions — if you fill out our contact form or a pricing intake form, we collect what you enter: name, business, email, phone, website, and your answers to the qualifying questions.",
      "Plan & billing status — which plan you're on and whether your account is marked as paid. We do not process or store payment card details ourselves — billing is handled manually today (an invoice or call), not through an automated card processor.",
      "Cookies & session data — a signed, httpOnly cookie that keeps you logged in, and (for our internal team only) a separate admin session cookie. We don't use third-party advertising or tracking cookies.",
    ],
  },
  {
    h: "3. How we use it",
    body: [
      "To provide the service: routing your calls to your AI receptionist, logging what happened, and showing it to you in your dashboard.",
      "To respond to inquiries you send us through the contact or intake forms.",
      "To operate your account: authentication, remembering your dashboard theme, and letting you reset your password.",
      "To improve the AI receptionist's accuracy for your business, using your own call history — we don't use one client's calls to train or improve another client's agent.",
    ],
  },
  {
    h: "4. Who we share it with",
    body: [
      "We don't sell your information. We share it only with the service providers (“subprocessors”) that make the product work, each bound to only use it to provide their service to us:",
      "• Supabase — hosts our database and handles authentication.",
      "• ElevenLabs — powers the AI voice agent and provides call recordings/transcripts.",
      "• Resend — sends transactional emails (e.g. notifying us when you submit a form).",
      "• Calendly — if you book a call with us, Calendly's own privacy policy governs that scheduling interaction.",
      "• Google — if you choose “Continue with Google” to sign in.",
      "• Vercel — hosts this website and application.",
      "We may also disclose information if required by law, or to protect the rights, safety, or property of Genesis LP or our clients.",
    ],
  },
  {
    h: "5. How long we keep it",
    body: [
      "We keep your account and call data for as long as your account is active, so your dashboard history stays intact. If you close your account, we'll delete your data within a reasonable period, except where we're required to keep records for legal or accounting reasons.",
      "Leads who submit the contact or intake form but never become clients are kept only as long as reasonably needed to follow up.",
    ],
  },
  {
    h: "6. Your rights",
    body: [
      "You can ask us to access, correct, or delete the personal information we hold about you at any time by emailing the address below. If you're a caller whose information was collected during a call to one of our clients, you can make the same request — we'll need enough detail to locate the right record.",
    ],
  },
  {
    h: "7. Children's privacy",
    body: [
      "Our service is intended for businesses and their adult representatives. We don't knowingly collect personal information from children under 13.",
    ],
  },
  {
    h: "8. Security",
    body: [
      "We rely on our providers' security practices (encryption in transit, access controls, row-level database security scoping every client to their own data) and follow reasonable practices ourselves. No method of transmission or storage is 100% secure, so we can't guarantee absolute security.",
    ],
  },
  {
    h: "9. Changes to this policy",
    body: [
      "We may update this policy as the service changes. We'll update the date below when we do. Continued use of the service after a change means you accept the update.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 100px" }}>
        <div style={{ maxWidth: "72ch" }}>
          <h1 className="v2-display v2-in" style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.4rem, 5vw, 3.4rem)" }}>
            Privacy <span className="v2-grad-text">policy.</span>
          </h1>
          <p
            className="v2-in"
            style={{ ["--d" as string]: "0.2s", marginTop: 16, fontSize: "0.95rem", color: "var(--text-faint)" }}
          >
            Last updated August 2026
          </p>

          <div className="v2-in" style={{ ["--d" as string]: "0.28s", marginTop: 34, display: "flex", flexDirection: "column", gap: 30 }}>
            {sections.map((s) => (
              <div key={s.h}>
                <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem", fontWeight: 600 }}>{s.h}</h2>
                {s.body.map((p, i) => (
                  <p key={i} style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}

            <div>
              <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem", fontWeight: 600 }}>10. Contact us</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>
                Questions about this policy, or a request about your data? Reach us at{" "}
                <a href="mailto:hello@genesislp.ai" className="v2-link">
                  hello@genesislp.ai
                </a>{" "}
                or through our{" "}
                <Link href="/v2/contact" className="v2-link">
                  contact page
                </Link>
                . See also our{" "}
                <Link href="/v2/terms" className="v2-link">
                  Terms & Conditions
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
