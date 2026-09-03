# scroll-site-clone starter

Skeleton for a scroll-interaction replication project (see the
scroll-site-clone skill). Conventions baked in:

- **`src/lib/`** — all ported animation logic lives here as plain functions
  `initXxx(refs) -> dispose()`. No React imports in lib/.
- **`src/components/`** — thin shells: render the ORIGINAL site's DOM
  structure and class names, collect refs, dispose on unmount
  (StrictMode double-mount safe).
- **`src/styles/`** — one CSS file per original section, ported
  rule-for-rule. Keep files under 300 lines.
- **`.forensics/`** — the dumped original source (git-ignored). The dump is
  the only authority; every dispute goes back to it.
- **All content is mocked** — text, images (Canvas-generated textures via
  `src/lib/mockAssets.js`), videos, fonts (system fallback stacks). The
  clone must run with zero network assets.

The Lenis parameters in `src/lib/lenis.js` are placeholder defaults —
**overwrite them with the original site's values** found in the dump.

```bash
npm install
npm run dev
```
