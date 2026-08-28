# Agent scheduling notes

Per-environment instructions for arming the one-shot trigger described in
SKILL.md Step 2. This is the only file in the skill that names harness
specifics; SKILL.md stays agent-neutral on purpose. Facts below carry the
date they were verified — re-check before relying on them, harnesses move
fast.

## Claude Code — built-in scheduler (verified Aug 2026)

Current builds expose cron-style scheduling tools in-session (in current
builds: `CronCreate`, `CronList`, `CronDelete`). What matters for this
skill:

- **5-field cron in the user's local timezone** — `M H DoM Mon DoW`, e.g.
  `"27 17 27 8 *"` = Aug 27 at 17:27 local.
- **One-shot = `recurring: false`** — fires once, then auto-deletes. Pin
  minute, hour, day-of-month, and month; leave day-of-week `*`.
- **`durable: true` persists** to `.claude/scheduled_tasks.json` and
  survives session restarts; missed one-shot durable tasks are **surfaced
  for catch-up** on next launch. This is the resume-after-restart path.
  `durable: false` (default) is memory-only and dies with the session —
  do not use it here.
- **Fires only while the REPL is running and idle** — a closed or busy
  session fires nothing at the scheduled moment (missed durable one-shots
  surface later, but a session must be open for anything to happen).
- **Recurring tasks auto-expire after 7 days** — one more reason this
  skill's scope is one-shot + multi-step, not recurring.
- **Off-minute times**: the scheduler adds jitter — recurring jobs fire up
  to 10% of their period late (max 15 min); one-shots pinned to `:00`/`:30`
  can fire up to 90 s early. Prefer `:04`, `:27`, `:57`… over round marks
  (also spreads fleet load).

Arming template (one-shot, durable), id from the committed record:

```
cron:      "27 17 27 8 *"          # from fire_at, local time
recurring: false
durable:   true
prompt:    "Scheduled task <id> fired: run the task-scheduler
            triggered-execution step for <id> in <workdir>."
```

Drift check (SKILL.md Step 5): list registered schedules with the
schedule-listing tool (`CronList`) and compare against `task.py list`.

## OpenAI Codex CLI — no in-session scheduler (not verified as of Aug 2026)

No built-in session scheduler verified. Two fallbacks, in order:

1. **Mention-driven resume** — the record under `.tasks/` is the state; the
   skill triggers and scans on the next mention of pending work in the
   project. Zero setup, no time accuracy.
2. **OS-level trigger** (cookbook §6) — an OS scheduler job invokes a
   headless agent run with the self-locating prompt. Time-accurate,
   per-machine.

Tell the user which one they are getting; do not silently imply a timer
exists.

## pi — no in-session scheduler (not verified as of Aug 2026)

Skills load via `/skill:<name>`; no built-in scheduler verified. Same two
fallbacks as Codex CLI above.

## Comparison

| Environment | In-session scheduler | Durable / survives restart | Missed-fire catch-up | Fires with no session open |
|---|---|---|---|---|
| Claude Code | yes (cron tools) | yes (`durable: true`) | one-shots surfaced on next launch | no — cookbook §6 for that |
| Codex CLI | not verified | — | — | cookbook §6 only |
| pi | not verified | — | — | cookbook §6 only |

## Re-check before relying

Scheduler behavior (durability, catch-up, expiry) is harness territory and
changes across builds. Before the first arming on a new environment, verify
against current docs or the live tool schema what this file claims, and
update this file when you find drift — that is the same honesty convention
the forge's agent-compatibility notes follow.
