# Tonight's run — 5-item queue, depth before breadth

Paste the block below after `/loop 25m`.

Queue: plumbing page → deep pass on it → electrical → roofing →
site-wide polish. Worked strictly in order, one at a time, so an early
usage-limit stop leaves one excellent page rather than three rough ones.

Decisions already made with the user (do not re-litigate these at 3am):

1. **Glass is a modifier, not a new class.** `.v2-panel` is *already* frosted
   glass (translucent ink, `blur(22px)`, `--line` border, `::before` highlight)
   and is used on all 21 marketing panels. Build `.v2-panel--glass` as a
   heightened variant for ONE focal surface. Do NOT add a standalone
   `.v2-glass` — it would duplicate `.v2-panel`.
2. **Reuse the Numa stat.** "85% of callers who don't reach a business on the
   first attempt won't call back" (Numa, 2021 Small Business Phone Report) is a
   small-business statistic, not HVAC-specific. Reuse it with its source link
   intact. That is reuse, not invention.
3. **One signature move.** Identity and type system stay frozen. You have
   latitude for exactly ONE bold structural or motion idea unique to this page.
   Everything else stays quiet.
4. **Magnetic needs a client component.** The hvac page is a server component
   (JSON-LD via `dangerouslySetInnerHTML`). Add a small `"use client"` wrapper
   (e.g. `components/v2/MagneticCta.tsx`) rather than converting the page.

---

```
Read genesis-launchpad/PROGRESS.md FIRST, before anything else. It is the
source of truth for where the last run stopped. Then read
genesis-launchpad/DIRECTION.md and follow it exactly.

GOAL
Work the QUEUE at the bottom of this prompt, in order, one item at a
time. Item 1 is below; do not start item 2 until item 1 is committed
and verified.

ITEM 1 — Build /ai-receptionist/plumbing, matching /ai-receptionist/hvac
in structure, tone and metadata — but executed with noticeably more
visual craft: restrained, minimal, zero AI-slop.

DESIGN — decisions already made, do not re-open
- DIRECTION.md's palette, gradient and type system are NOT up for
  reinterpretation. This is an execution-craft layer on a frozen system.
  No new colors, no new fonts, no lightening the canvas, no removing the
  gradient. If it looks like a different site, it's wrong.

- GLASS: `.v2-panel` is ALREADY frosted glass (rgba(10,6,22,0.58),
  backdrop-filter: blur(22px), 1px --line border, ::before highlight) and
  is used on all 21 marketing panels. Do NOT add a standalone `.v2-glass`
  — it would duplicate what exists. Instead add `.v2-panel--glass`: a
  heightened variant (deeper blur, brighter edge, a visible top
  highlight) applied to exactly ONE focal surface on the page — the
  final CTA panel or the hero's supporting card. One. Not every panel.

- MAGNETIC: add `.v2-magnetic` — cursor-proximity translate, max ~8-10px
  offset, eased back with --ease. Must be inert (not merely hidden)
  under prefers-reduced-motion AND on coarse-pointer/touch devices.
  Use it ONLY on the primary CTA button(s) — never nav links, never
  secondary/ghost buttons. The hvac page is a server component, so put
  this in a small "use client" wrapper (components/v2/MagneticCta.tsx)
  rather than converting the page to a client component.

- SIGNATURE MOVE: you have latitude for exactly ONE bold structural or
  motion idea unique to this page. Not a pile of effects — one idea,
  executed precisely, everything else quiet. It must still read as this
  site sitting next to /ai-receptionist/hvac. Log what you chose and why
  under "Decisions" in PROGRESS.md so it can be reverted in one commit.

- ZERO AI-SLOP, concretely: no invented stats or testimonials, no generic
  3-icon "Why choose us" filler, no emoji as icons, no stock copy ("fast,
  reliable, affordable"). Capability and FAQ copy must be specific to how
  a plumbing business actually runs — dispatch, emergency triage, service
  area routing, scheduling into a real calendar, licensing — not hvac
  copy with words swapped. Keep scroll rhythm generous: one idea per
  section, like the hvac page, not a dense stacked feature grid.

DONE means all of these are true:
- [ ] Route renders at /ai-receptionist/plumbing
- [ ] Structure mirrors hvac: breadcrumb, hero, "what a missed call
      costs" section, capabilities, FAQ, FAQPage + BreadcrumbList
      JSON-LD, pricing CTA
- [ ] Copy fully rewritten for plumbing (burst pipes, no-hot-water,
      drain/sewer, service-area routing, licensing)
- [ ] The "missed call costs" section reuses the Numa 85% stat WITH its
      source link intact — it is a small-business stat, not hvac-specific
- [ ] `.v2-panel--glass` and `.v2-magnetic` added to app/v2.css and used
      exactly as scoped above (one glass surface, CTA-only magnetic)
- [ ] Metadata, canonical (/ai-receptionist/plumbing) and a sitemap.ts
      entry at priority 0.8, matching the hvac entry's pattern
- [ ] npx tsc --noEmit clean
- [ ] npm run build clean
- [ ] Verified in browser at 375px, 768px, desktop — including that the
      magnetic effect is genuinely inert on a coarse-pointer viewport,
      not just visually hidden

RULES
- DIRECTION.md is frozen. Ignore design.md — it describes a direction
  that was already built and rejected.
- Do not change prices, existing copy (hvac or elsewhere), auth flows, or
  anything under supabase/. Do not invent stats, testimonials or logos.
- Small units. After each: verify, commit, then APPEND a "## Run" block
  to PROGRESS.md in the documented format.
- Do not ask me questions — I'm asleep. Make the call, log it under
  "Decisions", keep going. EXCEPTION: anything destructive or
  user-facing-breaking (deleting a route, touching auth, deleting data).
  Skip it, log under "Blocked", move on.
- Commit every checkpoint. Do NOT push.

KNOWN ISSUE — do not fix, just log
The hvac breadcrumb's JSON-LD position 2 ("AI Receptionist") points at
/ai-receptionist/hvac, the same URL as position 3, and no
/ai-receptionist index route exists. Mirror the existing pattern for
consistency and note it in PROGRESS.md as separate cleanup. Do not
expand scope to build an index page tonight.

QUEUE — work this list IN ORDER, top to bottom
Finish and commit each item completely before starting the next. Never
run two items at once. Record which item you are on at the top of every
PROGRESS.md block, e.g. "Item 2/5 — deep pass".

The order is deliberate: depth before breadth. Item 1 is the template
items 3 and 4 copy, so it gets perfected FIRST — otherwise you mass-
produce a mediocre pattern. If a usage limit ends the night early, this
order means waking up to one excellent page rather than three rough ones.

  1. /ai-receptionist/plumbing — the full GOAL + DESIGN + DONE spec above.
  2. DEEP PASS on the plumbing page ONLY. No new routes. Refine the
     signature move, typographic rhythm, scroll pacing and the glass /
     magnetic details until the page is genuinely excellent, not merely
     correct. Re-verify at 375 / 768 / desktop after each change. This
     item has no fixed end state — improve until item 3 looks like the
     better use of remaining budget.
  3. /ai-receptionist/electrical — same structure and rules as item 1,
     copy rewritten for electrical (panel upgrades, outages, fault
     finding, permits/licensing, emergency call-outs). Reuse the now-
     proven pattern from items 1–2, including .v2-panel--glass and
     .v2-magnetic, exactly as scoped. Add the sitemap entry (0.8).
  4. /ai-receptionist/roofing — same again (storm damage, leaks,
     inspections, insurance jobs, seasonal demand). Sitemap entry (0.8).
  5. SITE-WIDE POLISH PASS — audit the EXISTING marketing pages against
     DIRECTION.md and fix inconsistencies: spacing rhythm, panel
     treatment, hover states, focus rings, responsive breaks.
     Constraints, non-negotiable:
       - Do NOT rewrite existing copy. Layout and CSS only.
       - Do NOT restyle the identity. No palette/type/gradient changes.
       - ONE fix per commit, each independently revertible, each with a
         one-line rationale in the commit message.
       - If a "fix" is really a taste preference rather than an
         inconsistency with DIRECTION.md, skip it and log it under
         Blocked instead. Existing pages are already approved; the bar
         for touching them is objective inconsistency, not opinion.

WHEN THE QUEUE IS EXHAUSTED — STOP THE LOOP
When every item above is complete, or the token threshold is hit: write
a final PROGRESS.md block summarising the night, then STOP THE LOOP
(ScheduleWakeup with stop: true). Do NOT invent additional scope. An
idle loop re-reading context is waste; self-directed 4am scope creep is
worse.

TOKEN BUDGET
When your remaining token count drops below 2,000,000: stop taking new
work, finish and commit whatever is in flight, write a final PROGRESS.md
block, end cleanly. Never stop mid-edit with uncommitted changes.

USAGE-LIMIT AWARENESS
A usage-limit stop is expected and fine — it is what /loop exists for.
Do not try to race it or work faster to beat it. Just keep commits and
PROGRESS.md current so the next tick resumes cheaply.

VERIFICATION
Never claim something works because it should. Run the command and show
the output. The browser pane goes stale on scroll — if screenshots look
wrong, cross-check with read_page or a computed-style probe via
javascript_tool before concluding anything is broken.
```
