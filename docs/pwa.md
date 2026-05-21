# Progressive Web App

v4 is **installable** on macOS, Windows, iOS, and Android. The shell works offline once the service worker has cached it. No PWA framework — just a `manifest`, a `sw.js`, and ~30 lines of registration code.

## What's wired

| Piece | File |
| --- | --- |
| Web app manifest | [`public/site.webmanifest`](../public/site.webmanifest) |
| Service worker | [`public/sw.js`](../public/sw.js) |
| Manifest + meta-tag injection | [`vite.config.js`](../vite.config.js) `shellInjectionPlugin` |
| Registration | [`src/main-v4.js`](../src/main-v4.js) |

## Service worker registration

[`src/main-v4.js`](../src/main-v4.js) registers the service worker **only in production builds**:

```js
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swPath).catch(() => {
      // silent — don't block the page on SW failure
    });
  });
}
```

Two important details:

- **`import.meta.env.PROD`** — the SW is *never* registered on the dev server. Otherwise HMR fights the cache.
- **`import.meta.env.BASE_URL`** — the path uses the resolved base so subpath deploys (e.g. `/theme/gentelella/`) scope the SW correctly.

## Manifest

[`public/site.webmanifest`](../public/site.webmanifest) describes the installable app:

```json
{
  "name": "Gentelella v4",
  "short_name": "Gentelella",
  "description": "Free admin dashboard template",
  "start_url": "production/index.html",
  "scope": ".",
  "display": "standalone",
  "theme_color": "#1ABB9C",
  "background_color": "#ffffff",
  "icons": [
    { "src": "images/android-chrome-192x192.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "images/android-chrome-512x512.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

| Field | Purpose |
| --- | --- |
| `name` | Full app name shown in install prompts |
| `short_name` | Shown under the home-screen icon |
| `start_url` | Page loaded when opening the installed app |
| `display` | `standalone` = no browser chrome; `minimal-ui` = thin browser bar; `browser` = normal tab |
| `theme_color` | Color of the OS status bar / browser title bar |
| `background_color` | Splash screen background on cold start |
| `icons` | Home-screen / installer icons |

Customize the `name`, `short_name`, `description`, `theme_color`, and icons for your brand. The Vite plugin injects the manifest link tag into every page automatically:

```html
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1ABB9C" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1a2332" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.svg">
```

## Service worker strategy

[`public/sw.js`](../public/sw.js) uses a **mixed strategy** tuned for Vite's hashed-asset output:

- **HTML navigations** → network-first, fall back to cache, fall back to the offline shell (`production/offline.html`). The freshly-fetched HTML is also cached for the offline fallback path.
- **Hashed static assets** (everything else, same-origin) → cache-first. Because Vite emits content-hashed URLs, a cache hit is always the right version.
- **Cross-origin** (Google Fonts, CDNs) → passthrough; the SW doesn't touch them.

On install, the SW pre-caches just the offline shell (`production/offline.html`). On activate, it purges old cache versions — the `CACHE` constant at the top of `sw.js` carries a version suffix you bump per release to bust users' caches when asset URLs change at the same path.

To swap strategies, edit the `fetch` event handler in [`public/sw.js`](../public/sw.js) — the file is under 60 lines and self-contained.

## Updating the service worker

The service worker file itself is uploaded with `Cache-Control: no-cache` so browsers always check for a fresh copy on each visit. When `sw.js` changes:

1. Browser fetches the new SW on next page load.
2. New SW enters the "waiting" state.
3. Old SW keeps serving until all of its clients close.
4. Next visit, the new SW activates.

For a hard reset during development:

```js
navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
caches.keys().then(ks => ks.forEach(k => caches.delete(k)));
```

Run in DevTools console, then reload.

## Offline shell

[`production/offline.html`](../production/offline.html) is a minimal page shown when the user navigates while offline and the requested page isn't in cache. It tells them they're offline and offers a "Retry" button.

Customize the copy and styling here — your users will probably see it occasionally.

## Install prompt

Browsers fire `beforeinstallprompt` on the `window` when the PWA is eligible to install. By default v4 doesn't intercept it, so the browser's native install UI shows up (puzzle-piece icon in Chrome's address bar, "Install app" menu in iOS Safari Share sheet).

To show your own install prompt (e.g. a banner on first visit):

```js
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();   // your custom UI
});

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') hideInstallBanner();
  deferredPrompt = null;
});
```

## Lighthouse audit

The starting Lighthouse PWA score is in the 80s — the missing pieces are:

- Splash screen icons in PNG (currently SVG; iOS doesn't always render SVG splash)
- Apple-specific touch icon variants
- Maskable icon variant

Convert your icon to PNG at 512×512, 192×192, 180×180 (Apple touch), and 192×192 maskable. Drop into `public/images/` and reference from the manifest.

The roadmap has "Lighthouse audit + tuning to 95+ Performance / 100 A11y / 100 SEO / 100 PWA" — submit a PR if you tackle this first.

## Subpath PWAs

Under a subpath (`https://example.com/admin/`), the manifest's `start_url` and `scope` are relative, so they resolve correctly. `BASE_PATH=/admin/ npm run build` produces:

```json
{
  "start_url": "production/index.html",
  "scope": "."
}
```

The browser interprets `.` as the manifest's location — i.e. `/admin/`. The SW registers at `/admin/sw.js` and its scope is `/admin/`. Multiple PWAs on the same domain don't collide.

## Disabling PWA

If you don't want PWA features:

1. Delete the `serviceWorker.register(…)` block in [`src/main-v4.js`](../src/main-v4.js).
2. Delete [`public/site.webmanifest`](../public/site.webmanifest) and [`public/sw.js`](../public/sw.js).
3. Remove the `metaPwa` block from [`vite.config.js`](../vite.config.js)'s `shellInjectionPlugin`.

The build still works; the page just isn't installable.

## Where to look

- [`public/sw.js`](../public/sw.js) — service worker implementation
- [`public/site.webmanifest`](../public/site.webmanifest) — install metadata
- [`src/main-v4.js`](../src/main-v4.js) — registration logic
- [`vite.config.js`](../vite.config.js) — manifest meta-tag injection
- [`production/offline.html`](../production/offline.html) — offline fallback
- [PWA: A new way to think about apps (web.dev)](https://web.dev/articles/what-are-pwas) — primer if you're new to PWAs
