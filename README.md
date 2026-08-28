# skill-forge

A personal forge of agent skills — distilled, reusable workflows written
once against the open [Agent Skills standard](https://agentskills.io/specification)
and usable in **Claude Code**, **OpenAI Codex CLI**, and **pi**. Each skill
is one plugin, versioned and installable on its own.

## Skills

| Skill | What it does |
|---|---|
| [`svg-handdrawn`](plugins/svg-handdrawn/) | Hand-drawn style SVG flowcharts & diagrams from plain-language descriptions (CN/EN), with aspect-ratio control and a built-in render-and-inspect verification loop. |
| [`task-scheduler`](plugins/task-scheduler/) | Delayed & multi-step tasks on a schedule with crash-safe resume: task records under `.tasks/`, one-shot triggers, checkpointed journal — an interrupted run continues instead of restarting. |

Example output (release pipeline, eval case 1):

![release-flow example](plugins/svg-handdrawn/examples/release-flow.png)

## Install

### Claude Code (marketplace — recommended)

```text
/plugin marketplace add Yujiaqi-1m/skill-forge
/plugin install svg-handdrawn@skill-forge
```

Pick a scope when prompted — **user** (`~/.claude/settings.json`, all your
projects) or **project** (`.claude/settings.json`, shared with
collaborators). After installing, run `/reload-plugins` if the summary asks
you to.

Manual invocation: `/svg-handdrawn:svg-handdrawn`. Natural-language
triggering usually needs no slash command — describing what you want is
enough.

<details>
<summary>Alternative: local plugin dir</summary>

```bash
git clone https://github.com/Yujiaqi-1m/skill-forge.git
claude --plugin-dir ./skill-forge/plugins/svg-handdrawn
```
</details>

### Codex CLI / pi

```bash
git clone https://github.com/Yujiaqi-1m/skill-forge.git
cd skill-forge
./scripts/install.sh --agent codex   # symlinks into ~/.agents/skills
./scripts/install.sh --agent pi      # copies into ~/.agents/skills
```

- **Codex** picks user skills up from `~/.agents/skills/` on the next run
  (implicit invocation via the skill description, or `$skill-name`). The
  committed `.agents/skills/` symlinks also give repo-scope discovery to
  any Codex session started **inside** this clone — no install needed.
- **pi** reads the same directory but **does not follow symlinks**
  (verified v0.80.6), so the script installs real copies — re-run it after
  `git pull` to refresh (`--force` overwrites a stale copy). Skills then
  register as `/skill:svg-handdrawn`. One-off without installing:
  `pi --skill ./plugins/svg-handdrawn/skills/svg-handdrawn`.

No symlink support on your filesystem? Add `--copy` anywhere. See
[docs/agent-compatibility.md](docs/agent-compatibility.md) for the full
discovery-path matrix, verified limitations, and design rationale.

## Usage

Once installed, just ask in Chinese or English:

- 「帮我画个流程图：代码合入 main 后 CI 跑构建和测试，通过后部署预发，QA 验收完再上生产，失败就通知值班」
- "Visualize our onboarding process as a diagram, A4 portrait"

The skill renders a hand-sketched SVG (wobbly edges, hatching, handwriting
fonts), rasterizes it, visually inspects the result, and iterates until it
passes — then reports the SVG + PNG paths without overwriting existing files.

## Repository layout

```
skill-forge/
├── .claude-plugin/marketplace.json        # Claude Code marketplace manifest
├── .agents/skills/<name>                  # committed symlinks -> plugins/<name>/skills/<name>
│                                          #   (native repo-scope discovery for Codex)
├── plugins/<name>/                        # one plugin per skill — SOURCE OF TRUTH
│   ├── .claude-plugin/plugin.json         # plugin metadata + version
│   └── skills/<name>/
│       ├── SKILL.md                       # entry point (<500 lines, Agent Skills standard)
│       ├── references/                    # loaded on demand
│       └── evals/evals.json               # regression prompts
├── scripts/
│   ├── validate.sh                        # lint all skills (run before pushing)
│   ├── install.sh                         # expose skills to claude/codex/pi
│   └── new-skill.sh                       # scaffold a new skill
├── templates/skill/                       # scaffold templates
└── docs/agent-compatibility.md            # multi-agent design decisions + facts
```

## Adding a new skill (conventions)

1. **Scaffold**: `./scripts/new-skill.sh <name> "one-line description"` —
   creates the plugin dir from `templates/skill/`, the `.agents/skills`
   symlink, and the marketplace registration.
2. **SKILL.md stays lean** (target <500 lines): workflow + rules + minimal
   template. Push copy-ready detail (snippets, palettes, tables) into
   `references/` and cite section numbers from the body.
3. **Write `description` as a router**: capability + explicit trigger
   phrases (Chinese and English) + style boundary. It is the only part
   permanently in context in every agent; the body loads on trigger.
4. **Encode decisions, not vibes**: exact fonts, hex values, commands, and
   defaults. Rules come from observed failures and carry their why; repeat
   critical rules across sections.
5. **Build in verification**: the skill must check its own output with a
   tool (render-and-read, test-run, dry-run) before delivering — phrased
   agent-neutrally, never a harness-specific tool name.
6. **`evals/evals.json` is mandatory**: 3-5 prompts covering distinct shapes
   of the task (languages, ratios, branching…), with qualitative expected
   outcomes. Re-run them after any skill edit.
7. **English everywhere in the repo** (code, docs, commit messages); trigger
   phrases in `description` may be Chinese — they are functional.
8. **Bump `plugin.json` version** whenever skill content changes.

Validate locally before pushing:

```bash
bash scripts/validate.sh            # repo conventions + Agent Skills standard
claude plugin validate ./plugins/<name>   # Claude-side manifest check
```

CI (`.github/workflows/validate.yml`) runs `validate.sh` on every push/PR.

## Skill roadmap

Candidates for future forge additions, in priority order:

**Distill existing workflows** (already proven as local commands/skills):

- `code-review-zh` / `perf-profiler` / `refactor-advisor` — port the local
  slash commands into portable SKILL.md form.
- `reading-guide` — turn a shared article into an OKR-based learning plan
  with gap analysis and SVG visualizations (synergizes with svg-handdrawn).
- `research-figure` — publication figures: LaTeX TikZ method pipelines and
  Blender 3D renders.

**Generic engineering** (high reuse, easy self-verification):

- `commit-crafter` — diff → conventional commit message + PR description.
- `changelog-forge` — git history → release notes.
- `slide-deck` — markdown → Marp slides with render-and-inspect loop.
- `table-wrangler` — CSV cleaning/transformation with row-count verification.
- `regex-forge` — regex construction validated against test cases.

Every skill follows the house rules above: <500-line SKILL.md, `references/`
for copy-ready detail, 3-5 evals, built-in self-verification.

## Attribution & license

- `svg-handdrawn` is an independent rewrite distilling techniques popularized
  by [chingswy/Skill-Research-Figure](https://github.com/chingswy/Skill-Research-Figure)
  (feTurbulence sketch filter, hatch fills, Ma Shan Zheng + Comic Sans font
  pairing). No text was copied from the source.
- Everything here is released under the [MIT license](LICENSE).
