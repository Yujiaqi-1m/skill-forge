#!/usr/bin/env bash
#
# install.sh — expose skill-forge skills to a coding agent.
#
# Symlink-based (default) and idempotent: re-running prints "already OK".
# Use --copy on filesystems without symlink support (e.g. Windows Git Bash
# without core.symlinks) — copies do NOT track upstream, re-run after git pull.
#
# Usage:
#   ./scripts/install.sh --agent claude|codex|pi|all [--skill <name>|--all]
#                        [--scope user|repo] [--copy] [--uninstall] [--force]
#
# Destinations:
#   claude:user  ~/.claude/skills/<name>          (Claude Code user skills)
#   codex:user   ~/.agents/skills/<name>          (Codex CLI user skills)
#   pi:user      ~/.agents/skills/<name>          (same dir, installed as a COPY —
#                                                  pi ignores symlinked skills)
#   *:repo       <repo>/.agents/skills/<name>     (or .claude/skills for claude;
#                                                  repo-scope discovery only works
#                                                  while the agent's cwd is inside
#                                                  this clone)
#
# Recommended for Claude Code users: the marketplace instead —
#   /plugin marketplace add Yujiaqi-1m/skill-forge
#   /plugin install <skill>@skill-forge

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS=()
SKILLS=()
SCOPE="user"
MODE="link"
UNINSTALL=0
FORCE=0

usage() {
  cat <<'USAGE'
Usage:
  ./scripts/install.sh --agent claude|codex|pi|all [--skill <name>|--all]
                       [--scope user|repo] [--copy] [--uninstall] [--force]

Modes:
  link (default)  symlink agent skill dirs into this clone — tracks upstream.
  --copy          copy instead of link — for filesystems without symlinks, and
                  automatically for pi (which ignores symlinked skills).
USAGE
  exit "${1:-0}"
}

die() { echo "install.sh: $*" >&2; exit 1; }
info() { echo "  $*"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent)     AGENTS+=("$2"); shift 2 ;;
    --skill)     SKILLS+=("$2"); shift 2 ;;
    --scope)     SCOPE="$2"; shift 2 ;;
    --copy)      MODE="copy"; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    --force)     FORCE=1; shift ;;
    -h|--help)   usage 0 ;;
    *)           usage 1 ;;
  esac
done

[[ ${#AGENTS[@]} -gt 0 ]] || die "missing --agent (claude|codex|pi|all)"
for a in "${AGENTS[@]}"; do
  [[ $a == claude || $a == codex || $a == pi || $a == all ]] || die "unknown agent '$a'"
done
[[ $SCOPE == user || $SCOPE == repo ]] || die "unknown scope '$SCOPE' (user|repo)"

# Default: every plugin in the forge.
if [[ ${#SKILLS[@]} -eq 1 && ${SKILLS[0]} == all ]]; then SKILLS=(); fi
if [[ ${#SKILLS[@]} -eq 0 ]]; then
  shopt -s nullglob
  for d in "$REPO_ROOT"/plugins/*/; do SKILLS+=("$(basename "$d")"); done
  shopt -u nullglob
  [[ ${#SKILLS[@]} -gt 0 ]] || die "no plugins found under $REPO_ROOT/plugins"
fi
for s in "${SKILLS[@]}"; do
  [[ -f "$REPO_ROOT/plugins/$s/skills/$s/SKILL.md" ]] \
    || die "$s: no plugins/$s/skills/$s/SKILL.md (run scripts/validate.sh)"
done

# Expand "all".
expanded=()
for a in "${AGENTS[@]}"; do
  if [[ $a == all ]]; then expanded+=(claude codex pi); else expanded+=("$a"); fi
done

# pi does not follow symlinked skills anywhere — scanning ~/.agents/skills,
# the --skill flag, and settings skills arrays all ignore symlinks (verified
# against pi v0.80.6, Aug 2026; real directories work). Fail fast on the
# unsupported combination; per-agent mode defaulting happens in the loop.
for a in "${expanded[@]}"; do
  if [[ $a == pi && $MODE == link && $SCOPE == repo ]]; then
    die "pi ignores symlinked skills, and real copies are not committed at repo scope — install pi at user scope instead (--scope user), or start pi with --skill plugins/<name>/skills/<name>"
  fi
done

dest_dir_for() { # $1 agent, $2 scope
  case "$1:$2" in
    claude:user) echo "$HOME/.claude/skills" ;;
    claude:repo) echo "$REPO_ROOT/.claude/skills" ;;
    codex:*|pi:*) # both read the same convention dir
      if [[ $2 == user ]]; then echo "$HOME/.agents/skills"; else echo "$REPO_ROOT/.agents/skills"; fi ;;
  esac
}

# ensure_link <link_path> <abs_target> <rel_target> <mode>
ensure_link() {
  local link="$1" abs_target="$2" rel_target="$3" mode="$4"
  local parent; parent="$(dirname "$link")"
  mkdir -p "$parent"

  if [[ $UNINSTALL -eq 1 ]]; then
    if [[ -L $link ]]; then
      local cur; cur="$(readlink "$link")"
      local resolved
      resolved=$(cd "$parent" && cd "$(dirname "$cur")" 2>/dev/null && echo "$(pwd)/$(basename "$cur")" || true)
      if [[ $resolved == "$abs_target" || $resolved == "$REPO_ROOT"* ]]; then
        rm "$link"; info "removed $link"
      else
        info "SKIPPED $link (points outside this repo; remove manually)"
      fi
    elif [[ -e $link ]]; then
      if [[ $FORCE -eq 1 ]]; then rm -rf "$link"; info "force-removed $link"
      else info "SKIPPED $link (not a symlink; use --force to remove a copied skill)"; fi
    else
      info "$link not present (nothing to do)"
    fi
    return
  fi

  if [[ -L $link ]]; then
    local cur; cur="$(readlink "$link")"
    local ours=0
    if [[ $cur == "$abs_target" || $cur == "$rel_target" ]]; then ours=1; fi
    # Already installed — only a no-op in link mode with our own target.
    if [[ $mode == link && $ours -eq 1 ]]; then info "already OK: $link"; return; fi
    if [[ $ours -eq 0 && $FORCE -eq 0 ]]; then
      die "$link already points at '$cur' (use --force to replace)"
    fi
    rm "$link"
  elif [[ -e $link ]]; then
    # A real directory that IS this skill (e.g. a copy left by a pi install)
    # works for every agent — treat as installed, not a conflict.
    if [[ $FORCE -eq 0 && -d $link && -f "$link/SKILL.md" ]] && head -n 12 "$link/SKILL.md" | grep -q "^name: $(basename "$link")\$"; then
      info "already OK (copy): $link — use --force to refresh"
      return
    fi
    [[ $FORCE -eq 1 ]] || die "$link already exists and is not our skill (use --force to replace)"
    rm -rf "$link"
  fi

  if [[ $mode == copy ]]; then
    cp -R "$abs_target" "$link"
    info "copied -> $link (does not track upstream; re-run after git pull)"
  else
    # Absolute targets survive anywhere; relative targets keep the repo
    # self-contained (matches the committed .agents/skills convention).
    if [[ ${link#"$REPO_ROOT"} != "$link" ]]; then
      ln -s "$rel_target" "$link"
    else
      ln -s "$abs_target" "$link"
    fi
    info "linked -> $link"
  fi
}

for agent in "${expanded[@]}"; do
  dest="$(dest_dir_for "$agent" "$SCOPE")"
  agent_mode="$MODE"
  if [[ $agent == pi && $agent_mode == link ]]; then
    agent_mode=copy
    echo "note: pi ignores symlinked skills (verified v0.80.6) — using copy mode; re-run after git pull"
  fi
  mode_label="$agent_mode"
  [[ $UNINSTALL -eq 1 ]] && mode_label="uninstall"
  echo "[$agent] scope=$SCOPE mode=$mode_label dest=$dest"
  for s in "${SKILLS[@]}"; do
    src="$REPO_ROOT/plugins/$s/skills/$s"
    ensure_link "$dest/$s" "$src" "../../plugins/$s/skills/$s" "$agent_mode"
  done
done

echo
if [[ $UNINSTALL -eq 1 ]]; then
  echo "Done uninstalling. Note: marketplace-based Claude installs are managed by Claude Code, not this script."
  exit 0
fi
echo "Done. Next steps per agent:"
echo "  claude: skills in ~/.claude/skills load at next session start."
echo "          (Prefer the marketplace: /plugin marketplace add Yujiaqi-1m/skill-forge)"
echo "  codex:  user skills in ~/.agents/skills are picked up on next codex run."
if [[ " ${expanded[*]} " == *" pi "* ]]; then
  echo "  pi:     copies in ~/.agents/skills register as /skill:<name> commands."
  echo "          One-off without installing: pi --skill <clone>/plugins/<name>/skills/<name>"
fi
[[ " ${expanded[*]} " == *" claude "* && $SCOPE == repo ]] && \
echo "  note:   repo-scope .claude/ is gitignored here (private); share via the marketplace."
exit 0
