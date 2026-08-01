/* Hallmark · genre: modern-minimal · macrostructure: Narrative Workflow · design-system: design.md · designed-as-app */
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { CTASection } from "@/components/CTASection";

const automations = [
  ["Support triage", "Every inbound message read, drafted, and routed — a human sees only what's genuinely unsure."],
  ["Reporting", "The morning dashboard assembles itself from your disconnected tools. Nobody opens a spreadsheet."],
  ["Onboarding", "A signed contract becomes a provisioned client record across every system, automatically."],
  ["Lead qualification", "Inbound leads scored, routed, and followed up before your competitors open their inbox."],
  ["Invoicing", "Reconciliation that runs itself. Your team stops being the glue between billing tools."],
];

const phases = [
  {
    id: "1.0",
    name: "Audit",
    when: "Week 0–1",
    body: "We map how your operation actually runs — who touches what, where it breaks, what it costs you weekly — and rank every opportunity by return on effort.",
  },
  {
    id: "2.0",
    name: "Build",
    when: "Weeks 1–4",
    body: "One named process, fixed scope. AI handles the judgment calls; plain, reliable automation handles the rest. Tested against your real data and your ugliest edge cases before handoff.",
  },
  {
    id: "3.0",
    name: "Run",
    when: "Ongoing · optional",
    body: "We monitor, maintain, and improve what we shipped — or hand it fully over. Built on tools you can own and operate without us.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* What we automate — ledger */}
      <section className="wrap py-20 md:py-28">
        <div className="grid gap-8 border-t border-rule pt-12 md:grid-cols-[1fr_2fr] md:gap-16">
          <div>
            <h2 className="text-2xl font-semibold tracking-tightish md:text-3xl">
              What we automate
            </h2>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-ink-2">
              Five patterns we&apos;ve built and rebuilt. Your version looks
              different — it always does.
            </p>
          </div>

          <div>
            {automations.map(([name, body], i) => (
              <div
                key={name}
                className="ledger-row grid-cols-[auto_1fr] md:grid-cols-[3rem_1fr_1.4fr]"
              >
                <span className="ledger-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium tracking-tightish md:text-xl">
                  {name}
                </h3>
                <p className="col-start-2 max-w-md text-[0.95rem] leading-relaxed text-ink-2 md:col-start-3">
                  {body}
                </p>
              </div>
            ))}
            <div className="border-t border-rule" />
          </div>
        </div>
      </section>

      {/* The process — narrative workflow phases */}
      <section className="wrap py-20 md:py-28">
        <div className="border-t border-rule pt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h2 className="text-2xl font-semibold tracking-tightish md:text-3xl">
              Weeks, not quarters
            </h2>
            <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-2">
              One named, measurable process at a time. No open-ended
              transformations, no strategy decks without a build attached.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-3">
            {phases.map((p) => (
              <div key={p.id} className="flex flex-col bg-paper p-7 md:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm text-accent">{p.id}</span>
                  <span className="meta">{p.when}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tightish md:text-2xl">
                  {p.name}
                </h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-2">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Point of view */}
      <section className="wrap py-20 md:py-28">
        <div className="border-t border-rule pt-14 md:pt-20">
          <p className="max-w-4xl text-[clamp(1.5rem,3vw,2.75rem)] font-medium leading-[1.2] tracking-tightish text-ink">
            Most teams aren&apos;t short on talent. They&apos;re buried in tools
            that don&apos;t talk to each other, doing by hand what should have
            been automated a year ago.{" "}
            <span className="text-ink-2">We close that gap — and leave.</span>
          </p>
          <Link
            href="/about"
            className="link mt-8 inline-flex text-sm text-ink-2"
          >
            How we think about the work →
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
