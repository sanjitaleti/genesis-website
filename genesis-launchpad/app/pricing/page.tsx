/* Hallmark · genre: modern-minimal · macrostructure: ledger · design-system: design.md · designed-as-app */
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Genesis LP pricing: a fixed-price discovery audit, a fixed-scope first build, and an optional support retainer. No year-long contracts.",
};

const tiers = [
  {
    num: "01",
    name: "Discovery audit",
    price: "$1.5k",
    unit: "fixed · 1 week",
    body: "We map your operations and rank every automation opportunity by return on effort.",
    includes: ["The real workflow, documented", "Ranked build recommendations", "Findings are yours either way"],
  },
  {
    num: "02",
    name: "First system",
    price: "From $10k",
    unit: "fixed scope · 2–6 weeks",
    body: "One named process, rebuilt as a system that runs itself — live in your stack.",
    includes: ["Tested on your real data", "Connected to your existing tools", "No proprietary lock-in"],
    flag: true,
  },
  {
    num: "03",
    name: "Ongoing",
    price: "Custom",
    unit: "monthly · optional",
    body: "We keep what we shipped healthy as your tools and needs change.",
    includes: ["Monitoring & maintenance", "Continuous iteration", "Priority response"],
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        kicker="Pricing"
        title="Clear numbers. No theatre."
        description="Scoped per project, priced fixed. You see the return on the first system before anyone mentions a retainer."
      />

      <section className="wrap py-12 md:py-16">
        {tiers.map((t) => (
          <div
            key={t.num}
            className="ledger-row grid-cols-[auto_1fr] md:grid-cols-[3.5rem_1.2fr_0.9fr_1.4fr]"
          >
            <span className="ledger-index">{t.num}</span>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold tracking-tightish md:text-2xl">
                  {t.name}
                </h2>
                {t.flag ? (
                  <span className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.08em] text-flag">
                    <span className="h-1.5 w-1.5 rounded-full bg-flag" />
                    Most start here
                  </span>
                ) : null}
              </div>
              <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink-2">
                {t.body}
              </p>
            </div>
            <div className="col-start-2 mt-3 md:col-start-3 md:mt-0">
              <div className="font-display text-2xl font-semibold tracking-tightish text-ink md:text-3xl">
                {t.price}
              </div>
              <div className="meta mt-1">{t.unit}</div>
            </div>
            <ul className="col-start-2 mt-3 space-y-2 md:col-start-4 md:mt-0">
              {t.includes.map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                  <span className="text-accent">—</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="border-t border-rule" />

        <p className="meta mt-10 max-w-xl leading-relaxed">
          No year-long contracts. Most clients expand after the first system pays
          for itself — not before.
        </p>
      </section>

      <CTASection title="Not sure where to start?" linkLabel="Ask us directly" />
    </>
  );
}
