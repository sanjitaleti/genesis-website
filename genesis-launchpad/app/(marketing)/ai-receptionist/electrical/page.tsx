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
import { MagneticCta } from "@/components/v2/MagneticCta";
import { tiers } from "@/lib/v2/pricing-tiers";

export const metadata: Metadata = {
  title: "AI Receptionist for Electricians — Answers 24/7, Books the Job",
  description:
    "An AI receptionist built for electrical contractors. Answers every call " +
    "day or night, triages outages and burning smells, and books the job into " +
    "your calendar. $250/mo, no contract.",
  alternates: { canonical: "/ai-receptionist/electrical" },
};

/**
 * The call timeline, adapted for electrical. Plumbing's version is about
 * stopping damage; this one is about making the property SAFE — which is
 * the thing an electrical call actually turns on. Same component, its own
 * argument. Labelled illustrative on the page.
 */
const timeline = [
  {
    t: "11:12p",
    key: false,
    h: "The call lands",
    b: "A breaker keeps tripping and half the house is dark. The homeowner calls the first electrician they find.",
  },
  {
    t: "11:12p",
    key: true,
    h: "Answered on the second ring",
    b: "Not an answering service reading from a card, and not a voicemail box the caller abandons for the next name on the list.",
  },
  {
    t: "11:13p",
    key: false,
    h: "Triaged for safety first",
    b: "Any burning smell? Anything hot to the touch? Is anyone getting a shock? It works through your safety questions before it discusses scheduling.",
  },
  {
    t: "11:14p",
    key: false,
    h: "Made safe",
    b: "It reads the make-safe steps you've given it — which breaker to leave off, what not to touch — so the property is stable while the visit is arranged.",
  },
  {
    t: "11:15p",
    key: false,
    h: "Scope captured",
    b: "Panel age, what tripped, what's on the circuit. Your sparky arrives knowing what they're walking into instead of guessing from a message pad.",
  },
  {
    t: "11:17p",
    key: false,
    h: "On the board",
    b: "Your first available emergency slot, on your real calendar, before the call ends.",
  },
];

const capabilities = [
  {
    Icon: IconPhone,
    title: "Separates danger from inconvenience",
    body: "A dead outlet and a panel that's hot to the touch are not the same call. It works through your safety questions first, then routes on your rules — so the urgent one doesn't sit behind a quote request.",
  },
  {
    Icon: IconSearch,
    title: "Won't book what you're not certified for",
    body: "It only offers the work you've told it you do. Commercial three-phase, EV chargers, anything outside your ticket — the details get taken down and flagged rather than scheduled.",
  },
  {
    Icon: IconCalendar,
    title: "Books into your real calendar",
    body: "Live availability, with emergency call-outs kept apart from scheduled installs and inspections. The job is on the board before the call ends.",
  },
  {
    Icon: IconBell,
    title: "Escalates on your terms",
    body: "You decide what's worth waking someone for. Those calls reach a human however you've asked to be reached; everything else is booked or logged for the morning.",
  },
];

const faqs = [
  {
    q: "Will it give callers safety advice?",
    a: "Only what you've scripted. If you want callers told to leave a breaker off and stay clear until someone arrives, we write that with you. If you'd rather it said nothing beyond “don’t touch it, we’re on our way”, that's what it says.",
  },
  {
    q: "Can it tell an emergency from a quote request?",
    a: "You define what urgent means for your shop — a burning smell, no power at all, anything hot or arcing — and it triages every call against your rules before it books anything.",
  },
  {
    q: "Will it book work I'm not licensed for?",
    a: "It only offers what you've told it you do. If you don't take on commercial three-phase or EV charger installs, it won't put them on your calendar — it takes the details and flags the call for you instead.",
  },
  {
    q: "Can it answer permit and inspection questions?",
    a: "It can explain your process and what you'll need from the customer, in your own wording. It won't invent code requirements or promise an inspection date it can't confirm.",
  },
  {
    q: "Do I have to change my number?",
    a: "No. It answers the line your customers already call.",
  },
  {
    q: "What happens when it doesn't know?",
    a: "It takes the details and flags the call rather than guessing at an answer. Every call is logged with what happened, so nothing quietly disappears.",
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

/* Mirrors the hvac/plumbing breadcrumb shape. Position 2 points at the leaf
   URL because no /ai-receptionist index route exists — logged in PROGRESS.md
   as separate cleanup rather than fixed here. */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "AI Receptionist", item: `${BASE}/ai-receptionist/electrical` },
    { "@type": "ListItem", position: 3, name: "Electrical", item: `${BASE}/ai-receptionist/electrical` },
  ],
};

export default function ElectricalPage() {
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
        <span>Electrical</span>
      </nav>

      {/* ---------------------------------------------- hero */}
      <section className="v2-wrap" style={{ paddingBlock: "24px 90px" }}>
        <h1
          className="v2-display v2-in"
          style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.7rem, 5.8vw, 4.6rem)", maxWidth: "16ch" }}
        >
          A breaker trips at 11pm.{" "}
          <span className="v2-grad-text">Someone&rsquo;s already on it.</span>
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
          Electrical calls are safety calls first. A panel that won&rsquo;t
          reset, a burning smell from an outlet, half a house with no power —
          the customer needs to know what&rsquo;s safe to touch and when
          someone is coming. Genesis LP answers, works through your triage
          questions, and books the job before the call ends.
        </p>

        <div
          className="v2-in"
          style={{ ["--d" as string]: "0.4s", display: "flex", flexWrap: "wrap", gap: 14, marginTop: 34 }}
        >
          <MagneticCta href="/contact">
            Book a free 20-minute call
            <IconArrow style={{ width: 18, height: 18 }} />
          </MagneticCta>
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
          What a missed call actually costs an electrical contractor
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
          It isn&rsquo;t negligence — your sparkies are up a ladder and the
          office closed at five. The call still doesn&rsquo;t get answered, and
          on an electrical job the person on the other end is often standing in
          the dark deciding whether it&rsquo;s safe to wait.
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
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Safety doesn&rsquo;t wait for Monday</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              A burning smell or a panel that&rsquo;s warm to the touch is not a
              callback item. If nobody picks up, the customer rings the next
              electrician — or has a go at it themselves.
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
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>The big jobs start small</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              Panel upgrades and rewires are among the largest tickets you
              quote, and they usually begin with an unglamorous after-hours call
              about a breaker that keeps going.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- the call timeline
          Given more air than its neighbours — it carries the page. */}
      <section className="v2-wrap" style={{ paddingBlock: "44px 124px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "20ch" }}>
          One call, minute by minute
        </h2>
        <p
          style={{
            marginTop: 18,
            maxWidth: "58ch",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          Five minutes between a dark kitchen and a job on your schedule, with
          the property made safe in between. Illustrative — an example call,
          not a recording.
        </p>

        <div className="v2-callline" style={{ marginTop: 34 }}>
          {timeline.map((s) => (
            <div key={s.h} className="v2-callline-step" data-key={s.key}>
              <span className="v2-callline-t">{s.t}</span>
              <div>
                <h3 className="v2-callline-h">{s.h}</h3>
                <p className="v2-callline-b">{s.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------- capabilities */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "20ch" }}>
          Built for how electrical calls actually go
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
          One emergency call-out a month covers it.{" "}
          <Link href="/pricing" className="v2-link">
            See full pricing
          </Link>
        </p>
      </section>

      {/* ---------------------------------------------- FAQ */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
          Questions electricians ask
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

      {/* ---------------------------------------------- closing CTA
          The one .v2-panel--glass surface on the page. */}
      <section className="v2-wrap" style={{ paddingBlock: "40px 60px" }}>
        <div
          className="v2-panel v2-panel--glass"
          style={{ padding: "clamp(38px, 6vw, 72px)", textAlign: "center" }}
        >
          <h2
            className="v2-display"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: "0 auto", maxWidth: "22ch" }}
          >
            Hear it take a no-power call.
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
            an electrical scenario you pick — a dead circuit at midnight, a
            panel upgrade enquiry, whatever you get most of. If it
            doesn&rsquo;t sound like someone you&rsquo;d put on your phones,
            don&rsquo;t buy it.
          </p>
          <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
            <MagneticCta href="/contact">
              Book a free 20-minute call
              <IconArrow style={{ width: 18, height: 18 }} />
            </MagneticCta>
          </div>
        </div>
      </section>
    </div>
  );
}
