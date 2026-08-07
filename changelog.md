# Changelog

All notable changes to this project will be documented in this file.

## [4.1.1] - 2026-08-07

Link fix. 4.1.0 was tagged and released on GitHub but never published to npm — this is the first 4.1.x on the registry, and it carries everything in 4.1.0 plus the fix below.

### Fixed

- **The landing page's changelog link 404'd.** It pointed at `blob/master/CHANGELOG.md`; the file is `changelog.md` and GitHub blob URLs are case-sensitive. The same mistake was in the docs site footer (fixed separately at <https://gentelella.colorlib.com/docs/>).

  The filename stays lowercase rather than being renamed to match convention: it has been `changelog.md` for its entire history, and the 4.0.2, 4.0.3 and 4.1.0 release notes all link to that name and resolve. Renaming would have fixed two links and broken three.

## [4.1.0] - 2026-08-06

Breadcrumbs become navigable, plus a dependency refresh that includes the DataTables 3 major.

### Added

- **Linked breadcrumbs** — every segment except the current page is now a link when it has somewhere to go ([#999](https://github.com/ColorlibHQ/gentelella/issues/999)). Three resolution tiers, in order:
  1. **Explicit target** — `data-breadcrumb="Home > Projects|projects.html > Acme Redesign"`; everything after `|` is the href.
  2. **NAV label match** — `CRUMB_HREFS` in [src/v4/shell-render.js](src/v4/shell-render.js) is derived from `NAV` at module load, so a segment whose text matches a sidebar entry links to it automatically. A parent group resolves to its first child. `Home` → `index.html` is the one hand-seeded entry.
  3. **Neither** — plain text, byte-identical to the previous output.

  The last segment stays `aria-current="page"` and is never a link. Links are emitted by the build-time shell injector alongside the rest of the topbar, so they are present in the served HTML on the first frame, work with JavaScript disabled, and never hydrate in after paint. Crumb hrefs are attribute-escaped on the way out.

  No visual change at rest: crumb links inherit `--text-muted` and pick up `--primary` plus an underline on hover, with the existing global `:focus-visible` ring for keyboard users.

### Changed

- **Breadcrumb trails rewritten on 12 pages** so no trail contains a dead level. Segments that were pure sidebar groupings with no landing page (`Apps`, `Layouts`, `Admin`, `UI`, `Shop`, `E-commerce`) are gone — `Home > Kanban`, not `Home > Apps > Kanban`. 61 of 63 non-current segments across the 46 shell pages now link; the two exceptions are on [production/level2.html](production/level2.html), which deliberately demonstrates unlinked segments and now documents the syntax on-page.
- **`datatables.net`** 2.3.8 → **3.0.1** (major). Our integration is narrow — `new DataTable(el, opts)`, `columns().every()`, `rows({search,order}).indexes()`, `row(i).node()` — and all of it is unchanged in 3.0. The generated markup our `_datatable.scss` re-skin targets (`.dt-container`, `.dt-search`, `.dt-paging-button`, `.dt-column-header`, `.dt-orderable-*`, `.dt-layout-row`) is identical, so the theme needed no changes. Verified on both table pages: same DOM structure, pixel-identical rendering in light and dark, no console errors, and CSV export still honours the applied sort and filter.
- **Dev dependencies** bumped to latest:
  - `@playwright/test`, `playwright`: 1.61.1 → 1.62.1
  - `eslint`: 10.7.0 → 10.8.0
  - `sass`: 1.101.3 → 1.102.0
  - `terser`: 5.49.0 → 5.49.2
  - `vite`: 8.1.5 → 8.2.0
- Runtime deps `echarts` 6.1.0 and `leaflet` 1.9.4, and dev deps `@eslint/js` 10.0.1, `eslint-config-prettier` 10.1.8, `prettier` 3.9.6, `rollup-plugin-visualizer` 7.0.1 were already at their latest published versions — no change.
- Docs updated for the new breadcrumb contract: [CLAUDE.md](CLAUDE.md), [AGENTS.md](AGENTS.md), [.cursor/rules/project.mdc](.cursor/rules/project.mdc), [.github/copilot-instructions.md](.github/copilot-instructions.md), [README.md](README.md), [types/gentelella.d.ts](types/gentelella.d.ts), and `--breadcrumb` help in [scripts/new-page.mjs](scripts/new-page.mjs).
- **ESLint `ecmaVersion`** 2022 → 2025, so the parser accepts the import attribute below. Emitted code is unchanged: `build.target` still pins ES2022.

### Fixed

- **Admin footer no longer claims to be a Bootstrap template.** The shell footer read "Gentelella — A free Bootstrap admin template by Colorlib" on all 46 shell pages, contradicting v4's entire premise (and its own landing page, which says "Bootstrap 5 is gone"). Now: "Gentelella — free admin dashboard template by Colorlib". The marketing copy on [landing.html](production/landing.html) keeps the historical phrasing deliberately.
- **Footer version no longer drifts.** The right-hand side read a hand-written `v4.0 Concept · 2026`, stale since v4 shipped. It now renders `v4.1.0 · MIT`, with the version imported from `package.json` at build time (`import pkg from '../../package.json' with { type: 'json' }`) so a release bump carries through automatically. Rolldown narrows the import to the single string — verified that no other `package.json` content reaches the bundle. `MIT` links to `LICENSE.txt`.

### Security

- **`brace-expansion`** (transitive, via `eslint` → `minimatch`) 5.0.7 → 5.0.9. Resolves two new **high-severity** DoS advisories affecting `< 5.0.9`: [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) (unbounded expansion length → OOM crash) and [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) (unbounded intermediate arrays, bypassing the CVE-2026-14257 mitigation that 5.0.7 introduced). `npm audit` reports 0 vulnerabilities.

Build verified (5.2 s, identical chunk layout), `eslint src/` clean, `npm run smoke` passes all 58 pages.

## [4.0.3] - 2026-07-21

Dependency refresh. Toolchain bumps to latest minor/patch; no source or API changes. Build verified (~8 s, identical chunk layout), `eslint src/` clean, `npm audit` reports 0 vulnerabilities.

### Changed

- **Dev dependencies** bumped to latest:
  - `@playwright/test`, `playwright`: 1.61.0 → 1.61.1
  - `eslint`: 10.5.0 → 10.7.0
  - `prettier`: 3.8.4 → 3.9.6
  - `sass`: 1.101.0 → 1.101.3
  - `terser`: 5.48.0 → 5.49.0
  - `vite`: 8.0.16 → 8.1.5
- **`brace-expansion`** (transitive) 5.0.6 → 5.0.7 — the bump Dependabot proposed in #996, folded into the lockfile refresh. This resolves Dependabot alert #85, a **high-severity** DoS advisory (exponential-time expansion of consecutive non-expanding `{}` groups) affecting `brace-expansion < 5.0.7`. `npm audit` now reports 0 vulnerabilities.
- Runtime dependencies (`datatables.net` 2.3.8, `echarts` 6.1.0, `leaflet` 1.9.4) and the remaining dev deps (`@eslint/js` 10.0.1, `eslint-config-prettier` 10.1.8, `rollup-plugin-visualizer` 7.0.1) were already at their latest published versions — no change.

## [4.0.2] - 2026-06-17

Dependency refresh. Toolchain bumps to latest minor/patch; no source or API changes. Build verified (5 s, identical chunk layout), `eslint src/` clean, `npm audit` reports 0 vulnerabilities.

### Changed

- **Dev dependencies** bumped to latest:
  - `@playwright/test`, `playwright`: 1.60.0 → 1.61.0
  - `eslint`: 10.4.0 → 10.5.0
  - `prettier`: 3.8.3 → 3.8.4
  - `sass`: 1.99.0 → 1.101.0
  - `terser`: 5.47.1 → 5.48.0
  - `vite`: 8.0.13 → 8.0.16
- Runtime dependencies (`datatables.net` 2.3.8, `echarts` 6.1.0, `leaflet` 1.9.4) and the remaining dev deps (`@eslint/js` 10.0.1, `eslint-config-prettier` 10.1.8, `rollup-plugin-visualizer` 7.0.1) were already at their latest published versions — no change.

## [4.0.1] - 2026-06-11

Distribution fix plus the v4 documentation and AI-tooling pass.

### Fixed

- **Ship `dist/` in the npm tarball.** 4.0.0 published before `dist/` was in the `files` field, so every `cdn.jsdelivr.net/npm/gentelella@4/dist/*` URL in the docs 404'd. 4.0.1 ships the pre-built `dist/` so the demo HTML pages and assets are reachable straight off jsDelivr. The `prepublishOnly` hook rebuilds `dist/` before publish, so the tarball always matches the current source.
- **Dropzone alignment** on the file-upload page (#985).
- **Button-group active border** + radio-style toggle (#986).
- Broken Apex and Zenith DashboardPack promo URLs.
- `showModal`/`showToast` API usage in the AI helper files.

### Added

- **AI tool support** and **comprehensive v4 documentation** — cross-tool guidance files plus a full docs pass; README links out to the hosted docs.
- **DashboardPack premium templates** promo section in the README.

### Changed

- **Docs moved off the local `/docs` tree** to <https://gentelella.colorlib.com/docs>; a Docs link was added to the topbar.
- README screenshots now link to the live demo pages.

## [4.0.0] - 2026-05-20

First stable v4 release. Drops the `-rc.2` suffix; content is rc.2 plus a dependency refresh.

### Changed

- **Dependencies** bumped to latest minor/patch, with a moderate `brace-expansion` advisory resolved via `npm audit fix`:
  - `@playwright/test`, `playwright`: 1.48.0 → 1.60.0
  - `eslint`: 10.2.1 → 10.4.0
  - `prettier`: 3.7.4 → 3.8.3
  - `sass`: 1.97.2 → 1.99.0
  - `terser`: 5.44.1 → 5.47.1
  - `vite`: 8.0.10 → 8.0.13
  - `datatables.net`: 2.3.6 → 2.3.8
  - `echarts`: 6.0.0 → 6.1.0

## [4.0.0-rc.2] - 2026-05-05

Polish pass on top of rc.1: a real mobile responsive sweep, npm-package-ready distribution metadata with TypeScript declarations, a page generator script, an optional API-hydration data adapter, and quality-of-life fixes.

### Added

- **`npm run new`** — page generator ([scripts/new-page.mjs](scripts/new-page.mjs)). One command stamps out a `production/*.html` from the standard skeleton and (with `--nav-group`) wires the entry into the `NAV` array in [src/v4/shell-render.js](src/v4/shell-render.js). Flags: `--title`, `--pretitle`, `--breadcrumb`, `--nav-group`, `--icon`, `--dry-run`. Run `npm run new -- --help` for the full list.
- **TypeScript declarations** — [types/gentelella.d.ts](types/gentelella.d.ts) typed-up the public JS surface (`mountShell`, `showModal`, `showToast`, `openMenu`, chart/table init, the `NAV` schema, `seedAdapter` / `httpAdapter`). Wired up via `types` field in [package.json](package.json) so VS Code IntelliSense resolves automatically — no `tsconfig` required.
- **npm package metadata** — `exports`, `files`, and `types` fields added. The package is now consumable as `import { mountShell } from "gentelella"`. Subpath exports (`gentelella/v4/*`, `gentelella/scss/*`) for granular imports.
- **Markup helpers** — [src/v4/markup.js](src/v4/markup.js) docs added to README and Playground. `statTile()`, `statusBadge()`, `customerCell()`, `activityItem()`, `visitorRow()`, `emptyState()`, `banner()`, `skeletonRows()`, `escapeHtml()`. For JS-rendered content (orders rows, inbox threads, kanban cards) where boilerplate adds up.
- **Data adapter** ([src/v4/data-adapter.js](src/v4/data-adapter.js)) — `seedAdapter()` for in-memory demo state; `httpAdapter(url)` for REST. Add `?api=1` to a page URL to hydrate from a real backend.
- **Inbox API mode** — append `?api=1` to [inbox.html](production/inbox.html) and the inbox loads its initial messages from `/api/messages` instead of the seed. Mutations stay client-side in the demo; extend the adapter to PATCH them back.
- **Playground** — new sections for async/loading patterns (skeleton table, skeleton tiles, list lifecycle, submit spinner, banners) and `markup.js` helper examples with copy-pasteable HTML output.

### Changed

- **Vite config auto-discovers entries** — replaces the hand-maintained 60-entry `rollupOptions.input` list. Adding a new page is now just dropping a file into [production/](production/); Vite picks it up. [vite.config.js](vite.config.js).
- **Semantic `<h1>` page titles** — every page's `<div class="page-title">` is now `<h1 class="page-title">`. Improves landmark navigation for screen readers and SEO. ~60 pages updated.
- **DataTables search input** gains an `aria-label="Search table"` since DataTables 2 emits it nameless. [src/v4/tables.js](src/v4/tables.js).
- **Table row checkboxes** gain `aria-label="Select row"` / `"Select all rows"`.
- **SCSS spacing tokens** — replaced ad-hoc `4px` / `12px` / `16px` `gap` values with `var(--space-1)` / `--space-3` / `--space-4` across pagination, chip, calendar toolbar, and other components. Now responds to the theme generator.

### Fixed

- **Mobile responsive pass.** Every page renders at native pixel scale on iPhone SE / iPhone 13 / Pixel without the browser shrink-to-fit zooming the layout. Audited 22 pages × 3 viewports (320 / 375 / 390 px); 0 overflows on mainstream sizes.
  - **Topbar** ([src/scss/v4/_layout.scss](src/scss/v4/_layout.scss)) — at ≤768 px the breadcrumb, 240 px search box, notifications and messages buttons hide; theme toggle + avatar (now 32×32) remain. The shell no longer pushes layout viewport to ~540 px on phones.
  - **Grid `minmax(0, 1fr)` bug.** Four spots in the grid system (`.col-1`, `.col-8-4`/`.col-4-8` ≤1100 px collapse, `.col-4`/`.col-3`/`.col-2` ≤768 px collapse) used `1fr` without `minmax(0, …)`. Wide intrinsic content (tables, code blocks, long unbreakable text) inside those columns pushed the column past viewport, triggering Chromium's shrink-to-fit on phones. All four now use `minmax(0, 1fr)`.
  - **Form wizard steps** stack vertically below 600 px ([src/scss/v4/_pages.scss](src/scss/v4/_pages.scss)) — connector lines and sub-labels suppressed.
  - **Invoice page** — header and 2-col billed-to / pay-to grid stack below 768 px; padding reduces from 32 px to 16 px.
  - **Invoice line-row** reflows to a 2-row layout (description above, qty / rate / amount below) below 600 px.
  - **Typography showcase** type-rows stack below 600 px, with `overflow-wrap: anywhere` so 56 px display words can break.
  - **Settings layout** stacking on mobile uses `minmax(0, 1fr)` ([src/scss/v4/_apps.scss](src/scss/v4/_apps.scss)).
  - **Calendar grid** scrolls horizontally with scroll-snap below 700 px instead of collapsing day cells.
  - **Chart-tab segmented controls** get larger padding on coarse pointers (touch devices) for hit-target compliance ([src/scss/v4/_widgets.scss](src/scss/v4/_widgets.scss)).

### Known limitations

- Connected-account rows on [profile.html](production/profile.html) overflow ~42 px at exactly 320 px viewport (Galaxy Fold cover screen). Mainstream 360+ phones unaffected.
- Image assets in `public/images/` aren't optimized — AVIF conversion is on the rc.3 docket.
- ECharts vendor chunk is still ~360 KB gz; per-page chart-type tree-shaking deferred.

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
