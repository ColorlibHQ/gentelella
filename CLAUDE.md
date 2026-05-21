# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository. Cross-tool counterparts: [AGENTS.md](AGENTS.md), [.cursor/rules/project.mdc](.cursor/rules/project.mdc), [.github/copilot-instructions.md](.github/copilot-instructions.md). Each tool reads only its own file; content overlaps intentionally.

## What this is

Gentelella v4 (`4.0.0`) — free admin dashboard template by Colorlib. **58 production HTML pages** under [production/](production/), built with Vite 8 (Rolldown). Vanilla ES2022, no Bootstrap, no jQuery, no SPA framework. SCSS-only styling. ECharts 6, DataTables.net 2, and Leaflet 1.9 are the only heavyweight runtime deps — all lazy-imported per page.

Live preview: <https://preview.colorlib.com/theme/gentelella/>.

## Commands

```bash
npm run dev                # Vite dev server on :9173, opens /production/index.html
npm run build              # Production build → dist/
npm run preview            # Serve built dist/ on :9174

npm run lint               # ESLint over src/
npm run lint:fix           # Auto-fix
npm run format             # Prettier write
npm run format:check       # Prettier check

npm run new -- <slug>      # Scaffold a new page under production/
npm run screenshots        # Playwright captures 22 pages × light+dark → docs/screenshots/
npm run smoke              # Boot dev server, hit every page, assert 200
npm run analyze            # Build + open dist/stats.html
npm run deploy:preview     # Build + sync to R2 with per-file cache headers
```

Override the dev port via `PORT=…`; build under a subpath via `BASE_PATH=/foo/ npm run build`.

## Architecture

**Entry point**: [src/main-v4.js](src/main-v4.js) — single bundle for every page. Imports `scss/v4/main.scss`, mounts the shell, registers ECharts/DataTables/Leaflet placeholders, then lazy-imports page-specific modules guarded by DOM presence:

```js
if (document.getElementById('inbox-root')) {
  import('./v4/inbox.js').then((m) => m.initInbox());
}
```

**Shell injection** ([vite.config.js](vite.config.js) `shellInjectionPlugin`): pages opt in by setting `<body data-shell="admin" data-page="key" data-breadcrumb="A > B">`. At build/dev time the Vite plugin inlines sidebar/topbar/footer HTML directly into the document so the shell paints on the first frame — no FOUC. Runtime [src/v4/shell.js](src/v4/shell.js) `mountShell()` is the fallback for raw-file viewing and always wires up event handlers (mobile drawer, theme toggle, sidebar accordion).

**Pages are auto-discovered** by `discoverEntries()` in [vite.config.js](vite.config.js): every `.html` file in `production/` becomes a Rollup input. Drop a file in, run dev, it's live — no config edit.

**Chunking**: only three vendor chunks are emitted, all lazy:

| Chunk            | Loaded on   | Source                          |
| ---------------- | ----------- | ------------------------------- |
| `vendor-echarts` | chart pages | `node_modules/echarts/`         |
| `vendor-tables`  | table pages | `node_modules/datatables.net/`  |
| `vendor-maps`    | map page    | `node_modules/leaflet/`         |

Everything else (shell, command palette, charts wrapper, tables wrapper, etc.) is in the main chunk and is small enough not to need splitting.

### Directory layout

```text
src/
├── main-v4.js              # Entry — mounts shell, lazy-loads modules
├── scss/
│   ├── v4/
│   │   ├── main.scss       # Entry — @use's the partials below
│   │   ├── _tokens.scss    # CSS custom properties (light + dark)
│   │   ├── _layout.scss    # Page wrapper, sidebar, topbar, grid
│   │   ├── _components.scss# Buttons, cards, badges, forms, …
│   │   ├── _widgets.scss   # Stat cards, mini-charts, todo lists, …
│   │   ├── _forms.scss     # Inputs, switches, date pickers
│   │   ├── _datatable.scss # DataTables re-skin
│   │   ├── _pages.scss     # Per-page styles (kept narrow)
│   │   ├── _apps.scss      # Inbox, kanban, chat, calendar, settings
│   │   └── _auth.scss      # Login/register/forgot/2FA/lock/errors
└── v4/
    ├── shell.js            # mountShell — sidebar/topbar wiring
    ├── shell-render.js     # Pure renderers + NAV definition (used by Vite plugin)
    ├── menus.js            # openMenu/openPanel dropdowns
    ├── modal.js            # showModal
    ├── toast.js            # showToast
    ├── charts.js           # ECharts factory + initCharts()
    ├── tables.js           # DataTables initialiser
    ├── command-palette.js  # ⌘K
    ├── page-actions.js     # Per-page action button delegation
    ├── inbox.js            # Folders, reader, compose
    ├── kanban.js           # Drag/drop board
    ├── calendar.js         # FullCalendar-style CRUD
    ├── settings.js         # localStorage-backed settings page
    ├── form-controls.js    # Date range, multi-select, rich text
    ├── file-manager.js     # Tree + grid file browser
    ├── details.js          # Disclosure rows
    ├── markup.js           # HTML pretty-printer for component playground
    ├── data-adapter.js     # Demo data shim
    ├── product-images.js   # E-commerce gallery
    └── product-mockups.js  # Storefront demo

production/                 # 58 HTML entry pages (auto-discovered)
public/                     # Static assets copied verbatim to dist/
types/gentelella.d.ts       # TypeScript declarations for the public JS surface
scripts/
├── new-page.mjs            # Scaffold a page + register in NAV
├── screenshots.mjs         # Playwright capture (22 pages × 2 themes)
├── smoke.mjs               # Boot dev server, fetch every page
└── deploy-preview.sh       # Build + R2 sync + cache-header pass

examples/                   # Standalone integration examples (Express/SQLite, etc.)
```

### Adding a new page

Use the scaffolder — it writes the HTML, sets the body attributes correctly, and (optionally) inserts the page into NAV:

```bash
npm run new -- reports --title "Reports" --nav-group "Admin"
npm run new -- user-roles --title "User roles" \
  --breadcrumb "Home > Admin > Roles" --nav-group "Admin" --icon profile
```

If you write the file by hand instead, the contract is:

1. Drop `production/<slug>.html`. Vite auto-discovers it (no config edit).
2. Set `<body data-shell="admin" data-page="<slug>" data-breadcrumb="Home > …">`.
3. Add a `<script type="module" src="/src/main-v4.js"></script>` in `<head>`.
4. To appear in the sidebar, edit `NAV` in [src/v4/shell-render.js](src/v4/shell-render.js) — match key to your `data-page`.

### NAV and icons

Single source of truth: `NAV` in [src/v4/shell-render.js](src/v4/shell-render.js). 7 groups (General, Apps, E-commerce, Projects, UI library, Admin, Layouts). Items are either flat leaves `{ key, href, text, icon, badge? }` or parents with a `children: []` array — the parent stays expanded if any child matches the page's `data-page`.

Icons are inline SVG strings in the `ICONS` object in the same file. Use a `data-page` whose `icon:` matches a key; add new icons by appending to `ICONS` (one SVG per entry, currentColor stroke).

### Theming

Tokens in [src/scss/v4/_tokens.scss](src/scss/v4/_tokens.scss) — CSS custom properties under `:root` (light) and `[data-theme="dark"]`. The pre-paint inline script in `vite.config.js` reads `localStorage.getItem('theme')` and sets `data-theme` on `<html>` before body render, so dark mode never flashes light. Theme toggle in the topbar flips the attribute and persists it.

The live theme generator at `production/theme.html` rewrites the same custom properties in real time and lets users copy/download the SCSS overrides.

### Subpath deploys

`base` in [vite.config.js](vite.config.js) reads `process.env.BASE_PATH` for build/preview. Asset URLs (manifest, apple-touch-icon, service worker registration) all use `import.meta.env.BASE_URL` so deploys under e.g. `/theme/gentelella/` resolve correctly. The R2 deploy script (`npm run deploy:preview`) reads `PREVIEW_SLUG` and sets `BASE_PATH=/theme/$SLUG/` before building.

### Service worker

Registered only in `import.meta.env.PROD` (skips dev so HMR isn't fighting cache). Path: `${BASE_URL}sw.js` so it scopes correctly under a subpath. Deploy script uploads `sw.js` and `site.webmanifest` with `Cache-Control: no-cache` so users get the freshest service worker on every visit.

## Conventions

1. **Vanilla DOM only.** `querySelector`, `classList`, `addEventListener`. No jQuery shim, no SPA framework.
2. **Event delegation on `document`** for common interactions (toggles, todo checkboxes, chart tabs) — see the bottom half of [src/main-v4.js](src/main-v4.js). Components that own their own state (inbox, kanban, command palette) register listeners on their root element instead.
3. **Lazy import per-page modules** with a DOM-presence guard so the bundle never ships unused code:

   ```js
   if (document.querySelector('.calendar-grid')) {
     import('./v4/calendar.js').then((m) => m.initCalendar());
   }
   ```

4. **Idempotent `init*()` functions.** Every module exports a single `init<Name>()` that is safe to call when its root element is absent and safe to call twice. The shell does this for you on every page; per-page modules do it themselves.
5. **`showModal()` and `showToast()`**, not hand-rolled overlays. Both in [src/v4/modal.js](src/v4/modal.js) / [src/v4/toast.js](src/v4/toast.js).
6. **`openMenu()` and `openPanel()`** ([src/v4/menus.js](src/v4/menus.js)) for any dropdown or slide-out — handles outside-click, escape, focus return.
7. **CSS custom properties for colors**, never hex literals in components. Defined in `_tokens.scss`, themed via `[data-theme="dark"]`. Charts read them via `getComputedStyle(document.documentElement).getPropertyValue('--…')`.
8. **ESLint single quotes + semicolons + 2-space indent.** Prettier formats. Both run pre-commit by convention; CI doesn't gate on them.
9. **No `console.log` in shipped code** — Terser drops `console.*` and `debugger` from production builds (see `terserOptions.compress` in [vite.config.js](vite.config.js)), but the lint config still flags them so you spot them in review.

## Anti-patterns

- Don't add jQuery, Bootstrap, or a SPA framework. v4's whole pitch is "vanilla and small."
- Don't hand-write Vite entry input lists — drop the file in `production/`.
- Don't bypass `mountShell()` to wire up your own sidebar/topbar. Use `data-shell="admin"` and let the plugin inject.
- Don't hard-code `/` paths in HTML or JS. Use relative paths inside `production/*.html` and `import.meta.env.BASE_URL` in JS.
- Don't import the whole of ECharts. The pattern in [src/v4/charts.js](src/v4/charts.js) does modular imports — match it.
- Don't write directly to `dist/` — it's the build output, gitignored, blown away on every build.
- Don't directly `new bootstrap.Modal(…)` — there is no Bootstrap. Use `showModal()`.
- Don't bump CDN-loaded scripts in templates without checking SRI hashes if any are pinned. (Most assets are bundled; check [production/index.html](production/index.html) and friends for `integrity=`.)
- Don't `Notification.objects.create()`-style direct DOM construction for toasts — use `showToast()`.
- Don't edit files in `dist/`, `node_modules/`, or `docs/screenshots/` — they're all generated.

## Recipes

### New chart card

1. Markup: `<div class="card chart-card"><div class="chart" data-chart="<id>"></div></div>` inside your page.
2. Add a `case '<id>':` in `initCharts()` in [src/v4/charts.js](src/v4/charts.js) that builds the ECharts `option` and returns it.
3. The wrapper reads tokens via `getComputedStyle` so dark mode redraw is automatic.

### New page in NAV

1. `npm run new -- <slug> --nav-group "<Group>"` — done.
2. Or by hand: append to the right group in `NAV` in [src/v4/shell-render.js](src/v4/shell-render.js), with `{ key, href, text, icon }`. Match `key` to your page's `data-page`.

### New modal or toast

```js
import { showModal } from './v4/modal.js';
showModal({ title: 'Delete project?', body: 'This can\'t be undone.', actions: [
  { label: 'Cancel', variant: 'ghost' },
  { label: 'Delete', variant: 'danger', action: () => { /* … */ } }
]});

import { showToast } from './v4/toast.js';
showToast('Saved', { variant: 'success' });
```

### Wire up keyboard shortcuts

Single global handler in [src/v4/command-palette.js](src/v4/command-palette.js) handles ⌘K. For page-local shortcuts (e.g. inbox J/K/R/S/#), register on the page module's root element and check `e.target.matches(':is(input,textarea,[contenteditable])')` first.

## Build output

```text
dist/
├── assets/         # Hashed CSS + fonts
├── images/         # Hashed images
├── js/             # Hashed JS chunks
├── production/     # 58 entry HTMLs (paths resolved at build time)
├── site.webmanifest
├── sw.js
└── stats.html      # Bundle analyzer (stripped by deploy script)
```

The deploy script does three passes: long-cache hashed assets, short-cache HTML, no-cache `sw.js` + `site.webmanifest`. See [scripts/deploy-preview.sh](scripts/deploy-preview.sh) for the reasoning — Cloudflare APO will otherwise pin stale HTML pointing at deleted hashed assets.

## TypeScript

No `.ts` files, but [types/gentelella.d.ts](types/gentelella.d.ts) declares the public JS surface for IntelliSense. `package.json` `"types"` field points to it; VS Code picks it up automatically.
