import Link from "next/link";
import { PortalPreview } from "@/components/v2/PortalPreview";
import { IconArrow } from "@/components/v2/icons";

/**
 * Home — macrostructure 14 · Narrative Workflow.
 *
 * A call arriving, being handled, being booked, and landing in the
 * dashboard is a genuine four-stage sequence, which is what this shape
 * requires (it is the wrong shape for a product that works in one
 * moment). The stages ARE the page; everything else supports them.
 *
 * Copy, prices and figures are unchanged — this is a structural and
 * visual redesign, not a rewrite.
 */

/* The process, in the order it actually happens. */
const stages = [
  {
    n: "1.0",
    k: "ANSWER",
    title: "A call comes in",
    body:
      "Your existing number, no new hardware. The AI picks up before the second ring.",
  },
  {
    n: "2.0",
    k: "HANDLE",
    title: "It has the conversation",
    body:
      "Answers questions, checks availability, and books the job the way your team would.",
  },
  {
    n: "3.0",
    k: "BOOK",
    title: "The job lands in your calendar",
    body: "The appointment lands in your calendar before the call ends.",
  },
  {
    n: "4.0",
    k: "REPORT",
    title: "It shows up in your dashboard",
    body:
      "The call, the booking, the outcome: logged and waiting for you, no chasing required.",
  },
];

/* What it handles — a ledger, read down, not a grid of cards. */
const handles = [
  {
    title: "Always answering",
    body: "Nights, weekends, holidays. Your phone never goes to voicemail again.",
    note: "24/7",
  },
  {
    title: "Sounds like your business",
    body: "Trained on how you actually talk to your customers, not a robot script.",
    note: null,
  },
  {
    title: "Books the job for you",
    body: "The appointment lands in your calendar before the call ends.",
    note: null,
  },
];

/* What the dashboard is. Was four icon-over-heading cards; now ruled rows. */
const dashboardSpecs = [
  { title: "Live", body: "Bookings and revenue update in real time, not end of day." },
  { title: "Logged", body: "Every call lands here automatically, outcome already tagged." },
  { title: "Yours", body: "Your data, your dashboard — nobody else's numbers mixed in." },
  { title: "Honest", body: "What it shows you is what actually happened on the call." },
];

const tiers = [
  { name: "Lunar", price: "$750", unit: "setup", retainer: "$250 / mo" },
  { name: "Orbit", price: "$825", unit: "setup", retainer: "$315 / mo" },
  { name: "Nova", price: "Custom", unit: "add on when ready", retainer: null },
];

export default function V2Landing() {
  return (
    <div className="v2-content">
      {/* ------------------------------------------------ hero
          Left-biased and content-height. The previous hero was the
          centred full-viewport shape with a radial bloom behind it —
          both named tells. */}
      <section className="v2-wrap" style={{ paddingBlock: "clamp(96px, 14vh, 150px) 0" }}>
        <p className="v2-eyebrow" style={{ marginBottom: 22 }}>
          <span className="v2-live-dot" />
          AI receptionist
        </p>

        <h1
          className="v2-display"
          style={{ fontSize: "var(--text-display)", maxWidth: "14ch", margin: 0 }}
        >
          Never miss <span className="v2-grad-text">another call.</span>
        </h1>

        <p
          style={{
            maxWidth: "58ch",
            margin: "26px 0 0",
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          We build you an AI receptionist that answers every call day or night,
          books the job straight into your calendar, and shows you exactly what
          it did, in one dashboard you can actually read.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 20,
            marginTop: 34,
          }}
        >
          <Link href="/configurator" className="v2-btn v2-btn--lg">
            Build your own agent
            <IconArrow style={{ width: 17, height: 17 }} />
          </Link>
          {/* secondary is a text link, not a second filled button */}
          <Link href="/contact" className="v2-link">
            Or book a free 20-minute call
          </Link>
        </div>

        <p className="v2-meta" style={{ marginTop: 40, textTransform: "none", letterSpacing: "0.02em" }}>
          Built for{" "}
          <Link href="/ai-receptionist/hvac" className="v2-link" style={{ fontSize: "inherit" }}>
            trades
          </Link>
          , clinics, salons, and firms of 5–75 people.
        </p>
      </section>

      {/* ------------------------------------------------ the process */}
      <section className="v2-wrap v2-sec--open">
        <div className="v2-sec-head">
          <span className="v2-meta">The process</span>
          <h2>What happens when your phone rings.</h2>
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

      {/* ------------------------------------------------ the artifact */}
      <section id="portal" className="v2-wrap v2-sec">
        <div className="v2-sec-head">
          <span className="v2-meta">Stage 4.0 · the dashboard</span>
          <h2>Built for how service businesses actually run.</h2>
          <p className="v2-sec-lede">
            Every call, booking, and dollar it earned you — logged the moment it
            happens, not reconstructed at the end of the day.
          </p>
        </div>

        <PortalPreview />

        <div className="v2-bento" style={{ marginTop: 40 }}>
          {dashboardSpecs.map((s, i) => (
            <div key={s.title} className="v2-fact">
              <span className="v2-fact-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ what it handles */}
      <section id="what" className="v2-wrap v2-sec">
        <div className="v2-sec-head">
          <span className="v2-meta">What it does</span>
          <h2>In plain English.</h2>
        </div>

        <div className="v2-bento">
          {handles.map((f, i) => (
            <div key={f.title} className="v2-fact">
              <span className="v2-fact-n">
                {f.note ?? String(i + 1).padStart(2, "0")}
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 28 }}>
          <Link href="/features" className="v2-link">
            Everything it handles →
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------ pricing ledger */}
      <section id="tiers-teaser" className="v2-wrap v2-sec">
        <div className="v2-sec-head">
          <span className="v2-meta">Pricing</span>
          <h2>Straightforward pricing.</h2>
        </div>

        <div className="v2-bento">
          {tiers.map((t) => (
            <Link
              key={t.name}
              href="/pricing"
              className="v2-fact"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="v2-fact-n">{t.name}</span>
              <h3 style={{ fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 16 }}>
                {t.price}{" "}
                <span style={{ color: "var(--text-faint)", fontSize: 13 }}>{t.unit}</span>
              </h3>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13.5 }}>
                {t.retainer ?? "—"}
              </p>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: 28 }}>
          <Link href="/pricing" className="v2-link">
            Full pricing →
          </Link>
        </p>
      </section>

      {/* ------------------------------------------------ Ft5 · statement close */}
      <footer className="v2-wrap v2-foot">
        <p className="v2-foot-line">
          How many calls did you miss <span className="v2-grad-text">this week?</span>
        </p>
        <p className="v2-sec-lede" style={{ marginTop: -8 }}>
          Twenty minutes on the phone and we&rsquo;ll tell you honestly whether
          this is worth doing for your business.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
          <Link href="/contact" className="v2-btn v2-btn--lg">
            Book a free 20-minute call
            <IconArrow style={{ width: 17, height: 17 }} />
          </Link>
        </div>

        <div className="v2-foot-meta">
          <span>© {new Date().getFullYear()} Genesis LP · Voices powered by ElevenLabs</span>
          <span className="v2-foot-links">
            <a href="mailto:hello@genesislp.ai">hello@genesislp.ai</a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/sign-in">Client sign in</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}
