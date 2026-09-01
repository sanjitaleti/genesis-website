# DIRECTION — Genesis LP

**This file is the frozen visual direction. For unattended/overnight work it is
the single source of truth. Read it before touching anything. Do not
reinterpret it, do not "improve" it, do not swap the palette.**

Last confirmed by the user: **2026-08-30**, by explicitly reverting the site
back to this look after a full night of alternatives.

---

## ⚠️ Conflicts to know about before you read anything else

**`design.md` does NOT describe this site.** It specifies a modern-minimal,
cool-toned, cyan-accent, Space-Grotesk system. That direction was actually
built on 2026-08-30 (commit `5418bd1`) and the user reverted it the same night
(`151a76b`). Treat `design.md` as a **rejected alternative**, not as the system.
If you follow it you will rebuild something that was already thrown away.

The same applies to any memory or note saying "no purple." That was true of an
earlier direction. It is **not** true now — the user asked for purple back by
name. This file wins.

---

## The look

Dark, saturated, glowing. A black-violet canvas with floating violet→magenta
gradient light. Confident and consumer-facing, not a restrained engineering
consultancy. The gradient IS the brand.

## Tokens — live values in `app/v2.css` under `.v2`

```
--ink            #04030a   near-black, violet-tinted canvas
--ink-1          #0a0616   raised surface
--ink-2          #120a1f
--ink-3          #1b0f2e

--violet-deep    #2a0f3a
--violet         #5a189a
--violet-lift    #7b2cbf
--magenta        #f72585   the primary signal
--magenta-soft   #ff5ca8
--blush          #ffd6ff

--text           #f7f3fb
--text-dim       rgba(247,243,251,0.8)
--text-faint     rgba(247,243,251,0.6)
--line           rgba(255,214,255,0.10)
--line-2         rgba(255,214,255,0.20)

--grad-brand     linear-gradient(100deg, #5a189a, #f72585 55%, #ff7ab8)
--grad-text      linear-gradient(100deg, #c77dff, #f72585 55%, #ffd6ff)
```

**Type:** the brand system, added 2026-08-31 with the identity. Superseded the
old "Apple system stack, no webfont" rule — that was a placeholder, not a
choice, and it meant the site looked like whatever device opened it.

| Role | Face | Weights |
|---|---|---|
| Display (`--font-display`) | **Schibsted Grotesk** | 500/600/700/800, tracking −0.02 to −0.03em |
| Body & UI (`--font-sans`) | **Hanken Grotesk** | 400/500/600, line-height 1.6 |
| Figures (`--font-mono`) | **JetBrains Mono** | 400/500, always `tabular-nums` |

Loaded via `next/font/google` in `app/layout.tsx`. Display above ~24px only.
Do **not** introduce Inter, Space Grotesk, Plus Jakarta Sans, or a script face —
the first three are the faces every AI-built site converges on, and the script
accent was already tried and removed.

**Logo:** the "open line" monogram — `components/v2/GenesisLogo.tsx`
(`<GenesisLogo>` and `<GenesisLockup>`), favicon at `app/icon.svg`. A geometric
G drawn as one continuous stroke that never closes; the aperture is the idea
(the line is always open). Do not close the gap, rotate it, or crowd it — clear
space is one aperture-width. Below 24px the stroke thickens so the aperture
doesn't optically fill in; the component handles this. Full kit, exported
assets and usage rules live in `~/Downloads/genesis-lp-brand-v1/`.

**Semantic colours** (state, deliberately separate from brand so a "booked"
chip can't be mistaken for a brand accent): `--mint #3DDC97` booked/healthy,
`--amber #FFB454` pending, `--coral #FF5C7A` missed/destructive,
`--sky #6BA8FF` informational.

**Contrast rule:** violet `#5A189A` is 1.99:1 on the ground — a **surface
colour only, never text**. Use `--magenta-soft` (7.19:1) for anything a person
has to read.

**Motion:** glow, float and aurora drift are *wanted here*. `--ease` is
`cubic-bezier(0.16, 1, 0.3, 1)`. Entrance animations (`.v2-in`) are on.

**Nav:** floating bottom dock (`DockNav`), not a top bar.
**Sign-in:** deliberately NOT linked from the dock or footer. The `/sign-in`
route still exists and must keep working — the dashboard guard, sign-out,
onboarding and both password-reset flows redirect through it.

---

## Never touch without being asked

- **Prices and plan contents.** `lib/v2/pricing-tiers.ts` is real commercial
  data. Lunar $750 setup / $250 mo (first month $125). Orbit $825 / $315.
  Nova custom.
- **Marketing copy.** It is written and approved. Restructure layout freely;
  do not rewrite sentences.
- **Auth and the portal.** `/sign-in`, `/dashboard`, `/welcome`, `/onboarding`,
  `/create-account`, `/reset-password`. Real customers depend on these.
- **Anything under `supabase/`.**
- **Never invent** statistics, testimonials, logos or case studies. If a number
  isn't in the repo, it doesn't go on the page.

## Environment

`OPENROUTER_API_KEY` (server-only) powers `/api/ai-dock` and
`/api/configurator/analyze`, both on `anthropic/claude-haiku-4.5`. Set locally
and in Vercel. Both routes fail quietly to a fallback if it's missing — so if
the assistant seems "fine but generic," check the key before debugging code.
