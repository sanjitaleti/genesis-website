"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconChart,
  IconPhone,
  IconCalendar,
  IconUsers,
  IconReport,
  IconGear,
  IconBell,
  IconLogout,
  IconSearch,
} from "../icons";
import { OverviewView, CallsView, CustomersView, ReportsView, SettingsView } from "./views";
import { CalendarView } from "./Calendar";
import { PortalDataProvider } from "./PortalData";
import { isSignedIn, signOut } from "@/lib/v2/session";
import type { Range } from "@/lib/v2/data";
import type { PortalData } from "@/lib/v2/portal";

type ViewId = "overview" | "calls" | "calendar" | "customers" | "reports" | "settings";

const nav: { id: ViewId; label: string; Icon: typeof IconChart }[] = [
  { id: "overview", label: "Overview", Icon: IconChart },
  { id: "calls", label: "Calls", Icon: IconPhone },
  { id: "calendar", label: "Calendar", Icon: IconCalendar },
  { id: "customers", label: "Customers", Icon: IconUsers },
  { id: "reports", label: "Reports", Icon: IconReport },
  { id: "settings", label: "Settings", Icon: IconGear },
];

const titles: Record<ViewId, { h: string; sub: string }> = {
  overview: { h: "Overview", sub: "How your receptionist is doing" },
  calls: { h: "Calls", sub: "Every call it has taken" },
  calendar: { h: "Calendar", sub: "Jobs it booked for you" },
  customers: { h: "Customers", sub: "Who has been calling" },
  reports: { h: "Reports", sub: "What it earned you back" },
  settings: { h: "Settings", sub: "How it answers and who it tells" },
};

const RANGES: Range[] = ["24h", "7d", "30d"];

export function Dashboard({ bundle }: { bundle: Record<Range, PortalData> }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewId>("overview");
  const [range, setRange] = useState<Range>("30d");

  useEffect(() => {
    let alive = true;
    isSignedIn().then((ok) => {
      if (!alive) return;
      if (!ok) router.replace("/v2/sign-in");
      else setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [router]);

  if (!ready) return <div className="v2-dash-hold" aria-hidden />;

  const t = titles[view];
  const showRange = view === "overview";
  const data = bundle[range];

  return (
    <PortalDataProvider value={data}>
    <div className="v2-dash">
      <div className="v2-dash-glow" aria-hidden />

      {/* ------------------------------------------------------- sidebar */}
      <aside className="v2-dash-side">
        <Link href="/v2" className="v2-dash-brand">
          <span className="v2-dash-brand-mark" aria-hidden />
          Genesis LP
        </Link>

        <nav className="v2-dash-nav" aria-label="Portal sections">
          {nav.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className="v2-dash-nav-item"
              data-active={view === id}
              aria-current={view === id ? "page" : undefined}
              onClick={() => setView(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        <div className="v2-dash-side-foot">
          <div className="v2-dash-status">
            <span className="v2-live-dot" aria-hidden />
            <span>
              <strong>Answering now</strong>
              <span>All systems normal</span>
            </span>
          </div>

          <div className="v2-dash-user">
            <span className="v2-avatar" aria-hidden>
              {data.business.slice(0, 2).toUpperCase()}
            </span>
            <span className="v2-dash-user-id">
              <strong>{data.business}</strong>
              <span>{data.plan} plan</span>
            </span>
            <button
              type="button"
              className="v2-icon-btn"
              aria-label="Sign out"
              onClick={async () => {
                await signOut();
                router.push("/v2/sign-in");
              }}
            >
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------- main */}
      <div className="v2-dash-main">
        <header className="v2-dash-top">
          <div className="v2-dash-top-id">
            <h1>{t.h}</h1>
            <p>{t.sub}</p>
          </div>

          <div className="v2-dash-top-tools">
            {data.live ? null : (
              <span className="v2-demo-badge" title="These figures are sample data, not real results">
                Demo data
              </span>
            )}
            {showRange ? (
              <div className="v2-seg" role="group" aria-label="Date range">
                {RANGES.map((r) => (
                  <button key={r} type="button" data-on={range === r} onClick={() => setRange(r)}>
                    {r}
                  </button>
                ))}
              </div>
            ) : null}

            <button type="button" className="v2-icon-btn" aria-label="Search">
              <IconSearch />
            </button>
            <button type="button" className="v2-icon-btn v2-icon-btn--dot" aria-label="Notifications">
              <IconBell />
            </button>
          </div>
        </header>

        <main className="v2-dash-body" key={view}>
          {view === "overview" ? <OverviewView range={range} /> : null}
          {view === "calls" ? <CallsView /> : null}
          {view === "calendar" ? <CalendarView /> : null}
          {view === "customers" ? <CustomersView /> : null}
          {view === "reports" ? <ReportsView /> : null}
          {view === "settings" ? <SettingsView /> : null}
        </main>
      </div>
    </div>
    </PortalDataProvider>
  );
}
