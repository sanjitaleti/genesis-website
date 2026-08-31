import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrow,
  IconCheck,
  IconPhone,
  IconSearch,
  IconCalendar,
  IconBell,
} from "@/components/v2/icons";
import { tiers } from "@/lib/v2/pricing-tiers";

export const metadata: Metadata = {
  title: "AI Receptionist for HVAC Contractors — Answers 24/7, Books the Job",
  description:
    "An AI receptionist built for HVAC shops. Answers every call day or night, " +
    "handles no-heat emergencies, and books the job into your calendar. " +
    "$250/mo, no contract.",
  alternates: { canonical: "/ai-receptionist/hvac" },
};

const capabilities = [
  {
    Icon: IconPhone,
    title: "Triages the emergency",
    body: "No heat in January is not the same call as a filter change. It asks what's wrong, how urgent it is, and whether the system is running at all — then routes accordingly.",
  },
  {
    Icon: IconSearch,
    title: "Knows your service area",
    body: "Callers outside your radius get told politely and immediately, instead of taking up a slot you can't serve.",
  },
  {
    Icon: IconCalendar,
    title: "Books into your real calendar",
    body: "It checks live availability and puts the job on the schedule before the call ends. No callback queue, no message pad.",
  },
  {
    Icon: IconBell,
    title: "Escalates when it should",
    body: "A genuine emergency reaches a human on your terms — your rules, your after-hours contact, your definition of urgent.",
  },
];

const faqs = [
  {
    q: "Will my customers know it's AI?",
    a: "It's trained on how your shop actually talks, and most callers treat it as a normal receptionist. We don't recommend hiding it — if a caller asks directly, it tells them.",
  },
  {
    q: "What happens on a real emergency?",
    a: "You define what counts as an emergency, and those calls escalate to whoever you nominate, however you want to be reached. Everything else gets booked or handled.",
  },
  {
    q: "Does it work with my scheduling software?",
    a: "It books into your existing calendar. Tell us what you run on the intro call and we'll confirm the integration before you pay anything.",
  },
  {
    q: "What if it can't answer something?",
    a: "It takes the details and flags the call for follow-up rather than guessing. Every call is logged with its outcome, so nothing disappears.",
  },
  {
    q: "Do I need a new phone number?",
    a: "No. It answers your existing business line.",
  },
  {
    q: "How long does setup take?",
    a: "Days, not months. Setup is a fixed one-time fee and there's no long-term contract.",
  },
];

const BASE = "https://www.genesislp.ai";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "AI Receptionist", item: `${BASE}/ai-receptionist/hvac` },
    { "@type": "ListItem", position: 3, name: "HVAC", item: `${BASE}/ai-receptionist/hvac` },
  ],
};

export default function HvacPage() {
  return (
    <div className="v2-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ---------------------------------------------- breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="v2-wrap"
        style={{ paddingTop: "clamp(90px, 12vh, 120px)", fontSize: 13, color: "var(--text-faint)" }}
      >
        <Link href="/" className="v2-link" style={{ fontSize: 13 }}>
          Home
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span>AI Receptionist</span>
        <span style={{ margin: "0 8px" }}>/</span>
        <span>HVAC</span>
      </nav>

      {/* ---------------------------------------------- hero */}
      <section className="v2-wrap" style={{ paddingBlock: "24px 90px" }}>
        <h1
          className="v2-display v2-in"
          style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.7rem, 5.8vw, 4.6rem)", maxWidth: "16ch" }}
        >
          The phone rings at 2am.{" "}
          <span className="v2-grad-text">Someone answers.</span>
        </h1>

        <p
          className="v2-in"
          style={{
            ["--d" as string]: "0.25s",
            marginTop: 22,
            maxWidth: "50ch",
            fontSize: "1.06rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          HVAC calls don&rsquo;t arrive during business hours. They arrive when the
          heat dies on the coldest night of the year, and the customer calls the
          next shop on the list if nobody picks up. Genesis LP answers every one of
          them, checks your availability, and books the job before the call ends.
        </p>

        <div
          className="v2-in"
          style={{ ["--d" as string]: "0.4s", display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}
        >
          <Link href="/contact" className="v2-btn v2-btn--lg">
            Book a free 20-minute call
            <IconArrow style={{ width: 18, height: 18 }} />
          </Link>
          <Link href="/pricing" className="v2-btn-ghost">
            See pricing
          </Link>
        </div>

        <p
          className="v2-in"
          style={{ ["--d" as string]: "0.5s", marginTop: 30, fontSize: 14, color: "var(--text-faint)" }}
        >
          Works with your existing number. No new hardware.
        </p>
      </section>

      {/* ---------------------------------------------- the problem */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "20ch" }}>
          What a missed call actually costs an HVAC shop
        </h2>
        <p
          style={{
            marginTop: 18,
            maxWidth: "60ch",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          HVAC contractors miss a meaningful share of inbound calls, and
          after-hours rates run far higher. The reason isn&rsquo;t negligence —
          your techs are on job sites and your office is closed. The call still
          doesn&rsquo;t get answered.
        </p>

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <div className="v2-panel" style={{ padding: "26px 24px" }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Nights, weekends, storms</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              The calls a shop most wants — a system down on the coldest night —
              land exactly when the office is closed and techs are already out.
            </p>
          </div>

          <div className="v2-panel" style={{ padding: "26px 24px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "2.4rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              85%
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              of callers who don&rsquo;t reach a business on the first attempt
              won&rsquo;t call back.
            </p>
            <a
              href="https://www.numa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="v2-link"
              style={{ display: "inline-block", marginTop: 10, fontSize: 12.5 }}
            >
              Source: Numa, 2021 Small Business Phone Report
            </a>
          </div>

          <div className="v2-panel" style={{ padding: "26px 24px" }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>A real job, every time</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              A no-heat or no-AC call is a paying job to whichever shop answers
              first — and callers move down their list fast.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- capabilities */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "20ch" }}>
          Built for how HVAC calls actually go
        </h2>

        {/* two-up: four cards in the base 3-col bento orphan the fourth */}
        <div className="v2-bento v2-bento--pairs" style={{ marginTop: 36 }}>
          {capabilities.map((c) => (
            <article key={c.title} className="v2-panel v2-fact">
              <div>
                <c.Icon className="v2-fact-icon" />
              </div>
              <div>
                <h3>{c.title}</h3>
                <p style={{ marginTop: 7 }}>{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------- after-hours */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <div className="v2-panel" style={{ padding: "clamp(34px, 5vw, 60px)" }}>
          <h2 className="v2-display" style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", maxWidth: "22ch" }}>
            Nights, weekends, and the first cold snap
          </h2>
          <p
            style={{
              marginTop: 16,
              maxWidth: "60ch",
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "var(--text-dim)",
            }}
          >
            The calls you most want are the ones that come in when you&rsquo;re
            least able to answer. A furnace failing on a Saturday night is a
            customer ready to book immediately and pay for speed. Genesis LP
            answers those calls in your voice, captures the details, and hands
            you a booked job on Monday morning rather than a voicemail
            you&rsquo;re too late to return.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------- pricing */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
          What it costs
        </h2>
        <p
          style={{
            marginTop: 16,
            maxWidth: "56ch",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          Most AI receptionist companies make you request a demo to find out.
          Here&rsquo;s ours.
        </p>

        <div className="v2-pricing-grid-cards" style={{ marginTop: 36 }}>
          {tiers.map((t) => (
            <article
              key={t.key}
              className={`v2-tier v2-pricing-grid-card${t.featured ? " is-featured" : ""}`}
              style={{
                ["--glow" as string]: t.glow,
                ["--glow2" as string]: t.glow2,
                ["--edge" as string]: t.edge,
              }}
            >
              <div className="v2-tier-crown" aria-hidden />
              {t.featured ? <span className="v2-tier-badge">Most clients start here</span> : null}

              <div className="v2-tier-body">
                <h3 className="v2-tier-name">{t.name}</h3>
                <p className="v2-tier-desc">{t.desc}</p>

                <div className="v2-tier-price">
                  {t.price} <small>{t.unit}</small>
                </div>
                {t.retainer ? <div className="v2-tier-retainer">{t.retainer}</div> : null}
                {t.discount ? <div className="v2-tier-discount">{t.discount}</div> : null}

                <ul className="v2-tier-list">
                  {t.perks.map((p) => (
                    <li key={p}>
                      <IconCheck />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="v2-tier-cta">
                  {t.featured ? (
                    <Link href={`/get-started/${t.key}`} className="v2-btn v2-btn--block">
                      {t.cta}
                    </Link>
                  ) : (
                    <Link href={`/get-started/${t.key}`} className="v2-btn-ghost" style={{ width: "100%" }}>
                      {t.cta}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p style={{ marginTop: 24, fontSize: 14.5, color: "var(--text-dim)" }}>
          One HVAC service call a month covers it.{" "}
          <Link href="/pricing" className="v2-link">
            See full pricing
          </Link>
        </p>
      </section>

      {/* ---------------------------------------------- FAQ */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
          Questions HVAC shops ask
        </h2>

        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f) => (
            <div key={f.q} className="v2-panel" style={{ padding: "24px 26px" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{f.q}</h3>
              <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-dim)" }}>
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------- closing CTA */}
      <section className="v2-wrap" style={{ paddingBlock: "40px 60px" }}>
        <div className="v2-panel" style={{ padding: "clamp(38px, 6vw, 72px)", textAlign: "center" }}>
          <h2
            className="v2-display"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: "0 auto", maxWidth: "22ch" }}
          >
            Hear it answer a call for your shop.
          </h2>
          <p
            style={{
              margin: "18px auto 0",
              maxWidth: "50ch",
              fontSize: "1.02rem",
              lineHeight: 1.65,
              color: "var(--text-dim)",
            }}
          >
            Book 20 minutes and we&rsquo;ll play you a live AI-answered call for
            an HVAC scenario you pick. If it doesn&rsquo;t sound like someone
            you&rsquo;d hire, don&rsquo;t buy it.
          </p>
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <Link href="/contact" className="v2-btn v2-btn--lg">
              Book a free 20-minute call
              <IconArrow style={{ width: 18, height: 18 }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
