# Migration from v2

v4 is a **ground-up rewrite** of Gentelella, not a refactor. If you're coming from v2 (Bootstrap 4/5 + jQuery), there is no automated migration path — your template, your CSS, and your JS will all be different.

This guide is honest about that and walks you through the differences so you can make an informed decision about whether to migrate, port piecemeal, or stick with v2.

## What changed at a glance

| | v2 (2.2.0) | v4 (4.0.0) |
| --- | --- | --- |
| **CSS framework** | Bootstrap 5.3 | Custom design system (10 SCSS partials) |
| **JS framework** | Bootstrap JS + small jQuery | Vanilla ES2022 |
| **Build system** | Vite 8 (MPA) | Vite 8 (MPA + Rolldown) |
| **Charts** | Chart.js + ECharts + Sparklines + Skycons | ECharts 6 only |
| **Date picker** | Tempus Dominus | Custom (`src/v4/form-controls.js`) |
| **Calendar** | FullCalendar | Custom (`src/v4/calendar.js`) |
| **Multi-select** | Choices.js | Custom (`src/v4/form-controls.js`) |
| **Rich text** | Quill | Custom contenteditable (`src/v4/form-controls.js`) |
| **Tables** | DataTables (Bootstrap-styled) | DataTables (custom-styled) |
| **PWA** | No | Yes |
| **Dark mode** | No | Yes |
| **Theme generator** | No | Yes |
| **Command palette** | No | Yes |
| **`node_modules` size** | ~600 MB | ~178 MB |
| **Pages** | ~40 | 58 |
| **Production deps** | ~25 | 3 |

## The decision matrix

| Your situation | Recommendation |
| --- | --- |
| Existing v2 app in production, working fine | Stay on v2. It's still maintained for security. |
| Starting a new project | Use v4. |
| v2 app needs a major UI refresh anyway | Use v4. The cost is similar to a v2 refresh and you get the new features. |
| v2 app needs dark mode / PWA / theme generator | Port to v4. v2 doesn't have these and won't get them. |
| You depend on a v2-specific library not in v4 (Quill, FullCalendar, …) | Stay on v2 or add the library back to v4 yourself. |

## Where v2 stays available

- npm `latest` tag points at v2.2.0 (`npm install gentelella` gets v2)
- npm `next` tag will point at v4.0.0 once published
- The `master` branch is v2; v4 is on the `v4` branch (will swap in a future release)

## The most common pitfalls

### 1. No Bootstrap classes

```html
<!-- v2 (Bootstrap) -->
<div class="row">
  <div class="col-md-6">
    <button class="btn btn-primary">Save</button>
  </div>
</div>

<!-- v4 -->
<div class="row col-2">
  <div>
    <button class="btn btn-primary">Save</button>
  </div>
</div>
```

`.btn` and `.btn-primary` happen to be the same. Most other classes (`.col-md-6`, `.form-control`, `.alert`, `.card-body`) are different or absent.

### 2. No jQuery

```js
// v2
$('#user-form').on('submit', function(e) {
  e.preventDefault();
  $.post('/api/save', $(this).serialize());
});

// v4
document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  await fetch('/api/save', { method: 'POST', body: new FormData(e.target) });
});
```

If your codebase has hundreds of jQuery calls, plan ~15–30 minutes per file to convert.

### 3. No `data-bs-*` attributes

Bootstrap 5's `data-bs-toggle`, `data-bs-target`, `data-bs-dismiss` aren't recognized in v4. The equivalent in v4 is to call helpers directly:

```js
// v2 — Bootstrap auto-attaches handlers to data-bs-toggle="modal"
<button data-bs-toggle="modal" data-bs-target="#myModal">Open</button>

// v4 — explicit helper call
<button id="open-btn">Open</button>
<script>
  import { showModal } from './v4/modal.js';
  document.getElementById('open-btn').addEventListener('click', () => {
    showModal({ title: 'Hello', body: '...' });
  });
</script>
```

### 4. New chart system

```js
// v2 — Chart.js
const ctx = document.getElementById('chart').getContext('2d');
new Chart(ctx, { type: 'line', data: {...}, options: {...} });

// v4 — ECharts via [data-chart] attribute
<div data-chart="revenue-line" style="width:100%;height:300px"></div>
// → src/v4/charts.js registers a factory called "revenue-line"
```

Port Chart.js charts to ECharts factories. The translation is mostly straightforward — ECharts has equivalent options for line / bar / pie / radar / scatter.

### 5. No more global utilities on `window`

v2 exposed `window.bootstrap`, `window.dayjs`, `window.NProgress`, `window.loadModule`, `window.sanitizeHtml`, `window.ValidationUtils`. None of these exist in v4.

Import what you need:

```js
// v2
const sanitized = window.sanitizeHtml(userInput);

// v4 — import from src/v4/markup.js
import { escapeHtml } from './v4/markup.js';
const sanitized = escapeHtml(userInput);
```

If you depended on DOMPurify-grade sanitization (v2 used it for rich content), keep using DOMPurify directly — it's not bundled in v4 because the markup helpers don't render arbitrary HTML.

### 6. Different scaffolding

```bash
# v2 — manual edits to vite.config.js after creating production/<page>.html

# v4 — auto-discovery + scaffolder
npm run new -- reports --title "Reports" --nav-group "Admin"
```

See [pages.md](pages.md).

## Porting checklist

If you decide to migrate:

1. **Audit your customizations**. List every file you've changed in v2 — SCSS overrides, custom pages, custom modules, server integrations.
2. **Start fresh from v4**. Clone v4 in a separate directory. Copy your custom HTML pages in one by one, updating them to use v4's classes.
3. **Tokens first**. Port your brand colors / spacing / fonts to v4's `_tokens.scss`. The rest will follow.
4. **Convert jQuery files**. For each `$(…)` call, find the vanilla equivalent. The common ones:
   - `$('#x').on('click', fn)` → `document.getElementById('x').addEventListener('click', fn)`
   - `$('.x').addClass('y')` → `document.querySelectorAll('.x').forEach(el => el.classList.add('y'))`
   - `$.ajax({…})` → `fetch(url, {…})`
   - `$('#form').serialize()` → `new FormData(form)` (or `new URLSearchParams(new FormData(form))`)
5. **Charts** — port Chart.js options to ECharts factory functions in `src/v4/charts.js`. See [charts.md](charts.md).
6. **Modals / toasts** — replace Bootstrap modal API with `showModal()` / `showToast()`. See [overlays.md](overlays.md).
7. **Date inputs** — replace Tempus Dominus with v4's `data-date-range` widget. See [forms.md](forms.md).
8. **DataTables** — change `$('#table').DataTable({...})` to a `data-datatable` attribute on the table. See [tables.md](tables.md).
9. **Run `npm run smoke`** to assert every page returns 200.

Expect: a small project = 1–2 days; a medium project = a week; a large project = 2–3 weeks of careful conversion.

## What you gain

- **Smaller bundle.** v4 ships ~178 MB of `node_modules` vs ~600 MB in v2. Build output is also significantly smaller because of lazy ECharts/DataTables/Leaflet chunks.
- **Dark mode + theme generator.** Major UX upgrade. The pre-paint script eliminates the dark-mode flash.
- **PWA.** Installable. Offline shell.
- **Command palette.** ⌘K across all pages.
- **Inbox / kanban / calendar / file manager** as polished interactive modules with seed → backend swap via `?api=1`.
- **AI helper files** (`CLAUDE.md`, `.cursor/`, `.github/copilot-instructions.md`, `AGENTS.md`).
- **TypeScript declarations** for IntelliSense without rewriting in TS.

## What you lose

- **Bootstrap class familiarity.** v4 has its own class names. Devs already fluent in Bootstrap need ~half a day to learn the v4 conventions.
- **Some third-party widgets.** Quill, FullCalendar, Choices.js, Tempus Dominus, Skycons, Sparklines, Switchery aren't bundled. The v4 custom equivalents cover ~80% of use cases. If you need the originals, install them and wire them up — they still work.
- **jQuery plugin ecosystem.** Anything you were doing with a jQuery plugin needs a vanilla equivalent.

## Side-by-side support

You can run both versions side-by-side during migration:

```text
deploys/
├── v2/                    # current production
└── v4-beta/               # new build
```

Use different hostnames or subpaths (`/admin/` vs `/admin-v4/`) to A/B test before cutover.

## Where to look

- [`CHANGELOG.md`](../CHANGELOG.md) — full diff between v2 and v4
- [README](../README.md) — v4 marketing overview
- [getting-started.md](getting-started.md) — clean v4 setup
- [faq.md](faq.md) — common gotchas
