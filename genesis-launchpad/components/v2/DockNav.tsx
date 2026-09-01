"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconSpark, IconChart, IconCard } from "./icons";
import { GenesisLogo } from "./GenesisLogo";

/** Floating dock. Icons only; the active item expands to show its label. */
const items = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/features", label: "Features", Icon: IconSpark },
  { href: "/portal", label: "Portal", Icon: IconChart },
  { href: "/pricing", label: "Pricing", Icon: IconCard },
];

export function DockNav() {
  const pathname = usePathname();

  return (
    <div className="v2-dock-shell">
      <nav className="v2-dock" aria-label="Site">
        {/* The mark anchors the dock — the site has no header, so this is
            the only persistent piece of brand on screen. */}
        <Link href="/" className="v2-dock-mark" aria-label="Genesis LP — home">
          <GenesisLogo size={18} />
        </Link>
        <span className="v2-dock-sep" aria-hidden="true" />

        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="v2-dock-item"
              data-active={active}
              aria-current={active ? "true" : undefined}
              aria-label={label}
            >
              <Icon />
              <span className="v2-dock-label">{label}</span>
            </Link>
          );
        })}
        {/* The sign-in entry is deliberately not surfaced in the public nav.
            /sign-in itself still works — customers reach it directly, and the
            dashboard guard, sign-out and password-reset flows all still
            redirect through it. */}
      </nav>
    </div>
  );
}
