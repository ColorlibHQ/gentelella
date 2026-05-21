# Architecture

Three load-bearing ideas keep v4 small and fast: **a single JS entry**, **build-time shell injection**, and **lazy modules guarded by DOM presence**. Once you understand all three, the rest of the codebase is just leaves on the tree.

## Single JS entry

Every page in `production/*.html` loads **the same one script**:

```html
<script type="module" src="/src/main-v4.js"></script>
```

[`src/main-v4.js`](../src/main-v4.js) does four things, in order:

1. Imports `scss/v4/main.scss` so styles ship in the same graph.
2. Mounts the admin shell (sidebar / topbar / footer).
3. Runs initialisers that no-op on pages without the relevant element: `initCharts()`, `initTables()`, `initCommandPalette()`, `initPageActions()`.
4. Lazy-imports page-specific modules guarded by DOM presence:

   ```js
   if (document.getElementById('inbox-root')) {
     import('./v4/inbox.js').then((m) => m.initInbox());
   }
   if (document.querySelector('.calendar-grid')) {
     import('./v4/calendar.js').then((m) => m.initCalendar());
   }
   ```

The DOM-presence guard is the linchpin. Inbox / kanban / calendar / file-manager / settings each ship as separate chunks, downloaded only on the pages that use them.

This is why there's no list of `<script>` tags per page. **Don't add them.** Instead, add a lazy-import block to `main-v4.js` and an idempotent `init<Name>()` export to `src/v4/<name>.js`.

## Build-time shell injection

The sidebar, topbar, and footer are **rendered into each HTML file at build time** by a Vite plugin — not after page load. That means:

- **No FOUC** (flash of unstyled content). The shell paints on the first frame.
- **No JS required to see the chrome.** Search engines and screen readers see semantic markup.
- **Runtime `mountShell()` is a fallback.** It only renders the shell if it's not already in the DOM (e.g. you opened a raw HTML file outside Vite). On every page, it still wires up event handlers (theme toggle, mobile drawer, sidebar accordion).

Pages opt in by setting three body attributes:

```html
<body data-shell="admin"
      data-page="inbox"
      data-breadcrumb="Home > Inbox">
```

| Attribute | What it does |
| --- | --- |
| `data-shell="admin"` | Triggers shell injection. Pages without it (login, marketing, error pages) get no chrome. |
| `data-page="<key>"` | Matches a leaf in `NAV` to highlight the active sidebar item. |
| `data-breadcrumb="A > B > C"` | Rendered into the topbar breadcrumb. Optional; defaults to `Home`. |

The Vite plugin lives in [vite.config.js](../vite.config.js) as `shellInjectionPlugin()`. It reads the body tag, parses the attributes, calls `renderShell()` from [`src/v4/shell-render.js`](../src/v4/shell-render.js), and string-replaces the result into the HTML.

[`shell-render.js`](../src/v4/shell-render.js) is **pure** — no DOM, no `window`/`document` — so the same code runs at build time (in Node) and at runtime (in the browser, as a fallback).

## NAV — one source of truth

The sidebar is rendered from the `NAV` constant in [`src/v4/shell-render.js`](../src/v4/shell-render.js):

```js
export const NAV = [
  {
    label: 'General',
    items: [
      {
        text: 'Dashboards', icon: 'dashboard',
        children: [
          { key: 'dashboard',   href: 'index.html',  text: 'Operations' },
          { key: 'dashboard-2', href: 'index2.html', text: 'Analytics' },
          ...
        ]
      },
      { key: 'calendar', href: 'calendar.html', text: 'Calendar', icon: 'calendar' },
      ...
    ]
  },
  ...
];
```

Items are either **flat leaves** (`{ key, href, text, icon, badge? }`) or **parents with submenus** (`{ text, icon, children: [...] }`). Parents auto-expand when any of their children matches the page's `data-page`.

Add a new sidebar entry by appending to the right group. The Vite plugin re-injects the shell on save.

Icons are inline SVG strings in the `ICONS` object in the same file. Adding a new icon = appending one entry with a `currentColor` stroke SVG (24×24 viewbox).

## Auto-discovered pages

[`vite.config.js`](../vite.config.js)'s `discoverEntries()` walks `production/*.html` and registers every file as a Rollup input. Adding a new page is just dropping a file into `production/` — no `rollupOptions.input` edit.

```js
function discoverEntries() {
  const dir = resolve(import.meta.dirname, 'production');
  const out = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.html')) continue;
    const stem = file === 'index.html' ? 'main' : file.replace(/\.html$/, '');
    out[stem] = `production/${file}`;
  }
  return out;
}
```

Combined with the shell injection plugin, this means a new page is one file:

```html
<!-- production/reports.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reports | Gentelella v4</title>
  <script type="module" src="/src/main-v4.js"></script>
</head>
<body data-shell="admin" data-page="reports" data-breadcrumb="Home > Admin > Reports">
  <main class="main">
    <!-- page content -->
  </main>
</body>
</html>
```

Drop it in. Run dev. It's live. (Use `npm run new -- reports --nav-group "Admin"` to also wire NAV.)

## Chunking strategy

The bundle ships exactly **three vendor chunks**, all lazy:

| Chunk | Loaded on | Source |
| --- | --- | --- |
| `vendor-echarts` | Chart pages | `node_modules/echarts/` |
| `vendor-tables` | Table pages | `node_modules/datatables.net/` |
| `vendor-maps` | Map page | `node_modules/leaflet/` |

Everything else (shell, command palette, charts wrapper, tables wrapper, inbox, kanban, calendar, …) ships in the main chunk because each is small enough not to need splitting.

The chunking rule lives in `vite.config.js`'s `manualChunks` function — it matches by `node_modules/` path because Rolldown doesn't resolve package names.

## Theming

CSS custom properties under `:root` (light) and `[data-theme="dark"]` in [`_tokens.scss`](../src/scss/v4/_tokens.scss). The Vite plugin emits a **pre-paint inline script** in every page's `<head>` that reads `localStorage.theme` and sets the `data-theme` attribute on `<html>` *before the body renders* — so dark mode never flashes light.

Charts read tokens at init time via `getComputedStyle(document.documentElement).getPropertyValue('--…')`. When the theme attribute changes, charts re-init with the new colors. The same trick keeps the live theme generator working — every chart, button, badge, and link reflects token edits in real time.

## Subpath-safe URLs

Anything that might be served under a subpath (`/admin/`, `/theme/gentelella/`) uses `import.meta.env.BASE_URL` at runtime and `${base}` in the Vite plugin. The service worker registration is the canonical example:

```js
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swPath).catch(() => {});
  });
}
```

Setting `BASE_PATH=/admin/ npm run build` rewrites every asset URL — manifest, apple-touch-icon, hashed JS/CSS — to the correct prefix.

## What this buys us

- **No FOUC, no JS-required chrome.** The shell is in HTML before the bundle parses.
- **Tiny per-page cost.** A page without charts doesn't pay for ECharts. A page without an inbox doesn't pay for `inbox.js`.
- **Boring deploys.** Static files, no SSR runtime, no edge functions.
- **Trivial onboarding.** A new page is one file. A new chart is one factory. A new sidebar entry is one array push.

The rest of the docs are about leaning on these patterns. See [pages.md](pages.md), [charts.md](charts.md), [theming.md](theming.md) next.
