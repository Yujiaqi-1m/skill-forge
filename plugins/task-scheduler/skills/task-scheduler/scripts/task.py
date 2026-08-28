#!/usr/bin/env python3
"""task.py — deterministic state manager for .tasks/ task records.

Stdlib only, Python 3.8+. Invoke as `python3 scripts/task.py ...` from the
skill directory (no executable bit needed, travels with the skill folder).

Every mutation is atomic (write .tmp, os.replace) and stamps updated_at.
Timestamps must carry a UTC offset — naive strings are rejected because
they are the classic resume failure. Exit codes: 0 ok, 1 usage/validation,
2 not-found/conflict.
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime

SCHEMA_VERSION = 1
NOTE_EVENTS = ("note", "blocked", "resumed")


# --- small helpers --------------------------------------------------------

def fail(code, msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


def now_iso():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def parse_ts(value, field):
    """Validate an ISO-8601 timestamp with explicit UTC offset; return it
    normalized (trailing Z -> +00:00 so py3.8-3.10 fromisoformat copes)."""
    s = str(value).strip()
    if s.endswith(("Z", "z")):
        s = s[:-1] + "+00:00"
    try:
        dt = datetime.fromisoformat(s)
    except ValueError:
        fail(1, f"{field}: not ISO-8601: {value!r}")
    if dt.tzinfo is None or dt.utcoffset() is None:
        fail(1, f"{field}: naive timestamp rejected — include a UTC offset "
                f"(e.g. 2026-08-27T17:30:00+08:00): {value!r}")
    return s


def make_slug(title, explicit=None):
    src = (explicit or title or "").lower()
    slug = "-".join(re.findall(r"[a-z0-9]+", src))[:24].strip("-")
    return slug or "task"


# --- storage --------------------------------------------------------------

def load_all(tdir):
    """Map task-id -> path for every record in the tasks dir."""
    if not os.path.isdir(tdir):
        return {}
    return {fn[:-5]: os.path.join(tdir, fn)
            for fn in sorted(os.listdir(tdir)) if fn.endswith(".json")}


def resolve(tdir, prefix):
    """Expand a (possibly partial) task id to exactly one record."""
    matches = [(tid, path) for tid, path in load_all(tdir).items()
               if tid == prefix or tid.startswith(prefix)]
    if not matches:
        fail(2, f"no task matches id prefix {prefix!r} in {tdir}")
    if len(matches) > 1:
        fail(2, f"ambiguous id prefix {prefix!r}: matches "
                + ", ".join(tid for tid, _ in matches))
    return matches[0]


def read_record(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_record(tdir, rec):
    rec["updated_at"] = now_iso()
    os.makedirs(tdir, exist_ok=True)
    path = os.path.join(tdir, rec["id"] + ".json")
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(rec, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, path)
    return path


def journal_append(rec, event, msg, step=None):
    entry = {"ts": now_iso()}
    if step is not None:
        entry["step"] = step
    entry["event"] = event
    entry["msg"] = msg
    rec["journal"].append(entry)


def str_list(spec, field, default=None):
    val = spec.get(field, default if default is not None else [])
    if not isinstance(val, list) or not all(isinstance(x, str) and x.strip()
                                           for x in val):
        fail(1, f"spec.{field}: must be an array of non-empty strings")
    return val


# --- subcommands ----------------------------------------------------------

def cmd_new(args):
    try:
        spec = json.load(sys.stdin)
    except ValueError as e:
        fail(1, f"stdin is not valid JSON: {e}")
    if not isinstance(spec, dict):
        fail(1, "stdin spec must be a JSON object")

    title = spec.get("title")
    if not isinstance(title, str) or not title.strip():
        fail(1, "spec.title: required non-empty string")
    fire_at = parse_ts(spec.get("fire_at"), "spec.fire_at")
    kind = spec.get("kind", "one-shot")
    if kind not in ("one-shot", "multi-step"):
        fail(1, "spec.kind: must be 'one-shot' or 'multi-step'")
    advance_every = spec.get("advance_every")
    if advance_every is not None and not isinstance(advance_every, str):
        fail(1, "spec.advance_every: duration string like '30m' or null")

    plan_spec = spec.get("plan")
    if not isinstance(plan_spec, list) or not plan_spec:
        fail(1, "spec.plan: required non-empty array of {title} or {n,title}")
    plan, seen = [], set()
    for item in plan_spec:
        if not isinstance(item, dict) or not str(item.get("title", "")).strip():
            fail(1, "spec.plan: every step needs a non-empty title")
        n = item.get("n")
        if n is None:
            n = len(plan) + 1
        if not isinstance(n, int) or isinstance(n, bool) or n < 1 or n in seen:
            fail(1, f"spec.plan: bad or duplicate step number {n!r}")
        seen.add(n)
        plan.append({"n": n, "title": str(item["title"]).strip(),
                     "status": "pending"})
    plan.sort(key=lambda s: s["n"])

    stamp = datetime.now().astimezone().strftime("%Y%m%d-%H%M%S")
    base = f"{stamp}-{make_slug(title, spec.get('slug'))}"
    existing = load_all(args.tasks_dir)
    tid, i = base, 0
    while tid in existing:
        i += 1
        tid = f"{base}-{i}"

    rec = {
        "schema": SCHEMA_VERSION,
        "id": tid,
        "title": title.strip(),
        "status": "active",
        "created_at": now_iso(),
        "updated_at": now_iso(),
        "workdir": os.path.abspath(spec.get("workdir") or os.getcwd()),
        "schedule": {"kind": kind, "fire_at": fire_at,
                     "advance_every": advance_every, "repeat": None},
        "requirements": str_list(spec, "requirements"),
        "acceptance": str_list(spec, "acceptance"),
        "plan": plan,
        "journal": [],
        "deliverables": str_list(spec, "deliverables"),
        "completed_at": None,
        "aborted_reason": None,
    }
    path = save_record(args.tasks_dir, rec)
    print(f"created {tid} {path}")


def cmd_list(args):
    for tid, path in sorted(load_all(args.tasks_dir).items()):
        rec = read_record(path)
        status = rec.get("status", "?")
        if status != "active" and not args.all:
            continue
        nxt = next((s["n"] for s in rec.get("plan", [])
                    if s.get("status") == "pending"), None)
        fire = rec.get("schedule", {}).get("fire_at", "-")
        print(f"{tid}  {status}  next={nxt if nxt is not None else '-'}  "
              f"{fire}  {rec.get('title', '')}")


def cmd_show(args):
    tid, path = resolve(args.tasks_dir, args.id)
    print(json.dumps(read_record(path), ensure_ascii=False, indent=2))


def cmd_next(args):
    tid, path = resolve(args.tasks_dir, args.id)
    for s in read_record(path).get("plan", []):
        if s.get("status") == "pending":
            print(json.dumps({"id": tid, "n": s["n"], "title": s["title"]},
                             ensure_ascii=False))
            return
    print("none")


def _step_status(args, want):
    tid, path = resolve(args.tasks_dir, args.id)
    rec = read_record(path)
    if rec.get("status") != "active":
        fail(2, f"{tid}: status is {rec.get('status')}; "
                "only active tasks accept step updates")
    for s in rec.get("plan", []):
        if s["n"] == args.n:
            if s["status"] != "pending":
                fail(2, f"{tid}: step {args.n} is already {s['status']}")
            s["status"] = want
            journal_append(rec, want, args.msg, step=args.n)
            save_record(args.tasks_dir, rec)
            remaining = sum(1 for x in rec["plan"] if x["status"] == "pending")
            print(f"{tid}: step {args.n} {want} ({remaining} pending)")
            return
    fail(2, f"{tid}: no step number {args.n}")


def cmd_done(args):
    _step_status(args, "done")


def cmd_skip(args):
    _step_status(args, "skipped")


def cmd_note(args):
    tid, path = resolve(args.tasks_dir, args.id)
    rec = read_record(path)
    journal_append(rec, args.event, args.msg)
    save_record(args.tasks_dir, rec)
    print(f"{tid}: noted ({args.event})")


def cmd_deliver(args):
    tid, path = resolve(args.tasks_dir, args.id)
    rec = read_record(path)
    if rec.get("status") != "active":
        fail(2, f"{tid}: status is {rec.get('status')}; "
                "only active tasks accept updates")
    added = [p for p in args.paths if p not in rec["deliverables"]]
    rec["deliverables"].extend(added)
    journal_append(rec, "note", "deliverables: " + ", ".join(added))
    save_record(args.tasks_dir, rec)
    print(f"{tid}: {len(added)} deliverable(s) recorded")


def cmd_complete(args):
    tid, path = resolve(args.tasks_dir, args.id)
    rec = read_record(path)
    status = rec.get("status")
    if status == "completed":
        fail(2, f"{tid}: already completed at {rec.get('completed_at')}")
    if status != "active":
        fail(2, f"{tid}: status is {status}; cannot complete")
    pending = [s["n"] for s in rec.get("plan", [])
               if s.get("status") == "pending"]
    if pending:
        fail(2, f"{tid}: {len(pending)} step(s) still pending ({pending}); "
                "finish or skip them first")
    rec["status"] = "completed"
    rec["completed_at"] = now_iso()
    journal_append(rec, "completed", args.msg or "all plan steps done")
    save_record(args.tasks_dir, rec)
    print(f"{tid}: completed")


def cmd_abort(args):
    tid, path = resolve(args.tasks_dir, args.id)
    rec = read_record(path)
    status = rec.get("status")
    if status != "active":
        fail(2, f"{tid}: status is {status}; only active tasks can abort")
    rec["status"] = "aborted"
    rec["aborted_reason"] = args.reason
    journal_append(rec, "aborted", args.reason)
    save_record(args.tasks_dir, rec)
    print(f"{tid}: aborted — {args.reason}")


# --- cli ------------------------------------------------------------------

class Parser(argparse.ArgumentParser):
    def error(self, message):
        fail(1, f"{message} (try: task.py --help)")


def build_parser():
    p = Parser(prog="task.py",
               description="Deterministic state manager for .tasks/ records.")
    p.add_argument("--tasks-dir", default=os.path.join(os.getcwd(), ".tasks"),
                   help="task record directory (default: $PWD/.tasks)")
    sub = p.add_subparsers(dest="cmd", metavar="command")

    # Accept --tasks-dir after the subcommand too (SUPPRESS keeps the
    # pre-subcommand value when the flag is not repeated).
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--tasks-dir", default=argparse.SUPPRESS,
                        help=argparse.SUPPRESS)

    def sp(*args, **kw):
        kw.setdefault("parents", [common])
        return sub.add_parser(*args, **kw)

    s = sp("new", help="create a task from a JSON spec on stdin")
    s.set_defaults(fn=cmd_new)

    s = sp("list", help="list tasks (active only by default)")
    s.add_argument("--all", action="store_true",
                   help="include completed and aborted records")
    s.set_defaults(fn=cmd_list)

    s = sp("show", help="print one full record as JSON")
    s.add_argument("id", help="task id or unique prefix")
    s.set_defaults(fn=cmd_show)

    s = sp("next", help="print the next pending step, or 'none'")
    s.add_argument("id", help="task id or unique prefix")
    s.set_defaults(fn=cmd_next)

    s = sp("done", help="mark a plan step done and journal it")
    s.add_argument("id", help="task id or unique prefix")
    s.add_argument("n", type=int, help="step number")
    s.add_argument("msg", help="what was done (journal entry)")
    s.set_defaults(fn=cmd_done)

    s = sp("skip", help="mark a plan step skipped and journal why")
    s.add_argument("id", help="task id or unique prefix")
    s.add_argument("n", type=int, help="step number")
    s.add_argument("msg", help="why it is skipped (journal entry)")
    s.set_defaults(fn=cmd_skip)

    s = sp("note", help="append a journal entry without touching the plan")
    s.add_argument("id", help="task id or unique prefix")
    s.add_argument("msg", help="journal text")
    s.add_argument("--event", default="note", choices=NOTE_EVENTS,
                   help="journal event kind (default: note)")
    s.set_defaults(fn=cmd_note)

    s = sp("deliver", help="record deliverable paths on the task")
    s.add_argument("id", help="task id or unique prefix")
    s.add_argument("paths", nargs="+", help="artifact path(s) to record")
    s.set_defaults(fn=cmd_deliver)

    s = sp("complete", help="mark the task completed "
                            "(all steps must be done/skipped)")
    s.add_argument("id", help="task id or unique prefix")
    s.add_argument("msg", nargs="?", default=None,
                   help="optional completion note")
    s.set_defaults(fn=cmd_complete)

    s = sp("abort", help="mark the task aborted (record is kept)")
    s.add_argument("id", help="task id or unique prefix")
    s.add_argument("reason", help="why the task is aborted")
    s.set_defaults(fn=cmd_abort)

    return p


def main(argv):
    args = build_parser().parse_args(argv)
    if not getattr(args, "fn", None):
        build_parser().print_help()
        return 1
    args.fn(args)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
