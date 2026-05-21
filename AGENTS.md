# AGENTS.md

Cross-tool agent instructions for Gentelella v4. Read by Aider, Cline, Codex, Continue, and any tool following the [agents.md](https://agents.md) convention. Claude Code reads `CLAUDE.md`; Cursor reads `.cursor/rules/`; GitHub Copilot reads `.github/copilot-instructions.md`. Content is intentionally overlapping — each tool only sees its own file.

## What this is

Gentelella v4 (`4.0.0`) — free admin dashboard template by Colorlib. 58 server-rendered HTML pages in [production/](production/), built with **Vite 8** (Rolldown). **Vanilla ES2022**, no Bootstrap, no jQuery, no SPA framework. SCSS only. Heavyweight runtime deps are limited to **ECharts 6**, **DataTables.net 2**, and **Leaflet 1.9** — all lazy-imported per page.

Live preview: <https://preview.colorlib.com/theme/gentelella/>.

## Setup

```bash
npm install
npm run dev               # Vite dev server on :9173 → opens /production/index.html
```

Build / preview / deploy:

```bash
npm run build             # → dist/
npm run preview           # serve built dist/ on :9174
npm run deploy:preview    # build + sync to R2 with cache headers
```

## Architecture

- **Single entry** [src/main-v4.js](src/main-v4.js). Imports `scss/v4/main.scss`, mounts the shell, runs `initCharts/initTables/initCommandPalette/initPageActions`, then lazy-imports page-specific modules guarded by DOM presence (`if (document.getElementById('inbox-root')) import(...)`).
- **Shell injection at build time.** [vite.config.js](vite.config.js)'s `shellInjectionPlugin` inlines sidebar/topbar/footer into every page whose body has `data-shell="admin"`. No FOUC. Runtime [src/v4/shell.js](src/v4/shell.js) `mountShell()` is a fallback for opening raw HTML.
- **Auto-discovered entries.** `discoverEntries()` in [vite.config.js](vite.config.js) walks `production/*.html` and registers each as a Rollup input. No hand-maintained input list.
- **Three lazy vendor chunks**: `vendor-echarts` (chart pages), `vendor-tables` (table pages), `vendor-maps` (map page). Everything else ships in the main chunk.
- **NAV is one constant.** `NAV` in [src/v4/shell-render.js](src/v4/shell-render.js), 7 groups. Pages match into NAV by `data-page` ↔ leaf `key`.
- **Theming via CSS custom properties.** Tokens in [src/scss/v4/_tokens.scss](src/scss/v4/_tokens.scss) under `:root` and `[data-theme="dark"]`. Pre-paint inline script (in the Vite plugin) sets `data-theme` on `<html>` from `localStorage` before body renders.
- **PWA.** Service worker registered only in `import.meta.env.PROD`. `site.webmanifest` + meta tags injected into every page by the Vite plugin. Subpath-safe: paths use `import.meta.env.BASE_URL`.

## Directory layout

```text
src/
  main-v4.js               # Entry — mounts shell, lazy-loads modules
  scss/v4/                 # 10 partials, main.scss is the @use'd entry
  v4/
    shell.js               # mountShell — runtime shell behavior
    shell-render.js        # Pure renderers + NAV + ICONS
    menus.js               # openMenu / openPanel
    modal.js               # showModal
    toast.js               # showToast
    charts.js              # ECharts wrapper + factories
    tables.js              # DataTables wrapper
    command-palette.js     # ⌘K
    page-actions.js
    inbox.js kanban.js calendar.js settings.js file-manager.js
    form-controls.js       # Date range, multi-select, rich text
    details.js markup.js data-adapter.js
    product-images.js product-mockups.js
production/                # 58 HTML entry pages (auto-discovered)
public/                    # Copied verbatim to dist/
types/gentelella.d.ts      # Type declarations for the public JS surface
scripts/
  new-page.mjs             # npm run new -- <slug>
  screenshots.mjs          # npm run screenshots
  smoke.mjs                # npm run smoke
  deploy-preview.sh        # npm run deploy:preview
examples/                  # Standalone integrations (Express/SQLite, etc.)
```

## Conventions

1. **Vanilla DOM only.** `querySelector`, `classList`, `addEventListener`. No jQuery, no SPA framework.
2. **Lazy import per-page modules** with a DOM-presence guard so the main bundle never ships unused code.
3. **Idempotent `init<Name>()` exports.** Safe to call when the root element is absent; safe to call twice.
4. **Event delegation on `document`** for common interactions (toggles, todo checkboxes, chart tabs) — see the bottom of [src/main-v4.js](src/main-v4.js). Components that own their state (inbox, kanban, command palette) register on their own root.
5. **`showModal()` / `showToast()`** ([v4/modal.js](src/v4/modal.js), [v4/toast.js](src/v4/toast.js)) for overlays; **`openMenu()` / `openPanel()`** ([v4/menus.js](src/v4/menus.js)) for dropdowns and slide-outs. Both handle outside-click / escape / focus return.
6. **CSS custom properties for colors.** Never hex literals in components. Charts read them via `getComputedStyle(document.documentElement).getPropertyValue('--…')` so dark-mode redraw is automatic.
7. **Subpath-safe URLs.** Use `import.meta.env.BASE_URL` in JS and `${base}` in the Vite plugin. Inside `production/*.html`, use relative paths.
8. **No `console.*` in shipped code.** Terser drops them in production builds; lint flags them so you catch them earlier.
9. **ESLint + Prettier** (single quotes, semicolons, 2-space indent). Run before committing; CI doesn't gate.
10. **Shell opt-in.** Pages without `data-shell="admin"` don't get a sidebar/topbar (login, marketing, error pages).

## Anti-patterns

- Don't add jQuery, Bootstrap, or any SPA framework. The whole pitch of v4 is "vanilla and small."
- Don't write Vite entry input lists by hand — drop the file in `production/`.
- Don't hand-roll your own modal/toast/dropdown — use [v4/modal.js](src/v4/modal.js), [v4/toast.js](src/v4/toast.js), [v4/menus.js](src/v4/menus.js).
- Don't hard-code `/` in asset paths. Use `import.meta.env.BASE_URL`.
- Don't bypass `mountShell()` to wire up sidebar/topbar yourself — set `data-shell="admin"` and let the Vite plugin inject.
- Don't import all of ECharts. Use modular imports — match the pattern in [src/v4/charts.js](src/v4/charts.js).
- Don't edit files in `dist/`, `node_modules/`, or `docs/screenshots/` — generated.
- Don't introduce a build step besides Vite. No PostCSS pipeline, no Webpack alongside, no Tailwind.
- Don't use `new bootstrap.Modal(...)` — there is no Bootstrap.

## Recipes

### Add a new page

Preferred — scaffolder writes the HTML, body attributes, and (optionally) the NAV entry:

```bash
npm run new -- reports --title "Reports" --nav-group "Admin"
npm run new -- user-roles --title "User roles" \
  --breadcrumb "Home > Admin > Roles" --nav-group "Admin" --icon profile
```

By hand:

1. `production/<slug>.html` with `<body data-shell="admin" data-page="<slug>" data-breadcrumb="Home > …">` and a `<script type="module" src="/src/main-v4.js"></script>` in `<head>`.
2. Append to the right group in `NAV` in [src/v4/shell-render.js](src/v4/shell-render.js). `key` matches `data-page`.
3. New icon? Add to `ICONS` in the same file (inline SVG, `currentColor` stroke).

### Add a chart

1. `<div class="card chart-card"><div class="chart" data-chart="<id>"></div></div>` in the page.
2. Add a `case '<id>':` in `initCharts()` in [src/v4/charts.js](src/v4/charts.js) that builds and returns the ECharts `option`.
3. Read colors via `getComputedStyle(document.documentElement).getPropertyValue('--token-name')` — dark mode redraw is automatic.

### Add a modal or toast

```js
import { showModal } from './v4/modal.js';
showModal({
  title: 'Delete project?',
  body: 'This cannot be undone.',
  actions: [
    { label: 'Cancel', variant: 'ghost' },
    { label: 'Delete', variant: 'danger', action: () => { /* … */ } }
  ]
});

import { showToast } from './v4/toast.js';
showToast('Saved', { variant: 'success' });
```

### Add a page-local module

```js
// At the bottom of src/main-v4.js:
if (document.querySelector('.reports-root')) {
  import('./v4/reports.js').then((m) => m.initReports());
}
```

Export a single `initReports()` from `src/v4/reports.js`. Guard re-entry; idempotent.

## Subpath / deploy

```bash
BASE_PATH=/theme/gentelella/ npm run build      # build under a subpath
PREVIEW_SLUG=gentelella npm run deploy:preview  # build + R2 sync, scoped to /theme/gentelella/
```

[scripts/deploy-preview.sh](scripts/deploy-preview.sh) does three passes: long-cache for hashed assets, short-cache for HTML, no-cache for `sw.js` and `site.webmanifest`. This works around Cloudflare APO pinning stale HTML at deleted hashed asset URLs.

## TypeScript

No `.ts` files, but [types/gentelella.d.ts](types/gentelella.d.ts) declares the public JS surface. `package.json` `"types"` points to it; VS Code / your editor picks it up automatically for IntelliSense across `src/v4/*.js`.

## Commands reference

```bash
npm run dev                # Dev server on :9173 (PORT to override)
npm run build              # Production build → dist/
npm run preview            # Serve dist/ on :9174
npm run lint               # ESLint
npm run lint:fix
npm run format             # Prettier write
npm run format:check
npm run new -- <slug>      # Scaffold a page
npm run screenshots        # 22 pages × light+dark → docs/screenshots/
npm run smoke              # Boot dev server, fetch every page, assert 200
npm run analyze            # Build + open dist/stats.html
npm run deploy:preview     # Build + R2 sync
```
