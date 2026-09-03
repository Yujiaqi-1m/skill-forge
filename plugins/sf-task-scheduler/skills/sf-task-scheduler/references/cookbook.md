# Cookbook

Copy-ready detail for the sf-task-scheduler skill. Cited from SKILL.md as
"cookbook §N". Everything here is reference material — the workflow lives
in SKILL.md.

**Contents** — §1 paths & invocation · §2 task record schema · §3 CLI
manual · §4 timestamps & timezones · §5 gitignore guidance · §6 OS-level
upgrade path · §7 manual fallback without python3 · §8 troubleshooting

## §1 Paths and invocation

Records live in `<workdir>/.tasks/`, one JSON file per task, named
`<id>.json`. The helper sits next to SKILL.md:

```bash
python3 <skill-dir>/scripts/task.py <command> [--tasks-dir <dir>]
```

`--tasks-dir` defaults to `$PWD/.tasks` — always pass it explicitly when
operating on a task whose workdir differs from your current directory.
Exit codes: `0` ok · `1` usage/validation error · `2` not-found or conflict
(duplicate completion, unknown id, ambiguous prefix).

## §2 Task record schema

```json
{
  "schema": 1,
  "id": "20260827-153000-release-check",
  "title": "Verify release branch before tagging v2.4.0",
  "status": "active",
  "created_at": "2026-08-27T15:30:00+08:00",
  "updated_at": "2026-08-27T18:04:11+08:00",
  "workdir": "/Users/dev/pkg",
  "schedule": {
    "kind": "one-shot",
    "fire_at": "2026-08-27T18:00:00+08:00",
    "advance_every": null,
    "repeat": null
  },
  "requirements": [
    "Bump version in pyproject.toml",
    "Changelog entry for the 3 merged PRs"
  ],
  "acceptance": [
    "git tag v2.4.0 points at main",
    "python -m build exits 0"
  ],
  "plan": [
    { "n": 1, "title": "Bump version to 2.4.0", "status": "done" },
    { "n": 2, "title": "Write changelog entry", "status": "pending" }
  ],
  "journal": [
    { "ts": "2026-08-27T18:00:03+08:00", "step": 1, "event": "done",
      "msg": "version bumped; pyproject.toml + __init__.py" }
  ],
  "deliverables": ["dist/pkg-2.4.0.tar.gz"],
  "completed_at": null,
  "aborted_reason": null
}
```

| Field | Semantics |
|---|---|
| `id` | `YYYYMMDD-HHMMSS-slug`; stamped by the helper at creation, stable forever. Accepts unique-prefix addressing. |
| `status` | `active` \| `completed` \| `aborted`. Terminal records stay on disk (audit); `list` hides them unless `--all`. |
| `workdir` | Absolute path pinned at intake — triggers may fire in sessions with a different cwd. |
| `schedule.kind` | `one-shot` — whole plan runs in the firing turn if ≤3 steps pending. `multi-step` — exactly one step per trigger. |
| `schedule.fire_at` | Audit copy of the armed time. The registered trigger is the firing source; this field is for humans and drift checks (§8). |
| `schedule.advance_every` | Re-arm spacing for multi-step (e.g. `"30m"`, `"4h"`), chosen at intake. |
| `schedule.repeat` | Always `null` in v1. Exists to make the no-recurring boundary explicit in the data itself. |
| `requirements` | What the user confirmed at intake. Inferred entries are prefixed `inferred: `. |
| `acceptance` | Completion gate — all must verify true before `complete`. |
| `plan[].status` | `pending` \| `done` \| `skipped`. `n` is 1-based and never renumbered. |
| `journal[]` | Append-only checkpoint log. `event` ∈ `done` \| `skipped` \| `note` \| `blocked` \| `resumed` \| `aborted` \| `completed`; `step` present when an entry concerns a plan step. |
| `deliverables` | Artifact paths (absolute, or relative to `workdir`). |
| `completed_at` / `aborted_reason` | Set by `complete` / `abort`; `null` otherwise. |

All timestamps are ISO-8601 **with explicit offset** (§4).

## §3 CLI manual

```
task.py new                     read spec JSON from stdin -> "created <id> <path>"
   stdin: {title, fire_at, kind?, workdir?, advance_every?,
           requirements?, acceptance?, plan[{n?,title}], deliverables?, slug?}
   kind defaults to "one-shot"; plan n auto-numbered when omitted
task.py list [--all]           "<id>  <status>  next=<n|->  <fire_at>  <title>"
task.py show <id>              full record, pretty JSON
task.py next <id>              {id, n, title} of next pending step, or "none"
task.py done <id> <n> "msg"    step -> done + journal entry
task.py skip <id> <n> "msg"    step -> skipped + journal entry (say why)
task.py note <id> "msg" [--event note|blocked|resumed]
task.py deliver <id> <path>... append deliverables + journal entry
task.py complete <id> ["msg"]  status -> completed (refuses if steps pending)
task.py abort <id> "reason"    status -> aborted (record kept)
```

Guard rails (all exit 2): unknown or ambiguous id prefix; `done`/`skip` on a
non-pending step or a terminal task; `complete` on a task with pending
steps or already completed; `abort` on a non-active task. Naive timestamps
and malformed specs exit 1.

## §4 Timestamps and timezones

- Every timestamp **stored in the record** carries an explicit UTC offset:
  `2026-08-27T17:30:00+08:00`. The helper rejects naive strings; `Z` is
  accepted and normalized. You compute the offset — the user never has to
  see or write one.
- Default timezone = the session's local timezone (the user's environment,
  e.g. Asia/Shanghai). Do not ask the user for a timezone unless the request
  references another region ("9am London time") or uses a DST-ambiguous
  zone name ("PST" is `−08:00` in winter, `−07:00` in summer — resolve
  against the actual date, or ask).
- Times shown **to the user** are natural local times ("今天 17:30",
  "tomorrow 9am"); mention the zone only when the zone itself is the point.
- Arithmetic across a DST boundary: compute in local time via the calendar
  ("tomorrow 09:00"), not by adding 24h — days are 23h/25h at transitions.
- When you re-arm a multi-step trigger, space from **now**, not from the
  original `fire_at`; journal the new armed time so the record explains the
  drift.

## §5 `.tasks/` and git

Default: gitignore `.tasks/` — records embed machine-local state (absolute
workdirs, transient output paths) and are per-machine resume state, not
team artifacts:

```gitignore
.tasks/
```

Deliberate exception: a team can commit `.tasks/` as a shared audit trail.
Tradeoffs: merge conflicts on concurrent journals (append-only helps but
does not eliminate them), leaked machine paths, and records from teammates'
aborted local experiments. If shared, prefer reviewing records in PRs like
any other artifact.

## §6 OS-level upgrade path (fires with no session open)

The in-session trigger only fires while a session is running and idle. For
fire-while-closed behavior, schedule an **agent CLI headless run** at the
OS level. The trigger target is the same self-locating prompt; the task
record does not change — the OS job simply delivers the message.

macOS (launchd) — `~/Library/LaunchAgents/com.skillforge.task.<id>.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.skillforge.task.20260827-153000-release-check</string>
  <key>ProgramArguments</key><array>
    <string>claude</string><string>-p</string>
    <string>Scheduled task 20260827-153000-release-check fired: run the
    sf-task-scheduler triggered-execution step for
    20260827-153000-release-check in /Users/dev/pkg.</string>
  </array>
  <key>WorkingDirectory</key><string>/Users/dev/pkg</string>
  <key>StartCalendarInterval</key><dict>
    <key>Hour</key><integer>18</integer>
    <key>Minute</key><integer>4</integer>
  </dict>
</dict></plist>
```

`launchctl load ~/Library/LaunchAgents/com.skillforge.task.<id>.plist` to
arm; `unload` + delete the plist to disarm.

Linux (cron) — `crontab -e`:

```cron
4 18 27 8 * cd /Users/dev/pkg && claude -p "Scheduled task <id> fired: run the sf-task-scheduler triggered-execution step for <id> in /Users/dev/pkg."
```

Caveats, stated honestly: the headless run needs permission to act — pass
your CLI's non-interactive permission flags (allowed-tools / permission
mode) or the run will stall on approval; a one-shot OS job should remove
itself after firing (cron: delete the line; launchd: a bare
`StartCalendarInterval` recurs yearly — delete the plist); logs land
wherever the OS job's stdout goes, so redirect them into the workdir if
you want them. This route is per-machine and per-user — it is an upgrade
for a machine you control, not a distribution mechanism.

## §7 Manual fallback (no python3)

If python3 is unavailable, say so explicitly, then keep the discipline by
hand — the format is simple, the rules are not optional:

1. `mkdir -p .tasks` and create `<id>.json` by hand; id =
   `YYYYMMDD-HHMMSS-slug` from the current local time.
2. Copy the §2 schema verbatim; fill every field; journal starts empty.
3. Every timestamp you write gets a UTC offset — compute it, do not guess.
4. Validate the file with whatever JSON tool exists (`node -e
   "JSON.parse(require('fs').readFileSync(0))" < <id>.json`, `jq . <file>`,
   or a fresh in-session read). A record that does not parse does not
   exist.
5. Mutations follow the same order the helper enforces: change one field,
   append one journal entry, bump `updated_at`, re-validate.
6. `complete` still requires every plan step `done`/`skipped` and every
   acceptance check verified — no shortcuts because the tooling is manual.

## §8 Troubleshooting

- **Trigger/record drift** — the registered trigger fires; `fire_at` is an
  audit copy. If they disagree (re-armed late, edited record, restored
  disk): list the session's registered schedules, compare against
  `task.py list`, trust the registered trigger for *when*, the record for
  *what*, journal the mismatch, re-arm if needed.
- **Orphaned records** — `active` records whose triggers are gone (session
  died before durability, schedule deleted by hand). They surface on the
  next scan; either re-arm or `abort` with "trigger lost" so the audit
  trail explains the gap.
- **Duplicate ids** — same-second creation with the same slug gets `-2`
  suffixed automatically. Two *different* machines writing into one shared
  `.tasks/` can still collide (clock skew); the prefix match then reports
  ambiguity (exit 2) — fix by renaming the `id` field and filename
  together, touching nothing else.
- **Concurrent sessions on one record** — atomic replace prevents torn
  writes but not lost updates (last writer wins per whole-file). Accept the
  limit: one task, one session at a time; journal entries lost this way are
  recoverable by re-verifying the step's output (that is why steps are
  idempotent-or-checkable).
- **A `done` step's output is missing** — investigate before redoing: later
  steps may have consumed or moved it. If truly lost, `note --event
  blocked` with the finding, then redo deliberately.
