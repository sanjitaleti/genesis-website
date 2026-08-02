import Link from "next/link";
import Image from "next/image";
import { GalaxyLayer } from "@/components/v2/GalaxyLayer";
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

const testimonials = [
  {
    name: "Dana Morales",
    handle: "Morales Plumbing & Heating",
    photo: "/testimonials/dana-morales.jpg",
    quote:
      "We used to lose two or three jobs a week to voicemail. Now every call gets answered, and I know exactly what got booked.",
  },
  {
    name: "Priya Anand",
    handle: "Brightside Family Dental",
    photo: "/testimonials/priya-anand.jpg",
    quote:
      "Patients used to call after hours and just hang up. Now they get an answer and a next-day slot before we even open.",
  },
  {
    name: "Marcus Webb",
    handle: "The Fade Room",
    photo: "/testimonials/marcus-webb.jpg",
    quote:
      "It sounds like one of my own staff answering, not a machine. Clients honestly can't tell the difference.",
  },
];

const tierTeasers = [
  { name: "Lunar", price: "$750", unit: "setup · $250/mo", color: "#4cc9f0" },
  { name: "Orbit", price: "$825", unit: "setup · $315/mo", color: "#ff8a00" },
  { name: "Nova", price: "Custom", unit: "add on when ready", color: "#c77dff" },
];

export default function V2Landing() {
  return (
    <>
      <GalaxyLayer triggerId="tiers-teaser" />

      <div className="v2-content">
        {/* ---------------------------------------------- hero */}
        <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 168px) 90px" }}>
          <div>
            <h1
              className="v2-display v2-in"
              style={{
                ["--d" as string]: "0.1s",
                fontSize: "clamp(2.9rem, 7.2vw, 5.6rem)",
                maxWidth: "12ch",
              }}
            >
              Never miss{" "}
              <span className="v2-grad-text">another call.</span>
            </h1>
          </div>

          <p
            className="v2-in"
            style={{
              ["--d" as string]: "0.3s",
              maxWidth: "44ch",
              marginTop: 30,
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
              marginTop: 38,
            }}
          >
            <Link href="/v2/contact" className="v2-btn v2-btn--lg">
              Book a free 20-minute call
              <IconArrow style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="/v2/features" className="v2-btn-ghost">
              See how it works
            </Link>
          </div>

          <p
            className="v2-in"
            style={{
              ["--d" as string]: "0.55s",
              marginTop: 34,
              fontSize: 14,
              color: "var(--text-faint)",
            }}
          >
            Built for trades, clinics, salons, and firms of 5–75 people.
          </p>
        </section>

        {/* ---------------------------------------------- testimonials */}
        <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
          <h2 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "18ch" }}>
            Businesses like yours, already running on it.
          </h2>

          <div className="v2-testi-grid" style={{ marginTop: 36 }}>
            {testimonials.map((t) => (
              <article key={t.name} className="v2-panel v2-testi-card">
                <div className="v2-testi-head">
                  <div className="v2-testi-av">
                    <Image src={t.photo} alt={t.name} width={40} height={40} />
                  </div>
                  <div>
                    <p className="v2-testi-name">{t.name}</p>
                    <p className="v2-testi-handle">{t.handle}</p>
                  </div>
                </div>
                <p className="v2-testi-body">&ldquo;{t.quote}&rdquo;</p>
              </article>
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
            <Link href="/v2/features" className="v2-btn-ghost">
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
            <Link href="/v2/portal" className="v2-btn v2-btn--lg">
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
            <Link href="/v2/pricing" className="v2-btn-ghost">
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
                href="/v2/pricing"
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
            <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
              <Link href="/v2/contact" className="v2-btn v2-btn--lg">
                Book a free 20-minute call
                <IconArrow style={{ width: 18, height: 18 }} />
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
            <span>© {new Date().getFullYear()} Genesis LP</span>
            <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
              <a href="mailto:meridiansocial01@gmail.com" className="v2-link">
                meridiansocial01@gmail.com
              </a>
              <Link href="/v2/sign-in" className="v2-link">
                Client sign in
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}
