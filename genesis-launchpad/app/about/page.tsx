/* Hallmark · genre: modern-minimal · macrostructure: Long Document · design-system: design.md · designed-as-app */
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Genesis LP is an AI automation agency for the businesses nobody builds for — service companies, e-commerce brands, and firms of 5–75 people.",
};

const beliefs = [
  ["01", "Working systems over strategy decks."],
  ["02", "One named process at a time."],
  ["03", "No lock-in. You own what we build."],
  ["04", "Boring wins add up to real money."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="About"
        title="Built for the businesses nobody builds for."
        description="The plumbing company with twelve trucks. The boutique accounting firm. The regional e-commerce brand. Bottlenecked by back-office work nobody has time to fix."
      />

      <section className="wrap py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
          <div className="meta">Why we started</div>
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink-2">
            <p>
              This industry has two failure modes. Traditional agencies treat AI
              as a feature to sprinkle on top of existing software. AI-first
              startups build impressive demos that never survive contact with a
              real client&apos;s messy data and legacy systems.
            </p>
            <p>
              Genesis LP was built against both. We come in, map how your
              operation actually runs, and ship a working system — connected to
              your existing tools, tested against your real data, running on
              infrastructure you can own without us.
            </p>
            <p className="text-ink">
              We&apos;re not for enterprises with in-house ML teams, and we&apos;re
              not for anyone who wants a chatbot as a marketing checkbox. We&apos;re
              for operators who want a specific process off their plate in the next
              30–60 days.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap py-8 md:py-12">
        <h2 className="border-t border-rule pt-10 text-2xl font-semibold tracking-tightish md:text-3xl">
          What we believe
        </h2>
        <div className="mt-8">
          {beliefs.map(([num, text]) => (
            <div key={num} className="ledger-row grid-cols-[3rem_1fr] md:grid-cols-[5rem_1fr]">
              <span className="ledger-index">{num}</span>
              <p className="text-xl font-medium tracking-tightish md:text-3xl">
                {text}
              </p>
            </div>
          ))}
          <div className="border-t border-rule" />
        </div>
      </section>

      <CTASection title="Recognize your business?" linkLabel="Say hello" />
    </>
  );
}
