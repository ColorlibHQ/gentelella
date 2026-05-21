# Theming

Everything visual in v4 — colors, spacing, radii, shadows, fonts, sidebar dimensions — is a **CSS custom property** in [`src/scss/v4/_tokens.scss`](../src/scss/v4/_tokens.scss). Change one variable, every chart, button, badge, link, and active state updates.

## The token file

```scss
:root {
  --primary: #1ABB9C;          // Teal — Gentelella's signature
  --primary-dk: #169f85;
  --primary-lt: rgba(26,187,156,0.06);

  --sidebar-bg: #1a2332;       // The dark navy sidebar
  --sidebar-w: 252px;

  --body-bg: #f5f7fb;
  --bg-surface: #ffffff;       // Card backgrounds
  --bg-surface-secondary: #f9fafb;

  --text: #1e2633;
  --text-secondary: #626d7d;
  --text-muted: #7e8896;

  --blue: #066fd1;
  --green: #2fb344;
  --yellow: #f59f00;
  --red: #d63939;
  --purple: #ae3ec9;
  // …more colors

  --radius: 6px;
  --radius-sm: 4px;
  --radius-lg: 8px;

  --space-1: 4px;              // Spacing scale — matches Tailwind's mental model
  --space-2: 8px;              // (--space-4 = 16px, like Tailwind's p-4)
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --shadow-card: 0 0 0 1px var(--border-translucent), rgba(30,38,51,0.04) 0 2px 4px 0;

  --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size: 0.875rem;
}

[data-theme="dark"] {
  --body-bg: #0f1623;
  --bg-surface: #1a2332;
  --text: #e6ebf2;
  // …
}
```

Edit `:root`, save, the dev server hot-reloads.

## Changing the brand color

Want a different primary?

```scss
:root {
  --primary: #6366f1;          // indigo
  --primary-dk: #4f46e5;
  --primary-lt: rgba(99,102,241,0.06);
}
```

Three updates handle everything: buttons, badges, active nav, focus rings, all 20 chart variants, the donut center, the gauge needle, the kanban WIP indicator. Charts re-read `--primary` via `getComputedStyle(...)` at init time, so a hard reload is all you need.

For dark mode, the same `--primary-lt` reference needs a slightly different alpha because dark surfaces require more contrast:

```scss
[data-theme="dark"] {
  --primary-lt: rgba(99,102,241,0.14);
}
```

## Dark mode

Dark mode is the default `prefers-color-scheme`-aware mode. A pre-paint inline script (in [vite.config.js](../vite.config.js)'s shell-injection plugin) reads `localStorage.theme` and sets `data-theme` on `<html>` *before* the body renders:

```html
<script>(function(){
  try {
    var t = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = t || (d ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();</script>
```

The toggle in the topbar flips the attribute and persists it. **No flash, no JS-rendered fallback.**

To customize dark mode, edit the `[data-theme="dark"]` block in `_tokens.scss`:

```scss
[data-theme="dark"] {
  --body-bg: #0f1623;
  --bg-surface: #1a2332;
  --bg-surface-secondary: #141d2b;
  --border-color: rgba(255,255,255,0.08);
  --text: #e6ebf2;
  --text-secondary: #b3bccb;
  --text-muted: #8a93a3;
  // …
}
```

### Force a theme

Override the pre-paint script if you want to lock a theme:

```html
<script>document.documentElement.setAttribute('data-theme', 'light');</script>
```

Set this *after* the pre-paint script to win the cascade.

## Spacing tokens

`--space-1` through `--space-8` are the spacing scale. Use them instead of raw pixels:

```scss
.my-card {
  padding: var(--space-4);          // 16px
  gap: var(--space-3);              // 12px
  margin-bottom: var(--space-5);    // 24px
}
```

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |

Six steps cover ~95% of UI needs. Off-scale values (like 14px between two specific labels) should be the exception.

## Radii and shadows

```scss
:root {
  --radius-sm: 4px;            // Inputs, small chips
  --radius: 6px;               // Buttons, cards, badges (default)
  --radius-lg: 8px;            // Modals, big cards

  --shadow: rgba(30,38,51,0.04) 0 2px 4px 0;
  --shadow-card: 0 0 0 1px var(--border-translucent), rgba(30,38,51,0.04) 0 2px 4px 0;
}
```

The card shadow is built as a border + a near-invisible drop. Cards feel pinned without looking heavy. Adjust `var(--border-translucent)` alpha to taste.

## Sidebar dimensions

```scss
:root {
  --sidebar-w: 252px;          // Expanded width
  --sidebar-bg: #1a2332;       // Dark navy
}
```

Want a wider sidebar? Change `--sidebar-w`. The `<main>` gets a `margin-left: var(--sidebar-w)` and updates automatically. The collapsed (rail / icon-only) width is set directly in [`_layout.scss`](../src/scss/v4/_layout.scss) under the `body.sidebar-rail .sidebar` rule — edit it there if you want a different rail size.

## Fonts

```scss
:root {
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace;
  --font-size: 0.875rem;       // 14px base
  --line-height: 1.4286;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
}
```

To swap Inter for another font:

1. Replace the Google Fonts `<link>` tag in each `production/*.html` (or remove it and use a system font stack).
2. Update `--font` in `_tokens.scss`.

For a self-hosted font, drop the files in `public/fonts/` and add an `@font-face` block at the top of `main.scss`.

## The live theme generator

[`production/theme.html`](../production/theme.html) is a fully functional UI for picking a primary color and previewing it in real time across stat cards, charts, buttons, and the active nav. Click **Download SCSS tokens** and you get a paste-ready `_tokens.scss` override.

Implementation: it writes to `:root` style properties via `document.documentElement.style.setProperty('--primary', value)`, then dispatches a `themechange` CustomEvent on `document.documentElement`. The chart initialiser listens for that event (and for `data-theme` mutations) and re-builds every chart with the fresh token values.

Useful for client demos — "send me the brand color" → paste hex → screenshot.

## ECharts theme integration

Charts read tokens at init time. The pattern lives in [`src/v4/charts.js`](../src/v4/charts.js):

```js
const tokens = () => {
  const cs = getComputedStyle(document.documentElement);
  return {
    primary: cs.getPropertyValue('--primary').trim(),
    primaryDk: cs.getPropertyValue('--primary-dk').trim(),
    text: cs.getPropertyValue('--text').trim(),
    textMuted: cs.getPropertyValue('--text-muted').trim(),
    // …
  };
};
```

When a chart factory builds its option, it uses these instead of hex literals:

```js
{
  itemStyle: { color: t.primary },
  axisLine:  { lineStyle: { color: t.borderLight } },
  tooltip:   { textStyle: { color: t.text } }
}
```

A `MutationObserver` on `<html data-theme="…">` triggers re-init when the attribute changes — charts swap their colors without a hard reload.

**Add a new chart? Use `t.primary`, `t.text`, etc. Never raw hex.**

## Custom themes via files

If you ship multiple themes (corporate, holiday, dark-blue, …), keep the additional tokens in their own files and toggle via class on `<html>`:

```scss
// src/scss/v4/_theme-corporate.scss
[data-theme="corporate"] {
  --primary: #003366;
  --primary-dk: #00254d;
  --sidebar-bg: #001a33;
}
```

Add to `main.scss`:

```scss
@use 'theme-corporate';
```

Switch via JS:

```js
document.documentElement.setAttribute('data-theme', 'corporate');
localStorage.setItem('theme', 'corporate');
```

The pre-paint script will pick it up on the next reload.

## Reset to defaults

Single edit, full undo:

```bash
git restore src/scss/v4/_tokens.scss
```

Hot reload kicks in. Everything goes back to teal.

## Where to look next

- [components.md](components.md) for the visual primitives (buttons, cards, badges) that consume these tokens
- [charts.md](charts.md) for how factories pull colors from `getComputedStyle`
- [architecture.md](architecture.md) for the pre-paint script and how `data-theme` flows through the build
