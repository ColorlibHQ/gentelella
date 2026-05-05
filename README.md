# Gentelella v4

> **`4.0.0-rc.2`** — release candidate. The v4 line ships under the `next` distribution tag while v2.x remains `latest`. [→ Changelog](CHANGELOG.md)

A modern admin dashboard template — **60 pages**, **20 chart variants**, fully interactive inbox / kanban / calendar / settings, **live theme generator**, **component playground**, **command palette** (⌘K), **PWA-ready**. Vanilla JavaScript, no Bootstrap, no jQuery.

Built on Vite 8. Free, MIT licensed, by [Colorlib](https://colorlib.com).

<p align="center">
  <img alt="Dashboard preview" src="docs/screenshots/light/dashboard.png" width="49%">
  <img alt="Dashboard preview (dark)" src="docs/screenshots/dark/dashboard.png" width="49%">
</p>

<p align="center">
  <em>Inbox · Kanban · Theme generator</em><br>
  <img alt="Inbox" src="docs/screenshots/light/inbox.png" width="32%">
  <img alt="Kanban" src="docs/screenshots/light/kanban.png" width="32%">
  <img alt="Theme generator" src="docs/screenshots/light/theme.png" width="32%">
</p>

> **Generate your own screenshots** — `npm run build && npm run screenshots` boots Playwright and captures 22 key pages × light + dark = 44 PNGs to `docs/screenshots/`.

---

## The wow features

- **🎨 Live theme generator** — pick a primary color, watch every chart, button, badge, link restyle in real time. Copy or download the generated SCSS tokens. Demo: `/production/theme.html`
- **🧪 Component playground** — every reusable component on one page, side-by-side with its **exact HTML** and a Copy button. Demo: `/production/playground.html`
- **⌘K command palette** — fuzzy search across all 60 pages and inline actions
- **📬 Real inbox client** — folders, reader pane, compose modal, reply/forward, J/K/R/S/# keyboard shortcuts, search across the active folder
- **📱 PWA** — installable on macOS / Windows / mobile, offline shell, service worker
- **↔️ Sidebar rail mode** — desktop hamburger collapses sidebar to icon-only with hover tooltips and click-to-flyout submenus

## What you get

| Surface | What's in it |
|---|---|
| **Dashboards** | 4 variants — operations, analytics (heatmap, funnel, cohort matrix), sales (gauge, radar, pipeline), system health (resource bars, deployment list, error log) |
| **Auth** | Sign-in · social (Google, GitHub) · register · forgot password · 2FA · lock screen · 403 / 404 / 500 |
| **Forms** | General form · advanced controls · 6-step wizard · drag-and-drop upload · validation · **date-range picker · multi-select · rich text editor** |
| **Tables** | DataTables — sort, search, paginate, **row selection, CSV export** · 23-row + 50-row demos |
| **Charts** | **20 ECharts variants** — line, area, stacked area, bar, horizontal bar, mixed bar/line, donut, pie, radar, gauge, scatter, heatmap, funnel, candlestick, polar bar, treemap, sankey, calendar heatmap, gantt + dashboard mini-line |
| **App pages** | Calendar (full CRUD) · inbox (folders, compose, reader) · chat (8 threads) · kanban (drag-drop) · file manager (tree + grid) · notifications · invoice (editable line items) · profile · settings (persisted) · FAQ |
| **E-commerce** | Storefront · product detail · order list · order detail · pricing tiers |
| **Admin** | Contacts · user management (search, filters, role editor) · maintenance · coming-soon |
| **UI library** | **Component playground** · **theme generator** · 120+ icons in 14 categories · typography · 18 widget variants · media gallery · general elements (banners, accordion, drawer, popover, timeline) |
| **Map** | Leaflet customer map |
| **Marketing** | Landing page with hero, stats band, features, showcase, testimonials, FAQ |
| **Layouts** | Fixed sidebar / fixed footer / nested page / blank starter |

Plus: 10 SCSS partials · build-time + runtime shell (no FOUC) · `data-page` attribute auto-highlights nav · mobile drawer + desktop rail mode · light/dark with `prefers-color-scheme` + pre-paint · cross-document view transitions · skip-to-content · keyboard focus-visible · accordion sidebar with sessionStorage memory · `localStorage`-persisted settings.

## Tech stack

- **Vite 8** with Rolldown — multi-page app, 60 entry points
- **SCSS** with `@use` modules — no Bootstrap, no framework
- **Vanilla ES2022** — no jQuery, no SPA framework, no build-time JSX
- **Apache ECharts 6** — lazy-imported, modular (only chart types actually used)
- **DataTables.net 2** core — re-skinned from scratch to match the design system
- **Leaflet 1.9** — lazy-imported on the map page only
- **Inter** font from Google Fonts
- **Playwright** (devDep) — for the screenshot pipeline

3 production deps, 9 dev deps, **~178 MB `node_modules`** (was ~600 MB on the old Gentelella).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:9173/production/index.html](http://localhost:9173/production/index.html). The dev server hot-reloads SCSS, JS, and HTML. Override the port with `PORT=4000 npm run dev`.

### Production build

```bash
npm run build
```

Outputs static HTML + hashed JS/CSS to `dist/`. Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages).

To deploy under a subpath (e.g. `https://example.com/admin/`):

```bash
BASE_PATH=/admin/ npm run build
```

### Other scripts

```text
npm run dev           Start Vite dev server (port 9173)
npm run build         Production build to dist/
npm run build:dev     Non-minified build (debugging)
npm run preview       Serve dist/ to preview the production build (port 9174)
npm run analyze       Build + open the bundle treemap
npm run screenshots   Boot Playwright + capture 44 PNGs to docs/screenshots/
npm run lint          ESLint across src/
npm run format        Prettier write across src/
```

## Project layout

```text
src/
├── main-v4.js                 Entry — mounts shell, initializes charts/tables
├── v4/
│   ├── shell.js               Runtime: mobile drawer, theme toggle, dropdowns
│   ├── shell-render.js        Pure: nav config + sidebar/topbar/footer HTML
│   ├── charts.js              ECharts factories (revenue, sales, donut, …)
│   ├── tables.js              DataTables init for [data-datatable]
│   ├── menus.js               Popover menus + side panels
│   ├── modal.js               Modal dialog system
│   ├── toast.js               Toast notifications
│   ├── calendar.js            Month-grid calendar
│   ├── inbox.js               Inbox folder + message list
│   ├── kanban.js              Drag-and-drop kanban board
│   ├── file-manager.js        Tree + grid file browser
│   ├── details.js             Project / order / contact detail panels
│   ├── product-images.js      Product gallery zoom
│   └── product-mockups.js     SVG product mockups
└── scss/v4/
    ├── main.scss              @use aggregator
    ├── _tokens.scss           CSS custom properties (colors, sidebar, fonts, radii)
    ├── _layout.scss           Sidebar, topbar, main, grid, footer, responsive
    ├── _components.scss       Buttons, cards, tables, status, toggles, progress
    ├── _forms.scss            Inputs, selects, validation, input groups
    ├── _widgets.scss          Stat cards, activity, donuts, sparklines, todos
    ├── _pages.scss            Pagination, alerts, calendar, inbox, invoice, cards, pricing, landing
    ├── _datatable.scss        DataTables UI overrides
    ├── _auth.scss             Login + error layouts
    └── _apps.scss             Chat, kanban, file manager, settings

production/                    60 entry HTML pages — one per surface
public/                        Static assets copied as-is
dist/                          Build output (gitignored)
docs/getting-started.md        5-minute setup guide
vite.config.js                 Multi-page Vite config
```

## Customization

### Design tokens

Every color, radius, sidebar dimension, and font setting lives as a CSS custom property in [`src/scss/v4/_tokens.scss`](src/scss/v4/_tokens.scss). Edit `:root`, save, the Vite dev server reloads.

Want a different brand color? Change `--primary` and `--primary-dk`. Every chart, every button, every active nav item updates — ECharts reads these variables at chart-init time.

### Adding a page

The fast way:

```sh
npm run new -- reports --title "Reports" --pretitle "Admin" \
  --breadcrumb "Home > Admin > Reports" --nav-group "Admin" --icon "profile"
```

This creates `production/reports.html` with the standard skeleton and (with `--nav-group`) inserts a sidebar entry into the `NAV` array of [`src/v4/shell-render.js`](src/v4/shell-render.js). Vite auto-discovers the new entry — no config change needed. Run `npm run new -- --help` for all options, or use `--dry-run` to preview without writing.

The manual way:

1. Copy any existing page in `production/` (e.g. `profile.html`) as your starting point.
2. Update the `<title>`, `data-page`, and `data-breadcrumb` attributes.
3. Replace the `<main>` content with your markup using the v4 components.
4. Optionally add a new sidebar item by editing the `NAV` array in [`src/v4/shell-render.js`](src/v4/shell-render.js).

The shell auto-marks the matching nav item active based on `data-page`.

### Adding a chart

Add a factory function to [`src/v4/charts.js`](src/v4/charts.js) following the `revenueLine` / `salesBar` pattern, register it in the `charts` map, then drop a `<div data-chart="your-name" style="width:100%;height:300px"></div>` into any page. Colors come from the design tokens automatically.

### Adding a sortable table

Mark up a regular `<table class="table" data-datatable>` with `<thead>` and `<tbody>`. The init runs automatically. Use `<th data-orderable="false">` to disable sorting on a column, and `data-page-length="25"` on the table to change the page size.

### Sidebar navigation

The sidebar is rendered from a single source — the `NAV` array in [`src/v4/shell-render.js`](src/v4/shell-render.js). Edit there, every page updates.

### TypeScript / IntelliSense

Type declarations for the public JS surface ship in [`types/gentelella.d.ts`](types/gentelella.d.ts) and are wired up via the `types` field in `package.json`. VS Code resolves IntelliSense automatically — no `tsconfig` required, no rewrite. Covers `mountShell`, `showModal`, `showToast`, `openMenu`, `seedAdapter`/`httpAdapter`, chart/table init, and the `NAV` schema.

### Markup helpers

For pages that build content from data (orders rows, inbox threads, kanban cards), [`src/v4/markup.js`](src/v4/markup.js) exposes pure string-returning helpers — `statTile()`, `statusBadge()`, `customerCell()`, `activityItem()`, `visitorRow()`, `emptyState()`, `banner()`, `skeletonRows()`, plus `escapeHtml()`. Live examples on the [Playground](https://preview.colorlib.com/theme/gentelella-v4-rc1/playground.html#helpers-intro). Static pages keep their hand-written HTML — these are for JS-driven content where the boilerplate adds up.

## Deployment

Static template — deploy `dist/` anywhere that serves files.

| Host | Notes |
|---|---|
| **Netlify / Vercel / Cloudflare Pages** | Drop in, no config needed. Set `BASE_PATH=/` (default). |
| **GitHub Pages** | `BASE_PATH=/your-repo/ npm run build`, push `dist/` to `gh-pages`. |
| **S3 / CloudFront** | Upload `dist/`. Set the bucket as a static site, point CloudFront at it. |
| **Any nginx / Apache** | `cp -r dist/* /var/www/html/`. |

No backend. No environment variables required (other than `BASE_PATH` if you're deploying under a subpath).

## What's intentionally NOT included

- **No backend.** Forms post to `#` and don't persist. The dashboard is a UI template — wire up your own API.
- **No auth.** The login form is a redirect; there's no session, no token, no validation.
- **No real-time.** No WebSockets, no SSE, no polling. Activity feeds and stats are static.
- **No state management.** Toggles and todo checkboxes flip via direct DOM mutation.
- **No formal accessibility audit.** Skip-link, focus rings, ARIA labels and landmarks are wired, but no systematic screen-reader testing has been done. PRs welcome.

## Roadmap

Shipped in `4.0.0-rc.1` — full list in [`CHANGELOG.md`](CHANGELOG.md). Still planned:

- **Image optimization** — compress `public/images/*.jpg` and ship AVIF + JPG fallback
- **Per-page `<meta description>`** auto-derived from the breadcrumb
- **Playwright smoke test** in CI (asserts no console errors across all 60 pages)
- **Lighthouse audit** + tuning to 95+ Performance / 100 A11y / 100 SEO / 100 PWA
- **Per-page chart-type tree-shaking** to slim the ECharts vendor chunk
- **RTL support** (logical-properties pass)
- **i18n extraction pattern**

Want any of these prioritized? Open an issue.

## License

MIT — free for personal and commercial use. See [`LICENSE.txt`](LICENSE.txt).

## Credit

Gentelella has been a free Bootstrap admin template since 2014, originally by [Aigars Silkalns](https://colorlib.com) at Colorlib. v4 is a ground-up redesign for 2026 — Bootstrap and jQuery are gone, replaced by a self-contained design system.
