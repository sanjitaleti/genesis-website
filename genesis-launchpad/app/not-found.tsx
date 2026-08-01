import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] content-center pt-36">
      <div className="meta">Error 404</div>
      <h1 className="mt-5 max-w-2xl text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tighter2">
        This page never shipped.
      </h1>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
        The page you&apos;re after doesn&apos;t exist — or hasn&apos;t been built yet.
      </p>
      <Link href="/" className="btn-primary mt-8 w-fit">
        Back to home <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
