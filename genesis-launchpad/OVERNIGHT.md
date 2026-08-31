# Overnight run — how to launch one

Fill in `GOAL` and `DONE`, then paste the whole block after `/loop 25m`.

`/loop` re-fires the prompt on an interval. If a run dies on a usage limit, the
next tick reads `PROGRESS.md` and carries on from where it stopped. That — not
pacing — is what makes an overnight run survive a reset.

---

## The prompt

```
Read genesis-launchpad/PROGRESS.md FIRST, before anything else. It is the
source of truth for where the last run stopped. Then read
genesis-launchpad/DIRECTION.md and follow it exactly.

GOAL
<one sentence — the finished thing, not the activity>

DONE means all of these are true:
- [ ] <specific and checkable>
- [ ] <specific and checkable>
- [ ] npx tsc --noEmit is clean
- [ ] npm run build is clean
- [ ] verified in the browser at 375px, 768px and desktop

RULES
- DIRECTION.md is frozen. Do not reinterpret it, restyle it, or swap the
  palette. Ignore design.md — it describes a direction that was already
  built and rejected.
- Do not change prices, marketing copy, auth flows, or anything under
  supabase/. Do not invent stats, testimonials or logos.
- Work in small units. After each one: verify, commit, then APPEND a new
  "## Run" block to PROGRESS.md in the documented format.
- Do not ask me questions — I'm asleep. Make the call, log it under
  "Decisions" in PROGRESS.md, and keep going.
  EXCEPTION: anything destructive or user-facing-breaking (deleting a
  route, touching auth, deleting data). Skip it, log it under "Blocked",
  move to the next item.
- Commit every checkpoint. Do NOT push. I'll review in the morning.

TOKEN BUDGET
You can see your remaining token count. When it drops below 2,000,000:
stop taking new work, finish and commit whatever is in flight, write a
final PROGRESS.md block, and end cleanly. Never stop mid-edit with
uncommitted changes.

VERIFICATION
Never claim something works because it should. Run the command and show
the output. The browser pane goes stale on scroll — if screenshots look
wrong, cross-check with read_page or a computed-style probe via
javascript_tool before concluding anything is broken.
```

---

## Notes

**Interval.** `25m` is a reasonable default. Shorter wastes ticks re-reading
context; much longer leaves the machine idle after a limit clears.

**Stop threshold.** 2M is deliberately generous — enough headroom to finish a
unit of work and commit cleanly rather than dying mid-edit. Lower it if you
want more work per night and are willing to risk a messier stop.

**Why "do not push."** Unattended is exactly when the deploy gate should be
tighter, not looser. Commits are free and reviewable; a bad push reaches real
customers while you're asleep.

**The real limiter isn't tokens.** On 2026-08-30 the site went dark →
red-orange → white → understated → back to the original pink/purple. That round
trip cost more than any token budget would have saved. A frozen DIRECTION.md is
worth more than perfect pacing — which is the whole reason that file exists.
