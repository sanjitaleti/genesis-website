/* Hallmark · genre: modern-minimal · macrostructure: ledger · design-system: design.md · designed-as-app */
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "What Genesis LP automates: support triage, reporting, onboarding, lead qualification, invoicing — rebuilt as systems that run themselves.",
};

const patterns = [
  {
    num: "01",
    title: "Support triage",
    body: "An agent reads every incoming message, drafts the reply, and only escalates to a human when it's genuinely unsure.",
    stack: "Email / Slack · CRM · your reply templates",
  },
  {
    num: "02",
    title: "Reporting",
    body: "The morning dashboard assembles itself from five disconnected tools. Nobody touches a spreadsheet.",
    stack: "Analytics · billing · ops tools → one view",
  },
  {
    num: "03",
    title: "Client onboarding",
    body: "A signed contract becomes a fully provisioned client record in every system you run — automatically.",
    stack: "E-sign · CRM · billing · project tools",
  },
  {
    num: "04",
    title: "Lead qualification",
    body: "Inbound leads scored, routed, and followed up before your competitors have opened their inbox.",
    stack: "Forms · enrichment · CRM · outreach",
  },
  {
    num: "05",
    title: "Invoicing & reconciliation",
    body: "The numbers match themselves. Your team stops being the glue between billing tools.",
    stack: "Payments · accounting · bank feeds",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        kicker="Services"
        title="What we automate."
        description="Five patterns we've built and rebuilt. AI where judgment is needed, plain automation where it isn't. Your version looks different — it always does."
      />

      <section className="wrap py-12 md:py-16">
        {patterns.map((p) => (
          <div
            key={p.num}
            className="ledger-row grid-cols-[auto_1fr] md:grid-cols-[3.5rem_1.2fr_1.6fr]"
          >
            <span className="ledger-index">{p.num}</span>
            <div>
              <h2 className="text-xl font-semibold tracking-tightish md:text-2xl">
                {p.title}
              </h2>
              <div className="meta mt-3">{p.stack}</div>
            </div>
            <p className="col-start-2 max-w-md text-[0.95rem] leading-relaxed text-ink-2 md:col-start-3">
              {p.body}
            </p>
          </div>
        ))}
        <div className="border-t border-rule" />
      </section>

      <CTASection />
    </>
  );
}
