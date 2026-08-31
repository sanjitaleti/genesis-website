/**
 * The example client dashboard shown on the marketing site.
 *
 * The charts come from the same module the real portal uses, so what a visitor
 * sees here is literally what a client logs into. Static SVG on purpose: it
 * reads as a dense ops screen but costs one paint and no JS.
 *
 * Numbers are illustrative and labelled as such on the page.
 */

import { Sparkline, VolumeChart, RadarChart } from "./charts";
import {
  tilesByRange,
  volumeByRange,
  radarAxes,
  radarNow,
  radarPrev,
  funnel,
} from "@/lib/v2/data";

const tiles = tilesByRange["30d"];
const vol = volumeByRange["30d"];

const recent = [
  { t: "7:12a", from: "New estimate request", tag: "Booked", tone: "book" },
  { t: "6:38a", from: "Pricing question", tag: "Quoted", tone: "quote" },
  { t: "8:47p", from: "Job scheduled", tag: "Booked", tone: "book" },
  { t: "7:31p", from: "Reschedule request", tag: "Handled", tone: "handled" },
  { t: "6:58p", from: "New customer", tag: "Booked", tone: "book" },
];

export function PortalPreview() {
  return (
    <div className="v2-panel v2-portal">
      {/* top bar */}
      <div className="v2-portal-bar">
        <div className="v2-portal-id">
          <span className="v2-live-dot" />
          <strong>Example Co.</strong>
          <span className="v2-portal-range">last 30 days</span>
        </div>
        <div className="v2-portal-chips">
          <span className="v2-chip v2-chip--on">30d</span>
          <span className="v2-chip">7d</span>
          <span className="v2-chip">24h</span>
          <span className="v2-portal-note">Example view. Your real numbers appear here</span>
        </div>
      </div>

      {/* stat row */}
      <div className="v2-portal-stats">
        {tiles.map((t) => (
          <div key={t.label} className="v2-stat">
            <span className="v2-stat-label">{t.label}</span>
            <span className="v2-stat-value">{t.value}</span>
            <span className="v2-stat-row">
              <span className="v2-stat-delta" style={{ color: t.tone }}>
                {t.delta}
              </span>
              <Sparkline points={t.pts} tone={t.tone} />
            </span>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="v2-portal-main">
        <section className="v2-tile v2-tile--wide">
          <header className="v2-tile-head">
            <div>
              <h4>Call volume</h4>
              <p>Answered vs. booked, by week</p>
            </div>
            <div className="v2-legend">
              <span><i style={{ background: "#f72585" }} />Answered</span>
              <span><i style={{ background: "#7b2cbf" }} />Booked</span>
            </div>
          </header>
          <VolumeChart a={vol.a} b={vol.b} labels={vol.labels} id="previewVol" />
        </section>

        <section className="v2-tile">
          <header className="v2-tile-head">
            <div>
              <h4>Performance</h4>
              <p>This month vs. last</p>
            </div>
          </header>
          <RadarChart axes={radarAxes} now={radarNow} prev={radarPrev} />
        </section>
      </div>

      {/* funnel + recent */}
      <div className="v2-portal-lower">
        <section className="v2-tile">
          <header className="v2-tile-head">
            <div>
              <h4>Call to booking</h4>
              <p>Where the drop-off happens</p>
            </div>
          </header>
          <div className="v2-funnel">
            {funnel.map((f) => (
              <div key={f.label} className="v2-funnel-row">
                <div className="v2-funnel-meta">
                  <span>{f.label}</span>
                  <span className="v2-funnel-n">
                    {f.n} <em>{f.pct}%</em>
                  </span>
                </div>
                <div className="v2-funnel-track">
                  <div
                    className="v2-funnel-fill"
                    style={{ width: `${f.pct}%`, background: f.tone }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="v2-tile">
          <header className="v2-tile-head">
            <div>
              <h4>Outside-hours calls</h4>
              <p>While you were closed</p>
            </div>
          </header>
          <ul className="v2-calls">
            {recent.map((r) => (
              <li key={r.t}>
                <span className="v2-call-t">{r.t}</span>
                <span className="v2-call-from">{r.from}</span>
                <span className={`v2-call-tag v2-call-tag--${r.tone}`}>{r.tag}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
