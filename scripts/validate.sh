#!/usr/bin/env bash
#
# validate.sh — lint every skill in this forge against the repo conventions
# and the Agent Skills standard (agentskills.io).
#
# Usage: bash scripts/validate.sh
# Exit:  0 if no errors (warnings allowed), 1 otherwise.

set -u

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ERRORS=0
WARNINGS=0
SKILL_COUNT=0

err()  { echo "ERROR: $*";   ERRORS=$((ERRORS + 1)); }
warn() { echo "WARNING: $*"; WARNINGS=$((WARNINGS + 1)); }

# python3 powers the JSON checks; without it those checks downgrade to warnings.
if command -v python3 >/dev/null 2>&1; then
  HAVE_PY=1
else
  HAVE_PY=0
  warn "python3 not found — JSON files will not be fully validated"
fi

json_ok() { # $1: file — exits 0 iff valid JSON
  python3 -m json.tool "$1" >/dev/null 2>&1
}

# --- frontmatter extraction (awk, no YAML tooling needed) -------------------

fm_name() { # $1: SKILL.md
  awk '
    NR == 1 { if ($0 !~ /^---[ \t]*$/) exit; infm = 1; next }
    infm && /^---[ \t]*$/ { exit }
    infm && /^name:/ { sub(/^name:[ \t]*/, ""); sub(/[ \t]*$/, ""); print; exit }
  ' "$1"
}

# Handles single-line values and `>` / `|` folded blocks; joins lines with
# spaces (folded semantics — good enough for the ≤1024 length check).
fm_description() { # $1: SKILL.md
  awk '
    NR == 1 { if ($0 !~ /^---[ \t]*$/) exit; infm = 1; next }
    infm && /^---[ \t]*$/ { exit }
    infm && state == 0 && /^description:/ {
      sub(/^description:[ \t]*/, "")
      if ($0 ~ /^[>|][+-]?[ \t]*$/) { state = 1; next }
      printf "%s", $0; state = 2; next
    }
    infm && state == 1 {                      # folded/block scalar lines
      if ($0 ~ /^[ \t]*$/) next
      if ($0 ~ /^[^ \t]/) exit                # next key ends the block
      line = $0; sub(/^[ \t]+/, "", line)
      printf "%s%s", (n++ ? " " : ""), line; next
    }
    infm && state == 2 {                      # plain-scalar continuation
      if ($0 ~ /^[^ \t]/) exit
      line = $0; sub(/^[ \t]+/, "", line); printf " %s", line; next
    }
  ' "$1"
}

fm_value() { # $1: SKILL.md, $2: key — single-line value or NULL
  awk -v key="^$2:" '
    NR == 1 { if ($0 !~ /^---[ \t]*$/) exit; infm = 1; next }
    infm && /^---[ \t]*$/ { exit }
    infm && $0 ~ key { sub(key "[ \t]*", ""); sub(/[ \t]*$/, ""); print; exit }
  ' "$1" | sed 's/^"\(.*\)"$/\1/'
}

check_skill() { # $1: plugin dir name
  local name="$1"
  local pdir="$REPO_ROOT/plugins/$name"
  local sdir="$pdir/skills/$name"
  local skill_md="$sdir/SKILL.md"
  SKILL_COUNT=$((SKILL_COUNT + 1))

  # 1. plugin.json
  local pjson="$pdir/.claude-plugin/plugin.json"
  if [[ ! -f $pjson ]]; then
    err "$name: missing .claude-plugin/plugin.json"
  else
    if [[ $HAVE_PY -eq 1 ]]; then
      json_ok "$pjson" || err "$name: plugin.json is not valid JSON"
      local pj_name pj_version
      pj_name=$(python3 -c "import json;print(json.load(open('$pjson')).get('name',''))" 2>/dev/null)
      pj_version=$(python3 -c "import json;print(json.load(open('$pjson')).get('version',''))" 2>/dev/null)
      [[ -n $pj_name ]]         || err "$name: plugin.json has no name"
      [[ $pj_name == "$name" ]] || err "$name: plugin.json name '$pj_name' != dir name"
      [[ -n $pj_version ]]      || err "$name: plugin.json has no version"
      [[ $pj_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || err "$name: version '$pj_version' is not semver"
    fi
  fi

  # 2. one-plugin-per-skill: skills/ holds exactly one dir, named == plugin
  local subdirs
  subdirs=$(find "$pdir/skills" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')
  [[ $subdirs == 1 ]] || err "$name: expected exactly 1 dir under skills/, found $subdirs"
  [[ -d $sdir ]] || { err "$name: missing skills/$name/"; return; }

  # 3-6. SKILL.md + frontmatter
  if [[ ! -f $skill_md ]]; then
    err "$name: missing skills/$name/SKILL.md"
    return
  fi
  head -n 1 "$skill_md" | grep -q '^---' || err "$name: SKILL.md must start with ---"
  awk 'NR>1 && /^---[ \t]*$/ { found=1; exit } END { exit found ? 0 : 1 }' "$skill_md" \
    || err "$name: SKILL.md frontmatter has no closing ---"

  local fmname fmdesc desclen
  fmname=$(fm_name "$skill_md")
  fmdesc=$(fm_description "$skill_md")
  desclen=$(printf '%s' "$fmdesc" | awk '{ print length($0) }')

  [[ -n $fmname ]] || err "$name: SKILL.md frontmatter has no name"
  [[ $fmname =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || err "$name: frontmatter name '$fmname' violates the standard (lowercase a-z0-9 hyphens)"
  [[ ${#fmname} -le 64 ]] || err "$name: frontmatter name exceeds 64 chars"
  [[ $fmname == "$name" ]] || err "$name: frontmatter name '$fmname' != parent dir name (required by the Agent Skills standard)"
  [[ -n $fmdesc ]] || err "$name: SKILL.md frontmatter has no description"
  [[ $desclen -le 1024 ]] || err "$name: description is $desclen chars (max 1024)"

  local compat
  compat=$(fm_value "$skill_md" compatibility)
  [[ -z $compat || ${#compat} -le 500 ]] || warn "$name: compatibility field exceeds 500 chars"

  local lines
  lines=$(wc -l < "$skill_md" | tr -d ' ')
  if [[ $lines -ge 500 ]]; then
    err "$name: SKILL.md is $lines lines (hard limit 500)"
  elif [[ $lines -gt 400 ]]; then
    warn "$name: SKILL.md is $lines lines (soft limit 400)"
  fi

  # 7. evals
  local evals="$sdir/evals/evals.json"
  if [[ ! -f $evals ]]; then
    err "$name: missing evals/evals.json"
  elif [[ $HAVE_PY -eq 1 ]]; then
    json_ok "$evals" || err "$name: evals.json is not valid JSON"
    python3 - "$evals" "$name" <<'PY' || ERRORS=$((ERRORS + 1))
import json, sys
path, name = sys.argv[1], sys.argv[2]
try:
    data = json.load(open(path))
except Exception:
    sys.exit(1)
evals = data.get("evals")
if not isinstance(evals, list):
    print(f"ERROR: {name}: evals.json has no evals array"); sys.exit(1)
if not (3 <= len(evals) <= 5):
    print(f"ERROR: {name}: evals.json has {len(evals)} cases (need 3-5)"); sys.exit(1)
for i, e in enumerate(evals, 1):
    for field in ("id", "prompt", "expected_output"):
        if field not in e or not str(e[field]).strip():
            print(f"ERROR: {name}: evals[{i}] missing '{field}'"); sys.exit(1)
sys.exit(0)
PY
  fi

  # 8. references/
  [[ -d $sdir/references ]] || warn "$name: no references/ directory"

  # 8b. leftover scaffold TODOs
  grep -q 'TODO' "$skill_md" && warn "$name: SKILL.md still contains TODO placeholders"
  [[ -f $evals ]] && grep -q 'TODO' "$evals" && warn "$name: evals.json still contains TODO placeholders"

  # 9. agent-neutrality lint — body only (frontmatter compatibility strings
  #    legitimately name agents). The body starts after the FIRST closing ---;
  #    later --- lines (markdown hrs) are just body text.
  local body_hits
  body_hits=$(awk 'NR == 1 { next } !closed && /^---[ \t]*$/ { closed = 1; next } closed' "$skill_md" \
    | grep -niE 'read tool|claude|anthropic|/plugin|slash command' || true)
  [[ -z $body_hits ]] || warn "$name: possible agent-specific wording in SKILL.md body: $(echo "$body_hits" | head -n 1)"

  # 10. .agents/skills symlink for Codex/pi repo-scope discovery
  local link="$REPO_ROOT/.agents/skills/$name"
  if [[ -L $link || -e $link ]]; then
    [[ -f "$link/SKILL.md" ]] || warn "$name: .agents/skills/$name exists but does not resolve to a skill dir"
  else
    warn "$name: no .agents/skills/$name symlink (run: ln -sfn ../../plugins/$name/skills/$name .agents/skills/$name)"
  fi
}

# --- per-plugin checks --------------------------------------------------------

shopt -s nullglob
plugin_dirs=("$REPO_ROOT"/plugins/*/)
shopt -u nullglob

if [[ ${#plugin_dirs[@]} -eq 0 ]]; then
  err "no plugins found under plugins/"
else
  for pdir in "${plugin_dirs[@]}"; do
    check_skill "$(basename "$pdir")"
  done
fi

# --- repo-level: marketplace.json <-> plugins/ consistency -------------------

mp="$REPO_ROOT/.claude-plugin/marketplace.json"
if [[ $HAVE_PY -eq 1 ]]; then
  json_ok "$mp" || err "marketplace.json is not valid JSON"
  python3 - "$mp" "$REPO_ROOT" <<'PY' || ERRORS=$((ERRORS + 1))
import json, os, sys
mp, root = sys.argv[1], sys.argv[2]
try:
    data = json.load(open(mp))
except Exception:
    sys.exit(1)
names = [p.get("name") for p in data.get("plugins", [])]
sources = [p.get("source") for p in data.get("plugins", [])]
on_disk = sorted(d for d in os.listdir(os.path.join(root, "plugins")) if not d.startswith("."))
for d in on_disk:
    if d not in names:
        print(f"ERROR: plugins/{d} exists but is not registered in marketplace.json"); sys.exit(1)
for n, s in zip(names, sources):
    if n not in on_disk:
        print(f"ERROR: marketplace.json registers '{n}' but plugins/{n} does not exist"); sys.exit(1)
    if s != f"./plugins/{n}":
        print(f"ERROR: marketplace.json source for '{n}' is '{s}', expected './plugins/{n}'"); sys.exit(1)
sys.exit(0)
PY
fi

echo "----"
echo "$SKILL_COUNT skills, $ERRORS error(s), $WARNINGS warning(s)"
[[ $ERRORS -eq 0 ]] || exit 1
exit 0
