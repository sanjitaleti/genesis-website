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

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="v2-nav-shell">
      <nav className="v2-wrap v2-nav" aria-label="Site">
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--text)" }}>
          <GenesisLogo />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Genesis LP</span>
        </Link>

        <div className="v2-nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="v2-nav-item">
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/sign-in" className="v2-btn-ghost" style={{ padding: "8px 18px", fontSize: 14 }}>
            Sign in
          </Link>
          <Link href="/contact" className="v2-btn" style={{ padding: "8px 18px", fontSize: 14 }}>
            Get Started
          </Link>
          <button
            type="button"
            className="v2-nav-icon-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            style={{ display: "inline-flex" }}
          >
            {open ? <IconX style={{ width: 17, height: 17 }} /> : <IconMenu style={{ width: 17, height: 17 }} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="v2-wrap" style={{ borderTop: "1px solid var(--line-2)", padding: "8px 24px 16px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="v2-nav-item" onClick={() => setOpen(false)} style={{ padding: "10px 4px" }}>
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
