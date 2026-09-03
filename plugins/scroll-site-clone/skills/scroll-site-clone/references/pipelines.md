# Pipeline porting notes

Per-pipeline identification, porting rules, and known pitfalls for the
scroll-site-clone skill, cited from SKILL.md as "pipelines §N". Values shown
are from a real replication; treat them as examples of *what to copy*, then
copy the target site's own values instead.

## §1 Smooth-scroll source (Lenis / Locomotive)

**Identify**: `new Lenis(`, `lenis.on('scroll')`, `html.lenis` class,
`data-lenis-prevent` attributes. Locomotive: `data-scroll` attributes,
`data-scroll-speed`.

**Port**:
- One global instance, exposed as `window.__lenis` (or whatever global name
  the original uses — check its consumers first and keep that name).
- Copy the constructor parameters exactly. Observed original:
  `lerp: 0.09, wheelMultiplier: 1.0, touchMultiplier: 1.5, syncTouch: false`.
- Drive it from the tween engine's ticker, not its own rAF, with
  `gsap.ticker.add((t) => lenis.raf(t * 1000))` and
  `gsap.ticker.lagSmoothing(0)` — that pairing is what makes scrubbed
  sections and the smooth scroll share a clock.
- Init in the app root's effect; dispose on cleanup (`lenis.destroy()`).

**Pitfalls**:
- Consumers may read `window.__lenis.scroll` instead of `window.scrollY`
  (fractional values). Port the reads verbatim or offsets drift by
  sub-pixels that round differently.
- If a module lazily hooks `lenis.on('scroll')` after mount (effect order),
  the original may too — keep the lazy-hook pattern instead of "fixing" it.

## §2 rAF phase state machine (gsap.ticker)

The signature pattern of award-site hero sections:

```js
gsap.ticker.add(tick)
function tick() {
  currentProgress += (targetProgress - currentProgress) * 0.1  // lerp
  if (currentProgress < 0.0001) currentProgress = 0            // snap
  const progressDelta = Math.abs(currentProgress - lastApplied)
  const targetDelta = Math.abs(targetProgress - currentProgress)
  if (progressDelta < 0.0001 && targetDelta < 0.0001) return   // skip guard
  // phase branches: progress <= p_Reveal / <= p_TextOut / … else
}
```

**Port** — everything verbatim:
- Phase constants (`p_Reveal = 0.12, p_TextOut = 0.44, …`) are the site's
  choreography. Copy the numbers and the derived ones
  (`p_PreExit = p_Spin - 0.06`).
- Keep the snap (`< 0.0001 → 0`) and the skip guard — they are behavior
  (settle thresholds), not noise.
- Keep window helpers: `win(from, span)` easing-window functions for
  staggered line reveals.
- Keep `else` reset branches that restore every animated property — they are
  what makes reverse scrolling clean.

**Pitfalls**:
- Keep unreachable branches (`progress > 1.0` behind a clamp). Alignment is
  the deliverable (SKILL.md Step 4 L1).
- Convergence takes ~87 frames at lerp 0.1 — see cookbook §6 before
  sampling.
- Dispose = `gsap.ticker.remove(tick)` plus every `addEventListener` you
  added. StrictMode double-mount otherwise doubles the ticker.

## §3 ScrollTrigger scrub + sticky stages

**Identify**: `ScrollTrigger.create({ trigger, start, end, scrub })` or
`gsap.to(el, { scrollTrigger: { scrub: 0.35 } })`; sticky stages are
`position: sticky; top: 0` sections of 200–400vh feeding a pinned child.

**Port**:
- `start`/`end` strings copy verbatim — the grammar matters:
  `clamp(bottom bottom-=10%)`, `center center`, `top top` produce different
  progress curves. Compute the equivalent progress by hand for one position
  and assert it (e.g. `(scrollY - sectionTop) / sectionHeight`).
- Two opposing scrubbed tweens (`.to` into alt state, `.from` back) are a
  common "crossfade between layout states" idiom — port both with their
  original orders.
- `ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })`
  globals copy too.

**Pitfalls**:
- Triggers are computed at creation from layout. After a big DOM change,
  the original may call `ScrollTrigger.refresh()` — mirror when, don't add
  "safety" refreshes the original lacks.
- StrictMode: double-created triggers double-apply — every `create` needs a
  matching `.kill()` in dispose.
- Sticky + `overflow: hidden` ancestors break pinning; keep the original's
  overflow values on the ancestor chain.

## §4 Flip state swaps

**Identify**: `Flip.getState(els)` stored, class swapped,
`Flip.from(state, { scrollTrigger: { scrub }, ease, duration })`.

**Port**:
- The two layout states must exist as real CSS classes (e.g.
  `.stm-pos-2 { margin-left: 25vw }` vs `.stm-pos-5 { margin-top: 200px }`)
  ported rule-for-rule. Flip interpolates between computed layouts — get
  the layouts wrong and nothing else matters.
- `data-flip-id` / selector grouping and per-element ease overrides
  (`expo.in` on select elements) copy verbatim.
- The getState must happen while the source class is applied — keep the
  original's ordering (state capture → class write → Flip.from).

**Pitfalls**:
- Margin-offset vs absolute positioning classes is THE classification error
  (the golden-rule-1 war story in SKILL.md Step 2). Check the dump's
  position scheme before writing a single pos class.
- Flip + scramble on the same elements needs the original's exact tween
  ordering; swapping order makes words jump between states.

## §5 ScrambleText

**Identify**: `scrambleText: { text: '…', chars: 'upperCase', speed: 0.4 }`.

**Port**: import from the gsap package (`gsap/ScrambleTextPlugin` — all
formerly club plugins ship free in gsap ≥3.13) and register once. Copy
`chars` and `speed`; scramble amount often rides other tweens
(`data-scramble="2.5"` per element) — port the data attributes too.

**Pitfalls**: scramble changes text width → layout shift on non-`nowrap`
elements. If the original sets `white-space: nowrap`, that's why; keep it.

## §6 WebGL layers (three.js / pixi)

**Identify**: `THREE.WebGLRenderer`, `ShaderMaterial`, uniforms like
`uProgress` / `uMouse` / `uTime`; canvas sized to a section, often behind
DOM overlays.

**Port**:
- GLSL copies verbatim — noise warp factors (`noise * p * (1-p) * 0.3`),
  dispersion (`0.04 * p * (1-p) * (noise + 1)`), vignette/grain constants
  are the look.
- Scroll-driven uniforms: the original tweens `uProgress` (or
  `uTransitionProgress`) from ScrollTrigger timelines — port the tween
  wiring, not just the shader.
- Textures: feed `makeMockTexture()` canvases through `THREE.CanvasTexture`
  (cookbook §4).
- Dispose: cancel the render loop, `renderer.dispose()`,
  `geometry.dispose()`, `material.dispose()`, textures `.dispose()`.

**Pitfalls**:
- Keep DPR clamping (`Math.min(devicePixelRatio, 2)`) — omitting it changes
  shader grain size, not just performance.
- Canvas behind `mix-blend-mode` DOM text needs the original's exact
  stacking (z-index + isolation) or the blend hits the wrong backdrop.

## §7 Miscellaneous idioms

**Marquee**: infinite loop via `xPercent: -50` on a doubled track,
`repeat: -1`, or modulo offset in a ticker. Duplicate the track exactly
(2× content) or the loop seam shows.

**IntersectionObserver reveals**: threshold values (0.2, 0.5) and
once-vs-repeat (`observer.unobserve` presence) are behavior — copy both.

**Parallax / mouse follow**: `gsap.quickTo(el, 'x', { duration: 0.6,
ease: 'power4.out' })` — the duration IS the feel; keep the original's
values and its normalized-input math (`(e.clientX / winW - 0.5)`).

**Native CSS scroll-driven** (`animation-timeline: scroll()` /
`view-timeline()`): port the keyframes and timeline scoping verbatim; if the
clone must support older browsers, note it in the report rather than
silently substituting JS.

**Fixed overlays inside transformed ancestors**: a `position: fixed` child
of a `will-change: transform` / `contain: paint` ancestor is trapped by it.
If the original places a fixed layer as a section SIBLING (not child), that
placement is load-bearing — keep it.
