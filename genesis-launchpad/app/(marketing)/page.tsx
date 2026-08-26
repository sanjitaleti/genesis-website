import Link from "next/link";
import { PortalPreview } from "@/components/v2/PortalPreview";
import {
  IconArrow,
  IconClock,
  IconShield,
  IconChart,
} from "@/components/v2/icons";

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
    title: "Books the job for you",
    body: "The appointment lands in your calendar before the call ends.",
    art: <IconClock className="v2-fact-icon" />,
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
    body: "The call, the booking, the outcome: logged and waiting for you, no chasing required.",
  },
];

const tierTeasers = [
  { name: "Lunar", price: "$750", unit: "setup · $250/mo", color: "#4cc9f0" },
  { name: "Orbit", price: "$825", unit: "setup · $315/mo", color: "#ff8a00" },
  { name: "Nova", price: "Custom", unit: "add on when ready", color: "#c77dff" },
];

const dashboardSpecs = [
  {
    Icon: IconChart,
    title: "Every call, logged automatically",
    body: "No manual entry. Each call lands in the dashboard the moment it ends, with the outcome already tagged.",
  },
  {
    Icon: IconClock,
    title: "Live, not end-of-day",
    body: "Bookings and revenue update in real time, so what you see is what actually happened today.",
  },
];

export default function V2Landing() {
  return (
    <>
      <div className="v2-content">
        {/* ---------------------------------------------- hero */}
        <section className="v2-wrap" style={{ paddingBlock: "clamp(120px, 16vh, 168px) 60px", textAlign: "center" }}>
          <div className="v2-in" style={{ ["--d" as string]: "0.05s", display: "flex", justifyContent: "center" }}>
            <span className="v2-eyebrow">
              <IconShield style={{ width: 14, height: 14 }} />
              AI Receptionist
            </span>
          </div>

          <h1
            className="v2-display v2-in"
            style={{
              ["--d" as string]: "0.1s",
              fontSize: "clamp(2.9rem, 7.2vw, 5.6rem)",
              maxWidth: "16ch",
              margin: "22px auto 0",
            }}
          >
            Never miss{" "}
            <span className="v2-grad-text">another call.</span>
          </h1>

          <p
            className="v2-in"
            style={{
              ["--d" as string]: "0.3s",
              maxWidth: "44ch",
              margin: "24px auto 0",
              fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)",
              lineHeight: 1.6,
              color: "var(--text-dim)",
            }}
          >
            We build you an AI receptionist that answers every call day or night,
            books the job straight into your calendar, and shows you exactly what
            it did, in one dashboard you can actually read.
          </p>

          <div
            className="v2-in"
            style={{
              ["--d" as string]: "0.42s",
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 34,
              justifyContent: "center",
            }}
          >
            <Link href="/contact" className="v2-btn v2-btn--lg">
              Book a free 20-minute call
              <IconArrow style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="/features" className="v2-btn-ghost">
              See how it works
            </Link>
          </div>

          <p
            className="v2-in"
            style={{
              ["--d" as string]: "0.55s",
              marginTop: 22,
              fontSize: 14,
              color: "var(--text-faint)",
            }}
          >
            Built for{" "}
            <Link href="/ai-receptionist/hvac" className="v2-link" style={{ fontSize: "inherit" }}>
              trades
            </Link>
            , clinics, salons, and firms of 5–75 people.
          </p>
        </section>

        {/* ---------------------------------------------- dashboard showcase */}
        <section className="v2-wrap" style={{ paddingBlock: "0 100px" }}>
          <PortalPreview />

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {dashboardSpecs.map((s) => (
              <div key={s.title} className="v2-panel" style={{ padding: "22px 24px", display: "flex", gap: 14 }}>
                <s.Icon style={{ width: 20, height: 20, color: "var(--text)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{s.title}</h3>
                  <p style={{ margin: "6px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--text-dim)" }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------- how it works */}
        <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
          <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
            How a call actually moves through it.
          </h2>

          <div
            style={{
              marginTop: 36,
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

        {/* ---------------------------------------------- features teaser */}
        <section id="what" className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
            <h2
              className="v2-display"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", maxWidth: "16ch" }}
            >
              What it does, in plain English.
            </h2>
            <Link href="/features" className="v2-btn-ghost">
              See everything it does
              <IconArrow style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          <div className="v2-bento" style={{ marginTop: 42 }}>
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

        {/* ---------------------------------------------- portal teaser */}
        <section id="portal" className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
          <div
            className="v2-panel"
            style={{
              padding: "clamp(34px, 5vw, 60px)",
              display: "grid",
              gap: 24,
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
            }}
          >
            <div style={{ maxWidth: "38ch" }}>
              <h2 className="v2-display" style={{ fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)" }}>
                Your numbers, <span className="v2-grad-text">in one place.</span>
              </h2>
              <p
                style={{
                  marginTop: 14,
                  fontSize: "1rem",
                  lineHeight: 1.65,
                  color: "var(--text-dim)",
                }}
              >
                Log in whenever you like and see every call, booking, and dollar
                it earned you, no spreadsheets, no reports to chase.
              </p>
            </div>
            <Link href="/portal" className="v2-btn v2-btn--lg">
              Peek inside the dashboard
              <IconArrow style={{ width: 18, height: 18 }} />
            </Link>
          </div>
        </section>

        {/* ---------------------------------------------- pricing teaser */}
        <section id="tiers-teaser" className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
            <h2 className="v2-display" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", maxWidth: "16ch" }}>
              Straightforward pricing.
            </h2>
            <Link href="/pricing" className="v2-btn-ghost">
              See full pricing
              <IconArrow style={{ width: 16, height: 16 }} />
            </Link>
          </div>

          <div
            style={{
              marginTop: 36,
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {tierTeasers.map((t) => (
              <Link
                key={t.name}
                href="/pricing"
                className="v2-panel"
                style={{ padding: "26px 24px", textDecoration: "none", color: "inherit" }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: t.color,
                    boxShadow: `0 0 12px ${t.color}`,
                  }}
                />
                <h3 style={{ margin: "12px 0 0", fontSize: 18, fontWeight: 600 }}>{t.name}</h3>
                <p style={{ margin: "8px 0 0", fontSize: 22, fontWeight: 600 }}>
                  {t.price}{" "}
                  <small style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-faint)" }}>
                    {t.unit}
                  </small>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------- close */}
        <section className="v2-wrap" style={{ paddingBlock: "40px 60px" }}>
          <div
            className="v2-panel"
            style={{
              padding: "clamp(38px, 6vw, 72px)",
              textAlign: "center",
            }}
          >
            <h2
              className="v2-display"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: "0 auto", maxWidth: "20ch" }}
            >
              How many calls did you miss{" "}
              <span className="v2-grad-text">this week?</span>
            </h2>
            <p
              style={{
                margin: "18px auto 0",
                maxWidth: "46ch",
                fontSize: "1.02rem",
                lineHeight: 1.65,
                color: "var(--text-dim)",
              }}
            >
              Twenty minutes on the phone and we&rsquo;ll tell you honestly whether
              this is worth doing for your business.
            </p>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "center",
              }}
            >
              <Link href="/contact" className="v2-btn v2-btn--lg">
                Book a free 20-minute call
                <IconArrow style={{ width: 18, height: 18 }} />
              </Link>
              <Link href="/configurator" className="v2-btn-ghost">
                Build your agent first
              </Link>
            </div>
          </div>

          <footer
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 14,
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 44,
              paddingBottom: 130,
              fontSize: 13.5,
              color: "var(--text-faint)",
            }}
          >
            <span style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <span>© {new Date().getFullYear()} Genesis LP</span>
              <span style={{ opacity: 0.6 }}>Voices powered by ElevenLabs</span>
            </span>
            <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
              <a href="mailto:hello@genesislp.ai" className="v2-link">
                hello@genesislp.ai
              </a>
              <Link href="/privacy" className="v2-link">
                Privacy
              </Link>
              <Link href="/terms" className="v2-link">
                Terms
              </Link>
              <Link href="/sign-in" className="v2-link">
                Client sign in
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}
