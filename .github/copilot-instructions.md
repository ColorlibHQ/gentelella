# GitHub Copilot Instructions — Gentelella v4

Admin dashboard template (`4.0.0`) by Colorlib. 58 server-rendered HTML pages in `production/`, built with **Vite 8** (Rolldown). **Vanilla ES2022**, no Bootstrap, no jQuery, no SPA framework. SCSS only. Heavyweight deps — **ECharts 6**, **DataTables.net 2**, **Leaflet 1.9** — are lazy-imported per page. Full reference: `CLAUDE.md`.

## Hard rules

- **Vanilla DOM only.** `querySelector`, `classList`, `addEventListener`. No jQuery, no SPA framework. v4's pitch is "vanilla and small."
- **Single entry**: `src/main-v4.js`. Page-specific modules are lazy-imported inside it, guarded by DOM presence. Don't add `<script>` tags per page.
- **Pages auto-discover.** Drop `production/<slug>.html` and `discoverEntries()` in `vite.config.js` picks it up — never edit `rollupOptions.input`.
- **Shell opt-in**: `<body data-shell="admin" data-page="<key>" data-breadcrumb="Home > …">`. The Vite plugin inlines sidebar/topbar/footer at build/dev time (no FOUC).
- **NAV is one constant** — `NAV` in `src/v4/shell-render.js`, 7 groups. `key` matches `data-page`. New icons go in the `ICONS` object in the same file.
- **Overlays go through helpers**: `showModal()`/`showToast()`/`openMenu()`/`openPanel()` from `src/v4/{modal,toast,menus}.js`. Never hand-roll a backdrop, escape handler, or focus return.
- **CSS custom properties for colors.** Tokens in `src/scss/v4/_tokens.scss` under `:root` and `[data-theme="dark"]`. Charts read them via `getComputedStyle(document.documentElement).getPropertyValue('--…')` so dark-mode redraw is automatic.
- **Lazy ECharts.** Match the modular import pattern in `src/v4/charts.js`. Don't `import * as echarts`.
- **Subpath-safe URLs.** `import.meta.env.BASE_URL` in JS, `${base}` in the Vite plugin, relative paths in `production/*.html`. Never hard-code a leading `/`.
- **Idempotent `init<Name>()` exports.** Every module in `src/v4/` has one. Safe to call when its root element is absent, safe to call twice.
- **No `console.*` in shipped code.** Terser drops them in production; ESLint flags earlier.
- **Service worker only in prod** (`import.meta.env.PROD` guard) — keeps HMR working in dev.

## File layout

- `src/main-v4.js` — entry; mounts shell + lazy-loads page modules
- `src/scss/v4/` — 10 SCSS partials (`_tokens`, `_layout`, `_components`, `_widgets`, `_forms`, `_datatable`, `_pages`, `_apps`, `_auth`, `main`)
- `src/v4/shell.js` — `mountShell()` runtime (sidebar accordion, theme toggle, mobile drawer)
- `src/v4/shell-render.js` — `NAV` + `ICONS` + pure renderers (also imported by Vite plugin)
- `src/v4/charts.js` — `initCharts()` + ECharts factories
- `src/v4/tables.js` — `initTables()` + DataTables wrapper
- `src/v4/command-palette.js` — ⌘K
- `src/v4/{modal,toast,menus}.js` — overlay helpers
- `src/v4/{inbox,kanban,calendar,settings,file-manager}.js` — page modules (lazy-loaded)
- `src/v4/form-controls.js` — date range, multi-select, rich text
- `production/` — 58 HTML entry pages, auto-discovered
- `public/` — static assets copied verbatim to `dist/`
- `types/gentelella.d.ts` — TypeScript declarations for the public JS surface
- `scripts/new-page.mjs` — page scaffolder (`npm run new -- <slug>`)
- `scripts/deploy-preview.sh` — R2 deploy with per-file cache headers

## Anti-patterns

- Don't add jQuery, Bootstrap, or a SPA framework.
- Don't write Vite entry input lists by hand.
- Don't add `<script>` tags to `production/*.html` for new modules — lazy-import in `src/main-v4.js`.
- Don't bypass `mountShell()` to wire your own sidebar/topbar.
- Don't `new bootstrap.Modal(...)` — there is no Bootstrap.
- Don't hard-code `/` paths in JS/HTML.
- Don't import all of ECharts — match `src/v4/charts.js`.
- Don't use hex colors in components — use CSS custom properties.
- Don't introduce PostCSS, Tailwind, or any pipeline alongside Vite.
- Don't edit `dist/`, `node_modules/`, or `docs/screenshots/`.

## Commands

```bash
npm run dev                # Vite dev server on :9173 (set PORT to override)
npm run build              # Production build → dist/
npm run preview            # Serve dist/ on :9174
npm run lint               # ESLint over src/
npm run lint:fix
npm run format             # Prettier write
npm run new -- <slug>      # Scaffold a page (use --nav-group, --icon, --title …)
npm run screenshots        # Playwright capture (22 pages × light+dark)
npm run smoke              # Boot dev server, hit every page, assert 200
npm run analyze            # Build + open dist/stats.html
npm run deploy:preview     # Build + R2 sync with cache headers
```

Build under a subpath: `BASE_PATH=/foo/ npm run build`.

## When generating code

- **New page** → use `npm run new -- <slug> --nav-group "<Group>"` rather than crafting the HTML by hand. If you do write by hand, copy the head/body pattern from `production/index.html` (specifically the `data-shell`/`data-page`/`data-breadcrumb` triplet and the `<script type="module" src="/src/main-v4.js">` tag).
- **New chart** → add a `case` to the switch inside `initCharts()` in `src/v4/charts.js`. Read tokens via `getComputedStyle(document.documentElement).getPropertyValue('--…')`.
- **New page module** → add the lazy-import block at the bottom of `src/main-v4.js`, then create `src/v4/<name>.js` exporting a single idempotent `init<Name>()`.
- **New NAV entry** → append to the right group in `NAV` in `src/v4/shell-render.js`. `{ key, href, text, icon }`. `key` must match the target page's `data-page`.
- **New icon** → append to `ICONS` in `src/v4/shell-render.js`. Inline SVG, `currentColor` stroke, 24×24 viewbox.
- **New modal/toast** → import `showModal` / `showToast` from `src/v4/modal.js` / `src/v4/toast.js`. Don't render backdrops yourself.
- **New SCSS** → add a partial under `src/scss/v4/` and `@use` it from `main.scss`. Variables live in `_tokens.scss`; new tokens get both a light and a dark value.
