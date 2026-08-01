/* Hallmark · genre: modern-minimal · macrostructure: Narrative Workflow · design-system: design.md · designed-as-app */
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How Genesis LP works: audit the real workflow, build one named process, prove it on real data, then run it. Weeks, not quarters.",
};

const steps = [
  {
    id: "1.0",
    phase: "Audit",
    when: "Week 0–1",
    body: "We map the workflow as it actually happens — who touches what, where it breaks, what it costs you weekly. Not the org-chart version.",
  },
  {
    id: "2.0",
    phase: "Build",
    when: "Weeks 1–4",
    body: "One named process, fixed scope, fixed price. AI handles the judgment calls; boring, reliable automation handles the rest.",
  },
  {
    id: "3.0",
    phase: "Prove",
    when: "Before handoff",
    body: "Tested against your real data and your ugliest edge cases — not a demo dataset. It works before you're asked to trust it.",
  },
  {
    id: "4.0",
    phase: "Run",
    when: "Ongoing · optional",
    body: "We monitor, maintain, and improve what we shipped. Built on tools you can own and operate without us — no lock-in, ever.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <PageHeader
        kicker="Approach"
        title="Weeks, not quarters."
        description="One named, measurable process at a time. No open-ended transformations, no strategy decks without a build attached."
      />

      <section className="wrap py-12 md:py-16">
        {steps.map((s) => (
          <div
            key={s.id}
            className="ledger-row grid-cols-[auto_1fr] md:grid-cols-[5rem_1.1fr_1.6fr]"
          >
            <span className="font-mono text-sm text-accent">{s.id}</span>
            <div>
              <h2 className="text-xl font-semibold tracking-tightish md:text-2xl">
                {s.phase}
              </h2>
              <div className="meta mt-3">{s.when}</div>
            </div>
            <p className="col-start-2 max-w-md text-[0.95rem] leading-relaxed text-ink-2 md:col-start-3">
              {s.body}
            </p>
          </div>
        ))}
        <div className="border-t border-rule" />
      </section>

      <CTASection
        title="Sound like a fit?"
        linkLabel="Start the conversation"
      />
    </>
  );
}
