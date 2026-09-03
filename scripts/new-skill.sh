#!/usr/bin/env bash
#
# new-skill.sh — scaffold a new skill in the forge.
#
# Usage: ./scripts/new-skill.sh <name> ["one-line description"]
#
# Creates plugins/<name>/ from templates/skill/, symlinks it into
# .agents/skills/ (Codex/pi discovery), and registers it in the Claude
# marketplace manifest. Then run scripts/validate.sh and fill in the TODOs.
#
# The `sf-` prefix is the forge's origin mark: installed skills sit next to
# skills from other sources, so every name carries it. Added automatically
# when missing.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TPL="$REPO_ROOT/templates/skill"

die() { echo "new-skill.sh: $*" >&2; exit 1; }

[[ $# -ge 1 && $# -le 2 ]] || die "usage: new-skill.sh <name> [\"one-line description\"]"
NAME="$1"
DESC="${2:-What this skill does and when to use it}"

[[ $NAME =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "name '$NAME' must be lowercase a-z0-9 hyphens (Agent Skills standard)"
if [[ $NAME != sf-* ]]; then
  echo "note: adding the sf- origin prefix -> $NAME becomes sf-$NAME"
  NAME="sf-$NAME"
fi
[[ ${#NAME} -le 64 ]] || die "name exceeds 64 chars"
[[ ! -e "$REPO_ROOT/plugins/$NAME" ]] || die "plugins/$NAME already exists"

PDIR="$REPO_ROOT/plugins/$NAME"
mkdir -p "$PDIR/.claude-plugin" "$PDIR/skills/$NAME/evals" "$PDIR/skills/$NAME/references" \
         "$REPO_ROOT/.agents/skills"

# Bash-native template substitution — no sed escaping pitfalls.
render() { # $1: template, $2: destination
  local content
  content=$(cat "$1")
  content=${content//\{\{NAME\}\}/$NAME}
  content=${content//\{\{DESCRIPTION\}\}/$DESC}
  printf '%s\n' "$content" > "$2"
}

render "$TPL/plugin.json.tmpl"   "$PDIR/.claude-plugin/plugin.json"
render "$TPL/SKILL.md.tmpl"      "$PDIR/skills/$NAME/SKILL.md"
render "$TPL/evals.json.tmpl"    "$PDIR/skills/$NAME/evals/evals.json"
render "$TPL/cookbook.md.tmpl"   "$PDIR/skills/$NAME/references/cookbook.md"

ln -sfn "../../plugins/$NAME/skills/$NAME" "$REPO_ROOT/.agents/skills/$NAME"

# Register in the Claude marketplace manifest (sorted); fall back to
# printing a paste-ready snippet when python3 is unavailable.
MP="$REPO_ROOT/.claude-plugin/marketplace.json"
if command -v python3 >/dev/null 2>&1; then
  python3 - "$MP" "$NAME" "$DESC" <<'PY'
import json, sys
mp, name, desc = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open(mp))
plugins = [p for p in data.get("plugins", []) if p.get("name") != name]
plugins.append({"name": name, "source": f"./plugins/{name}",
                "description": desc, "category": "general", "tags": [name]})
plugins.sort(key=lambda p: p["name"])
data["plugins"] = plugins
with open(mp, "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")
PY
  echo "registered $NAME in .claude-plugin/marketplace.json"
else
  echo "python3 not found — add this entry to .claude-plugin/marketplace.json by hand:"
  printf '{\n  "name": "%s",\n  "source": "./plugins/%s",\n  "description": "%s",\n  "category": "general",\n  "tags": ["%s"]\n}\n' \
    "$NAME" "$NAME" "$DESC" "$NAME"
fi

echo
echo "Scaffolded $NAME. Next steps:"
echo "  1. Fill in SKILL.md: description as a router (capability + zh/en trigger"
echo "     phrases + boundary), workflow, verification loop."
echo "  2. Replace the TODOs in evals/evals.json with 3-5 real regression cases."
echo "  3. Move copy-ready detail into references/cookbook.md."
echo "  4. bash scripts/validate.sh  (must pass with 0 errors)"
echo "  5. Test in an agent: claude (marketplace), codex / pi (~/.agents/skills)."
