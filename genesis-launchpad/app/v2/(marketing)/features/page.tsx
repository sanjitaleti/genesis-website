import type { Metadata } from "next";
import Link from "next/link";
import { IconArrow, IconShield, IconClock, IconChart, IconCheck } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Features — Genesis LP" },
  description: "Everything your Genesis LP AI receptionist handles, in plain English.",
};

const facts = [
  {
    title: "Always answering",
    body: "Nights, weekends, holidays. Your phone never goes to voicemail again.",
    art: (
      <div className="v2-ring">
        <span>24/7</span>
      </div>
    ),
  },
  {
    title: "Sounds like your business",
    body: "Trained on how you actually talk to your customers, not a robot script.",
    art: <IconShield className="v2-fact-icon" />,
  },
  {
    title: "Picks up on the first ring",
    body: "No hold music, no phone tree, no waiting.",
    art: (
      <div className="v2-wave" aria-hidden>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <i key={i} style={{ animationDelay: `${i * 0.09}s` }} />
        ))}
      </div>
    ),
  },
  {
    title: "Books the job for you",
    body: "The appointment lands in your calendar before the call ends.",
    art: <IconClock className="v2-fact-icon" />,
  },
  {
    title: "You see everything it did",
    body: "Every call, every booking, every job it saved you. All in one place.",
    art: <IconChart className="v2-fact-icon" />,
  },
  {
    title: "Handles the messy calls too",
    body: "Reschedules, cancellations, \"is anyone open right now\" — it stays calm and gets it done.",
    art: <IconShield className="v2-fact-icon" />,
  },
];

const steps = [
  {
    n: "01",
    title: "A call comes in",
    body: "Your existing number, no new hardware. The AI picks up before the second ring.",
  },
  {
    n: "02",
    title: "It has the conversation",
    body: "Answers questions, checks availability, and books the job the way your team would.",
  },
  {
    n: "03",
    title: "It shows up in your dashboard",
    body: "The call, the booking, the outcome — logged and waiting for you, no chasing required.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 30px" }}>
        <h1
          className="v2-display v2-in"
          style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.6rem, 5.6vw, 4.4rem)", maxWidth: "16ch" }}
        >
          Everything it <span className="v2-grad-text">handles for you.</span>
        </h1>
        <p
          className="v2-in"
          style={{
            ["--d" as string]: "0.25s",
            marginTop: 22,
            maxWidth: "48ch",
            fontSize: "1.08rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          One AI receptionist, built around how your business actually runs — not
          a script you have to work around.
        </p>
      </section>

      <section className="v2-wrap" style={{ paddingBlock: "40px 100px" }}>
        <div className="v2-bento">
          {facts.map((f) => (
            <article key={f.title} className="v2-panel v2-fact">
              <div>{f.art}</div>
              <div>
                <h3>{f.title}</h3>
                <p style={{ marginTop: 7 }}>{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
          How a call actually moves through it.
        </h2>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {steps.map((s) => (
            <div key={s.n} className="v2-panel" style={{ padding: "28px 26px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 13,
                  letterSpacing: "0.08em",
                  color: "var(--text-faint)",
                }}
              >
                {s.n}
              </span>
              <h3 style={{ margin: "14px 0 0", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <p style={{ margin: "9px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-dim)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="v2-wrap" style={{ paddingBlock: "20px 60px" }}>
        <div
          className="v2-panel"
          style={{ padding: "clamp(34px, 5vw, 60px)", display: "grid", gap: 24, gridTemplateColumns: "1fr auto", alignItems: "center" }}
        >
          <div>
            <h2 className="v2-display" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
              See it against your own numbers.
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
              {["No setup fees to talk to us", "Live in 2–6 weeks", "You keep your existing number"].map((t) => (
                <li key={t} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14.5, color: "var(--text-dim)" }}>
                  <IconCheck style={{ width: 16, height: 16, color: "var(--blush)", flexShrink: 0 }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/v2/contact" className="v2-btn v2-btn--lg">
            Book a free 20-minute call
            <IconArrow style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>
    </div>
  );
}
