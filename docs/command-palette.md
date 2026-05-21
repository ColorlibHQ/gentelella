# Command palette

⌘K (Ctrl+K on Windows/Linux) opens a global fuzzy-search palette across every page in the sidebar plus a curated list of inline actions. Sits on top of the page like a Spotlight / VS Code command palette.

Implementation: [`src/v4/command-palette.js`](../src/v4/command-palette.js). Initialized once per page by `initCommandPalette()` in [`src/main-v4.js`](../src/main-v4.js).

## What's searchable

By default the palette indexes two kinds of items:

### Pages (from `NAV`)

Every leaf in the `NAV` array of [`src/v4/shell-render.js`](../src/v4/shell-render.js) gets indexed as a `{ kind: 'page' }` item:

```js
NAV.forEach((group) => {
  group.items.forEach((it) => {
    out.push({
      kind: 'page',
      label: it.text,                // "Inbox"
      section: group.label,           // "Apps"
      href: it.href,                  // "inbox.html"
      keywords: `${it.text} ${group.label} ${it.key}`.toLowerCase()
    });
  });
});
```

When you select a page, the palette navigates the browser to its `href`.

### Inline actions

A curated list of `{ kind: 'action' }` items defined in `command-palette.js`:

| Label | What it does |
| --- | --- |
| Toggle theme | Flips light / dark on `<html data-theme>` |
| Open profile | Navigates to `profile.html` |
| Open settings | Navigates to `settings.html` |
| Theme generator | Navigates to `theme.html` |
| Help & support | Navigates to `faq.html` |
| Sign out | Confirmation modal → toast → redirect to `login.html` |

When you select an action, its handler runs. The palette closes immediately.

## Keyboard

| Key | Action |
| --- | --- |
| **⌘K / Ctrl+K** | Open palette (works from anywhere — input, button, body) |
| **Esc** | Close |
| **↑ / ↓** | Move selection |
| **Enter** | Activate selection (navigate or run action) |
| **Type** | Filter the list |

The opener listener uses `keydown` with `event.metaKey || event.ctrlKey` so it works on both macOS and Windows / Linux.

## The matcher

There's no `fuse.js` or external fuzzy library — the matcher is ~30 lines of subsequence + word-boundary scoring. It's accurate enough for ~50 items and adds zero KB to the bundle.

The scoring rules (in priority order):

1. Exact prefix match: `inbox` → "Inbox"
2. Word-boundary match: `mu` → "**Mu**lti-select" or "user **m**anage**u**ment"
3. Subsequence match: `frmv` → "**F**o**r**m **v**alidation"
4. Section name is included in the keyword string for cross-group search

For more sophisticated fuzzy matching, swap the `score()` function in `command-palette.js` for [Fuse.js](https://fusejs.io/). Cost: ~5 KB gzipped.

## Adding actions

To add a new inline action, edit the `actions` array in `command-palette.js`:

```js
const actions = [
  // …existing actions
  {
    label: 'Lock screen',
    keywords: 'lock screen sleep away',
    action: () => { window.location.href = 'lock_screen.html'; }
  },
  {
    label: 'New customer',
    keywords: 'new customer create add',
    action: () => showModal({ … })
  }
];
```

Action shape:

```ts
type CommandAction = {
  label: string;
  keywords: string;            // space-separated, lowercase, included in fuzzy match
  action: () => void;          // run when selected
}
```

## Programmatic open / close

```js
import { openCommandPalette, closeCommandPalette } from './v4/command-palette.js';

// Open from a button click, not just from ⌘K
button.addEventListener('click', openCommandPalette);

// Close on route change (if you ever add SPA-style nav)
closeCommandPalette();
```

## Customizing the UI

The palette uses these CSS classes (defined in [`_components.scss`](../src/scss/v4/_components.scss)):

| Class | Element |
| --- | --- |
| `.command-palette-backdrop` | Full-screen overlay |
| `.command-palette` | The dialog itself |
| `.command-palette-input` | Search input at the top |
| `.command-palette-list` | Results list |
| `.command-palette-item` | One row |
| `.command-palette-item.active` | Highlighted row (keyboard / hover) |
| `.command-palette-section` | Section label (e.g. "Apps") |

To restyle, override these in your own SCSS partial.

## Adding section / group results

The palette groups results by `section`. By default, pages use their NAV group as the section ("General", "Apps", …) and actions are all under "Actions".

To add a new section (e.g. recent docs, customers, projects from a search API):

1. Push items with `{ kind: 'doc', section: 'Documents', label, href, keywords }` into the `items` array.
2. Optionally make the fetch lazy — re-fetch when the input has more than, say, 2 characters and the kind is `'remote'`.

The renderer in `command-palette.js`'s `render()` function uses the `section` field to insert section headers between groups of items.

## Triggering from the topbar

The topbar's "Search…" placeholder is a button that calls `openCommandPalette()`. Look for the search-trigger button in [`src/v4/shell-render.js`](../src/v4/shell-render.js) — that's where the click handler is wired up at runtime via [`src/v4/shell.js`](../src/v4/shell.js).

## Disabling

If you don't want the palette:

1. Remove `initCommandPalette()` from [`src/main-v4.js`](../src/main-v4.js).
2. Remove the search button from the topbar in [`src/v4/shell-render.js`](../src/v4/shell-render.js).
3. (Optional) Delete `src/v4/command-palette.js`.

The bundle shrinks by ~3 KB.

## Where to look

- [`src/v4/command-palette.js`](../src/v4/command-palette.js) — full implementation
- [`production/playground.html`](../production/playground.html) — try it out
- [`src/v4/shell-render.js`](../src/v4/shell-render.js) — `NAV` source data
