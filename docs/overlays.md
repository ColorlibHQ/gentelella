# Overlays

Modals, toasts, popover menus, and slide-out panels. Four helpers — no third-party UI library, no Bootstrap JS.

All overlays handle the boring parts for you: backdrop click, Escape key, focus trap, focus return, ARIA roles. You provide content; they provide behavior.

## `showModal` — backdropped dialog

```js
import { showModal } from './v4/modal.js';

showModal({
  title: 'Delete project?',
  body: 'This action cannot be undone.',
  actions: [
    { label: 'Cancel', variant: 'outline' },
    { label: 'Delete', variant: 'danger', action: () => deleteProject(id) }
  ]
});
```

### Options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `string` | — | Header text |
| `body` | `string \| HTMLElement` | `''` | Modal body. String is set via `innerHTML`; HTMLElement is appended |
| `actions` | `Action[]` | `[]` | Footer buttons (see below) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dialog width |
| `onClose` | `() => void` | — | Called when the modal closes (any reason) |

### Action shape

```ts
type Action = {
  label: string;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';  // default 'outline'
  action?: (ctx: { dialog, body, close }) => false | void;  // return false to keep modal open
  closeOnAction?: boolean;  // default true
}
```

If `action()` returns `false`, the modal stays open (use this for validation failures). Otherwise the modal closes after the handler runs.

### Body as HTML

```js
showModal({
  title: 'Edit user',
  body: `
    <form id="edit-user-form" class="form-stack">
      <label class="field">
        <span class="label">Name</span>
        <input class="input" name="name" value="Jane Smith">
      </label>
      <label class="field">
        <span class="label">Email</span>
        <input class="input" name="email" type="email" value="jane@example.com">
      </label>
    </form>
  `,
  actions: [
    { label: 'Cancel', variant: 'outline' },
    { label: 'Save', variant: 'primary', action: ({ body, close }) => {
        const form = body.querySelector('#edit-user-form');
        if (!form.reportValidity()) return false;   // keep open if invalid
        saveUser(new FormData(form));
        // modal auto-closes
    }}
  ]
});
```

### Body as DOM element

```js
const content = document.createElement('div');
content.innerHTML = '<p>Dynamic content</p>';

showModal({ title: 'Hello', body: content });
```

### Programmatic close

```js
import { closeModal, isModalOpen } from './v4/modal.js';

if (isModalOpen()) closeModal();
```

### Accessibility

- `role="dialog"` + `aria-modal="true"`
- `aria-label` set from the title
- Focus moves into the dialog on open (first focusable element)
- Tab is trapped inside while open
- Focus restored to the trigger on close
- Backdrop click + Escape + close button all dismiss

## `showToast` — transient notifications

```js
import { showToast } from './v4/toast.js';

showToast('Saved');
showToast('Failed to save', { variant: 'error' });
showToast('Heads up', { variant: 'info', duration: 5000 });
```

### Options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'success' \| 'error' \| 'info'` | `'default'` | Color and icon |
| `duration` | `number` (ms) | `2600` | Auto-dismiss delay; click also dismisses |

Stacks at the top-right of the viewport. Each toast self-removes on the `transitionend` after `duration`. Click dismisses early.

ARIA: the host container has `role="status"` and `aria-live="polite"` so screen readers announce new toasts without interrupting.

### Returns

The toast element, in case you want to dismiss early:

```js
const t = showToast('Uploading…', { duration: 60000 });
upload().finally(() => t.remove());
```

## `openMenu` — popover menu

Right-click-style context menu anchored to a trigger button.

```js
import { openMenu } from './v4/menus.js';

button.addEventListener('click', () => {
  openMenu(button, [
    { label: 'Edit',      action: () => editItem() },
    { label: 'Duplicate', action: () => duplicateItem() },
    '-',  // separator
    { label: 'Delete',    action: () => deleteItem() }
  ]);
});
```

### Item shape

```ts
type MenuItem =
  | { label: string; action?: () => void; disabled?: boolean; icon?: string }
  | '-'  // separator
```

One menu open at a time. Outside-click, Escape, or scroll closes it.

### `DEFAULT_CARD_MENU`

Common card-options menu (Refresh, Move up, Move down, Hide card) — drop in for any card without writing your own list:

```js
import { openMenu, DEFAULT_CARD_MENU } from './v4/menus.js';

btn.addEventListener('click', () => openMenu(btn, DEFAULT_CARD_MENU));
```

The Refresh item briefly shimmers the card and re-emits `themechange` so any embedded chart redraws. Move up / Move down reorder the card within its parent. Hide card removes it with a fade and shows an undo toast.

### Programmatic close

```js
import { closeMenu } from './v4/menus.js';
closeMenu();
```

## `openPanel` — slide-out side panel

For larger drill-down content that doesn't deserve a modal. Slides in from the right.

```js
import { openPanel } from './v4/menus.js';

button.addEventListener('click', () => {
  openPanel(button, `
    <div class="panel-header">
      <h2>Notifications</h2>
      <button class="panel-close">×</button>
    </div>
    <div class="panel-body">
      <!-- content -->
    </div>
  `, { width: '380px' });
});
```

### Options

| Option | Default | Purpose |
| --- | --- | --- |
| `width` | `'320px'` | Panel width |
| `onClose` | — | Called when the panel closes |

Outside-click and Escape dismiss. The Notifications and Messages panels in the topbar use this.

## Choosing between them

| Use case | Helper |
| --- | --- |
| Confirmation prompt with OK/Cancel | `showModal` |
| Form in a popup | `showModal` |
| "Saved" / "Failed" feedback | `showToast` |
| Card-options ⋯ menu | `openMenu` |
| Right-click context | `openMenu` |
| Notifications drawer | `openPanel` |
| User account menu | `openMenu` |

## What you don't have to do

These helpers handle:

- Backdrop element creation + removal
- Click-outside-to-close detection
- Escape key handling
- Body scroll lock (modals)
- Focus trap (modals)
- Focus return to the trigger
- ARIA roles + labels
- Transition timing (no premature DOM removal)

You write content. They handle the boring 200 lines per overlay.

## Custom overlays

If you need something the helpers don't cover (e.g. a tooltip), use the same patterns:

- Append to `document.body`
- Add a single global Escape listener with a cleanup function
- Use `aria-live` (toast) or `role="dialog"` (modal) appropriately
- Capture and restore focus

[`src/v4/modal.js`](../src/v4/modal.js) is the cleanest reference — under 200 lines, no dependencies.

## Where to look

- [`src/v4/modal.js`](../src/v4/modal.js)
- [`src/v4/toast.js`](../src/v4/toast.js)
- [`src/v4/menus.js`](../src/v4/menus.js)
- Live examples: [`production/playground.html`](../production/playground.html) — buttons that trigger every overlay variant
