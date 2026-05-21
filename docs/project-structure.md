# Project structure

```text
gentelella/
├── src/                          Source — all JS and SCSS lives here
│   ├── main-v4.js                Entry; every page loads this single file
│   ├── v4/                       JS modules
│   │   ├── shell.js              mountShell() — sidebar, topbar, theme toggle, mobile drawer
│   │   ├── shell-render.js       NAV + ICONS + pure HTML renderers
│   │   ├── menus.js              openMenu / openPanel — popovers and slide-outs
│   │   ├── modal.js              showModal — backdropped dialog with focus trap
│   │   ├── toast.js              showToast — top-right transient notifications
│   │   ├── charts.js             initCharts — ECharts factories
│   │   ├── tables.js             initTables — DataTables init
│   │   ├── command-palette.js    ⌘K fuzzy search
│   │   ├── page-actions.js       Delegated handlers for `.page-actions` buttons
│   │   ├── inbox.js              Folders, reader pane, compose
│   │   ├── kanban.js             Drag-and-drop board
│   │   ├── calendar.js           Month-grid + event CRUD
│   │   ├── file-manager.js       Tree + grid file browser
│   │   ├── settings.js           localStorage-backed settings page
│   │   ├── form-controls.js      Date range, multi-select, rich text editor
│   │   ├── details.js            Project / order / contact detail panels
│   │   ├── markup.js             Pure string helpers (statTile, statusBadge, …)
│   │   ├── data-adapter.js       seedAdapter + httpAdapter (?api=1 toggle)
│   │   ├── product-images.js     E-commerce gallery + zoom
│   │   └── product-mockups.js    SVG product mockups
│   └── scss/v4/                  Stylesheets
│       ├── main.scss             @use aggregator — the only file Vite imports
│       ├── _tokens.scss          CSS custom properties (light + dark)
│       ├── _layout.scss          Sidebar, topbar, main, grid, footer, responsive
│       ├── _components.scss      Buttons, cards, tables, status, toggles, progress
│       ├── _forms.scss           Inputs, selects, validation, input groups
│       ├── _widgets.scss         Stat cards, activity, donuts, sparklines, todos
│       ├── _pages.scss           Pagination, alerts, calendar, inbox, invoice, …
│       ├── _datatable.scss       DataTables UI overrides
│       ├── _auth.scss            Login + error layouts
│       └── _apps.scss            Chat, kanban, file manager, settings
│
├── production/                   58 entry HTML pages (auto-discovered)
│   ├── index.html ... index4.html       4 dashboard variants
│   ├── form*.html                       6 form pages
│   ├── tables*.html                     2 table pages
│   ├── chartjs.html, echarts.html, …    Chart pages
│   ├── inbox.html, kanban.html, …       App pages
│   ├── e_commerce.html, invoice.html, … E-commerce
│   ├── login.html, register.html, …     Auth (no `data-shell`)
│   ├── page_403.html ... page_500.html  Error pages
│   ├── playground.html                  Component playground
│   ├── theme.html                       Live theme generator
│   └── …                                See full list with `ls production/`
│
├── public/                       Static assets copied verbatim to dist/
│   ├── images/                   PNGs, JPGs, SVGs
│   ├── sw.js                     Service worker (cache-then-network)
│   └── site.webmanifest          PWA manifest
│
├── scripts/                      Node CLI tools
│   ├── new-page.mjs              `npm run new` — scaffold a page
│   ├── screenshots.mjs           `npm run screenshots` — Playwright capture
│   ├── smoke.mjs                 `npm run smoke` — boot dev + curl every page
│   └── deploy-preview.sh         `npm run deploy:preview` — R2 sync with cache headers
│
├── types/
│   └── gentelella.d.ts           TypeScript declarations for the public JS surface
│
├── examples/                     Standalone integration examples (Express, …)
│
├── docs/                         You are here
│
├── vite.config.js                Multi-page Vite config + shell injection plugin
├── package.json                  3 prod deps, 9 dev deps, scripts, npm exports
├── README.md                     Marketing + quick start
├── CLAUDE.md                     Rules of the road for Claude Code
├── AGENTS.md                     Cross-tool agent instructions (agents.md convention)
├── .cursor/rules/project.mdc     Cursor rules
├── .github/copilot-instructions.md  GitHub Copilot instructions
├── CHANGELOG.md                  Release notes
└── LICENSE.txt                   MIT
```

## What you'll touch most often

| Task | File |
| --- | --- |
| Change brand color, dark mode tokens | [`src/scss/v4/_tokens.scss`](../src/scss/v4/_tokens.scss) |
| Add a sidebar entry | `NAV` in [`src/v4/shell-render.js`](../src/v4/shell-render.js) |
| Register a new icon | `ICONS` in [`src/v4/shell-render.js`](../src/v4/shell-render.js) |
| Add a chart factory | `charts` map in [`src/v4/charts.js`](../src/v4/charts.js) |
| Wire a new page module | Bottom of [`src/main-v4.js`](../src/main-v4.js) |
| Tweak DataTables defaults | [`src/v4/tables.js`](../src/v4/tables.js) |
| Pin a new entry page | Drop the file in [`production/`](../production/) — auto-discovered |

## What's intentionally not here

- **No backend.** Forms post to `#`; data is in seed objects inside each page module.
- **No auth.** Login is a redirect; no session, no JWT, no validation.
- **No tests** beyond `npm run smoke` and the Playwright screenshot script. Add Vitest if you need unit tests.
- **No design tokens for spacing scale** as Sass variables — they're CSS custom properties (`--space-1`, `--space-2`, …) in `_tokens.scss`. The SCSS map pattern from v2 is gone.
- **No JS framework.** Components are HTML + CSS classes. JS is only for behavior (drag/drop, sort, search), never structure.
