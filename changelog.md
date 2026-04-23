# Gentelella Changelog

## 2.2.0 - 23.04.2026

**Fresh for 2026 — Dependency Refresh + HTML Validity + Sidebar Persistence + Senior-Dev Polish**

### Performance & competitive parity

- **ECharts tree-shaken: -32% bundle size.** Switched both `main-minimal.js` and `main-form-basic.js` from `import * as echarts from 'echarts'` (the umbrella entry that ships every chart, every component, every renderer) to a tree-shaken bundle in [src/lib/echarts.js](src/lib/echarts.js) that registers only the charts and components Gentelella actually uses (Bar, Line, Pie, Scatter, Gauge, Radar, Funnel + the standard component set + CanvasRenderer). Audited the codebase first to confirm `MapChart`, `GeoComponent` and `CustomChart` weren't actually used. Result: `vendor-echarts` chunk dropped from **1,108 kB → 752 kB** (363 kB → 250 kB gzipped) — the biggest single first-paint win available.
- **Stopped placeholder `<a href="#">` jump-to-top.** Added a one-shot delegated click handler in [src/js/init.js](src/js/init.js) that calls `preventDefault()` on any `<a href="#">` click. Skips elements with `data-bs-toggle` since Bootstrap handles those. Fixes ~108 placeholder links across the template without touching any markup, idempotent for any future additions.
- **Fixed broken inline JS in [projects.html](production/projects.html).** The "save project" handler had a bare object literal (`name: projectName, …`) with no enclosing `const projectData = {…}` declaration. Threw `Unexpected token ':'` on every page load. Now logs the demo payload to console.
- **Reduced `!important` from 152 → 137** in `custom.scss`. Removed 6 from the `#sidebar-menu .badge` block (selector specificity already wins over Bootstrap's `.badge`), 3 from `.jqstooltip`, and 6 from legacy DataTables 1.x selectors (`.dataTables_paginate a`, `.paging_full_numbers`, `.DTTT_button`) which no longer match anything in DataTables 2.x markup but were left in place for now to avoid scope creep.
- **Replaced Lorem ipsum on [widgets.html](production/widgets.html)** with realistic dashboard copy ("+12% vs last week", "34 awaiting reply", "$48.2K this month", "92% on-time delivery").

### Senior-dev polish pass

- **Auth / error pages rebranded.** `login.html`, `page_403.html`, `page_404.html`, `page_500.html` used the sidebar-tinted `logo.svg` (white fill) on a white card, so the wordmark was nearly invisible and the adjacent `<h3>Gentelella</h3>` created an overlapping ghost. Replaced the image with a new `.brand-mark` CSS badge (a 9-cell grid icon in the brand navy) rendered via `background-image` gradients — no SVG asset required, scales at any size, no color fights.
- **Fixed broken `<h2 class="h3">…</h4>` tags** on `page_403.html`, `page_404.html`, `page_500.html`. Opens as h2, closes as h4 — browsers autocorrect, validators don't.
- **Promoted every page-title `<h3>` to `<h1>`** across 31 dashboard pages. Kept the `.h3` Bootstrap utility class so the visual size is identical. Added a `visually-hidden` `<h1>` to the 4 `index*.html` dashboards (Dashboard Overview / Analytics / Sales Analytics / Operations) so every page now has exactly one document-level heading.
- **Standardised `<head>` across all 40 pages.** Every page now ships the same security headers (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), the full favicon set (SVG + 32×32 + 16×16 + ICO + Apple Touch Icon + Web App Manifest), and theme colors (`theme-color: #2a3f54`, `msapplication-TileColor`). Previously only `landing.html` and `index.html` had this.
- **Normalised `<title>` tags.** 35 pages updated to the consistent `{Page} | Gentelella` pattern. Fixed three pages whose titles read `Alela! | Gentelella` (indexing artifact from an earlier regex pass) and three error-page titles that were just `"404 | Gentelella"` etc. — now `"404 Page Not Found | Gentelella"`.
- **Expanded token usage.** Added `--gt-surface-muted: #f2f5f7` to `_variables.scss` and replaced the four hardcoded occurrences; replaced `#e4e4e4` and `#f4f4f4` in `.autocomplete-suggestions` with `--gt-border-color` and `--gt-gray-50`.
- **Deleted `_variables-modern.scss`.** Alternate theme file that was never imported and only referenced by a commented-out `@use` line in `main.scss`. Simplified the "theme selection" comment in `main.scss` to the single active entry.

### Dependencies

### Dependencies

Bumped every direct dependency to its latest release (as of 2026-04-23). Every non-major was pulled via `npm update`; majors were migrated individually with a build/test verification at each step.

**Major version upgrades:**

- **Vite 7 → 8.0.10** — now bundled with Rolldown instead of Rollup. Required rewriting `manualChunks` in `vite.config.js` from the object form to a function (Rolldown only supports the function form) and teaching `assetFileNames` to read the new `assetInfo.names` array. Production build is ~35% faster (22.9s → 13.8s).
- **ESLint 9 → 10.2.1** (and `@eslint/js` → 10.0.1) — flat config carries over unchanged.
- **Uppy 4 → 5** (`@uppy/core`, `@uppy/dashboard`, `@uppy/xhr-upload`) — CSS import path changed from `@uppy/*/dist/style.min.css` to `@uppy/*/css/style.min.css` (Uppy now uses `exports` conditions).
- **jsdom 27 → 29** — no code change, test suite passes.
- **rollup-plugin-visualizer 6 → 7** — no config change, `npm run analyze` still emits `dist/stats.html`.

**Minor/patch bumps:** `@fortawesome/fontawesome-free`, `@vitest/coverage-v8`, `choices.js`, `cropperjs`, all `datatables.net-*`, `dayjs`, `dompurify`, `glob`, `prettier`, `sass`, `terser`, `vitest`.

**Known advisory:** `quill@2.0.3` carries advisory GHSA-v3m3-f69x-jf25 (XSS via HTML export). No patched version exists upstream; template already sanitises Quill output via `window.sanitizeHtml` (DOMPurify). Re-evaluate when Quill ships a fix.

### Lint config

ESLint passes with zero errors. Two policy tweaks, both justified:

- `no-unused-vars` is now a **warning** (was error), with `varsIgnorePattern` / `caughtErrorsIgnorePattern` set to `^_`. Rationale: this is a template — consumers routinely declare state for features they'll wire up next.
- `no-empty` now allows empty catch blocks. Rationale: the chart init modules use empty catches as a defensive skip when a charting library isn't present on the page — intentional, not a missed `console.error`.

Added `File` to the browser-globals list so `validation.test.js` recognises it.

### HTML Validity

- **Closed unclosed `<li>` tags across 34 pages**: every parent `<li>` that wraps a `<ul class="nav child_menu">` in the sidebar now has a matching `</li>`. Same fix applied to the `<li class="sub_menu">` items inside the multilevel demo and to every `<li class="nav-item">` inside the top-nav `msg_list` dropdowns. ~600 closing tags inserted.

### Sidebar

- **Persisted collapsed/expanded state across page navigations** via `localStorage` key `gentelella:sidebar-collapsed`. Storage access is wrapped in `try/catch` so Safari private mode and disabled-storage environments degrade gracefully (state is just ephemeral). Refactored the toggle handler into `collapseSidebar()` / `expandSidebar()` helpers used by both the click handler and the on-load restore path.
- **Skip forcing submenus open** in the current-page highlight when the sidebar loads in collapsed mode — avoids a visible flash of an open submenu.

### Charts (ECharts + Chart.js)

- **`window.echarts` consistency**: `getInstanceByDom` calls in `echarts.js` now use `window.echarts` like the rest of the file, removing two implicit-global references.
- **Debounced ECharts resize handler** (150 ms) prevents resize storms when dragging window edges.
- **Pause real-time chart updates while the tab is hidden** via `document.hidden` checks in network/gauge/weekly-summary intervals. No `beforeunload` cleanup added — that pattern disables back/forward cache and is unnecessary for a multi-page app.

### Styles & Design Polish

- **Fixed broken asset paths** in all 40 production HTML files (370 attribute rewrites). Images and `site.webmanifest` now use `../images/` and `../site.webmanifest` — paths resolve correctly from `production/*.html` in both dev (`base: /`) and prod (`base: /polygon/gentelella/`). Previously they 404'd because bare `images/…` resolved to `/production/images/…`.
- **Unified card / panel / tile styling** under new design tokens in `_variables.scss`: `--gt-radius-card` (8px), `--gt-shadow-card`, `--gt-shadow-card-hover`, `--gt-card-border`, `--gt-card-border-hover`. Every card-like container now pulls from these tokens instead of hard-coded values.
- **Removed duplicate `.x_panel` rule** in `custom.scss` (the second copy at the end of the file was silently overriding the first via the cascade).
- **Removed conflicting `.x_panel` override** in `index2.scss` that was setting a different radius (5px) and shadow than the main stylesheet.
- **Migrated** `.x_panel`, `.dashboard_graph`, `.tile-stats`, `.top_tiles .tile`, `.pie_bg`, `.demo-container`, **and Bootstrap's `.card`** to the new tokens. Before: radii ranged 3px–10px and shadows had four distinct definitions; the top-row dashboard tiles (which used `.card shadow-sm border-0`) rendered with different borders and shadows than the `.x_panel` cards below them. After: one radius and one shadow for every raised surface, with one consistent hover elevation — regardless of whether the markup uses `.x_panel` or Bootstrap `.card`.
- **Stripped `shadow-sm` / `shadow` / `shadow-lg` / `border-0` Bootstrap utility classes** from `.card` elements across 9 HTML files (66 removals). These utilities were fighting the unified `.card` rule via `!important` and producing mismatched tiles. The unified `.card` SCSS now owns border + shadow via design tokens, so the utilities are redundant.
- **Scoped `transition` properties** on card hovers to `box-shadow`, `border-color`, `transform` instead of `all` — keeps interactions snappy and avoids animating every paintable property.
- Replaced remaining hard-coded `#fff` card backgrounds with `var(--gt-panel-bg)`, and `#ddd` / `#e4e4e4` borders with the new `--gt-card-border-hover` and `--gt-card-border` tokens.
- Removed a duplicated `.container { width: 100%; padding: 0; max-width: 100%; }` block in `custom.scss`.
- Removed a self-duplicated selector in `.navbar-nav > li > a, .navbar-brand, .navbar-nav > li > a`.

### Dev server

- **Fixed dev server 404 on root URL**: `vite.config.js` now uses the function form of `defineConfig` so `base` is `/polygon/gentelella/` only in production builds; in dev the base is `/`. `server.open` points at `/production/index.html` (the actual entry) instead of the non-existent `/index.html` at the project root.

### Verification

- `npm run build` — passes, 13.9s
- `npm test` — 126/126 passing
- `npm run lint` — 0 errors, 79 warnings (all `no-console` in logger/console modules, which is expected)
- Dev server smoke-tested: all key pages render with correct images and uniform card styling

### HTML Validity

- **Closed unclosed `<li>` tags across 34 pages**: every parent `<li>` that wraps a `<ul class="nav child_menu">` in the sidebar now has a matching `</li>`. Same fix applied to the `<li class="sub_menu">` items inside the multilevel demo and to every `<li class="nav-item">` inside the top-nav `msg_list` dropdowns. Net of ~600 inserted closing tags.

### Sidebar

- **Persisted collapsed/expanded state across page navigations** via `localStorage` key `gentelella:sidebar-collapsed`. Storage access is wrapped in `try/catch` so Safari private mode and disabled-storage environments degrade gracefully (state is just ephemeral). Refactored the toggle handler into `collapseSidebar()` / `expandSidebar()` helpers used by both the click handler and the on-load restore path.
- **Skip forcing submenus open** in the current-page highlight when the sidebar loads in collapsed mode — avoids a visible flash of an open submenu.

### Charts (ECharts + Chart.js)

- **`window.echarts` consistency**: `getInstanceByDom` calls in `echarts.js` now use `window.echarts` like the rest of the file, removing two implicit-global references.
- **Debounced ECharts resize handler** (150 ms) prevents resize storms when dragging window edges.
- **Pause real-time chart updates while the tab is hidden** via `document.hidden` checks in network/gauge/weekly-summary intervals. No `beforeunload` cleanup added — that pattern disables back/forward cache and is unnecessary for a multi-page app.

### Styles

- Removed a duplicated `.container { width: 100%; padding: 0; max-width: 100%; }` block (already declared near the top of `custom.scss`).
- Removed a self-duplicated selector in `.navbar-nav > li > a, .navbar-brand, .navbar-nav > li > a`.

---

## 2.1.5 - 15.02.2026

**Documentation Overhaul & jQuery Cleanup Release**

### Documentation Site Fixes

- **GitHub Pages Deployment**: Fixed broken Jekyll documentation site at colorlibhq.github.io/gentelella
  - Rewrote GitHub Actions workflow to build from `docs/` directory instead of repo root
  - Bumped Ruby from 3.1 to 3.3 to resolve Bundler compatibility failure
  - Fixed base URL from `puikinsh.github.io` to `colorlibhq.github.io`
  - Removed orphaned `docs/.github/workflows/pages.yml` (GitHub only discovers workflows at repo root)

- **Fixed All Broken Documentation Links**: Resolved 17 broken cross-links across 6 documentation files
  - Removed incorrect `/docs/` prefix from internal links site-wide
  - Replaced references to non-existent pages (security.md, testing.md, monitoring.md, examples.md) with valid targets

- **New Documentation Pages**:
  - Created `docs/performance.md` - Performance optimization guide with code splitting strategy and bundle analysis
  - Added Jekyll front matter to `bundle-analysis.md`, `jquery-elimination-complete.md`, `security-headers.md`

### Documentation Content Updates

- **Updated All Dependency Versions**: Aligned documentation with actual package.json versions
  - Vite 6.3.5 → 7.3.1, Bootstrap 5.3.7 → 5.3.8, Node.js v16 → v18
  - Removed references to eliminated libraries: jQuery, Morris.js, Select2, jVectorMap, Gauge.js, Ion.RangeSlider
  - Updated code examples: Select2 → Choices.js, Morris.js → ECharts, jVectorMap → Leaflet
  - Corrected `manualChunks` configuration examples in configuration.md and deployment.md

### jQuery Reference Cleanup

- **Removed All Stale jQuery References**: Template is fully jQuery-free
  - Updated HTML comments in 17 production files: "includes jQuery, Bootstrap, and all vendor scripts" → "Bootstrap and vendor scripts"
  - Fixed outdated `$().DataTable()` reference in tables_dynamic.html to modern `new DataTable('#myTable')`
  - Renamed "jQuery Smart Wizard" SCSS section comments to "Smart Wizard"

### Page Identifiers

- **Added `page-*` Body Classes**: All 24 pages missing identifiers now have proper `page-*` body classes for CSS targeting
  - Enables page-specific styling via `body.page-calendar`, `body.page-form-wizards`, etc.
  - Documented complete reference table in CLAUDE.md

### Cleanup

- Deleted orphaned documentation files: `BOOTSTRAP_MIGRATION_GUIDE.md`, `daterangepicker-fix.md`
- Deleted stale release files: `JQUERY_ELIMINATION_PLAN.md`, `RELEASE_v2.1.4.md`

---

## 2.1.4 - 13.01.2026

**UI Polish & Navigation Enhancement Release**

### New Features

- **Go Pro Sidebar Link**: Added prominent "Go Pro" menu item linking to DashboardPack premium templates
  - Positioned at top of sidebar for visibility
  - Includes UTM tracking for analytics
  - Opens in new tab for seamless user experience

- **Sidebar Badge System**: Introduced colorful badges throughout sidebar navigation
  - "Pro" badge (yellow) on Go Pro link
  - "Hot" badge (red) on UI Elements menu
  - "New" badge (green) on Data Presentation menu
  - "Updated" badge (blue) on ECharts and Landing Page items
  - Consistent 52px width across all badges with right alignment

### UI/UX Improvements

- **Avatar/Profile Thumbnails**: Redesigned profile icons in activity feeds
  - Colorful circular backgrounds (aero, green, blue, purple, orange, red)
  - White icons for better contrast and modern look
  - Flexbox centering for perfect alignment

- **Progress Bar Fixes**: Fixed invisible progress bars across dashboard pages
  - Added proper background color to `.progress` container
  - Removed conflicting CSS variable override that was zeroing out widths
  - Consistent 8px height with rounded corners

- **Spacing Consistency**: Removed extra `<br>` tag causing uneven card spacing on index.html

### File Upload Modernization

- **Uppy Integration**: Replaced legacy Dropzone.js with modern Uppy file uploader
  - Drag & drop support with visual feedback
  - Image preview thumbnails
  - Progress indicators for uploads
  - Cleaner, more maintainable codebase

### Cross-Page Consistency

- **Unified Sidebar Menu**: All 33 HTML template pages now share identical sidebar navigation
  - Consistent menu structure and badges across all pages
  - Improved user experience when navigating between pages

### Code Quality

- **Removed Inline CSS**: Cleaned up inline styles, moved to proper SCSS files
- **SCSS Organization**: Consolidated badge and progress bar styles

---

## 2.1.3 - 12.01.2026

**Code Quality, Naming Standardization & UI Modernization Release**

### UI Modernization

- **Bootstrap Icons Integration**: Added Bootstrap Icons as alternative to Font Awesome
  - Installed `bootstrap-icons` package (v1.13.1)
  - Sidebar navigation now uses thinner, more modern Bootstrap Icons
  - Icon mappings: `fa-home` → `bi-house`, `fa-edit` → `bi-pencil-square`, `fa-desktop` → `bi-display`, etc.
  - All 35 HTML files updated with new icon classes

- **Header Navigation Fixes**: Rebuilt top navigation using proper Bootstrap 5 flexbox utilities
  - Uses `d-flex`, `align-items-center`, `justify-content-between`, `ms-auto`, `gap-3` classes
  - Dropdown order corrected: notifications first, then user profile
  - Dropdown menus widened (320px for notifications, 200px for user profile)
  - Proper `dropdown-menu-end` alignment for right-side dropdowns

- **Sidebar Improvements**:
  - Hamburger menu properly positioned for both expanded (230px) and collapsed (70px) sidebar states
  - Logo icon centered in collapsed sidebar mode using flexbox
  - Chevron arrows positioned to right side of menu items with `margin-left: auto`

### Code Cleanup

- **Removed Legacy Files**: Deleted orphaned jQuery-based files no longer in use
  - `src/js/examples.js` - Legacy jQuery popover and Flot chart examples
  - `src/js/form-validation-init.js` - Unused validation demo file
  - `src/main.js` - Legacy full jQuery bundle
  - `src/main-minimal.js` (old) - Legacy jQuery minimal bundle
  - `src/main-form-advanced.js` - Unreferenced form entry point
  - `src/main-form-basic-simple.js` - Orphaned stub file
  - `src/js/require-shim.js` - Legacy CommonJS shim

### Naming Standardization

- **Removed "-modern" suffixes**: Standardized file naming throughout the codebase
  - `dom-modern.js` → `dom.js`
  - `sidebar-modern.js` → `sidebar.js`
  - `init-modern.js` → `init.js`
  - `smartresize-modern.js` → `smartresize.js`
  - `tables-modern.js` → `tables.js`
  - `echarts-modern.js` → `echarts.js`
  - `main-minimal-modern.js` → `main-minimal.js`

### New Features

- **Test Suite**: Added comprehensive unit testing infrastructure
  - Vitest testing framework with JSDOM environment
  - 126 unit tests covering all utility modules
  - Test coverage for security.js, validation.js, dom.js, logger.js
  - New npm scripts: `test`, `test:watch`, `test:coverage`

- **Logger Utility**: Added centralized development-only logging (`src/utils/logger.js`)
  - Wraps console methods with environment checks
  - Automatic suppression in production builds
  - Group logging support for better debugging

- **CSS Variables System**: Added comprehensive CSS custom properties (`src/scss/_variables.scss`)
  - Brand colors, semantic colors, neutral palette
  - Spacing, typography, shadows, transitions
  - Z-index scale and border radius tokens

### Bundle Optimization

- **Removed Unused Dependencies**: Eliminated dead weight from bundle
  - Removed `flot` (4.2 MB package, never imported)
  - Removed `moment` (67 KB, dayjs already used as lightweight alternative)

- **Smart Chunk Splitting**: Optimized vendor chunks for better caching
  - Split Chart.js (203 KB) and ECharts (1,109 KB) into separate chunks
  - Pages using only Chart.js now save ~1 MB vs loading both
  - Added `vendor-calendar` chunk for FullCalendar (256 KB)
  - Extended `vendor-tables-ext` to include all DataTables extensions

- **Production Build Optimization**
  - Disabled CSS source maps in production (saves ~8 MB build size)
  - Enhanced Terser compression with `pure_getters`, `reduce_vars`, `collapse_vars`
  - 3-pass minification for additional size reduction

### SCSS Improvements

- **Fixed Color Inconsistencies**: Resolved `.aero` color class conflict between files
- **Improved Organization**: Added table of contents to custom.scss for navigation

### Bootstrap 5 Consolidation (Migration Phase 1-3)

- **CSS Variables Integration**: Replaced ~90 hardcoded color values with CSS custom properties
  - Primary colors (#1abb9c, #2a3f54, #e74c3c, etc.) now use `var(--gt-*)` references
  - Enables easier theming and dark mode support

- **Reduced !important Declarations**: Cut from 278 to 138 (50% reduction)
  - Sidebar toggle states now use `body.nav-md`/`body.nav-sm` for specificity
  - Typography hierarchy uses body prefix instead of !important
  - Profile and panel sections modernized

- **Bootstrap Collapse Integration**: Panel toolbox now uses Bootstrap 5's Collapse API
  - Collapse/expand functionality leverages native Bootstrap component
  - Automatic icon rotation via collapse events
  - Removed dependency on custom slideUp/slideDown for panels

- **Float to Flexbox Conversion**: Modernized key layout sections
  - `.profile` section uses flexbox instead of float
  - `.x_title` panel header uses flexbox for title/filter alignment
  - `.nav_menu` converted to flexbox layout
  - Removed float from `.x_content`

- **Color Utility Documentation**: Added migration guide comments for legacy color classes
  - Documents Bootstrap equivalents (.blue → .text-info, .bg-green → .bg-success)
  - Classes kept for backward compatibility with existing HTML

### Documentation Updates

- Updated CLAUDE.md with new file structure and renamed modules
- Updated directory layout to reflect cleaned-up architecture

---

## 2.1.2 - 12.01.2026

Maintenance Release - Comprehensive Dependency Updates

### Dependency Updates

All dependencies updated to their latest versions for improved security, performance, and compatibility.

#### Dev Dependencies

- **Vite** 7.1.5 → 7.3.1 (build system improvements)
- **ESLint** 9.35.0 → 9.39.2 (linting engine)
- **@eslint/js** 9.35.0 → 9.39.2
- **@typescript-eslint/eslint-plugin** 8.43.0 → 8.52.0
- **@typescript-eslint/parser** 8.43.0 → 8.52.0
- **TypeScript** 5.9.2 → 5.9.3
- **Prettier** 3.6.2 → 3.7.4 (code formatter)
- **SASS** 1.92.1 → 1.97.2 (CSS preprocessor)
- **Terser** 5.44.0 → 5.44.1 (JS minifier)
- **glob** 11.0.3 → 13.0.0 (major version upgrade)
- **rollup-plugin-visualizer** 6.0.3 → 6.0.5

#### Runtime Dependencies

- **Font Awesome** 7.0.1 → 7.1.0 (icon library)
- **FullCalendar** 6.1.19 → 6.1.20 (all packages)
- **Chart.js** 4.5.0 → 4.5.1
- **CropperJS** 2.0.1 → 2.1.0
- **DataTables** 2.3.4 → 2.3.6 (core and BS5 styling)
- **DataTables Buttons** 3.2.5 → 3.2.6
- **DataTables FixedHeader** 4.0.3 → 4.0.5
- **DataTables KeyTable** 2.12.1 → 2.12.2
- **DataTables Responsive** 3.0.6 → 3.0.7
- **Day.js** 1.11.18 → 1.11.19
- **DOMPurify** 3.2.6 → 3.3.1 (security library)

### Code Quality Improvements

- **ESLint Configuration**: Added comprehensive browser globals to eliminate false-positive errors
  - Added all standard browser APIs (setTimeout, fetch, localStorage, etc.)
  - Added DOM interfaces (HTMLElement, Event, CustomEvent, etc.)
  - Added library globals (TempusDominus, Skycons, DataTable, etc.)
- **Bug Fix**: Fixed parsing error in main-form-advanced.js (incomplete console statement)

### Known Issues

- Sass deprecation warnings in build output are from Bootstrap's internal SCSS files and will be resolved in future Bootstrap releases
- All functionality tested and verified working with updated dependencies

---

## 2.1.1 - 11.09.2025

**Maintenance Release - Dependency Updates, Chart Fixes & UI Improvements**

### Dependency Updates
- **Latest Dependencies**: All dependencies updated to latest versions for security and performance
  - Vite 7.1.4 → 7.1.5
  - Bootstrap 5.3.6 → 5.3.8
  - ECharts 5.6.0 → 6.0.0 (major version upgrade)
  - Chart.js 4.4.2 → 4.5.0
  - jQuery 3.6.1 → 3.7.1
  - TypeScript 5.8.3 → 5.9.2
  - ESLint 9.34.0 → 9.35.0
  - SASS 1.92.0 → 1.92.1
  - DataTables 2.3.3 → 2.3.4 with all related packages
  - Font Awesome 7.0.0 → 7.0.1
- **Security Updates**: Ruby 3.3.9 and Nokogiri 1.18.9 resolve all CVE vulnerabilities

### Chart & Widget Improvements
- **ECharts Functionality**: Fixed all missing charts on echarts.html page
  - Added missing pyramid sales funnel chart with improved readability
  - Fixed world map visualization
  - Enhanced chart sizing and positioning
- **Widget System Enhancement**: Improved content density in widgets.html
  - Enhanced metric cards with additional context information
  - Added growth indicators and supplementary metrics
  - Professional styling with hover effects and better typography
- **Chart Color Consistency**: Fixed Device Usage chart colors to match label indicators
- **Interactive Maps**: Fixed visitors location map and skycons weather icons on index.html

### UI/UX Improvements
- **Sidebar Profile Enhancement**: Improved sidebar name section for better scalability
  - Reduced font size from default h4 to 14px for optimal space utilization
  - Added proper typography with font-weight 400 and line-height 1.2
  - Enhanced profile_info container with flexbox layout for better vertical centering
  - Added word-wrapping and break-word support for long names
  - Limited to 2.4em max-height to prevent sidebar expansion while allowing up to 2 lines
  - Gracefully handles both short names and longer names without breaking layout

### Developer Experience
- **Dev Server Stability**: Fixed development server crashes with auto-restart capability
  - Enhanced Vite configuration for better stability
  - Added dev:watch script for automatic server restart
  - Improved file watching and HMR reliability
- **Console Log Cleanup**: Production builds now clean with comprehensive console statement removal
  - Enhanced Terser configuration for complete console removal
  - Development-only console logging with environment checks
- **Build Optimization**: Enhanced production build configuration
  - Better chunk splitting and manual chunks optimization
  - Improved Terser settings with additional compression options

### Technical Enhancements
- **ES Module Support**: Added "type": "module" to package.json for modern JavaScript
- **Code Quality**: Enhanced ESLint and Prettier configurations
- **Bundle Analysis**: Improved build analysis tools and documentation

## 2.1.0 - 28.07.2025

**Enhancement Release - jQuery-Free Core System & Brand Refresh**

### New Features
- **jQuery-Free Core System**: Complete main-core.js modernization with vanilla JavaScript
  - Dynamic module loading with caching and performance monitoring  
  - Loading states and visual indicators for better UX
  - Enhanced error handling and development debugging tools
- **Brand-Consistent Favicon Suite**: Modern favicon system with complete browser support
  - SVG-first approach for sharp display across all devices
  - Apple Touch Icon, Android Chrome icons, and PWA manifest
  - Modern standard implementation with proper fallbacks

### UI/UX Improvements  
- **Top Navigation Alignment**: Perfect vertical centering of user profile and notification elements
- **Modern DOM Utilities**: Comprehensive jQuery-free DOM manipulation library
  - Slide animations, fade effects, and smooth transitions
  - Event handling and element manipulation without jQuery dependency
- **Enhanced Visual Consistency**: Improved spacing and alignment throughout interface

### Technical Enhancements
- **Console Log Cleanup**: Production-ready code with clean, professional output
  - Development-only logging wrapped in environment checks
  - Removed verbose initialization messages and debug output
- **Code Quality**: Streamlined codebase with reduced development artifacts
- **Performance Optimizations**: Further improvements to module loading system

### Bug Fixes
- Fixed loadModule reference errors when using main-minimal.js
- Resolved favicon display issues in legacy browsers  
- Corrected navigation element positioning and alignment
- Eliminated development console noise in production builds

### File Structure
- Added centralized DOM utilities (`src/utils/dom-modern.js`)
- Updated favicon implementation with proper size variants
- Cleaned development files and reduced repository size

### Developer Experience
- Improved error boundaries and debugging capabilities
- Enhanced module performance monitoring and statistics
- Better development vs production environment handling

## 2.0.0 - 20.06.2025 🎉

**Major Stable Release - Bootstrap 5 with Modern Build System**

### 🚀 New Features
- **Vite Build System**: Lightning-fast development with hot-reload and optimized production builds
- **Bootstrap 5.3.7**: Complete migration to latest Bootstrap with modern design system
- **Smart Code Splitting**: 90% smaller initial bundle (79KB vs 779KB) with conditional module loading
- **Modern JavaScript**: ES6+ modules with dynamic imports and tree shaking
- **Performance Optimized**: 40-70% faster page loads with intelligent caching

### 🔧 Major Improvements
- **Morris.js Complete Removal**: Replaced with modern Chart.js implementation
  - Renamed `morisjs.html` → `chart3.html` with updated navigation
  - Removed all Morris.js CSS and JavaScript code
  - Updated 35+ HTML files with new Chart.js references
- **jQuery Easing Fixes**: Resolved all `TypeError: jQuery.easing[this.easing] is not a function` errors
  - Added jQuery UI easing effects with fallback functions
  - Fixed EasyPieChart and progress bar animations
- **Enhanced Navigation**: Consistent search bar implementation across all pages
- **Error Page Redesign**: Modern 403, 404, 500 pages with consistent branding

### 🎨 UI/UX Enhancements
- **Responsive Design**: Mobile-first approach with optimized touch interfaces
- **Login Page**: Complete redesign with modern card layout and form validation
- **Pricing Tables**: Pure Bootstrap 5 implementation with interactive features
- **Fixed Sidebar/Footer**: Proper Bootstrap 5 compatibility and positioning

### 🛠️ Technical Updates
- **Dependencies**: Updated all packages to latest stable versions
- **SASS Structure**: Organized and optimized stylesheet architecture
- **TypeScript Ready**: Full TypeScript support available
- **Cross-Browser**: Tested compatibility with modern browsers

### 📦 Bundle Optimization
- **Core Bundle**: 79KB essential libraries
- **Chart Module**: 219KB (loads only on chart pages)
- **Form Module**: 200KB (loads only on form pages)
- **Table Module**: DataTables functionality on demand
- **Dashboard Module**: Dashboard-specific widgets

### 🐛 Bug Fixes
- Fixed all reported Bootstrap 4 to 5 migration issues
- Resolved SASS deprecation warnings
- Fixed dropdown functionality across all pages
- Corrected responsive behavior on mobile devices
- Eliminated JavaScript console errors

### 💻 Developer Experience
- Hot-reload development server
- Optimized build process with cache-busting
- Smart asset optimization
- Improved documentation and examples

### Note

Earlier there were no changelog at all and we have introduced one now and we will start from version 1.0.0. However, keep in mind that this is far from being first version as there have been dozens of commits.

### 1.0.0 - 25.03.2016

* Fixed dataTables
* Added new dataTable variations

### 1.1.0 - 26.04.2016

* Add multilevel menu
* Mobile comptibility enhancement

### 1.2.0 - 19.05.2016

* Fix menu not become active if url contains parameters
* Fix form upload form not adjust on large number of files
* Remove invalid css
* Add compose message functionalities
* Add fixed sidebar functionalities

### 1.3.0 - 01.06.2016

* Fix menu not become active if url contains parameters
* Fix form upload form not adjust on large number of files
* Remove invalid css
* Add compose message functionalities
* Add fixed footer functionalities

### Gentelella 2.0-beta1

* Updated Bootstrap to 4.3.1
* Updated all dependencies
* Fixed all reported bugs

This version is tested but we would recommend not to use it in production right away. Please install it for testing purposes and report back if there are any problems to be fixed.
