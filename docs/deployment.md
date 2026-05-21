# Deployment

v4 builds to a static `dist/` folder. Deploy it to any host that serves files.

## Build

```bash
npm run build
```

Outputs to `dist/`:

```text
dist/
├── assets/         # Hashed CSS + fonts
├── images/         # Hashed images
├── js/             # Hashed JS chunks
├── production/     # 58 entry HTML pages
├── site.webmanifest
└── sw.js
```

The `images/`, `js/`, and `assets/` directories contain content-hashed files (e.g. `main-v4-CdizX8eI.js`) so they can be cached forever. The HTML files reference the latest hashes after each build.

For a non-minified debug build:

```bash
npm run build:dev
```

To preview the production build locally:

```bash
npm run preview          # serves dist/ on :9174
```

## Subpath builds

By default the build assumes deployment at the host root (`/`). To deploy under a subpath:

```bash
BASE_PATH=/admin/ npm run build
```

Every asset URL — manifest, apple-touch-icon, service worker, hashed JS/CSS — gets rewritten to the prefix. The Vite plugin uses `import.meta.env.BASE_URL` at runtime so the SW registers at the right scope.

Common subpath scenarios:

```bash
BASE_PATH=/admin/ npm run build              # https://example.com/admin/
BASE_PATH=/your-repo-name/ npm run build     # https://you.github.io/your-repo-name/
BASE_PATH=/dashboard/v2/ npm run build       # https://example.com/dashboard/v2/
```

The trailing slash matters — Vite normalizes to `/admin/` but missing the trailing slash can produce broken asset URLs.

## Hosts

### Netlify

Drop the repo into Netlify and set:

- Build command: `npm run build`
- Publish directory: `dist`

Or one-shot from the CLI:

```bash
npx netlify deploy --dir dist --prod
```

No `_redirects` or `_headers` file needed for the default setup.

### Vercel

```bash
vercel --prod
```

Vercel detects Vite automatically. If it doesn't, set:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### Cloudflare Pages

Connect the repo in the Cloudflare dashboard:

- Build command: `npm run build`
- Build output: `dist`

The default Cloudflare CDN cache + APO interact with the service worker — set `Cache-Control: no-cache` on `sw.js` and `site.webmanifest` (Cloudflare Pages does this for `sw.js` automatically by name).

### GitHub Pages

```bash
BASE_PATH=/your-repo-name/ npm run build
git subtree push --prefix dist origin gh-pages
```

Or via GitHub Actions — there's a starter workflow in [`.github/workflows/`](../.github/workflows/).

For a custom domain, set the `CNAME` file in `dist/` and point your DNS at GitHub Pages.

### S3 + CloudFront

```bash
aws s3 sync dist/ s3://your-bucket/ --delete --cache-control "public, max-age=31536000, immutable"
aws s3 cp dist/index.html s3://your-bucket/ --cache-control "no-cache"
aws s3 cp dist/sw.js s3://your-bucket/ --cache-control "no-cache"
aws cloudfront create-invalidation --distribution-id ABC123 --paths "/*"
```

Two passes — the second overwrites HTML and sw.js with short cache so users get the latest version after a deploy. Without the second pass, your edge caches stale HTML pointing at deleted hashed assets.

### Cloudflare R2 (built-in deploy script)

[`scripts/deploy-preview.sh`](../scripts/deploy-preview.sh) handles cache headers properly for R2:

```bash
npm run deploy:preview                       # default slug: 'gentelella'
PREVIEW_SLUG=my-app npm run deploy:preview   # deploys to /theme/my-app/
```

What it does:

1. Builds with `BASE_PATH=/theme/$SLUG/`
2. Three sync passes:
   - Long-cache (`max-age=31536000, immutable`) for hashed JS/CSS/images
   - Short-cache (`max-age=60`) for HTML pages
   - No-cache for `sw.js` and `site.webmanifest`
3. Optionally purges Cloudflare APO (if `CF_API_TOKEN` + `CF_ZONE_ID` env vars are set)

Requires [`rclone`](https://rclone.org/) configured with an `r2pro` remote pointing at your Cloudflare R2 account.

### nginx / Apache / any web server

```bash
cp -r dist/* /var/www/html/
```

Recommended `Cache-Control` headers:

| Path | Header |
| --- | --- |
| `/js/*.js`, `/assets/*.css`, `/images/*` | `public, max-age=31536000, immutable` |
| `*.html` | `public, max-age=60, must-revalidate` |
| `/sw.js`, `/site.webmanifest` | `no-cache, no-store, must-revalidate` |

nginx example:

```nginx
location ~* \.(?:js|css)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
location ~* \.html$ {
  add_header Cache-Control "public, max-age=60, must-revalidate";
}
location = /sw.js {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
location = /site.webmanifest {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Why cache headers matter

Hashed assets (`js/main-v4-CdizX8eI.js`) are content-addressed — when the content changes, the filename changes. A long `Cache-Control: immutable` is safe and fast.

HTML pages reference the latest hashes after each build. If your edge cache serves a stale HTML pointing at `js/main-v4-OLDHASH.js`, but `OLDHASH.js` has been deleted, the page is broken until the cache expires.

Two ways to avoid that:

1. **Short HTML cache** (60 seconds) — visitors see new builds within a minute. Edge cache + browser are short-circuited.
2. **Cache purge after deploy** — flush the edge cache for the HTML paths.

The R2 deploy script does both. Other deploys should follow the same pattern.

## Pre-deploy checks

```bash
npm run smoke           # boots dev server, hits every page, asserts HTTP 200
npm run build           # confirms a clean production build
npm run lint            # ESLint
npm run format:check    # Prettier
```

If you're shipping a major UI change:

```bash
npm run screenshots     # generates current state into docs/screenshots/
git diff --stat docs/screenshots/
```

Visual diff the PNGs to make sure nothing regressed.

## Environment variables

| Variable | Read by | Purpose |
| --- | --- | --- |
| `BASE_PATH` | Vite (`vite.config.js`) | Build-time prefix for asset URLs |
| `PORT` | Vite dev server | Override default :9173 |
| `API_URL` | Vite dev server proxy | Backend for `/api/*` (default `http://localhost:8080`) |
| `NODE_ENV` | Terser, build target | `production` enables minification + drops console.* |
| `PREVIEW_SLUG` | `scripts/deploy-preview.sh` | R2 path slug |
| `CF_API_TOKEN`, `CF_ZONE_ID` | `scripts/deploy-preview.sh` | Cloudflare cache purge |

Other than `BASE_PATH` and (optionally) `API_URL`, no env vars are required.

## Multiple builds (preview + prod)

If you ship a preview environment and a production environment from the same repo, build twice with different `BASE_PATH`:

```bash
BASE_PATH=/preview/ npm run build && cp -r dist/ deploys/preview/
BASE_PATH=/ npm run build && cp -r dist/ deploys/prod/
```

Or use the R2 deploy script with different slugs:

```bash
PREVIEW_SLUG=staging npm run deploy:preview
PREVIEW_SLUG=production npm run deploy:preview
```

## Production checklist

- [ ] `BASE_PATH` set correctly for your hosting URL
- [ ] HTML pages have short cache (60s) or are purged on deploy
- [ ] Hashed assets have long cache (1y `immutable`)
- [ ] `sw.js` and `site.webmanifest` have no-cache
- [ ] HTTPS is enabled (PWA install requires HTTPS)
- [ ] `manifest`'s `theme_color`, `name`, `short_name`, icons match your brand
- [ ] All `production/*.html` titles + descriptions reflect your app, not "Gentelella v4"
- [ ] Login form's action attribute points to your actual auth endpoint
- [ ] Analytics / monitoring is wired (none ships by default)
