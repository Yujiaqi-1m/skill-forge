# Agent compatibility

How skill-forge skills stay usable across coding agents. Facts below were
verified against each agent's documentation in **August 2026** — re-check
before making structural changes.

## Design decision

**Real skill content lives at `plugins/<name>/skills/<name>/` (one place).
`.agents/skills/<name>` holds a committed *relative* symlink into it.
User-scope installs go to `~/.claude/skills/` (Claude, symlinks) or
`~/.agents/skills/` (Codex, symlinks; pi, **copies** — see limitations
below) via `scripts/install.sh`.**

Why not the reverse (a root `skills/` dir with plugin wrappers around it):
Claude Code **copies** the plugin directory out of the cloned marketplace
when installing a plugin. A symlink *inside* the plugin pointing to a
sibling directory would arrive at `~/.claude/plugins/…` as a dangling link —
a dead skill. Symlinks placed only in `.agents/skills/` (which the Claude
installer never touches) make the copy behavior irrelevant.

## Verified limitations (August 2026)

Empirically tested against **pi v0.80.6** — conclusions may change with
newer versions, re-test before relying on them:

| What | Result |
|---|---|
| Symlinked skill dir inside a scanned location (`.agents/skills/`, `~/.agents/skills/`) | **Not discovered** — pi's scan does not follow symlinks |
| `--skill <symlink-path>` | **Not loaded** |
| `--skill <real-path>` (e.g. `plugins/<name>/skills/<name>`) | Works |
| Real skill dir inside `.agents/skills/` / `~/.agents/skills/` | Discovered |
| `skills` array in project `.pi/settings.json` / user `~/.pi/agent/settings.json` | **Not loaded** in this version (despite docs) |

Consequences baked into this repo:

- The committed `.agents/skills/` symlinks serve **Codex only** (Codex
  officially supports symlinked skill folders). They are harmless for pi
  and will start working for pi if pi fixes symlink following upstream.
- `scripts/install.sh --agent pi` therefore defaults to **copy mode** into
  `~/.agents/skills/` (copies are discovered). Re-run it after `git pull`
  to refresh; `--force` refreshes a stale copy.
- One-off pi usage without installing:
  `pi --skill /path/to/skill-forge/plugins/<name>/skills/<name>`.
- Claude Code: symlinks in `~/.claude/skills/` work; the marketplace
  remains the recommended path anyway.

## Discovery paths (verified Aug 2026)

| Agent | User scope | Repo scope | Notes |
|---|---|---|---|
| Claude Code | `~/.claude/skills/` | `.claude/skills/` | Plugins via marketplaces are the primary distribution; skills load from `plugins/<name>/skills/<name>/`. |
| OpenAI Codex CLI | `~/.agents/skills/` | `$REPO_ROOT/.agents/skills/` (scanned from cwd up to the repo root), plus `/etc/codex/skills/` (admin) | Optional per-skill `agents/openai.yaml` (UI metadata, invocation policy, MCP tool dependencies). Symlinked skill folders are officially supported. |
| pi (pi.dev) | `~/.pi/agent/skills/`, `~/.agents/skills/` | `.pi/skills/`, `.agents/skills/` in cwd + ancestors (up to the git root) | Implements the Agent Skills standard leniently (warnings, still loads). Skills register as `/skill:<name>` commands. **Does not follow symlinks** (verified v0.80.6) — needs real directories; see Verified limitations. |

`.agents/skills/` is the shared convention Codex and pi both read — that is
why this repo commits entries there (symlinks for Codex; pi users install
copies at user scope).

## Scope caveats

- Repo-scope `.agents/skills/` is discovered **only when the agent's cwd is
  inside this clone** (ancestor scan). If you use the forge clone as a
  nested directory of another project, that project's Codex/pi sessions
  will NOT see the skills — install at user scope instead
  (`./scripts/install.sh --agent codex|pi`).
- For Claude Code users, the marketplace remains the recommended path —
  it handles updates and per-skill versioning:
  `/plugin marketplace add Yujiaqi-1m/skill-forge`.

## Platform notes

- Git stores the `.agents/skills/*` symlinks as mode-120000 entries; clones
  on macOS/Linux materialize them as real symlinks (targets are relative,
  so any clone path works).
- **Windows**: without `core.symlinks` + Developer Mode, git checks symlinks
  out as plain text files. Run `./scripts/install.sh --copy` from Git Bash —
  it copies skill directories instead of linking them (copies do not track
  upstream; re-run after `git pull`).

## Authoring rules for agent-neutrality

1. **Frontmatter**: standard subset only — `name` (lowercase a-z0-9
   hyphens, ≤64 chars, **must equal the directory name**), `description`
   (≤1024 chars, non-empty); optional `license`, `compatibility` (≤500),
   `metadata`. Claude-only extras (`allowed-tools`,
   `disable-model-invocation`) are tolerated — pi understands them, Codex
   ignores unknown fields — but avoid unless needed.
2. **Body**: no slash commands or harness-specific tool names. Say "view
   the rendered PNG with your image-reading tool", not "use the Read tool".
   (`scripts/validate.sh` lints for this.)
3. **Scripts**: plain POSIX shell or node with no agent assumptions; state
   missing-tool fallbacks explicitly.
4. **Description is the router** in every agent: it is the only part always
   in context; front-load capability and trigger words (Codex shortens long
   skill lists, so early words survive truncation).

## Reference

- Agent Skills specification: <https://agentskills.io/specification>
- Codex skills: <https://developers.openai.com/codex/skills>
- pi skills: <https://pi.dev/docs/latest/skills>
