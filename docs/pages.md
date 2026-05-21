# Pages

Every page in v4 is a standalone HTML file under [`production/`](../production/). Vite auto-discovers them — drop a file in, it's a new entry point.

## The two ways

### 1. The scaffolder (recommended)

```bash
npm run new -- reports --title "Reports" --nav-group "Admin"
```

That creates `production/reports.html` with the standard skeleton, sets the body attributes correctly, and inserts a sidebar entry into the `NAV` array of [`src/v4/shell-render.js`](../src/v4/shell-render.js).

Run `npm run new -- --help` for the full flag list:

| Flag | Default | Purpose |
| --- | --- | --- |
| `<slug>` | — (required) | URL-safe page key; becomes `<slug>.html`. Pattern: `^[a-z][a-z0-9_-]*$` |
| `--title` | Title-cased slug | Page title in `<title>` and `<h1>` |
| `--pretitle` | — | Section label above the title (e.g. "Admin") |
| `--breadcrumb` | `Home > <Title>` | `>`-separated breadcrumb |
| `--nav-group` | — | Group to add the entry to (`General`, `Apps`, `E-commerce`, `Projects`, `UI library`, `Admin`, `Layouts`) |
| `--icon` | `pages` | Sidebar icon key — must exist in `ICONS` |
| `--force` | false | Overwrite if the file exists |
| `--dry-run` | false | Print what would happen; don't write |

Examples:

```bash
npm run new -- reports \
  --title "Reports" \
  --pretitle "Admin" \
  --breadcrumb "Home > Admin > Reports" \
  --nav-group "Admin" \
  --icon profile

# Preview without writing:
npm run new -- user-roles --nav-group "Admin" --dry-run
```

### 2. By hand

If you want full control over the page body:

```html
<!-- production/reports.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reports | Gentelella v4</title>
  <link rel="icon" href="../images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script type="module" src="/src/main-v4.js"></script>
</head>
<body data-shell="admin" data-page="reports" data-breadcrumb="Home > Admin > Reports">

<main class="main">
<div class="page-wrapper">

  <div class="page-header">
    <div class="page-header-row">
      <div>
        <div class="page-pretitle">Admin</div>
        <h1 class="page-title">Reports</h1>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary">New report</button>
      </div>
    </div>
  </div>

  <!-- page content -->

</div>
</main>

</body>
</html>
```

Vite picks it up on next save. To get the sidebar entry, append to `NAV` in [`src/v4/shell-render.js`](../src/v4/shell-render.js):

```js
{
  label: 'Admin',
  items: [
    // …existing items
    { key: 'reports', href: 'reports.html', text: 'Reports', icon: 'profile' }
  ]
}
```

## Body attributes

The shell injection plugin looks for these three attributes:

| Attribute | What it does |
| --- | --- |
| `data-shell="admin"` | **Required** to opt into the shell. Pages without this attribute (login, marketing, error pages) get no sidebar/topbar. |
| `data-page="<key>"` | Matches a leaf in `NAV` to highlight the active item. Must equal a `key` field. |
| `data-breadcrumb="A > B > C"` | `>`-separated breadcrumb. Optional; defaults to `Home`. |

Without `data-shell="admin"`, the page is "shell-less" — useful for:

- `login.html`, `register.html`, `forgot_password.html`, `verify_2fa.html`, `lock_screen.html`
- `landing.html` (marketing)
- `page_403.html`, `page_404.html`, `page_500.html`, `maintenance.html`, `coming_soon.html`, `offline.html`

These pages style themselves directly — see [`src/scss/v4/_auth.scss`](../src/scss/v4/_auth.scss).

## Sidebar groups

`NAV` in [`src/v4/shell-render.js`](../src/v4/shell-render.js) has 7 groups:

| Group | Pages |
| --- | --- |
| **General** | Dashboards (4 variants), Forms, Tables, Charts, Calendar, Map |
| **Apps** | Chat, Inbox, Kanban, Files, Notifications |
| **E-commerce** | Storefront, Product, Orders, Invoice, Pricing |
| **Projects** | All projects, Project detail |
| **UI library** | Elements, Widgets, Playground, Theme, Typography, Icons, Media |
| **Admin** | Contacts, User management, Profile, Settings, Help center |
| **Layouts** | Fixed sidebar, Fixed footer, Nested page, Plain page |

Add a leaf to the appropriate group. The shape is:

```js
// Flat leaf
{ key: 'reports', href: 'reports.html', text: 'Reports', icon: 'profile' }

// Leaf with badge
{ key: 'inbox', href: 'inbox.html', text: 'Inbox', icon: 'mail',
  badge: { text: 'New', cls: 'badge-teal' } }

// Parent with submenu
{
  text: 'Reports', icon: 'profile',
  children: [
    { key: 'reports-sales', href: 'reports_sales.html', text: 'Sales' },
    { key: 'reports-ops',   href: 'reports_ops.html',   text: 'Operations' }
  ]
}
```

Parents auto-expand when any child matches the current page's `data-page`. Children carry their own keys for the highlight match.

Badge classes: `badge-red`, `badge-teal`, `badge-blue`. Add new ones to `_components.scss` if you want more.

## Icons

The `ICONS` object in [`src/v4/shell-render.js`](../src/v4/shell-render.js) holds inline SVG strings. Current set covers:

`dashboard · forms · tables · charts · calendar · ui · pages · media · users · profile · settings · chat · bell · kanban · files · shop · tag · cart · help · mail · map · receipt · price · projects · type · icons · layout · code · paint`

To add a new icon:

```js
export const ICONS = {
  // …existing icons
  reports: '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17v-6h13M9 11V5h13"/></svg>'
};
```

Conventions:

- 24×24 viewbox
- `stroke="currentColor"`, `fill="none"` (so it picks up the active state color)
- `stroke-width="1.5"` for visual consistency
- 18×18 rendered size via the class `icon`

Once added, reference it by key in NAV: `{ key: '…', icon: 'reports', … }`.

## Page header

Every dashboard-shell page typically opens with a page header:

```html
<div class="page-header">
  <div class="page-header-row">
    <div>
      <div class="page-pretitle">Section label</div>
      <h1 class="page-title">Page title</h1>
    </div>
    <div class="page-actions">
      <button class="btn btn-outline">Secondary</button>
      <button class="btn btn-primary">Primary</button>
    </div>
  </div>
</div>
```

`.page-actions` buttons (and any button anywhere) get global delegated click handling via [`src/v4/page-actions.js`](../src/v4/page-actions.js). It matches the button's text or `aria-label` against a regex set and runs the right action:

| Label matches | Action |
| --- | --- |
| `Print` | `window.print()` |
| `Export` / `Export CSV` / `Export PDF` / `Download` | CSV / JSON download; for DataTables, triggers `data-export` |
| `Refresh` | Adds a `.is-refreshing` pulse to the nearest card and re-dispatches `themechange` so charts redraw |
| `Share` | Copies `window.location.href` to clipboard |
| `Compose` / `New chat` / `New email` | Opens a contextual modal |
| `New deal` / `New project` / `New event` / `New task` | Opens a contextual modal |
| `Invite` / `Add member` / `Add user` / `Add customer` | Opens a contextual modal |

Buttons that don't match any pattern fall through to your own listeners (or do nothing). If a page-specific handler calls `preventDefault()` on the click event, the global handler doesn't fire — that's how you opt out for a specific button.

## Adding a page-specific JS module

If your page needs its own JavaScript (a chart, a complex form, a custom widget):

1. Create `src/v4/<name>.js` exporting a single idempotent `init<Name>()`:

   ```js
   // src/v4/reports.js
   export function initReports() {
     const root = document.querySelector('.reports-root');
     if (!root) return;
     // …
   }
   ```

2. Add a lazy-import block at the bottom of [`src/main-v4.js`](../src/main-v4.js):

   ```js
   if (document.querySelector('.reports-root')) {
     import('./v4/reports.js').then((m) => m.initReports());
   }
   ```

3. Mark the page with the matching root class:

   ```html
   <div class="reports-root">…</div>
   ```

The module is downloaded only on pages that have `.reports-root`. Other pages don't pay the cost.

**Don't add `<script>` tags directly to `production/*.html`.** The single-entry pattern is what keeps everything cacheable and HMR-friendly.

## Deleting a page

1. Delete `production/<slug>.html`.
2. Remove the matching entry from `NAV` in [`src/v4/shell-render.js`](../src/v4/shell-render.js).
3. If you had a module in `src/v4/`, delete it and remove the lazy-import block from `main-v4.js`.

Vite picks up the change on next save. No config edit.

## Next

- [components.md](components.md) for the visual primitives (cards, buttons, badges)
- [charts.md](charts.md) for adding charts
- [tables.md](tables.md) for adding sortable tables
