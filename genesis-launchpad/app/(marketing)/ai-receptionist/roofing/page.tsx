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
  title: "AI Receptionist for Roofers — Answers Every Storm Call, Books the Job",
  description:
    "An AI receptionist built for roofing companies. Answers every call after " +
    "a storm — including the ones arriving at the same time — sorts leaks from " +
    "inspections, and books the job. $250/mo, no contract.",
  alternates: { canonical: "/ai-receptionist/roofing" },
};

/**
 * The call timeline, adapted for roofing. Plumbing's version is about
 * stopping damage and electrical's is about making safe; roofing's is
 * about VOLUME — the storm surge, where the differentiator is that calls
 * arriving simultaneously all get answered. Labelled illustrative.
 */
const timeline = [
  {
    t: "6:04a",
    key: false,
    h: "The wind drops",
    b: "The first homeowner goes outside, sees shingles in the yard, and starts working down a list of roofers.",
  },
  {
    t: "6:11a",
    key: true,
    h: "All of them answered",
    b: "The calls that land while another is still running get answered too, instead of rolling to voicemail the way one office line has to.",
  },
  {
    t: "6:12a",
    key: false,
    h: "Active leak flagged",
    b: "Water actually coming through a ceiling is not the same job as missing shingles. It asks which it is, and sorts accordingly.",
  },
  {
    t: "6:14a",
    key: false,
    h: "The insurance question, answered",
    b: "Whether you work with claims, what you need photographed, what happens before an adjuster visits — in your wording, not a generic script.",
  },
  {
    t: "6:16a",
    key: false,
    h: "Inspection booked",
    b: "Onto your real calendar, before the caller gets to the next roofer on their list.",
  },
  {
    t: "8:30a",
    key: false,
    h: "You open the laptop",
    b: "A morning's worth of booked inspections, each one logged with what the caller actually said.",
  },
];

const capabilities = [
  {
    Icon: IconPhone,
    title: "Handles the surge, not just the call",
    body: "Storm mornings don't arrive one at a time. Calls that land while another is still in progress get answered too — the difference between a booked week and a voicemail box you work through on Tuesday.",
  },
  {
    Icon: IconSearch,
    title: "Sorts leaks from inspections",
    body: "Water coming through a ceiling and a few lifted shingles are different jobs with different urgency. It asks which it is before it puts anything on the calendar.",
  },
  {
    Icon: IconCalendar,
    title: "Books into your real calendar",
    body: "Live availability, with storm inspections kept apart from scheduled installs and repairs, so a surge doesn't bury work you've already committed to.",
  },
  {
    Icon: IconBell,
    title: "Answers the insurance question",
    body: "Whether you work with claims, what you need photographed, what to expect from an adjuster — explained in your wording. It won't interpret a policy or promise what an insurer will cover.",
  },
];

const faqs = [
  {
    q: "Can it actually handle a storm morning?",
    a: "That's the case it's built for. Calls that arrive while another is still in progress get answered as well, rather than rolling to voicemail the way a single office line has to.",
  },
  {
    q: "Will it answer insurance questions?",
    a: "It explains your process — whether you work with claims, what you need photographed, what to expect from an adjuster — using your own wording. It won't interpret a policy or promise what an insurer will cover.",
  },
  {
    q: "Can it tell an active leak from storm damage?",
    a: "You define what counts as urgent for your company. Water coming through a ceiling gets triaged differently from missing shingles, and it asks before it books.",
  },
  {
    q: "Does it book free inspections?",
    a: "If that's how you work, yes. It books what you've told it to book, on the calendar you already run.",
  },
  {
    q: "What about the quiet months?",
    a: "You pay the same monthly retainer whether it takes four calls or four hundred. There's no per-call pricing to watch during a surge.",
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

/* Mirrors the hvac/plumbing/electrical breadcrumb shape. Position 2 points at
   the leaf URL because no /ai-receptionist index route exists — logged in
   PROGRESS.md as separate cleanup rather than fixed here. */
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
    { "@type": "ListItem", position: 2, name: "AI Receptionist", item: `${BASE}/ai-receptionist/roofing` },
    { "@type": "ListItem", position: 3, name: "Roofing", item: `${BASE}/ai-receptionist/roofing` },
  ],
};

export default function RoofingPage() {
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
        <span>Roofing</span>
      </nav>

      {/* ---------------------------------------------- hero */}
      <section className="v2-wrap" style={{ paddingBlock: "24px 90px" }}>
        <h1
          className="v2-display v2-in"
          style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.7rem, 5.8vw, 4.6rem)", maxWidth: "16ch" }}
        >
          The storm stops at 6am.{" "}
          <span className="v2-grad-text">The phone doesn&rsquo;t.</span>
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
          After a hailstorm every roof in the area calls the same morning, and
          one office line can only hold one of them. The rest go to voicemail,
          and most of those callers ring the next roofer instead. Genesis LP
          answers all of them, sorts the active leaks from the inspections, and
          books what&rsquo;s worth booking.
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
          What a missed call actually costs a roofing company
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
          Roofing demand doesn&rsquo;t trickle in — it arrives in a few hours
          after weather, then goes quiet. The crews are already on roofs and the
          office has one line. That&rsquo;s not a staffing failure; it&rsquo;s
          arithmetic.
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
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>It all lands at once</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              A single storm puts every damaged roof in the postcode on the
              phone the same morning. One line can hold one caller; the rest
              hear a recording.
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
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Then it goes quiet</p>
            <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-dim)" }}>
              The slow weeks between storms don&rsquo;t make up for the morning
              you couldn&rsquo;t pick up. The season is largely won in the hours
              right after the weather.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- the call timeline
          Given more air than its neighbours — it carries the page. */}
      <section className="v2-wrap" style={{ paddingBlock: "44px 124px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "20ch" }}>
          One storm morning, minute by minute
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
          From the wind dropping to a morning of booked inspections, without
          anyone in the office yet. Illustrative — an example morning, not a
          recording.
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
          Built for how roofing calls actually arrive
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
          One storm inspection a month covers it.{" "}
          <Link href="/pricing" className="v2-link">
            See full pricing
          </Link>
        </p>
      </section>

      {/* ---------------------------------------------- FAQ */}
      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
          Questions roofers ask
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
            Hear it take a storm-morning call.
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
            a roofing scenario you pick — a leak at 6am, an insurance
            inspection, whatever you get most of. If it doesn&rsquo;t sound
            like someone you&rsquo;d put on your phones, don&rsquo;t buy it.
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
