# scroll-site-clone cookbook

Copy-ready commands, templates, and tables for the scroll-site-clone skill,
cited from SKILL.md as "cookbook §N". Copy from here instead of improvising —
the values encode decisions from a completed end-to-end replication.

## §1 Forensics commands

Save everything into `<project>/.forensics/` BEFORE writing clone code.

```bash
mkdir -p <project>/.forensics && cd <project>/.forensics

# Server-rendered HTML (works for most award-style marketing sites).
# The UA avoids bot-blocks; -L follows redirects.
curl -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) \
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36" \
  -o page.html "https://target.site/"

# List every external script/stylesheet referenced.
grep -oE '(src|href)="[^"]+\.(js|css)[^"]*"' page.html | sort -u > assets.txt

# Pull each one (keep query strings — they version caches).
while read -r url; do
  curl -L -A "Mozilla/5.0" -O "$url"
done < <(grep -oE 'https?://[^"]+\.(js|css)[^"]*' page.html | sort -u)
```

For a client-rendered SPA, `page.html` from curl is an empty shell. Get the
rendered DOM via browser automation instead:

```js
// Browser console / automation evaluate:
copy(document.documentElement.outerHTML)  // -> paste into page.html
```

Add `.forensics/` to the clone project's `.gitignore` — it is reference
material (third-party code), not clone code.

### Minified sources

Minified ≠ illegible. Try, in order:

1. `npx prettier --parser babel bundle.js > bundle.pretty.js` — restores
   structure; most award-site bundles are minified, not obfuscated.
2. Look for `//# sourceMappingURL=` at the file end — fetch the `.map`.
3. Even unmangled-only passes work: string literals (`"top top"`,
   `"center center"`), property names (`.gsap`, `.scrollTo`), and numeric
   constants (0.09, 0.1) survive minification and are all you need for the
   grep table in §2.

If the source is truly obfuscated (string-array rot, control-flow flattening)
and no map exists, that is the Step 1 degradation: behavior-level clone with
an explicit diff report.

## §2 Animation-stack identification (grep table)

Run these against `.forensics/`; each hit routes to a pipelines.md section.

| grep pattern | library / mechanism | pipelines § |
|---|---|---|
| `lenis` \| `__lenis` \| `data-lenis-prevent` | Lenis smooth scroll | §1 |
| `locomotive-scroll` \| `data-scroll` | Locomotive Scroll | §1 |
| `gsap.ticker.add` | rAF phase state machine | §2 |
| `ScrollTrigger` \| `scrub:` | scroll-scrubbed tweens | §3 |
| `Flip.getState` \| `Flip.from` \| `Flip.to` | Flip state swaps | §4 |
| `scrambleText` | ScrambleText text effect | §5 |
| `THREE.` \| `WebGLRenderer` \| `ShaderMaterial` | three.js layer | §6 |
| `PIXI.` | PixiJS layer | §6 |
| `IntersectionObserver` | viewport-triggered reveals | §7 |
| `quickTo\(` \| `data-lag` \| `data-speed` | mouse/scroll parallax | §7 |
| `animation-timeline` \| `view-timeline` | native CSS scroll-driven | §7 |
| `position: *sticky` | sticky staging | §3 |

Then answer **what drives what**: which library is the scroll *source*
(usually Lenis/native) and which modules *consume* it (`lenis.on('scroll')`
vs `window.addEventListener('scroll')` vs ScrollTrigger's scroller proxy).
The consumer wiring must survive the port intact.

## §3 React thin-shell template

The component contract: render original structure, collect refs, dispose.

```jsx
import { useEffect, useRef } from 'react'
import { initSectionFx } from '../lib/sectionFx'

export default function Section({ data }) {
  // One shared bag of refs, keyed by the names the ported lib expects
  // (use the ORIGINAL id/class-derived names — the lib selects/talks to
  // these by contract).
  const refs = useRef({})

  const set = (key) => (el) => { refs.current[key] = el }

  useEffect(() => {
    const dispose = initSectionFx({ ...refs.current, data })
    return dispose          // StrictMode double-mount safe: full teardown
  }, [])

  return (
    <section id="target-section" className="target-section" ref={set('root')}>
      <div className="target-el" ref={set('el')}>{data.text}</div>
      {/* …structure mirrors the dump… */}
    </section>
  )
}
```

`src/lib/` function signature convention:

```js
// initSectionFx(refs) -> dispose(): attach listeners/tickers/triggers,
// return a closure that removes ALL of them. No React imports in lib/.
export function initSectionFx(refs) {
  // …verbatim-ported logic, adapted only at the wiring boundary…
  return () => { /* remove listeners, gsap.ticker.remove, .kill() */ }
}
```

Why a single dispose closure: React 18 StrictMode mounts effects twice in
dev. Anything not torn down (a `gsap.ticker.add`, a ScrollTrigger, a Lenis
instance) duplicates and the page animates at double speed or fights itself.

## §4 Mock asset strategies

**Rule first: mocks replace content, never structure** (SKILL.md Step 5).

### Copy/text

Keep the original's language, casing (UPPER/lower/Title), line count, and
approximate word length per line — masked-line reveals and marquees are
metric-sensitive. Replace only the words:

| original | mock (keep shape) |
|---|---|
| `WE CRAFT` / `DIGITAL` / `EXPERIENCES` | `WE BUILD` / `MOTION` / `WORLDS` |
| 6-item service list | 6 invented services, similar length |
| stats `120+ / 9yr / 26 / 4.9` | `98+ / 7yr / 18 / 4.8` |

### Images — Canvas gradient texture generator

Mirrors the common original-site fallback painter (canvas placeholder with
label). Deterministic per index, zero network:

```js
// makeMockTexture(index, w, h) -> HTMLCanvasElement (usable as a
// CanvasTexture source or background). Hue rotates by index.
export function makeMockTexture(index, w = 1280, h = 820, label = 'MOCK') {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  const hue = (index * 47) % 360

  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, `hsl(${hue} 40% 16%)`)
  g.addColorStop(0.55, `hsl(${(hue + 40) % 360} 45% 10%)`)
  g.addColorStop(1, `hsl(${(hue + 80) % 360} 35% 6%)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Faint grid so motion reads against the texture.
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '12px monospace'
  ctx.fillText(`${label} ${index + 1}`, 16, 24)
  return c
}
```

### `<video>` elements

Keep the element in the DOM (the ported CSS/JS may size or observe it) but
give it no `src`; cover it with a gradient-filled sibling overlay that the
animation can fade:

```html
<div class="face-media-mock"><!-- gradient via CSS, same box as the video --></div>
```

### Fonts — system fallback stacks

Never download webfonts. Replace only the family list; keep size, weight,
letter-spacing, and line-height exactly.

| original role | fallback stack |
|---|---|
| geometric display sans | `'Helvetica Neue', Arial, sans-serif` |
| grotesk UI text | `'DM Sans', 'Helvetica Neue', Arial, sans-serif` |
| pixel/grid display face | `'(original name)', 'Courier New', monospace` |
| serif accent | `Georgia, 'Times New Roman', serif` |

Keep the original family as the FIRST entry (unresolved, it falls through
harmlessly) so the dump diff stays honest.

## §5 Browser verification script templates

Run against the dev server with browser automation (Playwright or
equivalent). Viewport convention: 1440×900 (state it in the report).

### Jump-scroll + convergence wait + numeric assertions

```js
// Convergence-first sampling — never sample right after a jump (§6).
await page.evaluate(() => {
  window.__lenis
    ? window.__lenis.scrollTo(TARGET_Y, { immediate: true })
    : window.scrollTo(0, TARGET_Y)
  window.dispatchEvent(new Event('scroll'))
})
await page.waitForTimeout(3000)   // lerp settle — see §6 before lowering

const measured = await page.evaluate(() => {
  const cs = (el) => getComputedStyle(el)
  const title = document.querySelector('.title-line')
  const scene = document.querySelector('.scene-wrapper')
  return {
    scrollY: window.scrollY,
    titleTransform: cs(title).transform,
    titleOpacity: cs(title).opacity,
    sceneScale: cs(scene).transform,          // matrix(a,…); a = scale
    rect: title.getBoundingClientRect().toJSON(),
  }
})
// Assert digit-exact against hand-derived values, e.g.:
//   yPercent 130 on a 128px line  =>  translateY(166.4px)
//   cross-fade pair at ease 0.62  =>  0.62 + 0.38 === 1
```

### Selector sanity before trusting a "missing" value

A computed read of `undefined`/`none` usually means the selector missed, not
that the effect is broken. When a read surprises you, enumerate candidates
first:

```js
// Find what actually exists before concluding it's absent.
;[...document.querySelectorAll('span')].filter(s => /WORDMARK/i.test(s.textContent))
  .map(s => ({ cls: s.className, opacity: getComputedStyle(s).opacity }))
```

Observed failure mode: asserting on a guessed class name (`.title-line-1`)
reported the element "missing"; the real class was `.title-line`.

### Reverse-direction scrub check

For every scrubbed section: jump past it, then scrub backwards through 3–4
positions, asserting elements return to their laid-out positions (opacity/
transform reset). One-way checks miss stale-state bugs.

## §6 Lerp convergence table

A progress smoothed by `p += (target - p) * k` settles exponentially. Frames
to shrink the remaining error by 10⁻⁴ (i.e. 1% of 1%):

`frames = ln(10⁻⁴) / ln(1 − k)`

| lerp k | frames to settle ×10⁻⁴ | @60fps | safe wait (headless can halve fps) |
|---|---|---|---|
| 0.05 | 180 | 3.0s | 6s |
| 0.08 | 110 | 1.8s | 4s |
| 0.09 | 98 | 1.6s | 4s |
| 0.10 | 87 | 1.5s | **3s (default)** |
| 0.15 | 57 | 0.9s | 2s |
| 0.20 | 42 | 0.7s | 2s |

Sampling early reads a *mid-flight* state (e.g. a cube at scale 1.5 floating
mid-screen) that looks like a rendering bug but is just the easing still
running. If you must sample faster, poll until two consecutive identical
reads — but the flat 3s default has never been wrong, only occasionally
impatient.

## §7 Blueprint table + scroll timeline template

Fill one row per section. Worked example from a completed replication
(viewport 1440×900, page total 17127px):

| section | mechanism | key DOM (original classes) | z | mileage (y) | stack |
|---|---|---|---|---|---|
| hero | 600vh track → rAF phase machine (5 phases: reveal .12 / textOut .44 / tumble .6 / spin .78 / zoom 1.0) | `.hero-home .dark-wrapper .scene>.cube .hero-section-2 .new-text-group` | cube 20, overlays 18/22 | 0–4500 | Lenis + gsap.ticker + Three bg |
| keyword wall | document-flow groups, Flip class-swap pos↔alt, scramble | `.stm-content>.stm-group>.stm-el[.stm-pos-N]`, fixed `.stm-logo` | wall 25, logo 40 | 5400–9895 | ScrollTrigger scrub ×2 + Flip + ScrambleText |
| ring gallery | 300vh sticky stage, drag + scroll-velocity rotation | `.ccap-main>.ccap-sketch` canvas + DOM overlay | 30 (black bg — stops wall bleed) | 9895–12595 | Three + ScrollTrigger timelines |
| works | scroll-revealed cards | `.works-*` | auto | 12595–16947 | ScrollTrigger batch |
| footer | static end state | `.site-footer` | auto | 16947–17127 | — |
| nav (fixed) | section-spy highlight + progress bar | `.top-nav .nav-link.is-current` | 100 | always visible | scroll listener |

Timeline sketch to keep beside the table:

```
0 ─────── 4500 ── 5400 ─────────── 9895 ────── 12595 ───── 16947 ─ 17127
│  hero    │ gap │  keyword wall  │ ring gal.  │  works   │footer│
└ 5 phases ┘     └ 2× scrub tween └ sticky 3×h └ reveals  ┘
```

Every row of this table must later produce ≥1 numeric assertion point and
≥1 screenshot (SKILL.md Step 6).

## §8 Acceptance report template

Deliver in the user's language; structure:

```markdown
# <site> clone — acceptance report

## Issues found & fixed
| # | symptom | root cause (original vs clone divergence) | fix |
|---|---|---|---|
| 1 | … | original front face is a <video> (no text), clone added a
      text label; the ported `opacity: ease * 0` guard (harmless on the
      original) stopped covering it | cross-fade: overlay `ease` in,
      label `1 - ease` out; explicit resets in the other 3 branches |

## Changes
| file | lines | what |
|---|---|---|
| src/lib/heroTicker.js | 239 | phase cross-fade (L1, wrapper-only edits) |

## Verification (viewport 1440×900, dev server)
| check | position | expected (hand-derived) | measured | verdict |
|---|---|---|---|---|
| zoom end-state | y=4500 | overlay 1, label 0 | 1 / 0 | ✅ |
| wall 60% Flip | y=8100 | group T left=1032px | 1032px | ✅ |
| reverse scrub | 9450→5220 | monotonically returns, no residue | ok | ✅ |
| regression ×N | top/each section/bottom | source-derived expectations | screenshots inspected | ✅ |

## Descoped
- mobile pipeline (original ships a separate one) — desktop pipeline runs
  at all widths.
```

The verification table's "expected" column must cite the formula or dump
line it came from — a number without provenance is a vibe, not an assertion.
