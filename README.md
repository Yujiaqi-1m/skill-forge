# skill-forge

A personal forge of [Claude Code](https://code.claude.com/docs) skills —
reusable, distillable workflows packaged as installable plugins. Each skill is
one plugin, versioned and installable on its own.

## Skills

| Plugin | What it does |
|---|---|
| [`svg-handdrawn`](plugins/svg-handdrawn/) | Hand-drawn style SVG flowcharts & diagrams from plain-language descriptions (CN/EN), with aspect-ratio control and a built-in render-and-inspect verification loop. |

Example output (release pipeline, eval case 1):

![release-flow example](plugins/svg-handdrawn/examples/release-flow.png)

## Install

Requires Claude Code with plugin support.

```text
/plugin marketplace add Yujiaqi-1m/skill-forge
/plugin install svg-handdrawn@skill-forge
```

Pick a scope when prompted — **user** (`~/.claude/settings.json`, all your
projects) or **project** (`.claude/settings.json`, shared with collaborators).
After installing, run `/reload-plugins` if the summary asks you to.

Manual invocation: `/svg-handdrawn:svg-handdrawn`. Natural-language triggering
usually needs no slash command — describing what you want is enough.

### Alternative: local plugin dir

```bash
git clone https://github.com/Yujiaqi-1m/skill-forge.git
claude --plugin-dir ./skill-forge/plugins/svg-handdrawn
```

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
├── .claude-plugin/marketplace.json        # marketplace manifest
└── plugins/<name>/                        # one plugin per skill
    ├── .claude-plugin/plugin.json         # plugin metadata + version
    └── skills/<name>/
        ├── SKILL.md                       # entry point (<500 lines)
        ├── references/                    # loaded on demand
        └── evals/evals.json               # regression prompts
```

## Adding a new skill (conventions)

1. **One plugin per skill**, plugin name = skill name; scaffold by copying
   `plugins/svg-handdrawn` and bumping to `0.1.0`.
2. **Register it** in `.claude-plugin/marketplace.json`.
3. **SKILL.md stays lean** (target <500 lines): workflow + rules + minimal
   template. Push copy-ready detail (snippets, palettes, tables) into
   `references/` and cite section numbers from the body.
4. **Write `description` as a router**: capability + explicit trigger phrases
   (Chinese and English) + style boundary. It is the only part permanently in
   context; the body loads on trigger.
5. **Encode decisions, not vibes**: exact fonts, hex values, commands, and
   defaults. Rules come from observed failures and carry their why; repeat
   critical rules across sections.
6. **Build in verification**: the skill must check its own output with a tool
   (render-and-read, test-run, dry-run) before delivering.
7. **`evals/evals.json` is mandatory**: 3-5 prompts covering distinct shapes
   of the task (languages, ratios, branching…), with qualitative expected
   outcomes. Re-run them after any skill edit.
8. **English everywhere in the repo** (code, docs, commit messages); trigger
   phrases in `description` may be Chinese — they are functional.
9. **Bump `plugin.json` version** whenever skill content changes.

Validate locally before pushing:

```bash
claude plugin validate ./plugins/<name>
```

## Attribution & license

- `svg-handdrawn` is an independent rewrite distilling techniques popularized
  by [chingswy/Skill-Research-Figure](https://github.com/chingswy/Skill-Research-Figure)
  (feTurbulence sketch filter, hatch fills, Ma Shan Zheng + Comic Sans font
  pairing). No text was copied from the source.
- Everything here is released under the [MIT license](LICENSE).
