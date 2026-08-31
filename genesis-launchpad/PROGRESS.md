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
