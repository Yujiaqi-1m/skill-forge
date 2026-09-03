---
name: sf-task-scheduler
description: >
  Run delayed and multi-step tasks on a schedule with crash-safe resume:
  interview until the request is unambiguous, write a task record under
  .tasks/, arm a one-shot time trigger, go silent until it fires, then
  execute step by step with a timestamped journal so an interrupted run
  continues from the last checkpoint instead of restarting. Trigger when
  the user says "下午5点帮我跑", "到点再做", "定时任务", "那个任务进展如何",
  "继续之前没做完的任务", "run this at 6pm", "schedule this for later",
  "resume the pending task", "what happened to my scheduled task".
  Boundary: one-shot and multi-step tasks only — recurring/periodic work
  ("every day at 9am") is declined and redirected; nothing fires while no
  session is open (see references/ for the OS-level upgrade path).
license: MIT
compatibility: "Agent Skills standard; tested with Claude Code, OpenAI Codex CLI, and pi"
---

# Task Scheduler

Turn "do this at 5pm, not now" into a durable, resumable commitment: a task
record on disk, a time trigger armed in the session's scheduling facility,
and a checkpointed journal that lets an interrupted run continue where it
stopped instead of restarting. The quality bar: every state transition goes
through the helper script, every journal entry is timestamped with a UTC
offset, and between commit and firing the user hears exactly one line.

## Workflow

1. **Intake** — interview until the request is unambiguous, then get the
   user's confirmation.
2. **Commit and arm** — write the task record via the helper, arm a one-shot
   trigger, confirm in one line.
3. **Silent** — no output, no reminders, no restatements until the trigger
   fires or the user asks.
4. **Triggered execution** — locate the task, execute the next step,
   journal it the moment it finishes.
5. **Resume** (after an abnormal exit) — reload the journal, verify what is
   already done, continue at the first pending step.
6. **Complete** — after every acceptance check verifies true, mark the task
   completed; the record stays on disk as an audit trail.

## The state machine

| State | Entered by | Exits | Persistent evidence |
|---|---|---|---|
| intake | user request | confirmation → commit; ambiguity → more questions | none yet (do not write files) |
| armed (silent) | `task.py new` + trigger registered | trigger fires → executing; user cancels → abort | record with `status: active`, empty journal |
| executing | trigger fired, or resume scan | step done → journal entry; all steps done → complete | journal entries, plan step statuses |
| blocked | an acceptance check or step fails | fix + re-arm, or user decides → abort | journal entry with event `blocked` |
| completed | `task.py complete` | terminal (record kept) | `completed_at`, final journal entry |
| aborted | `task.py abort` | terminal (record kept) | `aborted_reason`, final journal entry |

## Step 1: Intake

Do not write anything to disk until five things are pinned down. Ask before
building when any of them is ambiguous — a delayed task with a vague spec
fires into a context where the user is not watching, so this is the last
moment cheap questions can be asked.

1. **Absolute fire time.** Resolve "6pm-ish" and relative words (tonight,
   tomorrow morning) to an exact local date-time in the **user's own
   timezone** — the session's local timezone is the default; do not ask
   for a timezone unless the request references another region or a
   genuinely DST-ambiguous zone name. The record still stores an explicit
   UTC offset (you resolve it — the user never has to), while times you
   show the user stay natural local times ("今天 17:30"), mentioning the
   zone only when the zone itself matters (cross-region handoffs).
2. **Workdir.** Where the task runs. Default: the project root of the
   current conversation. Pin it as an absolute path — the trigger may fire
   in a session whose working directory differs.
3. **Deliverables.** What artifacts exist when the task is done (file
   paths, a report, a green test run). "It's finished" is not a deliverable.
4. **Acceptance checks.** How completion is verified — commands to run,
   files to inspect, conditions to hold. These become the completion gate
   in Step 6.
5. **Plan steps.** Decompose into ordered steps, each small enough to
   finish in one trigger, and each **idempotent or verifiable** — meaning
   running it twice is harmless, or its output can be checked for existence.
   This is what makes resume safe: on recovery, a done step's output is
   verified, not redone.

If the user says "don't ask, just do it", infer all five answers, record
them in `requirements` flagged as inferred (prefix each with "inferred: "),
and proceed to commit.

## Step 2: Commit and arm

Build the spec and pipe it to the helper — path resolved relative to this
SKILL.md's directory:

```bash
python3 scripts/task.py new --tasks-dir <workdir>/.tasks <<'SPEC'
{
  "title": "...",
  "fire_at": "2026-08-27T17:30:00+08:00",
  "kind": "one-shot",
  "workdir": "/abs/path/to/project",
  "requirements": ["what the user confirmed"],
  "acceptance": ["exit code 0 from ...", "file X contains Y"],
  "plan": [{"title": "step one"}, {"title": "step two"}]
}
SPEC
```

`kind` is `one-shot` (whole plan runs when the trigger fires, if it has at
most 3 pending steps) or `multi-step` (exactly one step per trigger; include
`"advance_every": "30m"` to say how the next trigger is spaced). The helper
stamps the id (`YYYYMMDD-HHMMSS-slug`), validates the timestamp offset, and
creates the record. Full field semantics and the CLI manual: cookbook §2–3.

Then verify before arming (see Verification): `task.py show <id>` parses and
`task.py next <id>` returns step 1.

**Arm the trigger** through your session's built-in scheduling facility if
it has one — exact per-environment instructions live in
[references/agent-scheduling.md](references/agent-scheduling.md); read it
before the first arming on a new environment. The trigger must be one-shot
(fires once, then gone) and its prompt text must be self-locating so any
session that receives it finds the task without guessing:

```
Scheduled task <id> fired: run the sf-task-scheduler triggered-execution
step for <id> in <workdir>.
```

If the environment has no scheduling facility, say so plainly and offer the
fallbacks: the OS-level route (cookbook §6) or mention-based resume (the
task still executes whenever the user next mentions pending work in this
project — the record is already on disk).

**Then confirm in one line** — task id, resolved fire time, first step —
in the user's language, and stop. Example for a Chinese-speaking user:
`任务 20260827-153000-release-check 已挂好：今天 17:30 触发，第一步「跑
完整测试」；共 7 步，到点后边做边记日志。` Natural local time, no offset
notation. Nothing else in this turn.

## Step 3: Go silent

Between commit and firing: no progress updates, no reminders as the time
approaches, no restating the task on unrelated turns. The user asked for
work to happen *later* — status chatter defeats the point of deferring it.
Concretely: end the turn after the one-line confirmation, and on later
unrelated turns do not resurrect the task.

If the user asks ("那个任务怎么样了?", "what's the state of my task?"),
answer tersely from the record — `task.py show` or `list` — covering: id,
status, steps done/pending, next fire time if re-armed, last journal entry.
Then go silent again.

## Step 4: Triggered execution

When the trigger fires (its text carries the id), or when the user points
at pending work:

1. **Locate the task.** Take the id from the trigger text; if there is
   none, list active tasks and match on context. Multiple active tasks →
   ask the user which one (or take the one whose `fire_at` has passed).
2. **Enter the workdir** recorded on the task.
3. **Get the next step**: `python3 scripts/task.py next <id>`.
4. **Execute exactly one step** — unless the task is `one-shot` with ≤3
   pending steps, in which case run to completion, journaling each step as
   it finishes.
5. **Journal the moment a step finishes**, before anything else:
   `task.py done <id> <n> "what was done"`. Work performed but not
   journaled is work a crash will make the next run redo — the journal
   entry is the checkpoint.
6. **Record artifacts**: `task.py deliver <id> <path> ...` for anything the
   step produced that counts as a deliverable.
7. **Re-arm if steps remain** (multi-step): a fresh one-shot spaced by
   `advance_every` from now, same trigger-text template. This is successive
   one-shot arming bounded by the plan's end — not the recurring feature
   this skill declines (see Out of scope).
8. If a step cannot finish, `task.py note <id> "..." --event blocked`,
   decide whether to re-arm or surface to the user, and end the turn
   without silently swallowing the failure.

## Step 5: Resume after interruption

Nothing is installed anywhere — no hooks, no background daemons. Recovery
rides on two mechanisms only: the scheduling facility's catch-up of missed
one-shot triggers after a restart (where the environment supports it —
references/agent-scheduling.md), and this skill scanning `.tasks/` for
`status: active` whenever it triggers or the user mentions pending work.

On resume:

1. Read the record and journal (`task.py show <id>`).
2. Treat every `done` step as finished — **verify its output exists rather
   than redoing it**. A done step whose output is missing is a signal, not
   a to-do: investigate what happened before overwriting anything (was the
   artifact moved? did a later step consume it?). If genuinely lost,
   journal `blocked` with the finding before redoing.
3. `task.py note <id> "resuming after interruption at step N"
   --event resumed`, then continue at the first `pending` step under normal
   triggered-execution rules.
4. The registered trigger and the record's `fire_at` can drift (the
   trigger is the firing source; `fire_at` is an audit copy). If they
   disagree, trust the registered trigger, journal the mismatch, and re-arm
   from the current state. Drift-check recipe: cookbook §8.

## Step 6: Complete

Run every acceptance check from the record — actually run it: execute the
command, inspect the file, test the condition. All true →
`python3 scripts/task.py complete <id>`. Any false → journal `blocked` with
which check failed and why, then re-arm (multi-step) or report to the user.
Never mark complete on "the steps felt done"; the acceptance list is the
gate the user agreed to at intake.

The record is never deleted on completion — completed and aborted records
stay in `.tasks/` as the audit trail of what was promised, done, and when.

## Rules

Each rule exists because breaking it produced a real failure mode.

- **Timestamps always carry a UTC offset.** Naive times are ambiguous
  across timezones and DST, and a resume that misreads "9:00" by hours
  fires at the wrong moment. The helper rejects naive strings — do not
  work around it by inventing an offset for a time the user gave without
  one; ask.
- **One JSON file per task, no index file.** `task.py list` is the index; a
  separate index is a second source of truth that drifts from the records.
- **Only the helper writes records.** Hand-editing nested JSON loses
  offsets, trailing commas corrupt files, and every such edit is invisible
  to the journal. If python3 is unavailable, say so explicitly and use the
  manual checklist in cookbook §7 instead of silently hand-editing.
- **Journal immediately after each step.** The journal is the checkpoint;
  batching entries at the end of a turn loses everything to a crash mid-turn.
- **Record and replies follow the user's language.** The record is the
  audit trail the user reads back ("那个任务现在怎么样了?" is answered
  from it), so title, requirements, acceptance, plan step titles, and
  journal messages are written in the user's conversation language — not
  switched to English just because surrounding code and file names are
  English. Paths, commands, and identifiers stay verbatim.
- **`.tasks/` is gitignored by default.** Records contain machine-local
  state (absolute workdirs, transient paths). Teams who want a shared
  audit trail may commit it deliberately — tradeoffs in cookbook §5.
- **Abort over delete.** `task.py abort <id> "reason"` keeps the story;
  deleting a record erases what was promised and why it stopped.
- **One step per trigger for multi-step tasks.** Bounds the blast radius of
  any single firing and gives a natural checkpoint cadence; `one-shot`
  tasks may run to completion only because their plan is small (≤3 steps).

## Out of scope

**Recurring/periodic work** ("每天早上9点跑一次", "every day at 9am") is
declined: this skill deliberately does one-shot and multi-step tasks that
end. Respond with one line naming the boundary, then stay helpful — offer
the nearest in-scope shape (a single run at the next occurrence: "I can arm
one for tomorrow 9:00; want me to re-arm it after each run?") and the real
alternatives: the environment's own recurring facility if it has one
(references/agent-scheduling.md), or an OS-level scheduler job that invokes
an agent session headlessly (cookbook §6). Never create a record or arm a
recurring trigger for these requests.

Also out of scope and worth saying out loud when relevant: **nothing fires
while no session is open.** The trigger lives in the running session's
scheduling facility; a closed laptop fires nothing. If the user needs
fire-while-closed behavior, that is the OS-level route (cookbook §6).

## Verification

Self-checks are mandatory, not optional polish — a broken record is silent
until the worst possible moment (the fire time).

- After `new`: `task.py show <id>` must parse and display the record;
  `task.py next <id>` must return step 1. If either fails, the task is not
  committed — fix before arming.
- After every mutation (`done`, `note`, `deliver`, `complete`): re-run
  `show` and confirm the intended field actually changed. Cheap insurance
  against writing to the wrong task or step.
- Before `complete`: re-run each acceptance check from the record and
  watch it pass. A check you cannot run is a check that has not passed.
- If python3 is missing on this machine, say so explicitly and follow the
  manual-edit checklist in cookbook §7 — do not skip verification silently.

## Recap

1. No naive timestamps — resolve times to an absolute moment with a UTC
   offset before committing anything.
2. One confirmation line, then silence until the trigger fires or the user
   asks.
3. One step per trigger (multi-step), journaled the moment it finishes.
4. Resume = verify-then-continue; never blindly redo a step the journal
   says is done.
5. Only the helper writes the record; verify every mutation with `show`.
