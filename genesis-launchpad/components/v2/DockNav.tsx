"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconSpark, IconChart, IconCard, IconUser } from "./icons";

/** Floating dock. Icons only; the active item expands to show its label. */
const items = [
  { href: "/v2", label: "Home", Icon: IconHome },
  { href: "/v2/features", label: "Features", Icon: IconSpark },
  { href: "/v2/portal", label: "Portal", Icon: IconChart },
  { href: "/v2/pricing", label: "Pricing", Icon: IconCard },
];

export function DockNav() {
  const pathname = usePathname();

  return (
    <div className="v2-dock-shell">
      <nav className="v2-dock" aria-label="Site">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/v2" ? pathname === "/v2" : pathname?.startsWith(href);
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
        <Link
          href="/v2/sign-in"
          className="v2-dock-item"
          data-active={pathname?.startsWith("/v2/sign-in")}
          aria-label="Sign in"
        >
          <IconUser />
        </Link>
      </nav>
    </div>
  );
}
