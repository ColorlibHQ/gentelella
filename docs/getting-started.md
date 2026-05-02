# Getting started

This guide gets you from `git clone` to a running dev server in under 2 minutes.

## Prerequisites

- **Node.js 20+** (tested on 25)
- **npm 10+** (ships with Node)

That's it. No Python, no Ruby, no Docker. There is no backend.

## Install

```bash
git clone <your-repo>
cd gentelella-v4

npm install
```

Installs **3 production deps** (echarts, datatables.net, leaflet) and **8 dev deps** (vite, sass, eslint, prettier, …) — about 138 MB.

## Run the dev server

```bash
npm run dev
```

Vite starts on [http://localhost:3000/](http://localhost:3000/) (or the next free port if 3000 is taken). Open [http://localhost:3000/production/index.html](http://localhost:3000/production/index.html).

Hot-reload works for SCSS, JS, and HTML — save any file and the page reloads.

## Build for production

```bash
npm run build
```

Outputs static HTML + hashed JS/CSS to `dist/`. To preview the build locally:

```bash
npm run preview
```

## Deploy

Drop the `dist/` directory onto any static host:

| Host | Command / notes |
|---|---|
| **Netlify** | `npx netlify deploy --dir dist --prod` |
| **Vercel** | `vercel --prod` (point project root at `dist/`) |
| **Cloudflare Pages** | Connect the repo, set build command `npm run build`, output `dist` |
| **GitHub Pages** | `BASE_PATH=/your-repo/ npm run build`, push `dist/` to `gh-pages` |
| **S3 + CloudFront** | `aws s3 sync dist/ s3://your-bucket/ --delete` |
| **Any web server** | `cp -r dist/* /var/www/html/` |

For deployments under a subpath (e.g. `https://example.com/admin/`), pass `BASE_PATH`:

```bash
BASE_PATH=/admin/ npm run build
```

All asset URLs in the built HTML get rewritten to that prefix.

## Next steps

- Read [`README.md`](../README.md) for the full surface map and customization patterns.
- See [`CLAUDE.md`](../CLAUDE.md) for architectural conventions (shell pattern, charts, tables, SCSS structure).
- Browse [`src/scss/v4/_tokens.scss`](../src/scss/v4/_tokens.scss) for the design tokens — change `--primary` and every chart, button, and active-state recolors.
- Open [`src/v4/shell.js`](../src/v4/shell.js)'s `NAV` array to edit the sidebar.
