---
name: svg-handdrawn
description: >
  Turn plain-language descriptions of processes, systems, and architectures into
  hand-drawn style SVG flowcharts and diagrams — wobbly edges, hatching fills,
  handwriting fonts, as if sketched on a whiteboard with colored markers rather
  than rendered by a diagram tool. Supports aspect-ratio control (16:9 default,
  4:3, 1:1, A4, or any custom W:H). Trigger when the user says "画个图",
  "画个流程图", "帮我可视化一下", "draw a diagram", "visualize this process",
  "make a flowchart showing how X works", or describes a workflow/system and
  wants it turned into a picture.
license: MIT
compatibility: "Agent Skills standard; tested with Claude Code, OpenAI Codex CLI, and pi"
---

# Hand-Drawn SVG Diagrams

You convert spoken or written descriptions of workflows into SVG diagrams that
look hand-sketched. The aesthetic target: marker-on-whiteboard, warm and a
little imperfect — never the sterile corporate look of a diagram tool.

Copy-ready code for every visual technique lives in
[references/svg-cookbook.md](references/svg-cookbook.md) (cited below as
"cookbook §N"). Copy from there instead of improvising; consistency across
diagrams comes from reusing the exact same filter, fonts, and palettes.

## Workflow

1. **Decompose** — parse the description into nodes and connections
2. **Frame** — pick aspect ratio and flow direction
3. **Compose** — write the SVG with sketch styling
4. **Audit** — statically verify every connection in the source
5. **Inspect** — rasterize and look at the result; fix and repeat
6. **Deliver** — report file paths, iterate on feedback

## Step 1: Decompose

From the user's description, extract four things:

- **Actors** — who or what participates (PM, User, Gateway, `订单服务`)
- **Stages** — natural groupings of work (intake, processing, delivery)
- **Steps** — the individual operations inside each stage
- **Connections** — how control moves: linear, branching, parallel, feedback loop

Write this decomposition down before touching coordinates — it doubles as the
verification checklist in Step 4. If the description leaves the structure
ambiguous (unclear branching, unnamed participants), ask before drawing.

## Step 2: Frame the canvas

- Ratio: use the user's if given, otherwise default to **16:9**
  (presentation-ready). If content clearly fights the default — a deep
  hierarchy wants A4/portrait — suggest the better ratio instead of silently
  switching.
- Preset ratios, viewBox values, and the custom-ratio calculation rule are in
  cookbook §7.
- Match flow direction to the frame: **wide canvases run left-to-right**,
  **tall canvases run top-to-bottom** (2–3 items per row max), **squares suit
  grids and radial maps**. Forcing a horizontal flow onto a portrait canvas
  wastes the frame.
- Budget space before writing coordinates: roughly 400×500 px per major
  section, 40–60 px gaps between elements (room for arrows and labels),
  30–50 px outer margins. Size containers after placing their children, plus
  40–60 px padding per side.

## Step 3: Compose the SVG

### The one rule you must not break: filters are for shapes, never arrows

The sketch effect is an `feTurbulence` + `feDisplacementMap` filter (cookbook §1)
applied to rects, ellipses, and container paths. Applied to a connector line,
the same displacement **shreds a thin stroke into fragments or erases it
entirely** — arrows vanish, which is the single most damaging failure this
skill guards against. Therefore:

> Every `<line>` and connector `<path>` carries **no `filter` attribute at
> all**. Arrows read as hand-drawn through `stroke-width="3"`+ and the sketchy
> shapes around them.

This rule is repeated in Step 4, Step 5, and the recap deliberately — it is
where every careless pass fails.

### Styling essentials

- **Fills**: hatch pattern layered under a translucent solid fill so text stays
  readable (cookbook §2). One hatch pattern per color theme.
- **Fonts**: use the exact `<style>` blocks in cookbook §3 — Ma Shan Zheng for
  Chinese text, Comic Sans MS stack for English labels (`.label-en` class in
  mixed diagrams). Do not substitute Caveat, Patrick Hand, Indie Flower, or any
  other handwriting font. Keep the local fallbacks (`STKaiti`, `KaiTi`,
  `Segoe Print`) so offline rendering still looks handwritten.
- **Markers**: define one arrow marker per theme color (cookbook §4).
- **Color**: assign each actor/stage its own theme from the palettes in
  cookbook §6; gray is reserved for dashed, indirect connectors.
- **Shape grammar**: ellipse = actor, rounded rect = step, big hatched rect =
  stage container, parallelogram = data/output, diamond = decision, dashed
  outer rect = system boundary (cookbook §5).

### Arrow geometry

1. `stroke-width` ≥ 3 on every connector, always with `marker-end`.
2. Leave a 5–10 px standoff between the shape edge and each arrow endpoint so
   the arrowhead is fully visible.
3. L-shaped and curved paths must land on the target's **center axis** — a
   target rect centered at x=600 gets its final path segment ending at x=600.
   Derive centers from `cx`/`cy` (ellipses) or `x + width/2` (rects).
4. Edge labels sit ≥ 15 px off the line they annotate — above/below horizontal
   arrows, left/right of vertical ones — never on top of the stroke.
5. Dashed strokes (`stroke-dasharray="14 10"`, gray) mark indirect, optional,
   or feedback flows; feedback loops wrap around the outside of the layout.

## Step 4: Audit the source before saving

Checklist-driven, in the SVG source itself:

1. Revisit the Step 1 decomposition and list every connection that must exist.
2. For each, confirm a `<line>`/`<path>` runs from the source's edge to the
   target's edge **and** carries `marker-end`.
3. Scan the whole file for `filter=` on any connector — remove it on sight.
4. Sanity-check coordinates: start near the source edge, end near the target
   edge (center axis for bent paths), nonzero length.
5. Confirm labels clear their lines by ≥ 15 px and overlap no shape.

A missing arrow found here costs one edit; found by the user, it costs trust.

## Step 5: Rasterize and inspect

Never hand over an SVG you have not looked at. Detect the first available
rasterizer and convert (full command reference and per-tool caveats in
cookbook §8):

```bash
# 1st choice — exact SVG rendering
rsvg-convert --background-color='#ffffff' diagram.svg -o diagram.png

# 2nd choice — Chrome headless; window-size MUST equal the SVG width/height
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --screenshot=diagram.png --window-size=1600,900 \
  --default-background-color=FFFFFFFF "file://$PWD/diagram.svg"

# 3rd choice — if installed
inkscape diagram.svg --export-type=png --export-filename=diagram.png

# last resort — macOS built-in, correct aspect but DROPS the sketch filter
# (edges render straight; still validates layout, arrows, and text)
sips -s format png diagram.svg --out diagram.png
```

**Never use `qlmanage`**: it ignores the SVG's aspect ratio and emits a
square canvas (`-s 1600` on a 1600×900 SVG yields 1600×1600 with the content
misplaced) — half the diagram appears missing.

Then view the rendered PNG with your image-reading tool and judge:

- **Layout** — no overlapping elements, no clipped or escaping text, no cramped
  or wasted regions
- **Arrows** — all present, pointing the right way, not crossing through
  shapes or shedding arrowheads
- **Text** — legible, inside its containers, correct language font applied
- **Balance** — the composition fills the canvas naturally

Fix the SVG, re-render, re-inspect, repeat until clean. If no rasterizer
exists on the machine, say so explicitly in your reply, fall back to the
Step 4 audit only, and suggest installing one (`brew install librsvg` on
macOS, `apt install librsvg2-bin` on Debian/Ubuntu).

## Step 6: Deliver and iterate

- Before writing, check the target path exists; if so, version up instead of
  overwriting (`diagram.svg` → `diagram-v1.svg` → `diagram-v2.svg` …).
- Report both the SVG and PNG paths. Do **not** run `open` — the user may be
  on a headless or remote box.
- Common follow-ups and their fixes: cramped box → enlarge and reposition;
  broken/invisible arrow → strip any filter from it, raise stroke-width;
  text not handwriting-styled → verify the `@import` and exact font-family
  string; colors too faint/dense → tune stroke and hatch opacity.

## Recap: the five rules

1. **No filter on connectors, ever** — displacement erases thin strokes.
2. **Exact fonts only** — Ma Shan Zheng (CN) / Comic Sans MS stack (EN), no
   substitutes, keep local fallbacks.
3. **Audit the connection checklist in-source before saving.**
4. **Rasterize and look before delivering; loop until clean.**
5. **Never overwrite an existing file** — version the filename.

## Minimal starter

```xml
<!-- Default 16:9. Other ratios: adjust viewBox per cookbook §7. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&amp;display=swap');
      text { font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', cursive; }
      .label-en { font-family: 'Comic Sans MS', 'Segoe Print', 'Bradley Hand', cursive; }
    </style>
    <!-- Sketch filter — apply to shapes ONLY, never to connectors -->
    <filter id="sketchy" x="-3%" y="-3%" width="106%" height="106%">
      <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" seed="2" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5"
                         xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#a0c4f0" stroke-width="1.5" opacity="0.4"/>
    </pattern>
    <marker id="arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
      <path d="M 2 3 L 10 6 L 2 9 Z" fill="#3b82d0"/>
    </marker>
  </defs>
  <!-- shapes: filter="url(#sketchy)" -->
  <!-- connectors: stroke-width="3" + marker-end="url(#arrow)", NO filter -->
</svg>
```

## Credits

Distilled and rewritten from techniques popularized by
[chingswy/Skill-Research-Figure](https://github.com/chingswy/Skill-Research-Figure)
(feTurbulence sketch filter, hatch fills, Ma Shan Zheng + Comic Sans pairing).
This skill is an independent rewrite, not a copy.
