import Link from "next/link";

export default function NotFound() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(140px, 22vh, 220px) 120px", textAlign: "center" }}>
        <p className="v2-eyebrow" style={{ display: "inline-flex", marginBottom: 18 }}>
          Error 404
        </p>
        <h1 className="v2-display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", maxWidth: "20ch", margin: "0 auto" }}>
          This page never shipped.
        </h1>
        <p
          style={{
            margin: "16px auto 0",
            maxWidth: "44ch",
            fontSize: "1.02rem",
            lineHeight: 1.65,
            color: "var(--text-dim)",
          }}
        >
          The page you&rsquo;re after doesn&rsquo;t exist, or hasn&rsquo;t been built yet.
        </p>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "center" }}>
          <Link href="/" className="v2-btn v2-btn--lg">
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
