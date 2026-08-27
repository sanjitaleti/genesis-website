# Design — Genesis LP

A locked design system for genesislp.ai. Every page reads this file before emitting
code. Do not regenerate per page — extend or amend this file when the system grows.
Built via Hallmark. Genre: modern-minimal (Cobalt/dark register).

/ * Hallmark · genre: modern-minimal · design-system: design.md · designed-as-app * /

## Genre
modern-minimal — cool, technical, instrument-panel. Engineering consultancy, not
a flashy AI startup. Restraint is the brand. Atmospheric (dark-AI-tool glows,
radial blooms, shaders) is explicitly banned — that is the slop we're leaving.

## Macrostructure family
- Home:     Narrative Workflow — the audit → build → run process is the page.
- Services / Pricing: ledger / spec-sheet — ruled rows, mono figures, tabular.
- About / Contact / Approach: Long Document — memo voice, one column, generous measure.

All pages share the tokens, type, nav, footer, and CTA voice below.

## Theme (light, warm-tinted) — AMENDED

Superseded the original dark cool-tinted register on two axes, both direct user
calls. Everything else about the system is unchanged. Live values are in
`app/v2.css` under `.v2`.

- `--ink`        oklch(99% 0.0025 60)   /* warm near-white paper — NOT #fff */
- `--ink-1`      oklch(97.2% 0.004 60)  /* raised surface */
- `--ink-2`      oklch(95% 0.005 60)    /* hover surface */
- `--text`       oklch(21% 0.008 55)    /* warm near-black — NOT #000 */
- `--text-dim`   oklch(45% 0.009 55)    /* muted */
- `--text-faint` oklch(60% 0.008 55)    /* faint / meta */
- `--line`       oklch(91% 0.005 60)    /* visible hairline */
- `--line-2`     oklch(86% 0.006 60)    /* stronger border */
- `--accent`     oklch(63% 0.208 34)    /* red-orange #ff4d1f — the ONE signal */
- `--accent-deep` oklch(48% 0.17 32)    /* pressed / text-on-wash */
- `--accent-ink` oklch(99% 0.002 60)    /* text on accent fills */
- `--accent-wash` oklch(96.5% 0.02 45)  /* the one tinted surface, status only */

**Amendment 1 — paper is light.** The register is a warm near-white, never pure
`#fff` (flat and synthetic). Neutrals carry the accent's hue at very low chroma so
the page reads lit rather than blank.

**Amendment 2 — the signal accent is red-orange, not cyan.** Cyan and the pink
flag are both retired; the palette is one hue plus warm neutrals.

Accent discipline is otherwise **unchanged and still binding**: the accent appears
on links, focus rings, and one or two functional marks per view — never as a
background flood, gradient, or glow. The primary CTA is ink-filled rather than
accent-filled, which keeps the accent budget under 5% and reserves the colour for
signal. No purple, ever.

## Typography
- Display: Space Grotesk, weight 500–600, style normal (roman ONLY — no italic headers).
- Body:    Inter, weight 400–500.
- Mono:    JetBrains Mono, weight 400–500 — metrics, labels, ordinals, technical texture.
- Display tracking: -0.02em to -0.03em on large sizes.
- Type scale anchor: --text-display = clamp(2.75rem, 5vw + 0.5rem, 5rem).

## Spacing
4-point named scale in tokens.css. Pages use named tokens, never raw values.
Vary section padding deliberately — never every section identical.

## Motion
- Easings: --ease-out cubic-bezier(0.16, 1, 0.3, 1). No bounce/overshoot, ever.
- Reveal pattern: NONE. The page is composed and present on load. No scroll fade-ins.
- Micro only: 150–200ms colour/border shifts on hover; instant focus rings.
- Reduced-motion: already trivially satisfied (near-zero motion).

## Microinteractions stance
- Silent success. No celebratory toasts.
- Hover = one signal (border or colour), never scale+shadow+glow.
- Focus rings appear instantly, cyan, ≥3:1.

## CTA voice
- Primary: solid **ink** fill, paper text, 6px radius (999px in the nav pill), one per
  page. Hover shifts the fill to the accent — one signal, never scale + shadow + glow.
  Copy = a verb-first action ("Book a call", "Build your own agent"), never "Get started".
- Secondary: text link with a drawn accent underline. No second filled button.

## Nav & footer
- Nav: floating, content-sized, detached from edges, subtle backdrop. Mono links.
  NOT a full-width bar with hairline border (the AI-nav tell).
- Footer: statement close — one honest line + contact + minimal links + mono meta.
  NOT four columns of links, NOT a giant hollow wordmark.

## What pages MUST share
wordmark · red-orange accent + its ≤5% placement · Space Grotesk/Inter/JetBrains trio ·
CTA voice · ruled-row rhythm · no eyebrows, no italic headers, no hanging labels.

## Implemented archetypes
- Nav: **N5 floating pill** — content-sized, detached, mono links. Must stay under
  ~720px wide or it becomes a full-width bar with rounded ends.
- Footer: **Ft5 statement** — one closing line, then contact + minimal links in mono
  meta beneath a rule.
- Home: **14 · Narrative Workflow** — numbered stages (`1.0 ANSWER` → `4.0 REPORT`).
- Pricing / Features: **F3 tabular spec sheet** — ruled rows, mono figures, tabular
  numerics, one accent mark for "included".

## Tells removed (do not reintroduce)
Pacifico script accent word · radial hero glow / `mix-blend-mode` bloom · full-width
nav with hairline border-bottom · centred full-viewport hero · 3-and-4-up icon-card
feature grids · asymmetric bento · staggered fade-and-rise reveal on ~69 elements ·
perpetual per-icon animation · 380vh scroll-pinned pricing stage with gradient skies ·
"Get Started" CTA copy · pink/purple/cyan status-tag holdovers.

## What pages MAY differ on
macrostructure within the family · section ordering · presence of the process ledger.
