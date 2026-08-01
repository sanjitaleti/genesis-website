import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="mt-4 max-w-3xl text-balance text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.025em]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-xl text-lg leading-relaxed text-text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
