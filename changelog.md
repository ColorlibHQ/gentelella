# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0-rc.1] - 2026-05-01

Release candidate. Massive expansion since beta.2 — 60 pages, 20 chart variants, full mail client, live theme generator, component playground, PWA, sidebar rail mode. The published `latest` tag still points at the v2.x line; v4 ships under the `next` distribution tag until 4.0.0 stable.

### Added

#### New top-level features
- **Live theme generator** ([production/theme.html](production/theme.html)) — pick a primary color from 11 swatches or a hex input; tune corner radius, sidebar width, body font size; switch sidebar style (Dark / Black / Light / Brand); flip light/dark mode. Every chart, button, badge, card and link restyles in real time. Generated SCSS preview is copyable and downloadable as `_tokens-override.scss`.
- **Component playground** ([production/playground.html](production/playground.html)) — every reusable component on a single scrolling page, side-by-side with its **exact HTML** and a "Copy" button. Sticky left rail with scrollspy nav, 13 sections covering buttons, status, alerts, cards, forms, tables, tabs, progress, stats, timeline, accordion, empty state.
- **Command palette** (⌘K / Ctrl+K) — fuzzy search across all 60 pages and inline actions (toggle theme, open profile, sign out, etc.). Built-in matcher with subsequence + word-boundary scoring. Topbar search input now opens the palette on focus.
- **PWA** — full `site.webmanifest` with shortcuts, service worker (network-first HTML, cache-first assets, offline fallback), apple-touch-icon, theme-color metas (light + dark). Installable on macOS / Windows / mobile.
- **Sidebar rail mode** — desktop hamburger collapses sidebar from 252px → 64px showing icons only. Tooltip on hover via `data-rail-label`. Submenu groups become click-to-flyout when collapsed. Persists in localStorage. Same hamburger toggles drawer on mobile.

#### New pages (8)
- `production/theme.html` — theme generator
- `production/playground.html` — component playground
- `production/offline.html` — PWA offline fallback
- `production/chat.html` — fully interactive 8-conversation chat
- `production/kanban.html` — HTML5 drag-drop kanban with edit modals
- `production/file_manager.html` — tree + grid file browser with breadcrumbs
- `production/notifications.html` — filterable notifications page
- `production/settings.html` — persisted settings with 8 sections

#### New chart factories (added to [src/v4/charts.js](src/v4/charts.js); 20 total now)
- `stacked-area` · multi-series stacked area with smooth fills
- `horizontal-bar` · top categories ranked
- `mixed-bar-line` · bars + secondary-axis trend line
- `radar` · 6-axis comparison
- `gauge` · single-KPI progress arc
- `scatter` · bubble plot with size encoding
- `heatmap` · week × hour activity
- `funnel` · conversion stages
- `candlestick` · OHLC market data
- `polar-bar` · circular bar chart
- `treemap` · proportional cells
- `sankey` · flow diagram
- `calendar-heatmap` · GitHub-contribution-style 12-month grid
- `gantt` · project timeline using `custom` series

#### New form components ([src/v4/form-controls.js](src/v4/form-controls.js))
- **Date-range picker** — two-month grid, 6 presets (Today / Last 7 days / Last 30 days / This month / Last month / This year), hover preview, Monday-first weeks. No library.
- **Rich text editor** — toolbar (bold / italic / underline / H2 / blockquote / lists / link / code / clear), keyboard shortcuts (⌘B/I/U/K), syncs to a hidden textarea for form submission.
- **Multi-select with chips** — autocomplete on type, ↑/↓/Enter keyboard nav, Backspace removes last chip, binds to a real `<select multiple>`.

#### New SCSS primitives in [_components.scss](src/scss/v4/_components.scss) and [_forms.scss](src/scss/v4/_forms.scss)
- `.accordion` — native `<details>` styled with primary border on open
- `.drawer` / `.drawer-backdrop` — slide-in left/right side panel
- `.timeline` — color-coded event timeline with vertical guide rail
- `.banner` — info / warning / danger / success callouts with action buttons
- `.popover-trigger` — hover/focus rich-content popovers
- `.empty-state` — generic centered icon + title + text + actions block
- `.card.is-refreshing` — sweep animation on card refresh
- `.input-affix` — input with prefix/suffix segments
- `.segmented` — compact tab-like radio
- `.switch` — iOS-style toggle
- `.color-grid` — color swatch picker
- `.tag-input` — chip input with × removal
- `.rating` — star rating
- `.search-suggest` — autocomplete dropdown
- `.password-strength` — 4-segment meter
- `.otp-grid` — 6-box one-time-code input
- `.file-input` — compact file picker with filename echo
- `.avatar-upload` — circular avatar with hover overlay
- `.stepper` — number stepper with +/− buttons

#### Real interactivity replacing demo toasts
- **Inbox** ([src/v4/inbox.js](src/v4/inbox.js)) — full mail client: 5 folders + 4 labels, click-to-read pane, compose modal, reply / forward (prefilled), star, trash / restore / delete-forever, edit drafts, mark-all-read, per-folder search, J/K/R/S/#/C keyboard shortcuts.
- **Settings** ([src/v4/settings.js](src/v4/settings.js)) — every toggle persists to localStorage, profile form has dirty-state with Save/Cancel rollback, theme/density radios persist and apply, integration cards toggle Connect ↔ Disconnect, Revoke session opens confirm modal, Danger zone has real export download / transfer / delete-account flows, team Invite + Manage modals.
- **Topbar dropdowns** — clicking a notification or message row opens a real **detail modal** with kind icon, body, and action buttons (Dismiss / View all / Open in inbox / Send reply).
- **User avatar menu** — entries route to real pages (Profile / Settings / Theme generator / FAQ / Lock screen) or open modals (Keyboard shortcuts grid, Sign out confirm).
- **Card 3-dot menu** — Refresh adds shimmer + repaints chart; Move up / Move down reorder siblings; Hide card has 5-second clickable undo toast.
- **Page-actions** ([src/v4/page-actions.js](src/v4/page-actions.js)) — Print / Export / Refresh / Share / Compose / `New {anything}` / Invite buttons routed to real handlers across the whole template (window.print, download blob, navigator.share, modals).
- **Invoice** — editable line items (description / sub / qty / rate), Add / Remove rows, editable discount + VAT %, live total recompute, Mark-as-paid flips status pill and advances payment timeline.
- **DataTables** — `data-selectable` enables row selection (header checkbox = select all), `data-export="filename"` adds CSV export button.

#### Sidebar rebuild
- 7 nav groups with submenu support: General (Dashboards × 4, Forms × 6, Tables × 2, Charts × 3, + Calendar / Map), Apps (5), E-commerce (5 incl. Orders × 2), Projects (2), UI library (7 incl. Playground / Theme / Typography / Icons), Admin (5), Layouts (4)
- **Accordion behavior** — opening one group closes others; chosen state persists in `sessionStorage` so navigation doesn't snap it shut
- **Visual redesign** — vertical guide rail, colored connector tick on active sublink (primary teal), parent stays subtly highlighted when a child is current, smoother chevron rotation
- Every page reachable from the sidebar (was 22 of 43; now all 60)

#### Dashboards expanded (3 thin → comprehensive)
- **index2.html** (Analytics) — 6 rows / 18 cards: KPI sparklines, live counter, stacked-area, conversion funnel, activity heatmap, top pages / countries / referrers, goals, top searches, cohort retention matrix
- **index3.html** (Sales) — 6 rows / 14 cards: pipeline KPIs, quarterly target gauge, mixed bar/line, pipeline by stage, lead-sources donut, quota attainment, activity radar, top reps, won-this-week, deals at risk, lost reasons
- **index4.html** (Operations) — 5 rows / 18 cards: maintenance banner, 4 KPIs, 6-bar resource usage, API endpoint stats, cache-hit gauge, service status, incident timeline, background jobs, deployment history, recent errors

#### Page expansion
- **icons.html** — 120+ icons in **14 categories** (was 44 flat), live search filter, click to copy name, 48px icon size, 180px cells
- **general_elements.html** — added Banners / Accordion / Drawer / Popover / Timeline sections
- **profile.html** — added stats grid, achievements row (6 badges), connected accounts (GitHub / Google / Slack / X), recent activity timeline
- **chartjs.html** — 16 chart variant cards organized into themed rows
- **echarts.html** — full 16-chart gallery
- **typography.html** — 6 sections (display, heading scale, inline, block, code, terminal, numerals, truncation)
- **form.html** — 4 sections, 25+ field variants (advanced controls section showcasing date-range / multi-select / rich-text)
- **widgets.html** — 18 widget variants in 6 rows
- **landing.html** — eyebrow pill, stats band, expanded features (3 → 6), showcase section linking to 12 demos, stack section, 3 testimonials, 6-question FAQ accordion

#### Tooling & DX
- **Playwright screenshot pipeline** ([scripts/screenshots.mjs](scripts/screenshots.mjs)) — `npm run screenshots` boots `vite preview` and captures **22 pages × light + dark = 44 PNGs** at 1440×900 @ 2x. Outputs to `docs/screenshots/{light,dark}/` plus a `manifest.json`.
- **Random-collision ports** — dev defaults to **9173**, preview to **9174** (was 3000/4173). Override via `PORT` / `PREVIEW_PORT` env.
- **CONTRIBUTING.md** — add-a-page / add-a-chart / add-a-table flows, what we don't accept.
- **Public API JSDoc** — `mountShell`, `initCharts`, `initTables`, `showToast`, `openMenu`, `openPanel`, `showModal`, `initCommandPalette`. IntelliSense in VS Code without TypeScript.
- **Print stylesheet** — `@media print` block strips chrome (sidebar, topbar, footer, action bars), expands link URLs, page-break-inside avoid on rows.
- **Deploy-Pages CI** — replaces the dead Jekyll workflow with a real Vite build + Pages deploy on push to master.

### Changed

- Hamburger sidebar toggle is now **always visible** (no longer mobile-only). Click on desktop collapses to rail; click on mobile opens drawer.
- Service worker cache key bumped to `gentelella-v4-r2` to invalidate old caches on the next visit.
- Page count: 55 → **60** (added theme, playground, offline, plus several new app pages registered in vite.config).
- ECharts vendor chunk grew slightly (~360 KB gz) to include the 4 new chart constructors and Calendar / VisualMap / Polar components.
- Chart factories now repaint on a `themechange` custom event in addition to `data-theme` mutations — used by the theme generator for live preview.
- Global `:where(svg):not([width]):not([height])` rule replaces the higher-specificity rule that was forcing inline SVGs to 1em even when classes set explicit sizes.

### Fixed

- File manager card grid was stretching to fill viewport height — `align-content: start` + `grid-auto-rows: max-content` on `.fm-grid.view-grid`.
- Icons.html cells were rendering at ~12px because the global SVG-size rule out-specificity'd `.icon-cell svg`. Fixed via `:where()` neutralization plus larger 48px / 180px cell sizing.
- 25 page `data-page` keys updated to match the new submenu structure so the right group auto-opens.
- Deprecated demo toast pattern: removed the catch-all `.btn` toast fallback in [main-v4.js](src/main-v4.js); buttons now route through [page-actions.js](src/v4/page-actions.js) to real handlers (modals, downloads, navigation) or do nothing rather than spamming.

### Numbers (rc.1 vs beta.1)

| Metric | beta.1 | rc.1 |
|---|---|---|
| Pages | 39 | **60** |
| Chart variants | 4 | **20** |
| Interactive surfaces | dashboard widgets | dashboard, inbox, kanban, calendar, chat, file manager, settings, notifications, invoice, theme generator, playground, command palette |
| Form components | inputs, selects, textareas | + tag input, sliders, OTP, password strength, file upload, avatar upload, stepper, color picker, segmented, switch, **date-range, rich-text, multi-select** |
| Toast occurrences | "any unhandled .btn shows toast" | only on real confirmations |
| Build time | 4.81s | ~5s |
| Above-the-fold gz | ~17 KB | ~17 KB (entry stayed tiny) |
| node_modules | 138 MB | 178 MB (+ Playwright) |

### Known limitations

- Image assets in `public/images/` aren't optimized yet (~290 KB media.jpg, ~157 KB cropper.jpg). Lossy compression / AVIF conversion is on the rc.2 docket.
- No formal accessibility audit. Skip-link, focus rings, ARIA labels and landmarks are wired, but no systematic screen-reader testing.
- ECharts vendor chunk is the dominant bundle weight (~360 KB gz). Per-page tree-shaking of chart-type constructors could shave ~30%.
- All forms post to `#` and don't persist outside `localStorage`. This is a UI template; bring your own backend.

## [4.0.0-beta.2] - 2026-04-29

Audit pass: bring docs and code up to par with the actual feature set. No breaking changes.

### Added

- Vite + GitHub Pages deploy workflow ([.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)) — replaces the dead Jekyll workflow.
- `.nvmrc` pinning Node 20.
- 6 page-scoped sections moved into [`_pages.scss`](src/scss/v4/_pages.scss): fixed-footer, dropzone, wizard, media gallery, pricing, landing.

### Fixed

- Lint: 12 ESLint errors and 24 warnings cleared via `npm run lint:fix`.
- `profile.html` had `data-page="profile"` (no matching nav key); now empty since profile is reached from the topbar avatar menu.
- `landing.html` had an `h1 → h3` heading-order skip; features now use `<h2>`.
- 6 inline `<style>` blocks removed from `production/*.html` — styles belong in SCSS per project conventions.
- README and CHANGELOG no longer claim missing features (mobile drawer, dark-mode skin, skip link) that are actually implemented.

## [4.0.0-beta.1] - 2026-04-28

First release of the v4 redesign. Bootstrap 5 and jQuery are gone; the entire design system is custom SCSS. Major version bump from v2.x because there is no markup overlap with prior releases.

### Added

- **Design system** — 10 SCSS partials (`_tokens`, `_layout`, `_components`, `_forms`, `_widgets`, `_pages`, `_datatable`, `_auth`, `_apps`, `main`) all consumable via CSS custom properties on `:root`.
- **Layout shell** — sidebar + topbar + footer rendered both at build time (Vite plugin, no FOUC) and at runtime (`mountShell()` fallback). Driven by `body[data-shell="admin"]`, `data-page`, `data-breadcrumb` attributes. Pure renderers in [`src/v4/shell-render.js`](src/v4/shell-render.js); runtime wiring in [`src/v4/shell.js`](src/v4/shell.js).
- **Mobile drawer** — sidebar slides in below 768px with backdrop, ESC-to-close, viewport-resize-to-close.
- **Light/dark theme toggle** — pre-paint script reads `localStorage('theme')` / `prefers-color-scheme` and sets `data-theme` on `<html>` before body renders, so dark mode never flashes.
- **Cross-document view transitions** — smooth cross-fade between same-origin pages on supporting browsers.
- **Skip-to-content link** — injected on every shell page for keyboard users.
- **55 pages** spanning dashboards, auth, forms, tables, charts, app pages (chat, kanban, file manager, calendar, inbox, settings, notifications), e-commerce, admin, marketing, and UI library.
- **Real ECharts** (6 chart instances across 5 pages) — modular import (line/bar/pie + canvas renderer), lazy-loaded, colors driven by design tokens.
- **Real DataTables** — sortable, searchable, paginated, fully styled to match the v4 design system from scratch (no Bootstrap-bs5 styling dependency).
- **Leaflet** — lazy-imported on the map page only, with circle markers driven by per-city customer counts.
- **`BASE_PATH` env var** — `BASE_PATH=/admin/ npm run build` for subpath deployments.
- **Bundle analyzer** — `npm run analyze` for the rollup-plugin-visualizer treemap.

### Changed

- Vite multi-page input list cut from 42 entries to 39 — `theme-comparison` and `index-legacy` removed.
- `manualChunks` simplified to 3 chunks (`vendor-echarts`, `vendor-tables`, `vendor-maps`) — was 11.
- `optimizeDeps.include` reduced to `[echarts, datatables.net, leaflet]` from `[bootstrap, @popperjs/core, dayjs, @simonwep/pickr]`.

### Removed

- **Bootstrap 5** + Bootstrap Icons + Tempus Dominus + Choices.js + nouislider + FontAwesome + Pickr + Uppy + Chart.js + FullCalendar + Cropper + Quill + Inputmask + JSZip + Skycons + DOMPurify + dayjs — 30+ deps gone.
- Legacy SCSS — `_color-schemes`, `_variables`, `custom`, `index2`, `index4`, `landing`, `font-optimization`, `daterangepicker`.
- Legacy entry scripts — `main-minimal`, `main-core`, `main-calendar`, `main-form-basic`, `main-inbox`, `main-tables`, `main-upload`, `init`, `chart-initializer`.
- Legacy modules and utils — `src/modules/`, `src/lib/`, `src/js/`, `src/utils/`, `src/test/`.
- Vitest test harness and 4 legacy unit-test files.
- Jekyll-based `docs/` site, `README_CN.md`, original `screenshots/` (those were screenshots of other Colorlib templates, not Gentelella).

### Numbers

| Metric | Before (v2.2.0) | After (v4.0.0-beta.1) |
|---|---|---|
| Production deps | 28 | **3** |
| Dev deps | 14 | **8** |
| `node_modules` | ~600 MB | **138 MB** |
| Files in `src/` | 30+ JS + 9 SCSS + tests | **13** |
| Above-the-fold deploy (gzipped) | ~107 KB (init.css alone) | **~17 KB** total |
| Total deploy size | 6.2 MB | **3.0 MB** |
| Build time | 7.42s | **4.81s** |

### Known limitations

- No formal accessibility audit. Skip-link, focus rings, ARIA labels and landmarks are wired, but no systematic screen-reader testing.
- All forms post to `#` and don't persist. This is a UI template; bring your own backend.
- ECharts vendor chunk is the dominant bundle weight (~350 KB gzipped). Future optimization: scope chart-type imports per page rather than blanket-loading line + bar + pie.
