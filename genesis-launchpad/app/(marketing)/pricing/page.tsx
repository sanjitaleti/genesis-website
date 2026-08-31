import type { Metadata } from "next";
import Link from "next/link";
import { PricingStage } from "@/components/v2/PricingStage";
import { PricingGrid } from "@/components/v2/PricingGrid";
import { GalaxyLayer } from "@/components/v2/GalaxyLayer";
import { IconArrow } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "AI Receptionist Pricing - From $250/mo | Genesis LP" },
  description: "Fixed scope, fixed price, no long contracts. Genesis LP pricing for AI receptionists and automation.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;

  // Arriving from a locked dashboard means "I need to pick a plan right
  // now" — skip the scroll-driven story and show every plan at once.
  if (locked) {
    return (
      <div className="v2-content">
        <PricingGrid />
      </div>
    );
  }

  return (
    <div className="v2-content">
      <GalaxyLayer triggerId="pricing" />
      <PricingStage />

      <section className="v2-wrap" style={{ paddingBlock: "40px 60px" }}>
        <div
          className="v2-panel"
          style={{ padding: "clamp(38px, 6vw, 72px)", textAlign: "center" }}
        >
          <h2
            className="v2-display"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", margin: "0 auto", maxWidth: "22ch" }}
          >
            Not sure which plan fits{" "}
            <span className="v2-grad-text">your business?</span>
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
            Twenty minutes on the phone and we&rsquo;ll tell you honestly which
            one makes sense, or if none of them do yet.
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
