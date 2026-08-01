import { cn } from "@/lib/cn";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Adds a faint top hairline to mark section boundaries. */
  divided?: boolean;
  id?: string;
}

export function Section({ children, className, divided, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-24 md:py-32",
        divided && "border-t border-white/[0.06]",
        className,
      )}
    >
      <div className="container-luxe">{children}</div>
    </section>
  );
}
