interface PageHeaderProps {
  kicker?: string;
  title: React.ReactNode;
  description: string;
}

/**
 * Modern-minimal page header: two-column on desktop (title left, lede right),
 * roman display, no hanging eyebrow, no italic. The kicker is a quiet mono line
 * stacked directly above the title — never a tag-left/header-right split.
 */
export function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <section className="wrap pt-36 md:pt-44">
      <div className="grid items-end gap-8 border-b border-rule pb-12 md:grid-cols-[1.5fr_1fr] md:gap-16 md:pb-16">
        <div>
          {kicker ? <div className="meta mb-5">{kicker}</div> : null}
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tighter2">
            {title}
          </h1>
        </div>
        <p className="max-w-md text-base leading-relaxed text-ink-2 md:pb-2 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
