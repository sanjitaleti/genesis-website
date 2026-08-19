import type { Metadata } from "next";
import Link from "next/link";
import { PortalPreview } from "@/components/v2/PortalPreview";
import { IconArrow } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Portal · Genesis LP" },
  description: "The dashboard you get with your Genesis LP AI receptionist: every call, booking, and dollar it earned you.",
  alternates: { canonical: "/portal" },
};

export default function PortalPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 30px" }}>
        <h1
          className="v2-display v2-in"
          style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.6rem, 5.6vw, 4.4rem)", maxWidth: "18ch" }}
        >
          Your numbers, <span className="v2-grad-text">in one place.</span>
        </h1>
        <p
          className="v2-in"
          style={{
            ["--d" as string]: "0.25s",
            marginTop: 22,
            maxWidth: "50ch",
            fontSize: "1.08rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          Log in whenever you like. No spreadsheets, no reports to chase, just
          what happened on the phone, and what it earned you. This is a real
          preview of what clients see.
        </p>
      </section>

      <section className="v2-wrap" style={{ paddingBlock: "20px 100px" }}>
        <PortalPreview />
      </section>

      <section className="v2-wrap" style={{ paddingBlock: "20px 60px" }}>
        <div
          className="v2-panel"
          style={{ padding: "clamp(34px, 5vw, 60px)", textAlign: "center" }}
        >
          <h2 className="v2-display" style={{ fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", margin: "0 auto", maxWidth: "20ch" }}>
            This dashboard comes with every plan.
          </h2>
          <p style={{ margin: "16px auto 0", maxWidth: "44ch", fontSize: "1rem", lineHeight: 1.65, color: "var(--text-dim)" }}>
            No add-on, no separate login for reporting. See the plans, or talk to
            us about what your version would look like.
          </p>
          <div style={{ marginTop: 26, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <Link href="/pricing" className="v2-btn v2-btn--lg">
              See pricing
              <IconArrow style={{ width: 18, height: 18 }} />
            </Link>
            <Link href="/contact" className="v2-btn-ghost">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
