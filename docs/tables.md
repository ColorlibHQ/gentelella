# Tables

v4 uses **DataTables.net 2** for sortable / searchable / paginated tables, re-skinned from scratch in [`_datatable.scss`](../src/scss/v4/_datatable.scss) to match the design system. DataTables is lazy-imported only when a `[data-datatable]` table is present.

Live demos: [`production/tables.html`](../production/tables.html) (23 rows) and [`production/tables_dynamic.html`](../production/tables_dynamic.html) (50 rows + extensions).

## The pattern

Mark up a regular `<table>` with `data-datatable` and a thead/tbody:

```html
<table class="table" data-datatable>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th data-orderable="false">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td><span class="badge badge-teal">Admin</span></td>
      <td>
        <button class="btn btn-sm btn-outline">Edit</button>
      </td>
    </tr>
    <!-- …more rows -->
  </tbody>
</table>
```

[`src/v4/tables.js`](../src/v4/tables.js) discovers every `[data-datatable]`, lazy-imports DataTables, and initializes each one.

## Per-table options (data attributes)

| Attribute | Default | Effect |
| --- | --- | --- |
| `data-datatable` | — | **Required** to opt in |
| `data-page-length="N"` | `10` | Rows per page |
| `data-orderable="false"` (on `<th>`) | — | Disable sorting on that column |
| `data-selectable` | — | Wire row checkboxes (header checkbox = select all visible) |
| `data-export="filename"` | — | Show a CSV export button in the card header |

Example with all options:

```html
<table class="table"
       data-datatable
       data-page-length="25"
       data-selectable
       data-export="users">
  <thead>
    <tr>
      <th><input type="checkbox" class="row-select-all"></th>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th data-orderable="false">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input type="checkbox" class="row-select"></td>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td><span class="badge badge-teal">Admin</span></td>
      <td><button class="btn btn-sm btn-outline">Edit</button></td>
    </tr>
  </tbody>
</table>
```

## Row selection

Adding `data-selectable` to the table (or having `.row-select-all` + `.row-select` checkboxes) wires:

- **Header checkbox** — toggles all visible rows on/off
- **Row checkboxes** — toggle individual rows, header checkbox reflects state (indeterminate when partial)
- **Visual highlight** — `tr.selected` class is added/removed; style in [`_datatable.scss`](../src/scss/v4/_datatable.scss)

Listen for selection changes via standard `change` events on the checkboxes, or read `.selected` row count:

```js
const selected = table.querySelectorAll('tbody tr.selected').length;
```

## CSV export

`data-export="users"` shows a download button. Clicking it grabs the current filtered/sorted rows from DataTables' API and produces a CSV named `users-YYYY-MM-DD.csv`.

The button is rendered into the parent `.card-options` slot if the table is inside a `.card`. If you want it elsewhere, look at `wireExport()` in [`src/v4/tables.js`](../src/v4/tables.js) for the integration point.

## Search and pagination

DataTables provides them automatically. The search input lives in the card header (auto-detected) or above the table. The paginator is rendered below the tbody.

Styled in [`_datatable.scss`](../src/scss/v4/_datatable.scss):

- Search input: `.dataTables_filter input` — uses the same look as `.input`
- Page info: `.dataTables_info`
- Paginator: `.dataTables_paginate` with `← / 1 / 2 / 3 / →` buttons

Strings are translated via the `language` block in `initTables`:

```js
language: {
  search: '',                                  // No "Search:" label
  searchPlaceholder: 'Search…',
  info: 'Showing _START_–_END_ of _TOTAL_',
  infoEmpty: 'No matching records',
  infoFiltered: '(of _MAX_ total)',
  zeroRecords: 'No matches found',
  paginate: { previous: '←', next: '→' }
}
```

Change those if you need a different copy.

## Custom column sort

By default DataTables sorts strings alphabetically and numbers numerically. For dates, prices, or other custom formats:

```html
<th data-sort-by="2026-05-20">May 20, 2026</th>
```

DataTables reads `data-sort` on `<td>` for the sort key while displaying the rendered HTML. Useful for relative-time strings ("2h ago") that you want sorted by an actual timestamp.

## Disable sorting per column

```html
<th data-orderable="false">Actions</th>
```

Done — clicking that header does nothing. Common for action columns and avatar columns.

## Initial sort

DataTables defaults to no initial sort (`order: []`). To set one:

```js
// Override in src/v4/tables.js or pre-sort the rows in the HTML
```

Or just sort the rows in your seed data before rendering — simpler for static demos.

## Server-side rendering / pagination

DataTables supports server-side processing via `serverSide: true` and `ajax: { url: '…' }`. The v4 default config doesn't enable it because the seed data is small. If you need to wire a backend:

1. Edit `initTables` to detect `data-source="…"` on the table.
2. When present, switch to `serverSide: true` and pass `ajax: { url: table.dataset.source }`.
3. Your endpoint returns `{ data, recordsTotal, recordsFiltered }` per [DataTables docs](https://datatables.net/manual/server-side).

Alternatively, render all rows server-side and let DataTables do client-side sort/filter — fine up to a few thousand rows.

## Selecting all rows from your own JS

If you've added rows dynamically and want the "select all" checkbox to pick them up, dispatch a `change` event after appending:

```js
tbody.appendChild(newRow);
tbody.querySelector('.row-select-all')?.dispatchEvent(new Event('change'));
```

## Refreshing data

DataTables 2 exposes an instance via `new DataTable(table, opts)` — `initTables` in [`src/v4/tables.js`](../src/v4/tables.js) creates one per `[data-datatable]` element. v4 doesn't use jQuery anywhere, including for DataTables.

To refresh rows after fetching new data, the cleanest approach is to keep a reference to the instance when you initialise:

```js
import DataTable from 'datatables.net';

const dt = new DataTable(table, { /* options */ });

async function refresh() {
  const rows = await fetch('/api/users').then((r) => r.json());
  dt.clear();
  dt.rows.add(rows.map((u) => [u.name, u.email, u.role, '']));
  dt.draw();
}
```

If you only have the `<table>` element and need the instance after `initTables` has run, store the `DataTable` on the table itself before that — modify `initTables` to set `table._dt = dt` and read it back later. Out of the box, the instance isn't exposed beyond the closure.

## Dark mode

DataTables-rendered UI elements (search, paginator, info text) all consume CSS custom properties, so dark mode just works. No re-init needed on theme change.

## Removing DataTables

If you only need a sortable table for one page and want to ditch DataTables entirely (it's ~180 KB):

1. Remove the page's `data-datatable` attribute (or just don't add it).
2. Write a tiny sort handler on the `<th>` clicks — 30 lines of vanilla JS.

For a static admin template, the cost-benefit usually favors keeping DataTables since the chunk is lazy-loaded and only one chunk per page.

## Where to look

- [`src/v4/tables.js`](../src/v4/tables.js) — initialization + selection + export
- [`src/scss/v4/_datatable.scss`](../src/scss/v4/_datatable.scss) — UI overrides
- [DataTables docs](https://datatables.net/) — the option reference
