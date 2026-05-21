# Components

Visual primitives are HTML + CSS classes — no JS framework, no `Component.render()`. Drop the markup, get the styling. Every component reads its colors from CSS custom properties (see [theming.md](theming.md)).

## Buttons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-primary btn-sm">Small primary</button>
```

| Class | Purpose |
| --- | --- |
| `.btn` | Base — sets size, padding, border-radius, transition |
| `.btn-primary` | Filled, uses `--primary` |
| `.btn-outline` | Bordered, transparent background |
| `.btn-ghost` | Borderless, hover background only |
| `.btn-danger` | Red — for destructive actions |
| `.btn-sm` | 28px height, smaller font and padding |

Buttons accept an inline SVG icon (14×14, `currentColor` stroke) before or after the text:

```html
<button class="btn btn-primary">
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M8 2v12M2 8h12"/>
  </svg>
  Create report
</button>
```

## Cards

The workhorse container. Holds stats, charts, tables, forms — almost everything in the dashboard.

```html
<div class="card">
  <div class="card-header">
    <div>
      <div class="card-title">Revenue</div>
      <div class="card-subtitle">Last 30 days</div>
    </div>
    <div class="card-options">
      <button class="card-opt-btn" aria-label="More">⋯</button>
    </div>
  </div>
  <div class="card-body">
    <!-- card content -->
  </div>
</div>
```

| Class | Purpose |
| --- | --- |
| `.card` | Base — white surface, 1px border, soft drop shadow |
| `.card-header` | Title row with options on the right |
| `.card-title` | h-style title text |
| `.card-subtitle` | Smaller muted text below the title |
| `.card-options` | Right-side button group (filter, refresh, menu) |
| `.card-opt-btn` | Single options icon button |
| `.card-body` | Inner content area (`padding: 16px`) |
| `.card-body.p-0` | No-padding variant (when content is a table) |
| `.card.is-refreshing` | Shows a shimmering top border during async updates |

## Stat cards

Compact KPI tiles for the dashboard.

```html
<div class="card">
  <div class="stat">
    <div class="stat-icon teal">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="9" cy="7" r="4"/>
      </svg>
    </div>
    <div class="stat-content">
      <div class="stat-label">Total Users</div>
      <div class="stat-value-row">
        <span class="stat-value">2,500</span>
        <span class="stat-change up">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3M3 6l3-3 3 3"/></svg>
          12%
        </span>
      </div>
      <div class="stat-subtext">342 new this week</div>
    </div>
  </div>
</div>
```

Stat icon colors: `.teal`, `.blue`, `.green`, `.yellow`, `.red`, `.purple`. Each pulls from the matching `--*-lt` background token.

Stat change indicators: `.stat-change.up` (green) and `.stat-change.down` (red).

Or use the [`markup.js`](../src/v4/markup.js) helper:

```js
import { statTile } from '../src/v4/markup.js';

const html = statTile({
  label: 'Total Users',
  value: '2,500',
  color: 'teal',
  iconHtml: '<svg …></svg>',
  subtext: '342 new this week',
  change: { direction: 'up', value: '12%' }
});
container.innerHTML = html;
```

## Badges

Badges are scoped to nav links — the count pill on a sidebar item, or the "New" / "Hot" / "Beta" pill in NAV. Defined in [`_layout.scss`](../src/scss/v4/_layout.scss); only show up when nested inside `.nav-link` / `.nav-sublink`.

```html
<a class="nav-link" href="…">
  Inbox
  <span class="badge badge-teal">3</span>
</a>
```

| Class | Color |
| --- | --- |
| `.badge-teal` | Primary (teal) |
| `.badge-red` | Red |
| `.badge-blue` | Blue |

For badge-like indicators **outside** the sidebar (in tables, cards, headers), use [status pills](#status-pills) below — they're the general-purpose equivalent and don't depend on nav context.

## Status pills

Like badges but bigger, with optional dot.

```html
<span class="status status-green">Active</span>
<span class="status status-yellow">Pending</span>
<span class="status status-red">Failed</span>
<span class="status status-blue">In progress</span>
```

Or via the markup helper:

```js
import { statusBadge } from '../src/v4/markup.js';
statusBadge('Active', 'green');
```

## Grid

A CSS Grid-based row + column system. Just enough to lay out the dashboard without dragging in a full CSS framework.

```html
<div class="row col-3">
  <div class="card">…</div>
  <div class="card">…</div>
  <div class="card">…</div>
</div>
```

| Class | Layout |
| --- | --- |
| `.row` | `display: grid; gap: var(--space-4)` (16px) |
| `.col-2` | Two equal columns |
| `.col-3` | Three equal columns |
| `.col-4` | Four equal columns |
| `.col-8-4` | 2/3 + 1/3 split |
| `.col-4-8` | 1/3 + 2/3 split |
| `.col-1` | Single column |

All columns use `grid-template-columns: repeat(N, minmax(0, 1fr))` so wide intrinsic content (a long table or a code block) doesn't blow out the layout.

Mobile breakpoints stack columns automatically:

- `.col-8-4` and `.col-4-8` collapse at 1100px
- `.col-4`, `.col-3`, `.col-2` collapse at 768px

## Toggle switches

```html
<button class="toggle"></button>
<button class="toggle on"></button>
```

Click toggles `.on`. Handled by event delegation in [`src/main-v4.js`](../src/main-v4.js):

```js
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.toggle');
  if (toggle) toggle.classList.toggle('on');
});
```

Want to react to changes? Use a `MutationObserver` on `class`, or add your own click listener on top.

## Progress bars

```html
<div class="progress-thin">
  <div class="bar" style="width: 65%"></div>
</div>
```

The `.bar` child reads its width from the inline style. Color via inline style on the bar:

```html
<div class="progress-thin">
  <div class="bar" style="width: 80%; background: var(--green)"></div>
</div>
```

Style lives in [`_components.scss`](../src/scss/v4/_components.scss). For a thicker bar or a different look, override the height directly in your own SCSS — there's only one variant in v4.

## Avatars

The base `.avatar` class is sizeless — always pair it with a size modifier:

```html
<span class="avatar avatar-xs">A</span>
<span class="avatar avatar-sm">SK</span>
<span class="avatar avatar-md">MR</span>
<span class="avatar avatar-lg">EW</span>
<span class="avatar avatar-xl">DR</span>
<span class="avatar avatar-xxl">JS</span>

<!-- With a custom background -->
<span class="avatar avatar-md" style="background:linear-gradient(135deg,var(--azure),#1d6fa5)">JS</span>

<!-- With an image -->
<span class="avatar avatar-md avatar-image"><img src="…" alt=""></span>
```

| Class | Size (px) |
| --- | --- |
| `.avatar-xs` | 20 |
| `.avatar-sm` | 26 |
| `.avatar-md` | 32 |
| `.avatar-lg` | 44 |
| `.avatar-xl` | 64 |
| `.avatar-xxl` | 96 |

Status dots: add `.avatar-status` with `.online` / `.offline` / `.busy` / `.away`.

For a table cell with avatar + name, the [`customerCell`](../src/v4/markup.js) helper renders the canonical `.cell-customer / .cell-avatar / .cell-strong` markup:

```js
import { customerCell } from '../src/v4/markup.js';
td.innerHTML = customerCell({ name: 'Jane Smith', initials: 'JS', avatarColor: 'var(--primary)' });
```

## Banners

Inline messaging at the top of a section.

```js
import { banner } from '../src/v4/markup.js';

banner({
  title: 'Heads up',
  body: 'Your trial ends in 3 days.',
  variant: 'warning',
  iconHtml: '<svg …></svg>',
  actionsHtml: '<a href="/billing" class="btn btn-sm btn-primary">Upgrade</a>'
});
```

Variants: `info`, `success`, `warning`, `danger`.

## Empty states

For empty lists / tables / search results.

```js
import { emptyState } from '../src/v4/markup.js';

emptyState({
  title: 'No results',
  desc: 'Try adjusting your filters.',
  iconHtml: '<svg …></svg>',
  actionHtml: '<button class="btn btn-primary">Clear filters</button>'
});
```

## Skeleton rows

For loading states in tables.

```js
import { skeletonRows } from '../src/v4/markup.js';

tbody.innerHTML = skeletonRows(/* cols */ 5, /* rows */ 8);
```

## Activity items

```js
import { activityItem } from '../src/v4/markup.js';

activityItem({
  bodyHtml: '<strong>Jane Smith</strong> commented on <a href="#">Q3 plan</a>',
  time: '2h ago',
  initials: 'JS'
});
```

## Visitor / metric rows

For the country / browser / referrer rows on dashboards.

```js
import { visitorRow } from '../src/v4/markup.js';

visitorRow({ name: 'United States', pct: 42, flag: '🇺🇸' });
```

Builds a name + percentage + horizontal bar.

## Page header

Already covered in [pages.md](pages.md), repeated here for completeness:

```html
<div class="page-header">
  <div class="page-header-row">
    <div>
      <div class="page-pretitle">Overview</div>
      <h1 class="page-title">Dashboard</h1>
    </div>
    <div class="page-actions">
      <button class="btn btn-outline">Secondary action</button>
      <button class="btn btn-primary">Primary action</button>
    </div>
  </div>
</div>
```

Page actions get delegated click handling via [`src/v4/page-actions.js`](../src/v4/page-actions.js).

## Where to see it all

Open [`production/playground.html`](../production/playground.html) — every reusable component is on one page, side-by-side with its exact HTML and a Copy button. The single best reference if you're hunting for "what does that thing look like and what's the class name?"

## Where to find component CSS

| Looking for | File |
| --- | --- |
| Buttons, cards, tables, status, toggles, progress | [`_components.scss`](../src/scss/v4/_components.scss) |
| Stat cards, activity, donuts, sparklines, todo lists | [`_widgets.scss`](../src/scss/v4/_widgets.scss) |
| Inputs, selects, input groups, validation | [`_forms.scss`](../src/scss/v4/_forms.scss) |
| Sidebar, topbar, grid, page wrapper | [`_layout.scss`](../src/scss/v4/_layout.scss) |
| Pagination, alerts, calendar, inbox, invoice | [`_pages.scss`](../src/scss/v4/_pages.scss) |
| Chat, kanban, file manager, settings | [`_apps.scss`](../src/scss/v4/_apps.scss) |
| Login + 4xx/5xx pages | [`_auth.scss`](../src/scss/v4/_auth.scss) |
| DataTables overrides | [`_datatable.scss`](../src/scss/v4/_datatable.scss) |
