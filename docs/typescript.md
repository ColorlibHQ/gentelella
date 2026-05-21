# TypeScript

v4 is written in **vanilla JavaScript**, not TypeScript. But the public JS surface is **fully typed** via a single ambient declarations file at [`types/gentelella.d.ts`](../types/gentelella.d.ts) — so VS Code (and any TypeScript-aware editor) gives you IntelliSense, parameter hints, and inline JSDoc on every helper.

No `tsconfig` required. No rewrite required. Open `src/main-v4.js`, hover over `showModal(...)` — you get the full signature.

## How it works

`package.json` declares:

```json
{
  "types": "types/gentelella.d.ts"
}
```

VS Code (and tsc itself) reads this when the package is installed as a dependency. For the in-repo case, VS Code picks up the file automatically because it lives at the standard location.

The declarations use **module augmentation** to type each module under its own namespace:

```ts
declare module 'gentelella/v4/shell' {
  /** Mount the admin shell. Reads body data attributes. */
  export function mountShell(): void;
}

declare module 'gentelella/v4/modal' {
  interface Action {
    label: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    action?: (ctx: { dialog: HTMLElement; body: HTMLElement; close: () => void }) => false | void;
    closeOnAction?: boolean;
  }

  export function showModal(opts: {
    title?: string;
    body?: string | HTMLElement;
    actions?: Action[];
    size?: 'sm' | 'md' | 'lg';
    onClose?: () => void;
  }): void;

  export function closeModal(opts?: { skipHook?: boolean }): void;
  export function isModalOpen(): boolean;
}
```

What's typed:

- `mountShell` (from `v4/shell`)
- `showModal`, `closeModal`, `isModalOpen` (from `v4/modal`)
- `showToast` (from `v4/toast`)
- `openMenu`, `closeMenu`, `openPanel`, `DEFAULT_CARD_MENU` (from `v4/menus`)
- `initCharts`, the `charts` factory map (from `v4/charts`)
- `initTables` (from `v4/tables`)
- `initCommandPalette`, `openCommandPalette`, `closeCommandPalette` (from `v4/command-palette`)
- `initInbox`, `initKanban`, `initCalendar`, `initFileManager`, `initSettings` (page modules)
- `initFormControls` (from `v4/form-controls`)
- `seedAdapter`, `httpAdapter`, `useApiMode`, `HttpError` (from `v4/data-adapter`)
- `NavItem`, `NavBadge`, `NavParent` types (the `NAV` schema)
- `statTile`, `statusBadge`, `customerCell`, `activityItem`, `banner`, `emptyState`, `skeletonRows`, `escapeHtml` (from `v4/markup`)

## In your editor

Open any source file and hover, ⌘-click to definition, or trigger autocomplete:

```js
import { showModal } from './v4/modal.js';

showModal({
  title: 'Hello',
  //  ┃
  //  ┗━ string | undefined
  body: '...',
  //     ┃
  //     ┗━ string | HTMLElement | undefined
  actions: [
    //   ┃
    //   ┗━ Action[]
    { label: 'OK', variant: 'primary', action: () => true }
    //                       ┃
    //                       ┗━ "primary" | "outline" | "ghost" | "danger" | undefined
  ]
});
```

Mistyped a variant? Squiggle. Misspelled `onClose` as `onclose`? Squiggle.

## Using v4 in a TypeScript project

If you install v4 as an npm dependency in a TypeScript project:

```bash
npm install gentelella
```

```ts
import { mountShell, showModal, showToast } from 'gentelella';
import 'gentelella/scss/v4/main.scss';
import type { Action } from 'gentelella/v4/modal';

mountShell();

const actions: Action[] = [
  { label: 'OK', variant: 'primary', action: () => {} }
];

showModal({ title: 'Hello', actions });
```

Subpath exports work too:

```ts
import { showToast } from 'gentelella/v4/toast';
import { httpAdapter } from 'gentelella/v4/data-adapter';
```

These are declared via the package's `exports` map (in `package.json`) — see `gentelella/v4/*`, `gentelella/scss/*`, `gentelella/types`.

## Adding types for new modules

If you add a new module (`src/v4/reports.js`), give it types in `types/gentelella.d.ts`:

```ts
declare module 'gentelella/v4/reports' {
  export interface ReportConfig {
    range: 'day' | 'week' | 'month';
    metric: string;
  }

  export function initReports(): void;
  export function buildReport(config: ReportConfig): Promise<Blob>;
}
```

VS Code picks it up immediately. No tsc, no codegen.

## Migrating to actual TypeScript

If you want to write `.ts` files in your fork:

1. Install: `npm install --save-dev typescript`
2. Create `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "moduleResolution": "Bundler",
       "strict": true,
       "noEmit": true,
       "allowJs": true,
       "checkJs": false
     },
     "include": ["src/**/*"]
   }
   ```

3. Vite already handles `.ts` files via esbuild. No additional plugin needed.
4. Convert `.js` → `.ts` file-by-file. The ambient declarations in `gentelella.d.ts` continue to work alongside the new TS files.

## Why not write v4 in TypeScript?

- **Smaller surface for contributors.** A static admin template needs JS-developer reach, not TS-only.
- **No build complexity for users.** Drop the dist files into any stack — no `.d.ts` resolution, no compilation step.
- **Type errors via `// @ts-check` if you want them.** Add the comment to the top of any JS file and tsc will type-check it against the declarations.

For all of that, the ambient `.d.ts` gives 95% of the IntelliSense benefit at 5% of the cost.

## JSDoc in source

Module functions in `src/v4/` use JSDoc for parameter docs:

```js
/**
 * Show a transient toast notification at the top-right of the viewport.
 * @param {string} message Text to display.
 * @param {{ variant?: 'default' | 'success' | 'error' | 'info', duration?: number }} [opts]
 * @returns {HTMLDivElement} The toast element.
 */
export function showToast(message, opts = {}) { … }
```

The JSDoc shows up in VS Code's hover-tip. The ambient `.d.ts` provides the strict type-checking layer on top.

## Where to look

- [`types/gentelella.d.ts`](../types/gentelella.d.ts) — the full declaration file
- [`package.json`](../package.json) — `types` field + `exports` map
- [TypeScript Handbook — Declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) — primer
