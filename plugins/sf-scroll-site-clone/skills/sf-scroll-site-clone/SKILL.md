---
name: sf-scroll-site-clone
description: >
  Forensically replicate a website's scroll-driven page effects — GSAP /
  ScrollTrigger / Lenis / Three.js pipelines — into a fresh React+Vite project
  with behavior-level fidelity. Dumps the site's real source as the single
  source of truth, ports its animation code verbatim, and pre-fills ALL
  text/images/videos/fonts with mock data so the clone runs with zero network
  assets. Trigger when the user says "复刻这个网站的滚动效果/交互",
  "100% 复刻/还原这个站", "克隆这个落地页的动画", "clone/replicate this site's
  scroll interactions", "rebuild this landing page's animations", or links an
  award-site URL and asks for the same feel. Boundary: replicates interaction
  behavior, never copyrighted assets — does not download the site's images,
  fonts, or real content; login-walled or minified-illegible sources degrade
  to behavior-level approximation with an explicit diff report.
license: MIT
compatibility: "Agent Skills standard; tested with Claude Code, OpenAI Codex CLI, and pi"
---

# Scroll-Site Clone — verbatim effects, mocked content

You replicate a website's scroll-driven interactions into a new React+Vite
project. Two hard guarantees define done, and neither is negotiable:

1. **Effects are 100% faithful** — not "looks similar", but *provably*
   identical: the original site's animation code is ported verbatim and the
   clone's computed styles are asserted against values derived from that code.
2. **All content is mocked** — text, images, videos, fonts. The clone runs
   with zero network assets and no copyrighted material.

Everything that makes this work is a consequence of one insight: a scroll
narrative site's entire behavior is deterministic frontend JavaScript, so
**the source code is the spec**. Visual observation of the running site
yields ~70% confidence (easing curves, phase boundaries, and scroll mappings
are invisible from outside); the dumped source yields 100%. This skill never
guesses from pixels what it can read from code.

Copy-ready commands, templates, and tables live in
[references/cookbook.md](references/cookbook.md) (cited as "cookbook §N");
per-pipeline porting notes live in [references/pipelines.md](references/pipelines.md)
(cited as "pipelines §N"); the starter project skeleton lives in
[templates/vite-react/](templates/vite-react/).

## Workflow

1. **Intake** — scope the job: target URL, output dir, whole site or section.
2. **Forensics** — dump the real source; identify the animation stack.
3. **Blueprint** — dissect sections into a map: mechanism, DOM, z-order,
   scroll mileage.
4. **Port** — layered porting: verbatim JS → verbatim shaders → same-name
   structure, wrapped in a thin React shell.
5. **Mock** — replace every piece of content, structure untouched.
6. **Verify & deliver** — numeric assertions + visual inspection at mapped
   scroll positions; acceptance report.

## Step 1: Intake

Confirm before building:

- **Target URL** and **output directory** (default: a sibling of the current
  repo). Never clone into the original project.
- **Scope**: whole page, or named sections only. If the user links a site and
  says "the same feel", that still means whole page — confirm only when the
  site has clearly independent sub-pages.
- **Stack**: default React 18 + Vite (starter in templates/vite-react/).
  Another stack is fine; the method is unchanged.

If the target is login-walled, obfuscated to illegibility, or server-rendered
with no inspectable animation code, say so **now** and negotiate the
degradation: behavior-level approximation with an explicit diff report.
Never silently deliver an approximation labeled as 100%.

## Step 2: Forensics — the dump is the only authority

Save the real source before writing any code (commands in cookbook §1):

- Full rendered HTML with its inline CSS/JS, plus every external JS/CSS
  chunk, into `<project>/.forensics/`.
- Identify the animation stack by grep (table in cookbook §2): smooth-scroll
  lib, tween engine, scroll observer, WebGL, and — critically — **what drives
  what** (which lib is the scroll source, which modules consume it).

> **Golden rule 1 (repeated in Steps 3, 5, and the recap): every dispute goes
> back to the dump. Never infer behavior from how the site looks.** Why:
> observed failure — a keyword-wall section was once rebuilt from visual
> inspection as a sticky screen with absolutely-positioned scattered words;
> the dump showed a document-flow wall with margin-offset position classes.
> The invented structure produced words flying everywhere, a bug the original
> never had. Fixing it meant porting the dump's structure verbatim.

## Step 3: Blueprint — dissect before porting

Produce one table (template + worked example in cookbook §7), a row per
section:

| column | meaning |
|---|---|
| mechanism | sticky / scrub / rAF state machine / Flip swap / WebGL |
| DOM | key element tree with the original class names |
| z-order | stacking contexts and their z-index values |
| mileage | `offsetTop` + height → the scroll range the section owns |
| stack | which libraries drive it (→ pipelines.md §N) |

Also draw the **scroll timeline**: total scrollable height, each section's
range in pixels, and the phase boundaries inside multi-phase sections (e.g. a
600vh hero track divided at progress 0.12 / 0.44 / 0.6 / 0.78 / 1.0).

This table is not paperwork — it is the implementation map **and** the
verification checklist: every row later becomes at least one numeric
assertion point and one screenshot (Step 6).

## Step 4: Port — layered, fidelity ordered

Port layers in this order; each layer's fidelity contract is different.

### L1 · Algorithm — verbatim, zero changes

The original site's animation JS is copied **byte for byte** where possible:
phase constants, lerp factors, easing functions, window functions, even
arithmetic that looks redundant.

- **Keep dead branches.** A branch like `progress > 1.0` behind a clamped
  value is unreachable — keep it. Why: this is a port, not a refactor;
  alignment with the original is the deliverable, and "improvements" are how
  ports diverge.
- **Keep micro-optimizations** (progress-delta skip guards, cached lengths).
  They change frame timing; removing them changes behavior.
- When the original code must be adapted (module imports, global access),
  change the wrapper, never the math. Mark every adaptation with a comment:
  `// adapted from original: <reason>`.

### L2 · Shaders — verbatim

GLSL (or WGSL) copies over as-is: noise-warps, dispersion amounts, uniform
conventions (`uProgress` etc.). See pipelines §6.

### L3 · Structure — same names, same shapes

The React tree must emit the **original class names and DOM shape** — the
ported JS selects `.stm-el`, `.cube-face`, `.scene` by name and breaks on
renames. CSS ports rule-by-rule against the dump: layout systems (margin
offsets vs absolute spots — check which!), z-index ladders,
`mix-blend-mode`, custom properties.

### The React thin shell

Components do exactly three things (full template in cookbook §3):

1. render the original DOM structure,
2. collect refs,
3. `useEffect`: `const dispose = init(refs)` → `return dispose`.

All animation logic lives in `src/lib/` plain functions that never import
React. Why: verbatim-ported code cannot be diffed against the original once
it is fragmented across components, and the dispose contract keeps React 18
double-mounting (StrictMode) from leaking duplicate tickers and triggers.

House style: files ≤300 lines — split into new files, don't grow one;
comments in English.

## Step 5: Mock — pre-fill all content, touch no structure

Every piece of original content is replaced (strategies in cookbook §4):

| asset | mock |
|---|---|
| copy/text | invented text with same language, casing, line count, word count |
| images | CSS gradients or Canvas-generated textures |
| `<video>` | gradient overlay element, kept in the DOM |
| webfonts | system font fallback stacks (no font downloads) |
| logo/wordmark | text or CSS redraw |

> **Golden rule 2 (repeated in Step 6 and the recap): mocks change content,
> never structure.** DOM node count, class names, and animated properties
> must match the original exactly. Why: a mock that swaps a text node for an
> image, drops a span, or renames a class silently changes layout and breaks
> the verbatim-ported selectors — the mock layer is the only layer allowed
> to be creative, and only inside these bounds. When the original has a
> fallback texture painter (canvas-drawn placeholder), mirror its approach
> and parameters rather than inventing a new look.

Match text metrics deliberately: same line counts and roughly same word
lengths keep masked-line reveals and marquees behaving identically.

## Step 6: Verify & deliver — two loops, then the report

Verification is where "100%" gets earned. Run both loops with browser
automation (Playwright or equivalent) against the dev server.

### Numeric loop — computed style vs. hand-derived value

For each row of the blueprint table: jump-scroll to the section's milestone
positions, read `getComputedStyle` / `getBoundingClientRect`, and compare
against values **hand-derived from the ported formulas** (e.g. a title line
at `yPercent: 130` with 128px line height must read `translateY(166.4px)`).
Digit-exact match or it fails. Cross-fade pairs must sum to 1 (overlay
`0.62` + label `0.38`).

> **Golden rule 3 (repeated in the recap): after a jump-scroll, wait for the
> lerp to converge before sampling — ≥3 seconds.** Why: a lerp-smoothed
> progress at factor 0.1 needs `log(0.0001)/log(0.9) ≈ 87` frames to settle
> four orders of magnitude — ~1.5s at 60fps, longer in a slow headless
> browser. Observed failure: sampling at 1200ms captured a mid-flight cube
> phase; correct code was misreported as a bug and a wild-goose debug
> session followed. Convergence table in cookbook §6; wait/poll script in
> cookbook §5.

### Visual loop — screenshot, then inspect with correct expectations

Screenshot the same milestone positions and inspect each with your
image-reading tool. **Write the expectation from the source first** — read
which elements the code says are visible at that scroll position, then judge
the screenshot against that list. Why: an expectation invented from vibes
(the wordmark "should" be here) produces false alarms that cost hours to
disprove. Also check each shot for cross-section bleed (stray words,
overlapping layers) and clipped edges.

Then: scrub back and forth across scrubbed sections (reverse direction must
return elements to their laid-out positions), and take one regression
screenshot per section including the very top and very bottom of the page.

### Deliver

Report with the template in cookbook §8: per-issue root cause (original code
vs. clone divergence), change list with file:line, and a verification table
(position / expected / measured / verdict). State explicitly what was
descoped (mobile pipelines are commonly out of scope — say so, don't hide
it). If either loop could not run (no browser available), say so instead of
skipping silently.

## Recap: the five golden rules

1. **The dump is the only authority** — disputes go to the source, never to
   visual guessing.
2. **Port verbatim, change nothing** — invented structure introduces bugs
   the original never had; keep dead branches and micro-optimizations.
3. **Mocks change content, never structure** — same nodes, same classes,
   same animated properties.
4. **Wait ≥3s after jump-scroll before sampling** — lerp convergence takes
   ~87 frames; early sampling reads mid-flight states and misreports good
   code as broken.
5. **Both loops green, then deliver** — numeric assertions digit-exact AND
   screenshots inspected against source-derived expectations.

## Minimal starter

Copy [templates/vite-react/](templates/vite-react/) as the project base — it
ships the thin-shell conventions pre-wired: Lenis init (parameters you will
overwrite with the original site's), a canvas mock-texture generator, and the
`src/lib/` layout. `npm install && npm run dev`, then start Step 2.
