# Genesis Launchpad — Design System

> Murdered-out matte black luxury. Quiet, cinematic, expensive. Two accents only: **icy cyan** and **hot pink**. **Zero purple, ever.**

---

## 1. Color Tokens

### Base (the murdered-out canvas)
| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#050505` | Dominant page background. ~80% of every screen. |
| `--ink-800` | `#0A0A0A` | Raised surfaces, alternating section bands. |
| `--ink-700` | `#111111` | Cards base, footer, deepest panels. |
| `--line` | `rgba(255,255,255,0.08)` | Hairline borders, dividers, grid lines. |
| `--line-strong` | `rgba(255,255,255,0.12)` | Card borders, focus rings base. |

### Text
| Token | Value | Usage |
|---|---|---|
| `--text` | `#FAFAFA` | Headings, primary copy. |
| `--text-muted` | `rgba(250,250,250,0.62)` | Body text on dark. Always ≥ 4.5:1. |
| `--text-faint` | `rgba(250,250,250,0.40)` | Labels, captions, meta. |

### Accents — restrained, glow-only
| Token | Hex | Usage rule |
|---|---|---|
| `--cyan` | `#00E5FF` | Primary accent. CTAs, key glows, active states, focus ring. |
| `--pink` | `#FF4D8D` | Secondary accent. Used **sparingly** — one moment per viewport max, gradient partner to cyan. |

**Accent law:** No more than ~5% of any screen is accent color. Accents appear as *light* (glows, thin gradients, single glowing word), never as large filled blocks. Cyan leads; pink supports. **Never** introduce purple, violet, indigo, or any blend that drifts toward it — if a cyan→pink gradient passes through a muddy middle, cut the gradient short or use a hard-ish blend so the midpoint reads as a clean magenta-leaning pink, not lavender.

### Signature gradient
```
--grad-accent: linear-gradient(100deg, #00E5FF 0%, #FF4D8D 100%);
```
Used only on: one hero word, stat numbers, thin top-of-card light lines, button glow. Never on large surfaces.

---

## 2. Typography

**Family:** `Inter` (variable) for everything. System-sans fallback. Loaded via `next/font` for zero layout shift.

### Scale (clamp-based, fluid)
| Role | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 5.5rem)` | 600 | `-0.04em` | 1.02 |
| H1 | `clamp(2.25rem, 4.5vw, 3.75rem)` | 600 | `-0.03em` | 1.05 |
| H2 | `clamp(1.75rem, 3vw, 2.75rem)` | 600 | `-0.025em` | 1.1 |
| H3 | `1.375rem` | 600 | `-0.02em` | 1.2 |
| Body-lg | `1.125rem` | 400 | `-0.01em` | 1.65 |
| Body | `1rem` | 400 | `0` | 1.6 |
| Label/eyebrow | `0.75rem` | 500 | `0.16em` UPPERCASE | 1 |
| Mono meta | `0.8125rem` | 400 (Geist/IBM mono) | `0` | 1.4 |

**Rules:** Headings 500–600 (never 800/black — that reads cheap on dark). Tighter tracking the larger the size. Body never below 16px. Muted text only for secondary content, never for anything the eye must read first.

---

## 3. Spacing — strict 4px grid

Allowed steps (px): `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160`.
Tailwind: `1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40`.

- Section vertical padding: `py-24` mobile → `py-40` desktop.
- Container: `max-w-6xl` (1152px) with `px-6` mobile / `px-8` desktop.
- Card inner padding: `p-8` (32px), tight cards `p-6`.
- Stack rhythm: eyebrow→heading `mt-4`, heading→body `mt-5`, body→CTA `mt-8`.

---

## 4. Glassmorphism recipe (liquid glass, done right)

```
bg-white/[0.04]            /* translucent fill, 0.03–0.06 range only */
backdrop-blur-xl           /* real refraction */
border border-white/10     /* hairline edge */
rounded-2xl                /* 16px — soft, not bubbly */
shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]   /* soft, never harsh */
```
Plus a **top light line** for the refraction read:
```
before:absolute before:inset-x-0 before:top-0 before:h-px
before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent
```
And an optional **inner glow** on hover (cyan, very low alpha). Never stack more than one glow. Never use blur below `lg` — weak blur looks like a bug, not glass.

---

## 5. Components

### Button
- **Primary:** white text on `bg-white/[0.06]`, `border-white/12`, `rounded-full`, `px-6 py-3`. Hover: cyan glow ring + slight lift. The CTA accent is the *glow*, not a filled neon block.
- **Cyan solid (rare, one per page):** `bg-cyan text-ink` with soft cyan shadow, for the single most important action.
- **Ghost:** text + animated arrow `→`, underline-on-hover via scaleX.
- Focus: `ring-2 ring-cyan/70 ring-offset-2 ring-offset-ink`.

### Card (`GlassCard`)
Glass recipe above. Hover: border brightens to `white/16`, top light line intensifies, content lifts `-translate-y-1`. Spring, not ease.

### Input
`bg-white/[0.03] border-white/10 rounded-xl px-4 py-3`, placeholder `text-faint`, focus → cyan border + faint cyan glow. Label above, `text-faint` eyebrow style.

### Nav
Fixed, transparent at top → on scroll gains `bg-ink/70 backdrop-blur-xl border-b border-white/8`. Logo left, links center/right, one CTA. Active link gets a tiny cyan dot. Mobile: full-screen glass overlay, staggered link reveal.

---

## 6. Animation guidelines (Framer Motion only)

Springs (from project skill — Fluid Motion):
- **High energy:** `{ type:'spring', stiffness:400, damping:25 }` — buttons, taps, nav.
- **Smooth fluid:** `{ type:'spring', stiffness:300, damping:30 }` — reveals, cards, page elements.

Rules:
- Reveal on scroll: `opacity 0→1`, `y 24→0`, `once:true`, viewport margin `-80px`. Smooth-fluid spring.
- Lists use `staggerChildren: 0.06–0.09`.
- Only animate `x, y, scale, opacity` (GPU-cheap). Never animate `width/height/top/left`.
- Hover = tactile: `scale 1.02` + glow, never bounce.
- Respect `prefers-reduced-motion`: collapse to instant fades.
- No looping attention-seeking motion except the slow ambient background orbs (very low contrast).

---

## 7. Depth & texture
- One ambient layer: two large, heavily-blurred radial orbs (cyan + pink) at very low opacity drifting slowly behind content.
- A fixed SVG/CSS **grain** overlay at ~3% opacity over the whole page for that filmic, non-flat premium feel.
- Shadows are soft and downward only. No harsh `0 0 0 black`.

---

## 8. Anti-slop manifesto — what NOT to do
1. No generic centered cards with drop shadows floating in space.
2. No rainbow / multi-stop gradients. Two accents, one direction, max.
3. **No purple. No violet. No lavender.** Cyan + pink only.
4. No neon-filled buttons screaming for attention — accent is light, not paint.
5. No 800/900 black headings — too heavy for luxury dark UI.
6. No low-contrast body text below 4.5:1.
7. No bouncy, springy, over-animated motion. No motion without purpose.
8. No fake-feeling lorem ipsum. Copy is concise, confident, believable.
9. No off-grid spacing — everything snaps to the 4px scale.
10. No element that only looks right at one breakpoint.
11. No weak `backdrop-blur-sm` "glass" — it must actually refract.
12. No clutter. Whitespace is the luxury. When unsure, remove.
