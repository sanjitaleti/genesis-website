import type { Metadata } from "next";
import Link from "next/link";
import { PricingGrid } from "@/components/v2/PricingGrid";
import { IconArrow } from "@/components/v2/icons";
import { tiers } from "@/lib/v2/pricing-tiers";

export const metadata: Metadata = {
  title: { absolute: "AI Receptionist Pricing - From $250/mo | Genesis LP" },
  description: "Fixed scope, fixed price, no long contracts. Genesis LP pricing for AI receptionists and automation.",
  alternates: { canonical: "/pricing" },
};

/**
 * Pricing — F3 tabular spec sheet, per design.md ("Services / Pricing:
 * ledger / spec-sheet — ruled rows, mono figures, tabular").
 *
 * Was a 380vh scroll-pinned stage with three gradient "sky" layers and
 * a galaxy field behind it. That is the atmospheric register design.md
 * bans outright, and it hid the actual numbers behind a scroll
 * performance. PricingStage / GalaxyLayer are left in the codebase,
 * just no longer mounted on this route.
 *
 * Every figure below comes from lib/v2/pricing-tiers.ts. The ●/— matrix
 * is derived from each tier's real perk list plus its stated
 * "Everything in <lower tier>" inheritance — nothing is invented.
 */

const YES = "●"; // ●
const NO = "—"; // —

/** [label, Lunar, Orbit, Nova] — figures and inclusions, in reading order. */
const rows: [string, string, string, string][] = [
  ["Setup, one-time", "$750", "$825", "Custom"],
  ["Monthly retainer", "$250", "$315", NO],
  ["First month", "50% off · $125", NO, NO],
  ["Phone answering, 24/7", YES, YES, YES],
  ["Your dashboard included", YES, YES, YES],
  ["Live in 2–6 weeks", YES, YES, YES],
  ["Text messaging", NO, YES, YES],
  ["We monitor and improve it", NO, YES, YES],
  ["Priority response", NO, YES, YES],
  ["Invoicing, reporting, onboarding", NO, NO, YES],
  ["Dedicated review calls", NO, NO, YES],
];

function Cell({ v }: { v: string }) {
  if (v === YES) return <span className="v2-spec-yes" aria-label="Included">{YES}</span>;
  if (v === NO) return <span className="v2-spec-no" aria-label="Not included">{NO}</span>;
  return <span className="v2-spec-figure">{v}</span>;
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;

  // Arriving from a locked dashboard means "I need to pick a plan right
  // now" — show every plan at once.
  if (locked) {
    return (
      <div className="v2-content">
        <PricingGrid />
      </div>
    );
  }

  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(96px, 14vh, 150px) 0" }}>
        <p className="v2-eyebrow" style={{ marginBottom: 22 }}>Pricing</p>
        <h1
          className="v2-display"
          style={{ fontSize: "var(--text-display)", maxWidth: "13ch", margin: 0 }}
        >
          Fixed scope. <span className="v2-grad-text">Fixed price.</span>
        </h1>
        <p
          style={{
            marginTop: 26,
            maxWidth: "56ch",
            fontSize: "1.0625rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          No long contracts. Every line below is what you actually pay and what
          you actually get.
        </p>
      </section>

      <section className="v2-wrap v2-sec--open">
        <div className="v2-spec-wrap">
          <table className="v2-spec">
            <caption className="v2-sr-only">
              Genesis LP plan comparison: Lunar, Orbit and Nova
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="v2-meta">Plan</span>
                </th>
                {tiers.map((t) => (
                  <th key={t.key} scope="col" className="v2-spec-plan">
                    {t.name}
                    <small>{t.featured ? "Most start here" : " "}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, a, b, c]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td><Cell v={a} /></td>
                  <td><Cell v={b} /></td>
                  <td><Cell v={c} /></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" />
                {tiers.map((t) => (
                  <td key={t.key}>
                    <Link href={`/get-started/${t.key}`} className="v2-link">
                      {t.cta} →
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="v2-meta" style={{ marginTop: 24, textTransform: "none", letterSpacing: "0.02em" }}>
          {tiers.find((t) => t.key === "nova")?.desc}
        </p>
      </section>

      <footer className="v2-wrap v2-foot">
        <p className="v2-foot-line">
          Not sure which plan fits <span className="v2-grad-text">your business?</span>
        </p>
        <p className="v2-sec-lede" style={{ marginTop: -8 }}>
          Twenty minutes on the phone and we&rsquo;ll tell you honestly which one
          makes sense, or if none of them do yet.
        </p>
        <div>
          <Link href="/contact" className="v2-btn v2-btn--lg">
            Book a free 20-minute call
            <IconArrow style={{ width: 17, height: 17 }} />
          </Link>
        </div>
        <div className="v2-foot-meta">
          <span>© {new Date().getFullYear()} Genesis LP</span>
          <span className="v2-foot-links">
            <Link href="/features">Features</Link>
            <Link href="/configurator">Build your agent</Link>
            <a href="mailto:hello@genesislp.ai">hello@genesislp.ai</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
