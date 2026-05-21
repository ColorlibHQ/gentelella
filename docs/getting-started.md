# Getting started

From `git clone` to a running dev server in under 2 minutes.

## Prerequisites

- **Node.js 20+** (tested on 25)
- **npm 10+** (ships with Node)

That's it. No Python, no Ruby, no Docker. There is no backend.

## Install

```bash
git clone https://github.com/ColorlibHQ/gentelella.git
cd gentelella
git checkout v4              # until v4 is the default branch
npm install
```

Installs **3 production deps** (`echarts`, `datatables.net`, `leaflet`) and **9 dev deps** (`vite`, `sass`, `eslint`, `prettier`, `terser`, `playwright`, `rollup-plugin-visualizer`, etc.) — about **178 MB**. Down from ~600 MB on the old Gentelella.

## Run the dev server

```bash
npm run dev
```

Vite starts on [http://localhost:9173/](http://localhost:9173/) and opens [/production/index.html](http://localhost:9173/production/index.html) automatically. If port 9173 is taken, Vite picks the next free port.

Hot-reload works for SCSS, JS, and HTML — save any file and the page updates without a full reload.

Need a different port? Set `PORT`:

```bash
PORT=4000 npm run dev
```

## Build for production

```bash
npm run build
```

Outputs static HTML + hashed JS/CSS to `dist/`. To preview the built site locally:

```bash
npm run preview                # serves dist/ on :9174
```

Want a non-minified build for debugging?

```bash
npm run build:dev
```

## Verify before deploying

```bash
npm run smoke                  # boot dev server, hit every page, assert HTTP 200
npm run lint                   # ESLint
npm run format:check           # Prettier check
```

## Deploy

Drop the `dist/` directory onto any static host:

| Host | Command / notes |
| --- | --- |
| **Netlify** | `npx netlify deploy --dir dist --prod` |
| **Vercel** | `vercel --prod` (point project root at `dist/`) |
| **Cloudflare Pages** | Connect the repo, set build command `npm run build`, output `dist` |
| **GitHub Pages** | `BASE_PATH=/your-repo/ npm run build`, push `dist/` to `gh-pages` |
| **S3 + CloudFront** | `aws s3 sync dist/ s3://your-bucket/ --delete` |
| **Cloudflare R2** | `npm run deploy:preview` (built-in script with per-file cache headers) |
| **Any web server** | `cp -r dist/* /var/www/html/` |

For deployments under a subpath (e.g. `https://example.com/admin/`), pass `BASE_PATH`:

```bash
BASE_PATH=/admin/ npm run build
```

All asset URLs in the built HTML get rewritten to that prefix.

More on hosting choices and cache headers: [deployment.md](deployment.md).

## Next steps

- **[project-structure.md](project-structure.md)** — directory layout and what each file does
- **[architecture.md](architecture.md)** — how the shell, NAV, and lazy loading work together
- **[theming.md](theming.md)** — change the brand color, customize tokens, build dark variants
- **[pages.md](pages.md)** — add a new page (the `npm run new` scaffolder)
- **[charts.md](charts.md)** — add an ECharts chart
- **[tables.md](tables.md)** — add a DataTables table with row selection and CSV export
- **[overlays.md](overlays.md)** — modals, toasts, popover menus
- **[migration-v2.md](migration-v2.md)** — moving from old Gentelella (Bootstrap 4 + jQuery)
