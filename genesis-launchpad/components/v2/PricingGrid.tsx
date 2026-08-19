import Link from "next/link";
import { IconCheck } from "./icons";
import { tiers } from "@/lib/v2/pricing-tiers";

/**
 * A static, all-at-once view of the three plans, no scroll-driven reveal.
 * Used when someone arrives here needing to pick a plan right now (e.g.
 * redirected off a locked dashboard) rather than browsing the marketing
 * site top to bottom.
 */
export function PricingGrid() {
  return (
    <section className="v2-wrap v2-pricing-grid" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px" }}>
      <h1 className="v2-display" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.8rem)", maxWidth: "22ch" }}>
        Choose a plan <span className="v2-grad-text">to unlock your dashboard.</span>
      </h1>

      <div className="v2-pricing-grid-cards">
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
    </section>
  );
}
