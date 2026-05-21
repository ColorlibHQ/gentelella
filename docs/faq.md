# FAQ

Common questions when building with Gentelella v4. Hit something not covered here? [Open an issue](https://github.com/ColorlibHQ/gentelella/issues).

## General

### Is it really free? Can I use it commercially?

Yes and yes. v4 is MIT-licensed. Use it for personal projects, client work, SaaS dashboards, internal tools — no attribution required.

### What's the difference between v2 and v4?

Total rewrite. v2 is Bootstrap + jQuery; v4 is vanilla JS + custom SCSS. See [migration-v2.md](migration-v2.md) for the full diff.

### Should I use v2 or v4?

If you're starting fresh: **v4**. If you have a v2 codebase: depends on whether you need dark mode / PWA / theme generator. Stay on v2 if v2 is meeting your needs.

### Where's the live demo?

<https://preview.colorlib.com/theme/gentelella/>

### Can I use this with React / Vue / Angular / Svelte?

v4 is server-rendered HTML — there is no Virtual DOM. You can:

1. **Use it as a static template** — keep the HTML and let your framework handle the JS later.
2. **Convert pages incrementally** — replace the `production/*.html` body with a framework-rendered component while keeping v4's CSS.
3. **Use just the SCSS** — `import 'gentelella/scss/v4/main.scss'` in any project. Drop in v4 classes without the JS.

There's no official React / Vue / Svelte port. Other Colorlib templates target those frameworks specifically (search "ColorlibHQ" on GitHub).

## Setup

### Node version?

Node.js 20+ (tested on 25). Lower versions may work but aren't tested.

### Why port 9173?

Picked something uncommon to avoid colliding with the dozen other tools that grab 3000 / 4000 / 5173 / 8000 / 8080. Override with `PORT=4000 npm run dev`.

### `npm install` is slow

It pulls ECharts (~9 MB unpacked), DataTables, Leaflet, and Vite's dev dependencies. ~178 MB total `node_modules` — that's lean for a modern frontend project. (v2 was ~600 MB.)

### Can I use Yarn / pnpm / Bun?

Yes. The `package-lock.json` is npm-specific but Yarn / pnpm / Bun all install the same dependencies. The `npm run ...` scripts work as `yarn ...`, `pnpm ...`, `bun run ...`.

### Where do I edit the dev server config?

[`vite.config.js`](../vite.config.js). The `server` block has port, host, proxy, watch options.

## Pages and navigation

### How do I add a page?

```bash
npm run new -- reports --nav-group "Admin"
```

See [pages.md](pages.md) for the full options.

### My new page doesn't show in the sidebar

Either you used `npm run new` without `--nav-group` (the file exists but isn't in NAV) or you added the file manually without editing `NAV` in [`src/v4/shell-render.js`](../src/v4/shell-render.js).

### The active nav item isn't highlighting

Check that the page's `<body data-page="...">` matches a `key` in NAV. They're case-sensitive.

### How do I add a sub-menu (parent + children)?

In `NAV`:

```js
{
  text: 'Reports', icon: 'profile',
  children: [
    { key: 'reports-sales', href: 'reports_sales.html', text: 'Sales' },
    { key: 'reports-ops',   href: 'reports_ops.html',   text: 'Ops' }
  ]
}
```

The parent stays expanded when any child's `data-page` matches.

### Page doesn't have a sidebar — why?

Pages without `data-shell="admin"` on `<body>` are intentionally shell-less. Login, register, error pages, marketing, etc. Add `data-shell="admin"` to opt in.

## Theming

### How do I change the brand color?

Edit `--primary` and `--primary-dk` in [`src/scss/v4/_tokens.scss`](../src/scss/v4/_tokens.scss). Charts and buttons read them automatically. See [theming.md](theming.md).

### How do I turn off dark mode?

Force a theme in your HTML:

```html
<script>document.documentElement.setAttribute('data-theme', 'light');</script>
```

Place this **after** the pre-paint script in `<head>`.

Or remove the theme toggle from the topbar (in [`src/v4/shell-render.js`](../src/v4/shell-render.js)) and delete the `[data-theme="dark"]` block from `_tokens.scss`.

### Dark mode is flashing on page load

That shouldn't happen — the pre-paint script in the Vite plugin sets `data-theme` *before* the body renders. If you see a flash:

1. Confirm `<script>(function(){try{var t=localStorage.getItem('theme');…})();</script>` is in `<head>` of every built page.
2. Check that you haven't added a render-blocking script before it.
3. Verify your browser isn't blocking the inline script (some strict CSP setups do).

### How do I customize the sidebar width?

`--sidebar-w` in `_tokens.scss`. The `<main>` adjusts automatically.

### Can I use my own font?

Yes. Replace the Google Fonts link in `<head>` and update `--font` in `_tokens.scss`. For self-hosting, drop the file in `public/fonts/` and add an `@font-face` in `main.scss`.

## Charts

### How do I add a new chart type?

Add a factory to [`src/v4/charts.js`](../src/v4/charts.js) and register it in the `charts` map. See [charts.md](charts.md).

### My chart colors aren't updating in dark mode

You're probably using hex literals instead of `t.primary` / `t.text` / etc. Refactor the factory to read from the `tokens()` object — see how `revenueLine` does it in [`charts.js`](../src/v4/charts.js).

### Why is ECharts so big?

~350 KB minified. We mitigate by lazy-loading on chart pages only. For a smaller chunk, delete chart types you don't use from the import block in `initCharts` — removing radar/gauge/treemap/sankey/calendar/funnel cuts the chunk by ~40%.

## Tables

### How do I add a sortable table?

Add `data-datatable` to any `<table class="table">`. See [tables.md](tables.md).

### How do I disable sort on a column?

`<th data-orderable="false">Actions</th>`

### How do I change the page size?

`<table data-datatable data-page-length="25">`

### Can I do server-side pagination?

DataTables supports it via `serverSide: true` and `ajax: { url }`. The default v4 init doesn't enable it because seed data is small. Edit [`src/v4/tables.js`](../src/v4/tables.js) to detect a `data-source` attribute and switch to server-side when present.

## Modals and toasts

### How do I show a modal?

```js
import { showModal } from './v4/modal.js';
showModal({ title: 'Hi', body: '...', actions: [...] });
```

See [overlays.md](overlays.md).

### How do I show a toast?

```js
import { showToast } from './v4/toast.js';
showToast('Saved', { variant: 'success' });
```

### How do I keep a modal open after the action button click?

Return `false` from the action handler:

```js
{ label: 'Save', action: () => {
    if (!form.reportValidity()) return false;  // stays open
    save();
    // closes automatically
}}
```

### My modal isn't appearing

Check the console — `showModal` requires the body to be ready. If you call it inside a script that runs *before* `<body>`, it'll silently no-op.

## Build and deploy

### How do I build for production?

`npm run build`. Outputs to `dist/`.

### How do I deploy under a subpath?

`BASE_PATH=/admin/ npm run build`. See [deployment.md](deployment.md).

### My deploy is showing 404s for hashed JS files

Edge cache has stale HTML pointing at deleted hashes. Two options:

1. Short-cache the HTML (`Cache-Control: max-age=60`) so users get a fresh page within a minute.
2. Purge the edge cache for `*.html` on every deploy.

See [deployment.md — Why cache headers matter](deployment.md#why-cache-headers-matter).

### Can I host the dev server publicly?

`npm run dev` binds to `0.0.0.0` (`host: true` in `vite.config.js`) so anyone on your network can reach `http://your-ip:9173/`. Don't expose to the public internet — the dev server has source maps and HMR enabled.

For a public preview, run `npm run build && npm run preview` or deploy `dist/` to a static host.

## PWA

### How do I disable the PWA?

Delete the `serviceWorker.register(...)` block in [`src/main-v4.js`](../src/main-v4.js). Also delete `public/sw.js` and `public/site.webmanifest`. See [pwa.md](pwa.md).

### Service worker is caching stale content during development

The SW is only registered in `import.meta.env.PROD` builds — `npm run dev` doesn't register it. If you're seeing stale content in dev, you probably registered the SW manually at some point. Clear it:

```js
navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
caches.keys().then(ks => ks.forEach(k => caches.delete(k)));
```

In DevTools console, then reload.

### How do I update users to a new version?

The SW file is uploaded with `Cache-Control: no-cache` so browsers check for an update on every visit. New SW activates after all of the old SW's clients close. For a forced update, deploy a new `sw.js` with a different version string and broadcast `skipWaiting()`.

## Performance

### Why is `vendor-echarts` chunk 350 KB?

ECharts is feature-rich. v4 already does modular imports — `LineChart`, `BarChart`, `PieChart`, etc. are imported individually. To shrink further, remove chart types you don't use from the modular-imports block in `initCharts`.

### How can I speed up `npm install`?

Use [pnpm](https://pnpm.io/) — global package store, hardlinks instead of copies. Or use [Bun](https://bun.sh/).

### How can I shrink the bundle?

- Remove unused chart types from [`src/v4/charts.js`](../src/v4/charts.js) (biggest win)
- Drop DataTables and write a tiny custom sort if you only need basic tables
- Drop Leaflet if you don't use the map page
- Drop the command palette (~3 KB) if you don't need ⌘K
- Drop the inbox / kanban / calendar / file-manager / settings modules if you don't use those pages — delete the lazy-import blocks in [`src/main-v4.js`](../src/main-v4.js)

## Customization

### How do I add a new SCSS partial?

Drop it in `src/scss/v4/_my-feature.scss` and add `@use 'my-feature';` to `main.scss`.

### How do I override the default styles?

Either:

1. Edit the partials directly (you own this fork; do whatever).
2. Add a new partial that comes last in `main.scss` — its rules override earlier ones at the same specificity.

### Where are the design tokens documented?

[theming.md](theming.md) and inline in [`_tokens.scss`](../src/scss/v4/_tokens.scss).

### Can I use Tailwind?

You could install Tailwind alongside v4, but the two design systems will fight. v4 already uses utility-ish classes (`.row`, `.col-3`, `.btn-primary`) but follows BEM-ish conventions. Mixing both adds bloat and confusion.

Better path: cherry-pick the patterns from v4 you want and write them in Tailwind in a separate project.

## Integrations

### How do I connect a backend?

Use the data adapter pattern — append `?api=1` to a page URL and `httpAdapter` takes over from `seedAdapter`. See [data-adapter.md](data-adapter.md).

### How do I add authentication?

The login form is a redirect. You need:

1. A backend with a login endpoint (`POST /api/login` returning a session cookie or token)
2. Wire the form's submit handler to call that endpoint
3. On success, redirect to `index.html`
4. On every protected page, check the session and redirect to `login.html` if absent

There's no auth helper in v4 because every backend's auth flow is different. Express, Django, Rails, Phoenix, Laravel — each has its own session middleware.

### Where do I put my API keys?

Don't ship them in the static bundle. Put them on your backend, proxy frontend calls through it. The dev server has a proxy at `/api/*` for this — see [`vite.config.js`](../vite.config.js).

## Contributing / extending

### Can I PR a new chart type?

Yes — open a PR. Match the existing factory pattern in [`src/v4/charts.js`](../src/v4/charts.js) and read tokens via `getComputedStyle`.

### Can I PR a new page?

Probably better to fork — v4 ships a curated set of 58 pages and we don't want it to balloon. But if your page is a clear gap (e.g. a missing common surface), open an issue first to discuss.

### Where do I report a bug?

<https://github.com/ColorlibHQ/gentelella/issues>

Include:

- Browser + version
- Node + npm version
- Page URL (if applicable)
- Console errors / network failures
- A minimal reproduction (if you can)
