import Link from "next/link";
import { Logo } from "./Logo";

const links = [
  { label: "Services", href: "/features" },
  { label: "Approach", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="max-w-md">
            <Logo />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-2">
              We build the automations that take the manual, repetitive work off your
              team — tested on your real data, running on tools you own.
            </p>
            <Link href="/contact" className="link mt-6 inline-flex text-sm text-accent">
              hello@genesislp.ai
            </Link>
          </div>

          <nav className="flex flex-col gap-3 md:items-end">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-xs tracking-[0.02em] text-ink-2 transition-colors duration-200 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-rule pt-6 md:flex-row md:items-center md:justify-between">
          <span className="meta">© {new Date().getFullYear()} Genesis LP</span>
          <span className="meta">AI automation &amp; workflow agency · genesislp.ai</span>
        </div>
      </div>
    </footer>
  );
}
