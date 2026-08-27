"use client";

import { useState } from "react";
import Link from "next/link";
import { GenesisLogo } from "./GenesisLogo";
import { IconMenu, IconX } from "./icons";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Portal", href: "/portal" },
];

/**
 * N5 · Floating pill.
 *
 * Replaces the full-width bar with a hairline border-bottom — wordmark
 * hard-left, links centre, CTA hard-right — which is the most
 * recognisable AI-nav fingerprint and is banned by name in design.md.
 *
 * The pill has to stay content-sized: a pill at 95% of the viewport is
 * just the same full-width nav with rounded ends. The link set is
 * deliberately short to keep it under ~720px.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="v2-nav-shell" data-open={open}>
      <nav className="v2-nav" aria-label="Site">
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "0 8px",
            textDecoration: "none",
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: "-0.015em",
            whiteSpace: "nowrap",
          }}
        >
          <GenesisLogo size={16} />
          Genesis LP
        </Link>

        <div className="v2-nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="v2-nav-item">
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <Link href="/sign-in" className="v2-nav-item v2-nav-signin">
            Sign in
          </Link>
          {/* verb-first, per design.md — never "Get started" */}
          <Link
            href="/contact"
            className="v2-btn"
            style={{ padding: "8px 15px", fontSize: 13.5, borderRadius: 999 }}
          >
            Book a call
          </Link>
          <button
            type="button"
            className="v2-nav-icon-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            style={{ display: "inline-flex" }}
          >
            {open ? <IconX style={{ width: 15, height: 15 }} /> : <IconMenu style={{ width: 15, height: 15 }} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "10px 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="v2-nav-item"
              onClick={() => setOpen(false)}
              style={{ padding: "9px 6px" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/sign-in"
            className="v2-nav-item"
            onClick={() => setOpen(false)}
            style={{ padding: "9px 6px" }}
          >
            Sign in
          </Link>
        </div>
      ) : null}
    </div>
  );
}
