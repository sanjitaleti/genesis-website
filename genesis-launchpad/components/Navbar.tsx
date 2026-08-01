"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { cn } from "@/lib/cn";

const links = [
  { label: "Services", href: "/features" },
  { label: "Approach", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 md:px-6 md:pt-5">
      <nav className="mx-auto flex w-full max-w-wide items-center justify-between rounded-[10px] border border-rule bg-paper/80 px-4 py-2.5 backdrop-blur-md md:px-5">
        <Logo />

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "font-mono text-xs tracking-[0.02em] transition-colors duration-200 hover:text-ink",
                    active ? "text-ink" : "text-ink-2",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Link href="/contact" className="btn-primary !px-4 !py-2 !text-xs">
            Book an audit
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-xs text-ink md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 w-full max-w-wide rounded-[10px] border border-rule bg-paper/95 p-2 backdrop-blur-md md:hidden">
          {[...links, { label: "Book an audit", href: "/contact" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between border-b border-rule px-3 py-4 text-lg last:border-0"
            >
              <span className="font-display font-medium">{link.label}</span>
              <span aria-hidden className="text-ink-3">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
