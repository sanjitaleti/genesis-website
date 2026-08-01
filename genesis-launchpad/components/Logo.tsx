import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Genesis LP — home"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-[0.95rem] font-semibold tracking-tightish text-ink",
        className,
      )}
    >
      <span className="grid h-5 w-5 place-items-center rounded-[3px] border border-rule-2">
        <span className="h-2 w-2 rounded-[1px] bg-accent" />
      </span>
      Genesis LP
    </Link>
  );
}
