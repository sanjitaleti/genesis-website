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

## Theme (dark, cool-tinted)
- `--color-paper`    oklch(15% 0.012 240)   /* cool near-black — NOT #000 */
- `--color-paper-2`  oklch(20% 0.012 240)   /* raised surface */
- `--color-paper-3`  oklch(25% 0.012 240)   /* hover surface */
- `--color-ink`      oklch(96% 0.005 230)   /* near-white text */
- `--color-ink-2`    oklch(72% 0.010 230)   /* muted */
- `--color-ink-3`    oklch(52% 0.010 230)   /* faint / meta */
- `--color-rule`     oklch(30% 0.012 235)   /* visible thin border */
- `--color-rule-2`   oklch(38% 0.014 235)   /* stronger border */
- `--color-accent`   oklch(84% 0.14 200)    /* cyan #00E5FF — the ONE signal */
- `--color-accent-ink` oklch(18% 0.03 230)  /* dark text on cyan fills */
- `--color-flag`     oklch(70% 0.20 5)      /* pink #FF4D8D — RARE state only */
- `--color-focus`    oklch(84% 0.14 200)    /* cyan */

Accent discipline: cyan appears on links, focus rings, the single primary CTA, and
one or two functional marks per view — never as a background flood, gradient, or glow.
Pink is a *flag*: at most one instance per page (a single status marker). Never blend
cyan→pink. No purple, ever.

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
- Primary: solid cyan fill, dark ink text, 6px radius, one per page. Copy = a verb-first
  action ("Book a discovery audit"), never "Get started".
- Secondary: text link with a drawn cyan underline on hover. No second filled button.

## Nav & footer
- Nav: floating, content-sized, detached from edges, subtle backdrop. Mono links.
  NOT a full-width bar with hairline border (the AI-nav tell).
- Footer: statement close — one honest line + contact + minimal links + mono meta.
  NOT four columns of links, NOT a giant hollow wordmark.

## What pages MUST share
wordmark · cyan accent + its ≤5% placement · Space Grotesk/Inter/JetBrains trio ·
CTA voice · ruled-row rhythm · no eyebrows, no italic headers, no hanging labels.

## What pages MAY differ on
macrostructure within the family · section ordering · presence of the process ledger.
