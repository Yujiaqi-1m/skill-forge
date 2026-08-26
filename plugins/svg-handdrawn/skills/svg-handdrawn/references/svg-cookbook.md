# SVG Cookbook — copy-ready snippets for hand-drawn diagrams

Every block below is meant to be copied verbatim into `<defs>` (or the body
where noted) and parameterized only where comments say so. Uniform reuse of
these exact values is what makes diagrams from different sessions look like
they came from the same hand.

## §1 Sketch filter (shapes only)

Pixel displacement driven by Perlin noise: straight edges gain a gentle wobble
and sharp corners soften, which produces the hand-sketched look.

```xml
<defs>
  <filter id="sketchy" x="-3%" y="-3%" width="106%" height="106%">
    <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" seed="2" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5"
                       xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs>
```

Tuning:

| Parameter | Effect | Safe range |
|---|---|---|
| `baseFrequency` | Wobble granularity — higher = tighter, busier tremor | 0.02–0.05 |
| `numOctaves` | Texture richness of the noise | 3–5 |
| `scale` | Displacement strength — how far edges wander | 2–4 |
| `seed` | Noise variant; change to alter the "hand" | any integer |

The `x/y/width/height` bounds (−3% / 106%) stop the displaced edges from being
clipped by the filter region.

**Apply only to `<rect>`, `<ellipse>`, and container/parallelogram `<path>`
shapes** via `filter="url(#sketchy)"`. Never to connector lines or arrow paths
— see SKILL.md Step 3.

## §2 Hatching fills

A rotated line pattern reads as marker cross-hatching. Define one per theme
color:

```xml
<pattern id="hatch-blue" width="8" height="8" patternUnits="userSpaceOnUse"
         patternTransform="rotate(-45)">
  <line x1="0" y1="0" x2="0" y2="8" stroke="#a0c4f0" stroke-width="1.5" opacity="0.5"/>
</pattern>
```

Layer it with a translucent solid fill so labels stay readable:

```xml
<!-- hatch underneath -->
<rect x="80" y="120" width="320" height="180" fill="url(#hatch-blue)"
      stroke="#3b82d0" stroke-width="3.5" filter="url(#sketchy)"/>
<!-- readability veil on top -->
<rect x="80" y="120" width="320" height="180" fill="#dbeafe" opacity="0.25"/>
```

Keep pattern cell size 8–10 px and line opacity 0.3–0.5; denser hatching
swallows text.

## §3 Typography

Google Fonts import for the brush-style Chinese face; `@import` needs network
access, so every stack ends in local fallbacks that keep the look offline.

**Diagrams containing Chinese text:**

```xml
<style>
  @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&amp;family=ZCOOL+KuaiLe&amp;display=swap');
  /* Chinese body text — brush style */
  text { font-family: 'Ma Shan Zheng', 'ZCOOL KuaiLe', 'STKaiti', 'KaiTi', cursive; }
  /* English inline labels: code names, technical terms (/task-add, Backlog) */
  .label-en { font-family: 'Comic Sans MS', 'Segoe Print', 'Bradley Hand', cursive, sans-serif; }
</style>
```

**Diagrams entirely in English:**

```xml
<style>
  @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&amp;display=swap');
  text { font-family: 'Comic Sans MS', 'Segoe Print', 'Bradley Hand', cursive, sans-serif; }
</style>
```

In mixed diagrams add `class="label-en"` to English `<text>` elements.
Substituting other handwriting fonts (Caveat, Patrick Hand, Indie Flower…)
breaks cross-diagram consistency — don't.

## §4 Arrow markers and connectors

One marker per theme color, matching the connector stroke:

```xml
<marker id="arrow-blue" viewBox="0 0 12 12" refX="10" refY="6"
        markerWidth="10" markerHeight="10" orient="auto-start-reverse">
  <path d="M 2 3 L 10 6 L 2 9 Z" fill="#3b82d0"/>
</marker>
```

Connector forms — note that none carries a `filter` attribute:

```xml
<!-- direct flow -->
<line x1="260" y1="390" x2="260" y2="425"
      stroke="#3b82d0" stroke-width="3" marker-end="url(#arrow-blue)"/>

<!-- indirect / optional / feedback flow -->
<line x1="460" y1="440" x2="590" y2="440"
      stroke="#777" stroke-width="3" stroke-dasharray="14 10" marker-end="url(#arrow-gray)"/>

<!-- bent route: final segment lands on the target's center axis -->
<path d="M 40 700 L 40 50 L 100 50" fill="none"
      stroke="#2d8a4e" stroke-width="4" stroke-dasharray="16 10" marker-end="url(#arrow-green)"/>
```

## §5 Shape grammar

| Concept | Element | Reading |
|---|---|---|
| Actor / role | `<ellipse>` | PM, User, System |
| Process step | `<rect rx="6">` | `build`, `/task-add` |
| Stage container | large `<rect rx="20">` + hatching | "1. 需求录入" |
| Data / output | `<path>` parallelogram | Backlog, Report |
| Decision | `<path>` diamond | branch Yes/No |
| System boundary | `<rect>` dashed outer frame | scope of the system |

## §6 Color themes

One theme per actor or stage; gray belongs to dashed indirect connectors only.

| Theme | stroke | fill | text | hatch |
|---|---|---|---|---|
| Blue | `#3b82d0` | `#dbeafe` | `#1e40af` | `#a0c4f0` |
| Orange | `#d4920a` | `#fef3c7` | `#92400e` | `#f0d080` |
| Green | `#2d8a4e` | `#d1fae5` | `#065f46` | `#5a9e6f` |
| Purple | `#7c3aed` | `#ede9fe` | `#5b21b6` | `#b4a0e8` |
| Gray (dashed connectors) | `#777` | — | — | — |

## §7 Canvas presets and custom ratios

| Name | Ratio | viewBox | Suits |
|---|---|---|---|
| `16:9` (default) | 16:9 | `0 0 1600 900` | slides, widescreen |
| `4:3` | 4:3 | `0 0 1200 900` | docs, traditional slides |
| `1:1` | 1:1 | `0 0 1000 1000` | thumbnails, concept maps |
| `A4` | 1:1.414 | `0 0 1000 1414` | print, tall posters, hierarchies |
| `A4-landscape` | 1.414:1 | `0 0 1414 1000` | print landscape |

Custom `W:H` ratio: scale so the longer side lands at 1400–1600 px and derive
the shorter side from the ratio.

Direction follows the frame — wide canvases favor left-to-right flows (4–6
elements per row), tall canvases top-to-bottom (2–3 per row), squares go grid
or radial.

## §8 Rasterizers (for visual self-check)

Try in order; the first one that exists on the machine wins:

```bash
# 1. librsvg — preferred, exact SVG 1.1 rendering
rsvg-convert diagram.svg -o diagram.png
# install: brew install librsvg   |   apt install librsvg2-bin

# 2. macOS built-in QuickLook (writes ./diagram.svg.png, width capped at -s)
qlmanage -t -s 2000 -o . diagram.svg

# 3. Inkscape, if present
inkscape diagram.svg --export-type=png --export-filename=diagram.png
```

If none is available, skip the visual pass, lean on the static audit, and tell
the user which package to install.
