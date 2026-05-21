# App modules

The five "app pages" — inbox, kanban, calendar, file manager, settings — are non-trivial interactive surfaces, each in its own module under [`src/v4/`](../src/v4/). They share the same loading pattern: lazy-imported when the relevant root element is present.

| Module | Page | Root selector |
| --- | --- | --- |
| `inbox.js` | [`inbox.html`](../production/inbox.html) | `#inbox-root` |
| `kanban.js` | [`kanban.html`](../production/kanban.html) | `.kanban-board` (auto-detected) |
| `calendar.js` | [`calendar.html`](../production/calendar.html) | `.calendar-grid` |
| `file-manager.js` | [`file_manager.html`](../production/file_manager.html) | `.file-manager-root` (auto-detected) |
| `settings.js` | [`settings.html`](../production/settings.html) | `.settings-content` |

Each exports an idempotent `init<Name>()` and is wired up in [`src/main-v4.js`](../src/main-v4.js):

```js
if (document.getElementById('inbox-root')) {
  import('./v4/inbox.js').then((m) => m.initInbox());
}
if (document.querySelector('.calendar-grid')) {
  import('./v4/calendar.js').then((m) => m.initCalendar());
}
if (document.querySelector('.settings-content')) {
  import('./v4/settings.js').then((m) => m.initSettings());
}
```

## Inbox

A full email client UI: folders sidebar, message list, reader pane, compose modal.

### Features

- **Folders**: Inbox, Starred, Sent, Drafts, Spam, Trash — switching filters the message list
- **Reader pane**: clicking a message shows the body to the right
- **Compose**: button → modal with To / Subject / Body inputs
- **Reply / Forward** buttons in the reader header
- **Search** input filters messages in the current folder
- **Keyboard shortcuts** (when not typing in an input):
  - `j` / `↓` — next message
  - `k` / `↑` — previous message
  - `r` — reply
  - `s` — toggle star on the selected message
  - `#` — delete the selected message
  - `c` — open compose

Forward is a button in the reader header (no keyboard shortcut).

### Data shape

The inbox seed is an array of message objects in [`src/v4/inbox.js`](../src/v4/inbox.js). To wire to a real backend, see [data-adapter.md](data-adapter.md) — append `?api=1` to the URL and the inbox switches from seed to HTTP.

```js
{
  id: 1,
  folder: 'inbox',                // inbox | sent | drafts | trash
  unread: true,
  starred: false,
  label: 'work',                  // work | personal | promotions | urgent | null
  from: 'Sarah K.',               // inbox: sender name. sent/drafts: 'Me'
  fromEmail: 'sarah@design.co',   // present on inbox items
  to: 'team@example.com',         // present on sent/drafts items
  subject: 'Re: Q1 design review',
  preview: 'I\'ve added comments to the figma file…',
  body: 'Full message body as plain text with \\n line breaks',
  time: '9:42 AM',                // display string, not an ISO date
  trashed: false                  // set on items in trash folder
}
```

Note: `time` is a display string (`'9:42 AM'`, `'Yesterday'`, `'Apr 19'`), not a `Date` or ISO timestamp. If you swap in an HTTP adapter, transform real timestamps to display strings before rendering.

### Extending

To add a new folder:

1. Add to the folders array at the top of `inbox.js`.
2. Make sure seed messages have a matching `folder` value.

To add a label / tag system:

1. Add `labels: string[]` to the message shape.
2. Render label chips in the message list item.
3. Add a labels-filter UI to the folders sidebar.

## Kanban

Drag-and-drop board with columns and cards. [`src/v4/kanban.js`](../src/v4/kanban.js).

### Features

- **Columns** with title and card count
- **Cards** with title, description, labels, assignees, due date, priority
- **Drag-and-drop** between columns and reorder within a column (HTML5 native drag API)
- **Click a card** to open an edit modal (title, description, labels, due, priority, delete)

### Data shape

```js
{
  id: 1,
  col: 'todo',                          // column id
  title: 'Add user filter to contacts page',
  desc: 'Filter by role + active status',
  labels: ['eng', 'frontend'],          // ids referencing LABELS list
  assignees: ['JS', 'MR'],              // initials
  due: 'May 25',
  priority: 'high'                      // low | medium | high
}
```

Columns and labels are defined at the top of [`src/v4/kanban.js`](../src/v4/kanban.js) as `COLUMNS` and `LABELS` arrays.

### Extending

- **Add a card**: insert into the cards array, call `render()`; drag handlers are delegated on the board so no per-card wiring needed
- **Persist drag**: hook the `drop` handler in `kanban.js` to PATCH the card's new `col` field
- **Add columns**: append to `COLUMNS`; the rendered columns are derived from it
- **WIP limits**: not built in. Add a `limit` field to columns and compare against `cards.filter(c => c.col === id).length` in `renderColumn()`

## Calendar

Month-grid view with event CRUD. [`src/v4/calendar.js`](../src/v4/calendar.js).

### Features

- **Month grid** with prev / today / next nav
- **Click a day** → "Add event" modal
- **Click an event** → edit / delete modal
- **Color tags** for event categories (blue, yellow, purple, red, green)
- **Procedural events** — recurring placeholders (e.g. weekly standup) generated on render so the grid always has content
- **Drag-to-reschedule is not implemented** — events are edited via the modal instead

### Data shape

```js
{
  id: 1,
  title: 'Sprint review',
  start: '2026-05-20T14:00:00Z',
  end:   '2026-05-20T15:00:00Z',
  color: 'teal',                   // teal | blue | yellow | red | purple
  description: '…'
}
```

### Extending

- **Week / day view**: add view-switcher buttons; the underlying date grid logic is already abstracted.
- **All-day events**: add `allDay: true` to the shape; render in a separate row above the timed grid.
- **Recurring events**: store an [iCalendar RRULE](https://datatracker.ietf.org/doc/html/rfc5545) and expand on render.

## File manager

Tree + grid file browser. [`src/v4/file-manager.js`](../src/v4/file-manager.js).

### Features

- **Folder tree** on the left with expand / collapse
- **File area** on the right with grid / list view toggle
- **Breadcrumb** above the file area
- **Per-file menu button** (⋯) opens a popover via `openMenu()` with Rename and Delete
- **Star / unstar** any file; a "Starred" virtual folder collects them
- **Shared** virtual folder shows files from a designated parent folder (demo: `marketing`)

### Data shape

```js
{
  folders: [
    { id: 'root', name: 'My drive', parent: null },
    { id: 'docs', name: 'Documents', parent: 'root' },
    { id: 'photos', name: 'Photos', parent: 'root' }
  ],
  files: [
    {
      id: 1,
      folder: 'docs',
      name: 'Q3 plan.pdf',
      type: 'pdf',                 // determines icon
      size: 1248000,
      modified: '2026-05-15T10:00:00Z'
    }
  ]
}
```

### Extending

- **File preview**: add a click handler that opens a modal with the file content (image, PDF embed, video).
- **Download**: add a `{ label: 'Download', action: () => downloadFile(id) }` entry to the per-file menu in `file-manager.js`.
- **Right-click context menu**: not built in. Wire `contextmenu` events on file rows to call the same `openMenu()` with the file's item list.
- **Multi-select**: add shift / cmd-click handling to mark multiple files; show a bulk-action bar at the top.
- **Upload**: drop-zone over the file area → POST to your backend.
- **Search**: add an `<input>` above the file area and filter `getCurrentFiles()` by name on input.

## Settings

`localStorage`-backed settings page. [`src/v4/settings.js`](../src/v4/settings.js).

### Features

- **Sections** (in [`production/settings.html`](../production/settings.html)): Account, Notifications, Privacy & security, Appearance, Integrations, Billing, Team, Danger zone
- **Section nav** in a left rail with scroll-spy active state
- **Persisted state** — toggles, radios, and form inputs save to `localStorage['gentelella:settings']` on change
- **Theme controls** in Appearance read/write `localStorage.theme` (the same key used by the pre-paint script)

### Data shape

```js
localStorage.getItem('gentelella:settings')
// JSON-encoded object — keys vary by input type:
{
  'toggle:notifications:Email digest': true,    // toggles: toggle:<section-id>:<label>
  'toggle:notifications:Push':         false,
  'radio:theme':                       'dark',  // radios: radio:<name>
  'radio:density':                     'comfy'
}
```

The persister discovers inputs by class:

- Toggles in `.settings-toggle-list .toggle` get a key `toggle:<section-id>:<label>` derived from the closest `.settings-section` and the row's `.label` text
- Radios in `.theme-options input[type="radio"]` get `radio:<name>`

To add a new persisted input, place it inside one of these container classes — no extra attribute needed.

### Extending

- **Add a section**: copy a `<section class="settings-section" id="…">` block in [`production/settings.html`](../production/settings.html) and append a `<a class="settings-nav-link" href="#…">` in the `.settings-nav` aside.
- **Sync to backend**: wrap `load()` / `save()` in [`src/v4/settings.js`](../src/v4/settings.js) with a `httpAdapter` (see [data-adapter.md](data-adapter.md)) so settings persist server-side instead of (or in addition to) `localStorage`.
- **Validation**: extend the toggle / radio change handlers in `settings.js` to validate the new value before calling `save()`.

## Common patterns

All five modules share these conventions:

- **Single root element**: each module checks for its root selector before doing anything else.
- **Idempotent init**: safe to call twice; already-initialized roots are skipped via a marker class (`._gentelella-init`).
- **Event delegation**: handlers attach to the root element and use `e.target.closest('.thing')` for matching. No per-element listeners on render.
- **Seed-first**: starts with an in-memory data array; mutations re-render the affected DOM region. `?api=1` swaps the seed for an HTTP adapter.
- **No SPA navigation**: each module is self-contained on its own page. There's no client-side router.

## Where to look

- [`src/v4/inbox.js`](../src/v4/inbox.js)
- [`src/v4/kanban.js`](../src/v4/kanban.js)
- [`src/v4/calendar.js`](../src/v4/calendar.js)
- [`src/v4/file-manager.js`](../src/v4/file-manager.js)
- [`src/v4/settings.js`](../src/v4/settings.js)
- [data-adapter.md](data-adapter.md) for wiring up a real backend
