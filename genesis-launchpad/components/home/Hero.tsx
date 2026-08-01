import Link from "next/link";

const facts = [
  ["Engagements", "Fixed scope, fixed price"],
  ["First system", "Live in 2–6 weeks"],
  ["Lock-in", "None — you own it"],
  ["Built for", "Teams of 5–75"],
];

export function Hero() {
  return (
    <section className="wrap pt-36 pb-8 md:pt-44 md:pb-12">
      <div className="grid gap-12 md:grid-cols-[1.55fr_1fr] md:gap-16">
        <div className="flex flex-col">
          <div className="meta">AI automation &amp; workflow agency</div>
          <h1 className="mt-6 text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[0.98] tracking-tighter2">
            We automate the work your team shouldn&apos;t be doing.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2">
            Genesis LP builds custom automations and agents that take the manual,
            repetitive work off your plate — support triage, reporting, onboarding,
            invoicing — and turn it into systems that run themselves.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/contact" className="btn-primary">
              Book a discovery audit <span aria-hidden>→</span>
            </Link>
            <Link href="/features" className="link text-sm text-ink-2">
              See what we automate
            </Link>
          </div>
        </div>

        {/* At-a-glance spec panel — instrument-panel, not a decorative card */}
        <div className="self-end border border-rule">
          <div className="meta border-b border-rule px-5 py-3">How we work</div>
          {facts.map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline justify-between gap-4 border-b border-rule px-5 py-4 last:border-0"
            >
              <span className="font-mono text-xs text-ink-3">{k}</span>
              <span className="text-right text-sm text-ink">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
