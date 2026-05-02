# Contributing to Gentelella v4

Thanks for considering a contribution. This is a small, opinionated codebase — knowing the conventions makes review much faster.

## Getting set up

```bash
git clone https://github.com/ColorlibHQ/gentelella.git
cd gentelella
nvm use            # picks up .nvmrc (Node 20)
npm install
npm run dev
```

Open http://localhost:3000/production/index.html. Vite hot-reloads SCSS, JS, and HTML.

## Before you open a PR

```bash
npm run lint       # ESLint, must pass
npm run format     # Prettier write
npm run build      # must succeed
```

CI runs the same three steps on every push. There is no test harness — this is a static UI template — so manual verification of the page you changed is part of the contract.

## Architecture in one breath

- **No framework, no SPA.** Every page in `production/` is its own HTML entry. They all load `/src/main-v4.js`, which mounts a shell, initializes ECharts/DataTables, and registers delegated event handlers for chips/toggles/tabs.
- **Page-specific behavior is data-driven**, not entry-script-driven. You set `data-shell="admin"`, `data-page="key"`, and `data-breadcrumb="A > B"` on `<body>` and the same shared entry handles the rest.
- **Tokens-first SCSS.** Every color, radius, sidebar dimension lives in `_tokens.scss` as a CSS custom property. No hardcoded colors anywhere else.
- **Lazy imports for heavy libs.** `echarts`, `datatables.net`, and `leaflet` only load on pages where their host elements exist.

If this is unclear, read [CLAUDE.md](CLAUDE.md) — it's the architecture brief.

## Adding things

### A new page

1. Copy a similar page from `production/` (e.g. `profile.html`) as a starting point.
2. Edit the `<title>`, `data-page`, `data-breadcrumb`.
3. Replace the `<main>` content with your markup using existing components.
4. Register the entry in `vite.config.js` `rollupOptions.input`.
5. If the page deserves a sidebar slot, add it to the `NAV` array in [`src/v4/shell-render.js`](src/v4/shell-render.js).

### A new chart

1. Add a factory in [`src/v4/charts.js`](src/v4/charts.js) following the `revenueLine` pattern. Pull colors from `t` (the token snapshot from CSS custom properties) — never hardcode.
2. Register the factory in the `charts` map at the bottom of the file.
3. Drop `<div data-chart="your-name" style="width:100%;height:300px"></div>` in any page.

### A new sortable table

Just add `data-datatable` to a regular `<table class="table">`. Use `<th data-orderable="false">` to disable sorting on a column and `data-page-length="25"` on the table to change the page size.

### A new shared component

Put the SCSS in the right partial:

| Where | When |
|---|---|
| `_components.scss` | Reusable, used on multiple pages (buttons, cards, tables, status, toggles). |
| `_widgets.scss` | Dashboard-style widgets (stat tiles, sparklines, donuts, todos). |
| `_pages.scss` | Single-page layout (invoice, calendar, pricing, landing). |
| `_apps.scss` | Heavier app surfaces (chat, kanban, file manager, settings). |
| Its own partial | Vendor library override (mirroring `_datatable.scss`). |

## What we don't accept

Feel free to argue any of these in your PR if you have a strong case, but the default answer is "no":

- **Re-introducing Bootstrap, jQuery, or any CSS framework.** v4 deliberately ships its own design system.
- **Page-specific entry scripts.** The shared `main-v4.js` stays small. Use `data-*` attributes + the existing event delegation, or dynamic-import inside the entry guarded by an element check.
- **Inline `<style>` blocks** in HTML. They belong in SCSS so they update with tokens.
- **Hardcoded colors anywhere outside `_tokens.scss`.** Use `var(--…)`.
- **Backwards-compat shims** for renamed/removed components. We're pre-1.0 — break things, document them in CHANGELOG.
- **Comments that restate what the code does.** Comments earn their place by explaining *why*.

## Issues and bug reports

Include:

- Browser + OS + Node version
- The page (e.g. `production/calendar.html`)
- Console errors (if any)
- Whether it reproduces on the live demo

## Releasing

Maintainers only:

```bash
npm version <patch|minor|major>
git push --follow-tags
```

A new tag triggers the GitHub Pages deploy.

---

By submitting code, you agree to license it under the MIT license (same as the project).
