# Gentelella v4 documentation

Practical guide to building with Gentelella v4. Pairs with the project [README](../README.md) (overview + marketing) and [CLAUDE.md](../CLAUDE.md) (rules-of-the-road for AI tools).

## Start here

1. **[Getting started](getting-started.md)** — install, run dev, build, deploy
2. **[Project structure](project-structure.md)** — what every directory does
3. **[Architecture](architecture.md)** — shell injection, NAV, lazy modules

## Customizing the UI

- **[Theming](theming.md)** — design tokens, dark mode, the live theme generator
- **[Pages](pages.md)** — the `npm run new` scaffolder, body attributes, sidebar entries
- **[Components](components.md)** — buttons, cards, badges, stat tiles, grids
- **[Forms](forms.md)** — inputs, validation, date range, multi-select, rich text
- **[Charts](charts.md)** — ECharts factories, dark-mode-aware tokens, the chart map
- **[Tables](tables.md)** — DataTables, row selection, CSV export, page size
- **[Overlays](overlays.md)** — `showModal`, `showToast`, `openMenu`, `openPanel`
- **[Command palette](command-palette.md)** — ⌘K, registering inline actions
- **[App modules](app-modules.md)** — inbox, kanban, calendar, file manager, settings

## Platform

- **[PWA](pwa.md)** — service worker, manifest, offline shell
- **[Deployment](deployment.md)** — hosts, subpath builds, Cloudflare R2, cache headers
- **[TypeScript](typescript.md)** — IntelliSense via `types/gentelella.d.ts`
- **[Data adapter](data-adapter.md)** — `?api=1`, seed vs HTTP

## Migration

- **[Migration from v2](migration-v2.md)** — coming from the old Bootstrap-based Gentelella

## Help

- **[FAQ](faq.md)** — common questions
- **[Open an issue](https://github.com/ColorlibHQ/gentelella/issues)** if you hit something not covered here

## At a glance

| You want to | Read |
| --- | --- |
| Run it locally | [Getting started](getting-started.md) |
| Add a new page in the sidebar | [Pages](pages.md) |
| Change the brand color | [Theming](theming.md) |
| Add a sortable table | [Tables](tables.md) |
| Add a chart | [Charts](charts.md) |
| Show a modal or toast | [Overlays](overlays.md) |
| Hook up a real backend | [Data adapter](data-adapter.md) |
| Deploy under `/admin/` | [Deployment](deployment.md) |
| Convert from old Gentelella | [Migration from v2](migration-v2.md) |
