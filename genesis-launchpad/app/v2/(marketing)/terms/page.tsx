import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions · Genesis LP" },
  description: "The terms that govern your use of Genesis LP's AI receptionist service.",
  alternates: { canonical: "/v2/terms" },
};

const sections = [
  {
    h: "1. Agreement to terms",
    body: [
      "These terms govern your use of genesislp.ai and the Genesis LP AI receptionist service (together, the “service”), operated under the Genesis LP name. By creating an account, booking a call, or otherwise using the service, you agree to these terms on behalf of yourself and, if applicable, your business.",
      "This is a plain-English summary of our terms, not a substitute for legal advice — if you have questions about how these terms apply to your business, we'd encourage you to have them reviewed.",
    ],
  },
  {
    h: "2. What we provide",
    body: [
      "Genesis LP builds and operates an AI voice agent that answers your business's phone calls, has a conversation with the caller, and books work into your calendar where appropriate. We also provide a dashboard showing your call history, customers, and outcomes.",
      "Plans (Lunar, Orbit, Nova) differ in scope, as described on our pricing page. Setup timelines (typically 2–6 weeks) are estimates, not guarantees, and depend on how quickly we can get your phone number and business details configured.",
    ],
  },
  {
    h: "3. Pricing & payment",
    body: [
      "Each plan has a one-time setup fee and, where applicable, a monthly retainer, as shown on our pricing page at the time you sign up. There is no long-term contract — either side can end the arrangement as described in Section 8.",
      "Payment is currently arranged directly with us (invoice or by agreement on your onboarding call) rather than automated card billing. We'll tell you clearly what's owed and when before any work begins.",
    ],
  },
  {
    h: "4. Your account",
    body: [
      "You're responsible for the accuracy of the business information you give us (phone number, hours, service area, pricing) — the AI agent tells callers what you tell us. You're also responsible for keeping your login credentials secure and for anything that happens under your account.",
      "You must be authorized to act on behalf of the business you're signing up.",
    ],
  },
  {
    h: "5. Acceptable use",
    body: [
      "You agree not to use the service for anything illegal, to impersonate another business, or to route calls unrelated to your legitimate business operations. We may suspend an account we reasonably believe is being misused.",
    ],
  },
  {
    h: "6. About the AI agent",
    body: [
      "Our AI receptionist is designed to handle calls accurately, but it is not a person and can make mistakes — misunderstand a caller, mis-book a time, or fail to catch an edge case your business handles a certain way. You're responsible for reviewing your call history and catching anything that needs correcting.",
      "The service is not designed or intended for emergency calls (medical, fire, police, or similar) and should never be relied on for them. Please make sure your emergency contact routing stays separate from your AI receptionist line.",
    ],
  },
  {
    h: "7. Intellectual property",
    body: [
      "We own the Genesis LP platform, software, and branding. You own your business's data — your calls, customers, and everything in your dashboard. We only use it to provide the service to you, as described in our Privacy Policy.",
    ],
  },
  {
    h: "8. Cancellation & termination",
    body: [
      "You can cancel at any time by contacting us; we'll stop routing calls to the AI agent and wind down billing for the following period. We may suspend or end the service if payment is significantly overdue, if you violate these terms, or if we discontinue the service generally (with reasonable notice where practical).",
      "On cancellation, you can request an export of your call history and customer data within 30 days before it's deleted per our data retention practices.",
    ],
  },
  {
    h: "9. Disclaimers & limitation of liability",
    body: [
      "The service is provided “as is.” We work to keep it reliable, but we don't guarantee it will be uninterrupted, error-free, or available 100% of the time — phone networks, our AI provider, and hosting infrastructure are all outside our direct control.",
      "To the fullest extent permitted by law, Genesis LP isn't liable for indirect, incidental, or consequential damages (like lost business or missed bookings) arising from your use of the service. Our total liability for any claim is limited to the amount you paid us in the three months before the claim arose.",
    ],
  },
  {
    h: "10. Governing law",
    body: [
      "These terms are governed by the laws of the State of Washington, without regard to its conflict-of-law principles. Any dispute will be resolved in the state or federal courts located in Washington, unless we agree otherwise in writing.",
    ],
  },
  {
    h: "11. Changes to these terms",
    body: [
      "We may update these terms as the service evolves. We'll update the date below when we do — continuing to use the service after a change means you accept the update. For material changes, we'll try to give you reasonable notice.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 100px" }}>
        <div style={{ maxWidth: "72ch" }}>
          <h1 className="v2-display v2-in" style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.4rem, 5vw, 3.4rem)" }}>
            Terms & <span className="v2-grad-text">conditions.</span>
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
              <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem", fontWeight: 600 }}>12. Contact us</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "var(--text-dim)" }}>
                Questions about these terms? Reach us at{" "}
                <a href="mailto:hello@genesislp.ai" className="v2-link">
                  hello@genesislp.ai
                </a>{" "}
                or through our{" "}
                <Link href="/v2/contact" className="v2-link">
                  contact page
                </Link>
                . See also our{" "}
                <Link href="/v2/privacy" className="v2-link">
                  Privacy Policy
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
