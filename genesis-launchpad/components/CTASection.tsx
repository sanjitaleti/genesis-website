import Link from "next/link";

interface CTASectionProps {
  title?: string;
  note?: string;
  linkLabel?: string;
}

export function CTASection({
  title = "What's eating your team's week?",
  note = "One conversation. We map the highest-return process to automate — no obligation, no deck.",
  linkLabel = "Book a discovery audit",
}: CTASectionProps) {
  return (
    <section className="wrap py-20 md:py-28">
      <div className="grid gap-8 border-t border-rule pt-14 md:grid-cols-[1.5fr_1fr] md:items-end md:pt-20">
        <h2 className="max-w-2xl text-[clamp(1.875rem,3.5vw,3.25rem)] font-semibold leading-[1.06] tracking-tighter2">
          {title}
        </h2>
        <div className="flex flex-col items-start gap-6">
          <p className="text-[0.95rem] leading-relaxed text-ink-2">{note}</p>
          <Link href="/contact" className="btn-primary">
            {linkLabel} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
