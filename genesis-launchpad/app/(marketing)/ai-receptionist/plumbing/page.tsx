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
  title: "AI Receptionist for Plumbers — Answers 24/7, Books the Job",
  description:
    "An AI receptionist built for plumbing shops. Answers every call day or " +
    "night, triages burst pipes and backed-up mains, and books the job into " +
    "your calendar. $250/mo, no contract.",
  alternates: { canonical: "/ai-receptionist/plumbing" },
};

/**
 * One call, as it actually unfolds. Plumbing is the trade where elapsed
 * time IS the story — water keeps damaging the house while the phone
 * rings out — so this page renders a call as a timeline rather than as
 * another grid of cards. Explicitly labelled illustrative on the page.
 */
const timeline = [
  {
    t: "12:41a",
    key: false,
    h: "The call lands",
    b: "A supply line lets go under a kitchen sink. The homeowner calls the first plumber their search turns up.",
  },
  {
    t: "12:41a",
    key: true,
    h: "Answered on the second ring",
    b: "No voicemail, no phone tree, no hold music — at the hour when every other shop's line goes to an answering service.",
  },
  {
    t: "12:42a",
    key: false,
    h: "Triaged",
    b: "Is water still flowing? Is it clean or waste? Is the main off? It asks what a dispatcher would ask, in the order you'd ask it.",
  },
  {
    t: "12:43a",
    key: false,
    h: "Damage stopped",
    b: "It reads the shutoff steps you've given it, so the water stops while the truck is still moving.",
  },
  {
    t: "12:44a",
    key: false,
    h: "Address checked",
    b: "The property is confirmed against your service radius before anything is promised.",
  },
  {
    t: "12:46a",
    key: false,
    h: "On the board",
    b: "Your first available emergency slot, on your real calendar, before the call ends.",
  },
];

const capabilities = [
  {
    Icon: IconPhone,
    title: "Sorts the emergency from the estimate",
    body: "A burst supply line and a dripping tap are not the same call. It asks whether water is still flowing, whether it's clean or waste, and whether the main is shut — then routes on your rules, not a generic script.",
  },
  {
    Icon: IconSearch,
    title: "Checks the address before it promises",
    body: "Service area confirmed while the caller is still on the line, so you're not sending a truck across the county for a job you were never going to take.",
  },
  {
    Icon: IconCalendar,
    title: "Books into your real calendar",
    body: "Live availability, with emergency slots kept separate from scheduled work. The job is on the board before the call ends — no callback queue, no message pad.",
  },
  {
    Icon: IconBell,
    title: "Escalates on your terms",
    body: "You decide what counts as a get-someone-out-now emergency. Those reach a human however you've asked to be reached. Everything else is booked or logged.",
  },
];

const faqs = [
  {
    q: "Will it tell someone how to shut the water off?",
    a: "Only if you want it to. It reads from the instructions you give it — if you'd like callers walked to the stop tap before your tech arrives, we script that with you. If you'd rather it stayed off that ground, it will.",
  },
  {
    q: "Can it tell an emergency from a quote request?",
    a: "That's most of the job. You define what urgent means for your shop — water actively flowing, a sewage backup, no water at all — and it triages every call against your rules before it books anything.",
  },
  {
    q: "Will it book work I'm not licensed for?",
    a: "It only offers what you've told it you do. If you don't run gas fitting or backflow testing, it won't put those on your calendar — it takes the details and flags the call for you instead.",
  },
  {
    q: "Will it work with the scheduling software I already use?",
    a: "It books into the calendar you already run. Tell us which one on the intro call and we'll confirm the integration before you pay for anything.",
  },
  {
    q: "Do I have to change my number?",
    a: "No. It picks up the line your customers already call.",
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

/* Mirrors the hvac page's breadcrumb shape. Note: position 2 points at the
   leaf URL because no /ai-receptionist index route exists — logged in
   PROGRESS.md as separate cleanup rather than fixed here. */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "AI Receptionist", item: `${BASE}/ai-receptionist/plumbing` },
    { "@type": "ListItem", position: 3, name: "Plumbing", item: `${BASE}/ai-receptionist/plumbing` },
  ],
};

export default function PlumbingPage() {
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
        <span>Plumbing</span>
      </nav>

      {/* ---------------------------------------------- hero */}
      <section className="v2-wrap" style={{ paddingBlock: "24px 90px" }}>
        <h1
          className="v2-display v2-in"
          style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.7rem, 5.8vw, 4.6rem)", maxWidth: "16ch" }}
        >
          A pipe bursts at midnight.{" "}
          <span className="v2-grad-text">Someone picks up.</span>
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
          Plumbing emergencies don&rsquo;t schedule themselves. A burst supply
          line, a backed-up main, no hot water on a Sunday — the customer calls
          whoever answers, and every minute they wait is more water on the floor.
          Genesis LP answers every one of them, triages it the way your
          dispatcher would, and books the job before the call ends.
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
          What a missed call actually costs a plumbing shop
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
          The reason isn&rsquo;t negligence — your techs are under someone
          else&rsquo;s sink and your office is closed. The call still
          doesn&rsquo;t get answered, and unlike most trades, the problem is
          getting worse the whole time it rings.
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
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>The damage compounds</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              A burst supply line or a backed-up main gets more expensive every
              minute it isn&rsquo;t stopped. The caller isn&rsquo;t shopping
              around — they&rsquo;re calling whoever picks up first.
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
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Always the worst hour</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              Frozen pipes over a holiday weekend, a Sunday-morning no-hot-water
              call — they arrive precisely when the office is dark and the vans
              are parked.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- signature: the call timeline
          Given more air than its neighbours on purpose — it's the centre of
          the page, not one of six equally-weighted blocks. */}
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
          Five minutes between a homeowner standing in water and a job on your
          schedule. Illustrative — an example call, not a recording.
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
          Built for how plumbing calls actually go
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
          One emergency callout a month covers it.{" "}
          <Link href="/pricing" className="v2-link">
            See full pricing
          </Link>
        </p>
      </section>

      {/* ---------------------------------------------- FAQ */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
          Questions plumbers ask
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
            Hear it take a burst-pipe call.
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
            a plumbing scenario you pick — an after-hours emergency, a drain
            quote, whatever you get most of. If it doesn&rsquo;t sound like
            someone you&rsquo;d put on your phones, don&rsquo;t buy it.
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
