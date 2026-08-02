"use client";

import { useMemo, useRef, useState } from "react";
import { Sparkline, VolumeChart, RadarChart, DonutChart, ColumnChart } from "../charts";
import { IconSearch } from "../icons";
import {
  radarAxes,
  radarNow,
  radarPrev,
  hourLabels,
  business as businessInfo,
  type Range,
  type CallStatus,
} from "@/lib/v2/data";
import { usePortalData, usePortalBundle, useTheme } from "./PortalData";
import { ThemeSwatches } from "../ThemeSwatches";
import type { Accent, Mode } from "@/lib/v2/theme";

/* ================================================================ overview */

export function OverviewView({ range }: { range: Range }) {
  const { tiles, volume: vol, funnel, resolution, hourly, activity } = usePortalData();
  const rangeLabel = range === "24h" ? "yesterday" : range === "7d" ? "last week" : "last month";

  return (
    <div className="v2-dash-stack">
      <div className="v2-dash-kpis">
        {tiles.map((t) => (
          <article key={t.label} className="v2-dash-card v2-kpi">
            <span className="v2-kpi-label">{t.label}</span>
            <span className="v2-kpi-value">{t.value}</span>
            <span className="v2-kpi-foot">
              <span className="v2-kpi-delta" style={{ color: t.tone }}>
                {t.delta}
              </span>
              <Sparkline points={t.pts} tone={t.tone} />
            </span>
            <span className="v2-kpi-hint">{t.hint}</span>
          </article>
        ))}
      </div>

      <div className="v2-dash-row v2-dash-row--split">
        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>Call volume</h4>
              <p>Answered vs. booked</p>
            </div>
            <div className="v2-legend">
              <span><i style={{ background: "#f72585" }} />Answered</span>
              <span><i style={{ background: "#7b2cbf" }} />Booked</span>
            </div>
          </header>
          <VolumeChart a={vol.a} b={vol.b} labels={vol.labels} id="dashVol" height={210} />
        </section>

        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>Performance</h4>
              <p>This month vs. {rangeLabel}</p>
            </div>
          </header>
          <RadarChart axes={radarAxes} now={radarNow} prev={radarPrev} size={230} />
        </section>
      </div>

      <div className="v2-dash-row v2-dash-row--thirds">
        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
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
                  <div className="v2-funnel-fill" style={{ width: `${f.pct}%`, background: f.tone }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>How calls resolved</h4>
              <p>Every call, accounted for</p>
            </div>
          </header>
          <DonutChart slices={resolution} size={172} />
          <ul className="v2-donut-key">
            {resolution.map((s) => (
              <li key={s.label}>
                <i style={{ background: s.tone }} />
                {s.label}
                <em>{s.value}</em>
              </li>
            ))}
          </ul>
        </section>

        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>Live activity</h4>
              <p>What it did recently</p>
            </div>
            <span className="v2-live-dot" aria-hidden />
          </header>
          <ul className="v2-feed">
            {activity.map((a, i) => (
              <li key={i}>
                <span className={`v2-feed-dot v2-feed-dot--${a.tone}`} aria-hidden />
                <span className="v2-feed-body">
                  <strong>{a.text}</strong>
                  <span>{a.t}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="v2-dash-card">
        <header className="v2-dash-card-head">
          <div>
            <h4>Busiest hours</h4>
            <p>When your phone actually rings</p>
          </div>
          <span className="v2-dash-note">Peak at 1pm — 74 calls</span>
        </header>
        <ColumnChart values={hourly} labels={hourLabels} />
      </section>
    </div>
  );
}

/* =================================================================== calls */

const STATUSES: (CallStatus | "All")[] = ["All", "Booked", "Quoted", "Handled", "Passed on"];

const toneFor = (s: CallStatus) =>
  s === "Booked" ? "book" : s === "Quoted" ? "quote" : s === "Handled" ? "handled" : "passed";

export function CallsView() {
  const { allCalls: calls } = usePortalData();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<CallStatus | "All">("All");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return calls.filter((c) => {
      if (status !== "All" && c.status !== status) return false;
      if (!needle) return true;
      return (
        c.caller.toLowerCase().includes(needle) ||
        c.reason.toLowerCase().includes(needle) ||
        c.phone.includes(needle)
      );
    });
  }, [calls, q, status]);

  return (
    <div className="v2-dash-stack">
      <section className="v2-dash-card">
        <header className="v2-dash-card-head v2-dash-card-head--tools">
          <div>
            <h4>Call log</h4>
            <p>
              {rows.length} of {calls.length} calls
            </p>
          </div>
          <div className="v2-dash-tools">
            <div className="v2-dash-search">
              <IconSearch />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search caller, number, or reason"
                aria-label="Search calls"
              />
            </div>
            <div className="v2-seg" role="group" aria-label="Filter by outcome">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  data-on={status === s}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        {rows.length === 0 ? (
          <p className="v2-dash-empty">No calls match that. Try a different search.</p>
        ) : (
          <div className="v2-table-wrap">
            <table className="v2-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Caller</th>
                  <th>Reason</th>
                  <th>Length</th>
                  <th>Outcome</th>
                  <th className="v2-table-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="v2-table-strong">{c.time}</span>
                      <span className="v2-table-sub">{c.day}</span>
                    </td>
                    <td>
                      <span className="v2-table-strong">{c.caller}</span>
                      <span className="v2-table-sub">{c.phone}</span>
                    </td>
                    <td>{c.reason}</td>
                    <td className="v2-table-mono">{c.duration}</td>
                    <td>
                      <span className={`v2-call-tag v2-call-tag--${toneFor(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="v2-table-right v2-table-mono">{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* =============================================================== customers */

export function CustomersView() {
  const { allCustomers: customers } = usePortalData();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(needle) ||
        c.business.toLowerCase().includes(needle) ||
        c.phone.includes(needle),
    );
  }, [customers, q]);

  return (
    <div className="v2-dash-stack">
      <section className="v2-dash-card">
        <header className="v2-dash-card-head v2-dash-card-head--tools">
          <div>
            <h4>Customers</h4>
            <p>{customers.length} people your receptionist has spoken to</p>
          </div>
          <div className="v2-dash-search">
            <IconSearch />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customers"
              aria-label="Search customers"
            />
          </div>
        </header>

        {rows.length === 0 ? (
          <p className="v2-dash-empty">Nobody by that name yet.</p>
        ) : (
          <div className="v2-table-wrap">
            <table className="v2-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th className="v2-table-right">Jobs</th>
                  <th className="v2-table-right">Lifetime</th>
                  <th>Last call</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.phone}>
                    <td>
                      <span className="v2-table-who">
                        <span className="v2-avatar v2-avatar--sm" aria-hidden>
                          {/^[\d()+\- ]+$/.test(c.name)
                            ? c.name.replace(/\D/g, "").slice(-2)
                            : c.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                        <span>
                          <span className="v2-table-strong">{c.name}</span>
                          <span className="v2-table-sub">{c.business}</span>
                        </span>
                      </span>
                    </td>
                    <td className="v2-table-mono">{c.phone}</td>
                    <td className="v2-table-right v2-table-mono">{c.jobs}</td>
                    <td className="v2-table-right v2-table-mono">{c.lifetime}</td>
                    <td>{c.last}</td>
                    <td>
                      <span
                        className={`v2-call-tag v2-call-tag--${
                          c.status === "Active" ? "book" : c.status === "New" ? "quote" : "handled"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* ================================================================= reports */

export function ReportsView() {
  // Pinned to the 30d slice regardless of whatever range is selected on
  // Overview, so the "last 30 days" label below is never stale.
  const { allTimeSummary } = usePortalData();
  const vol = usePortalBundle()["30d"].volume;
  return (
    <div className="v2-dash-stack">
      <section className="v2-dash-card">
        <header className="v2-dash-card-head">
          <div>
            <h4>All-time summary</h4>
            <p>Every real figure this receptionist has produced</p>
          </div>
        </header>

        <div className="v2-report-grid">
          {allTimeSummary.map((s) => (
            <div key={s.label} className="v2-report-cell">
              <span className="v2-report-label">{s.label}</span>
              <span className="v2-report-value">{s.value}</span>
              <span className="v2-report-note">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="v2-dash-card">
        <header className="v2-dash-card-head">
          <div>
            <h4>Call volume trend</h4>
            <p>Answered vs. booked, last 30 days</p>
          </div>
        </header>
        <VolumeChart a={vol.a} b={vol.b} labels={vol.labels} id="repVol" height={210} />
      </section>
    </div>
  );
}

/* ================================================================ settings */

export function SettingsView() {
  const { business, plan } = usePortalData();
  const { accent, mode, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  // Only the most recent save request should ever be allowed to win — without
  // this, clicking two swatches quickly races their PATCH requests, and
  // whichever response happens to land last silently overwrites the theme
  // the user actually asked for.
  const inFlight = useRef<AbortController | null>(null);

  const applyTheme = async (nextAccent: Accent, nextMode: Mode) => {
    setTheme(nextAccent, nextMode); // instant — don't make the user wait on the network to see it
    setSaved(false);
    setSaving(true);

    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;

    try {
      await fetch("/api/settings/theme", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ accent: nextAccent, mode: nextMode }),
        signal: controller.signal,
      });
      if (inFlight.current === controller) {
        setSaved(true);
        setSaving(false);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError" && inFlight.current === controller) {
        setSaving(false);
      }
      // An aborted request was superseded by a newer one, which owns the
      // saving/saved state now — nothing to update here.
    }
  };

  return (
    <div className="v2-dash-stack">
      <section className="v2-dash-card">
        <header className="v2-dash-card-head">
          <div>
            <h4>Appearance</h4>
            <p>How your dashboard looks — just for you, changeable anytime</p>
          </div>
          {saving ? (
            <span className="v2-dash-note">Saving…</span>
          ) : saved ? (
            <span className="v2-dash-note">Saved</span>
          ) : null}
        </header>
        <ThemeSwatches
          accent={accent}
          mode={mode}
          onAccent={(a) => applyTheme(a, mode)}
          onMode={(m) => applyTheme(accent, m)}
        />
      </section>

      <section className="v2-dash-card">
        <header className="v2-dash-card-head">
          <div>
            <h4>Business details</h4>
            <p>What your receptionist tells callers</p>
          </div>
        </header>
        <div className="v2-set-grid">
          <label className="v2-set-field">
            <span>Business name</span>
            <input className="v2-input" defaultValue={business} />
          </label>
          <label className="v2-set-field">
            <span>Main number</span>
            <input className="v2-input" defaultValue={businessInfo.phone} />
          </label>
          <label className="v2-set-field">
            <span>Service area</span>
            <input className="v2-input" defaultValue={businessInfo.serviceArea} />
          </label>
          <label className="v2-set-field">
            <span>Free estimates</span>
            <input className="v2-input" defaultValue="Yes, in-home and virtual" />
          </label>
        </div>
      </section>

      <div className="v2-dash-row v2-dash-row--split">
        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>Hours</h4>
              <p>When you want calls passed through</p>
            </div>
          </header>
          <ul className="v2-hours">
            {businessInfo.hours.map(([d, h]) => (
              <li key={d}>
                <span>{d}</span>
                <span className="v2-hours-val">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>Notifications</h4>
              <p>How we reach you</p>
            </div>
          </header>
          <ul className="v2-toggles">
            {[
              ["Text me on emergencies", true],
              ["Daily summary email", true],
              ["Weekly report", true],
              ["Notify on every booking", false],
            ].map(([label, on]) => (
              <li key={label as string}>
                <span>{label}</span>
                <span className="v2-toggle" data-on={on as boolean} aria-hidden />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="v2-dash-card">
        <header className="v2-dash-card-head">
          <div>
            <h4>Your plan</h4>
            <p>Billing and what&rsquo;s included</p>
          </div>
        </header>
        <div className="v2-plan">
          <div>
            <span className="v2-plan-name">{plan}</span>
            <span className="v2-plan-price">$825 setup · $315 / month</span>
          </div>
          <button type="button" className="v2-btn-ghost v2-btn-ghost--sm">
            Change plan
          </button>
        </div>
      </section>
    </div>
  );
}
