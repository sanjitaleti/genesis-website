# PROGRESS

**Append-only work log. This is how an unattended run finds its place after a
stop. Read this FIRST, before any other file, before touching any code.**

How to use it:

- Read the whole file. The last `## Run` block tells you where the previous run
  stopped and what it was about to do.
- Do one unit of work. Verify it. Commit it.
- Then append a new `## Run` block. Never edit or delete earlier blocks —
  the history is the point.
- If the only thing below is this header, you are run #1: start at the top of
  the task's DONE list.

Block format:

```
## Run <n> — <UTC timestamp>
Did:        <what actually changed, with file paths>
Verified:   <the command you ran and its result — not "looks fine">
Committed:  <sha> <subject>
Next:       <the single next action, concrete enough to just do>
Decisions:  <calls made without asking, and why>
Blocked:    <anything skipped, and what it needs from the user>
```

---

## Run 0 — 2026-08-30 (setup)

Did:        Created `DIRECTION.md` (frozen pink/purple visual system) and this
            file. Flagged in DIRECTION.md that `design.md` describes a rejected
            alternative and must not be followed.
Verified:   n/a — scaffolding only, no code touched.
Committed:  see next commit on `main`.
Next:       Nothing queued. Waiting on a task from the user.
Decisions:  Recorded the current live state (pink/purple, dock nav, hidden
            sign-in link) as the locked direction, since the user reverted to
            it explicitly rather than drifting into it.
Blocked:    Nothing.

---

## Run 1 — 2026-08-31 — Item 1/5 (plumbing page) — COMPLETE

Did:        Built `/ai-receptionist/plumbing`
            (`app/(marketing)/ai-receptionist/plumbing/page.tsx`), mirroring
            hvac's structure with copy written for plumbing. Added three
            primitives to `app/v2.css`: `.v2-panel--glass`, `.v2-magnetic`,
            `.v2-callline`. Added `components/v2/MagneticCta.tsx`. Added the
            sitemap entry at priority 0.8.

Verified:   - `npx tsc --noEmit` → clean (no output)
            - `npm run build` → "✓ Compiled successfully", route listed as
              `○ /ai-receptionist/plumbing` (prerendered)
            - 375 / 768 / 1280px → `scrollWidth - clientWidth = 0` at all
              three; no element's right edge past the viewport
            - Timeline → 6 steps, timestamps ascending 12:41a→12:46a, spine
              at the rail offset (83.2px desktop) using `--grad-brand`, key
              node `rgb(255,214,255)` vs normal `rgb(247,37,133)`
            - Magnetic on FINE pointer → `translate3d(9px, 5.76px, 0)` toward
              cursor, `translate3d(-9px, -5.76px, 0)` opposite, released to
              none when far away. Capped at exactly 9px.
            - Magnetic on COARSE pointer → dispatched a pointermove beside
              the CTA; NO inline transform written (listener never attached)
              and computed transform `none`. Genuinely inert, not hidden.
            - Exactly 1 `.v2-panel--glass` on the page; 2 `.v2-magnetic`,
              both the "Book a free 20-minute call" CTAs.

Committed:  8e759a7 Item 1/5 — build /ai-receptionist/plumbing
            (primitives committed separately just before it)

Next:       Item 2/5 — deep pass on the plumbing page only. No new routes.

Decisions:  - SIGNATURE MOVE = the call timeline (`.v2-callline`). Chose it
              because plumbing is the one trade where elapsed time is the
              actual story — water keeps damaging the house while the phone
              rings out — so a timeline is content-driven rather than
              decorative, and it is NOT swappable to hvac/electrical/roofing.
              The brand gradient becomes its spine, so the gradient carries
              structure instead of decorating another surface. To revert:
              drop the `.v2-callline` block in v2.css and the "One call,
              minute by minute" section in the page.
            - Replaced hvac's separate "after-hours" narrative panel with the
              timeline rather than having both — the timeline covers that
              ground, and keeping both would have broken the
              one-idea-per-section rhythm.
            - Timeline is labelled "Illustrative — an example call, not a
              recording" on the page, since it depicts a call rather than
              reporting one.
            - Shutoff-guidance step is framed as "reads the shutoff steps
              you've given it" so it describes configured behaviour rather
              than claiming an unlisted capability.
            - FAQ answers that are product facts (calendar integration, phone
              number, unknown questions) were reworded rather than copied
              verbatim from hvac, to avoid duplicate-content overlap between
              two landing pages.

Blocked:    - Pre-existing hvac breadcrumb bug, mirrored not fixed as
              instructed: JSON-LD position 2 ("AI Receptionist") points at the
              leaf URL because no `/ai-receptionist` index route exists. Now
              present on both hvac and plumbing. Fix would be an index page
              plus updating both pages' schema — out of tonight's scope.

Note:       Found and fixed a real bug while verifying — `.v2-panel--glass`
            had `backdrop-filter` silently stripped from the SERVED CSS. The
            hand-written `-webkit-backdrop-filter` duplicate (the only one in
            the file) caused the build's prefixer to drop the property
            entirely. Diagnosed via the CSSOM: background and box-shadow from
            the same rule applied, backdrop-filter was simply absent, while
            `.v2-dock`'s multi-function blur+saturate survives unprefixed.
            Removed the duplicate. Worth knowing: do not hand-write
            `-webkit-backdrop-filter` in this codebase.
