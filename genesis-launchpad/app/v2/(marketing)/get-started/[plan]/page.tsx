import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IntakeForm } from "@/components/v2/IntakeForm";
import { IconClock, IconShield, IconCheck } from "@/components/v2/icons";

const PLANS = {
  lunar: { label: "Lunar", blurb: "one AI receptionist, answering your phone and booking work" },
  orbit: { label: "Orbit", blurb: "phone and text, fully looked after month to month" },
  nova: { label: "Nova", blurb: "more of your busywork automated, not just the phone" },
} as const;

type PlanKey = keyof typeof PLANS;

function planFor(key: string) {
  return PLANS[key as PlanKey];
}

export async function generateStaticParams() {
  return Object.keys(PLANS).map((plan) => ({ plan }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ plan: string }>;
}): Promise<Metadata> {
  const { plan } = await params;
  const info = planFor(plan);
  return {
    title: { absolute: info ? `Get started with ${info.label} — Genesis LP` : "Get started — Genesis LP" },
    description: "Tell us about your business so we can scope your AI receptionist.",
  };
}

const points = [
  { Icon: IconClock, title: "One business day", body: "We read every submission and reply within one business day." },
  { Icon: IconShield, title: "No obligation", body: "This scopes the work — you decide after the call, not before." },
  { Icon: IconCheck, title: "The more detail, the better", body: "Specifics here mean a sharper first conversation." },
];

export default async function GetStartedPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  const info = planFor(plan);
  if (!info) notFound();

  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px" }}>
        <div className="v2-contact-grid">
          <div>
            <p
              className="v2-eyebrow v2-in"
              style={{ ["--d" as string]: "0.05s", display: "inline-flex", marginBottom: 18 }}
            >
              {info.label} plan
            </p>
            <h1
              className="v2-display v2-in"
              style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.6rem, 5.6vw, 4.2rem)", maxWidth: "16ch" }}
            >
              Let&rsquo;s scope <span className="v2-grad-text">your {info.label}.</span>
            </h1>
            <p
              className="v2-in"
              style={{
                ["--d" as string]: "0.2s",
                marginTop: 20,
                maxWidth: "48ch",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                color: "var(--text-dim)",
              }}
            >
              You picked {info.label} — {info.blurb}. A few questions so we show up to
              your call already knowing your business, not asking the basics.
            </p>

            <div style={{ marginTop: 40, maxWidth: 520 }}>
              <IntakeForm planLabel={info.label} planKey={plan} />
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {points.map(({ Icon, title, body }) => (
              <div key={title} className="v2-panel" style={{ padding: "20px 22px", display: "flex", gap: 14 }}>
                <Icon style={{ width: 22, height: 22, color: "var(--blush)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{title}</h3>
                  <p style={{ margin: "5px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--text-dim)" }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}

            <div className="v2-panel" style={{ padding: "20px 22px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Prefer email?</h3>
              <a
                href="mailto:meridiansocial01@gmail.com"
                className="v2-link"
                style={{ display: "inline-block", marginTop: 8, fontSize: 14 }}
              >
                meridiansocial01@gmail.com
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
