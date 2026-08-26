/** Minimal four-point spark mark, monochrome — matches the reference's flat, single-color brand mark. */
export function GenesisLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 1c.6 4.8 2.7 8.4 6.5 9.5C14.7 11.6 12.6 15.2 12 20c-.6-4.8-2.7-8.4-6.5-9.5C9.3 9.4 11.4 5.8 12 1Z" />
    </svg>
  );
}
