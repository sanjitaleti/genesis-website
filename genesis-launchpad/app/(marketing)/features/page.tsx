import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "What the AI Receptionist Handles | Genesis LP" },
  description: "Everything your Genesis LP AI receptionist handles, in plain English.",
  alternates: { canonical: "/features" },
};

/**
 * Features — F3 tabular spec sheet, inside the design.md system.
 *
 * Was a six-card asymmetric bento with a decorative icon per card (a
 * spinning conic ring, an animated waveform, three glyphs). The icons
 * carried no information the heading didn't already carry, so they are
 * gone; the content reads down as a ledger instead. Copy unchanged.
 */

const facts = [
  {
    n: "24/7",
    title: "Always answering",
    body: "Nights, weekends, holidays. Your phone never goes to voicemail again.",
  },
  {
    n: "01",
    title: "Sounds like your business",
    body: "Trained on how you actually talk to your customers, not a robot script.",
  },
  {
    n: "02",
    title: "Picks up on the first ring",
    body: "No hold music, no phone tree, no waiting.",
  },
  {
    n: "03",
    title: "Books the job for you",
    body: "The appointment lands in your calendar before the call ends.",
  },
  {
    n: "04",
    title: "You see everything it did",
    body: "Every call, every booking, every job it saved you. All in one place.",
  },
  {
    n: "05",
    title: "Handles the messy calls too",
    body: "Reschedules, cancellations, “is anyone open right now”: it stays calm and gets it done.",
  },
];

const stages = [
  {
    n: "1.0",
    k: "ANSWER",
    title: "A call comes in",
    body: "Your existing number, no new hardware. The AI picks up before the second ring.",
  },
  {
    n: "2.0",
    k: "HANDLE",
    title: "It has the conversation",
    body: "Answers questions, checks availability, and books the job the way your team would.",
  },
  {
    n: "3.0",
    k: "REPORT",
    title: "It shows up in your dashboard",
    body: "The call, the booking, the outcome: logged and waiting for you, no chasing required.",
  },
];

const terms = [
  "No setup fees to talk to us",
  "Live in 2–6 weeks",
  "You keep your existing number",
];

export default function FeaturesPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(96px, 14vh, 150px) 0" }}>
        <p className="v2-eyebrow" style={{ marginBottom: 22 }}>Features</p>
        <h1
          className="v2-display"
          style={{ fontSize: "var(--text-display)", maxWidth: "15ch", margin: 0 }}
        >
          Everything we <span className="v2-grad-text">handle for you.</span>
        </h1>
        <p
          style={{
            marginTop: 26,
            maxWidth: "58ch",
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          One AI receptionist, built around how your business actually runs, not
          a script you have to work around.
        </p>
      </section>

      <section className="v2-wrap v2-sec--open">
        <div className="v2-sec-head">
          <span className="v2-meta">The ledger</span>
          <h2>What it handles.</h2>
        </div>

        <div className="v2-bento">
          {facts.map((f) => (
            <article key={f.title} className="v2-fact">
              <span className="v2-fact-n">{f.n}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-wrap v2-sec">
        <div className="v2-sec-head">
          <span className="v2-meta">The process</span>
          <h2>How a call actually moves through it.</h2>
        </div>

        <div className="v2-stages">
          {stages.map((s) => (
            <article key={s.n} className="v2-stage-row">
              <span className="v2-stage-n">
                {s.n} · {s.k}
              </span>
              <h3 className="v2-stage-h">{s.title}</h3>
              <p className="v2-stage-b">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="v2-wrap v2-foot">
        <p className="v2-foot-line">See it against your own numbers.</p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 28px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--text-dim)",
          }}
        >
          {terms.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div>
          <Link href="/contact" className="v2-btn v2-btn--lg">
            Book a free 20-minute call
            <IconArrow style={{ width: 17, height: 17 }} />
          </Link>
        </div>
        <div className="v2-foot-meta">
          <span>© {new Date().getFullYear()} Genesis LP</span>
          <span className="v2-foot-links">
            <Link href="/pricing">Pricing</Link>
            <Link href="/configurator">Build your agent</Link>
            <a href="mailto:hello@genesislp.ai">hello@genesislp.ai</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
