# RTL (right-to-left)

Gentelella v4 supports right-to-left layouts for Arabic, Hebrew, Persian, and Urdu.

## Turning it on

Set `dir` on the root element:

```html
<html lang="ar" dir="rtl">
```

That's the whole API. Every layout, spacing, and alignment rule flips.

To let users switch at runtime — and have the choice survive a reload without a flash of the wrong direction — write it to `localStorage` under the `dir` key:

```js
localStorage.setItem('dir', 'rtl');
document.documentElement.setAttribute('dir', 'rtl');
```

The pre-paint script in `vite.config.js` reads that key and applies `dir` to `<html>` before the body renders, exactly as it does for the theme. Valid values are `'rtl'` and `'ltr'`; anything else is ignored and the document's own `dir` stands.

## How it works

The styling is built on **CSS logical properties**, so direction is handled by the browser rather than by a mirrored stylesheet:

| Physical | Logical |
| --- | --- |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `border-left` / `border-right` | `border-inline-start` / `border-inline-end` |
| `left:` / `right:` | `inset-inline-start` / `inset-inline-end` |
| `text-align: left` / `right` | `text-align: start` / `end` |
| `border-top-left-radius` (and friends) | `border-start-start-radius` (and friends) |

There is no separate `rtl.css` to keep in sync, and no build step that mirrors a stylesheet — one set of rules serves both directions.

[`_rtl.scss`](../src/scss/v4/_rtl.scss) exists only for the handful of properties with no logical equivalent:

- **`translateX()`** — transforms are physical by definition (sidebar drawer, slide-out drawer, switch and toggle knobs, rail flyout labels)
- **`background-position`** — the native select arrow
- **`box-shadow`** offsets — the drawer's edge shadow
- **Chevrons** that point along the inline axis

## Writing new styles

Use logical properties and new components work in both directions for free:

```scss
.my-card {
  padding-inline-start: 16px;   // not padding-left
  border-inline-end: 1px solid var(--border);
  text-align: start;            // not text-align: left
}
```

Two patterns are worth knowing:

**Centring is direction-neutral — don't convert it.** `left: 50%` paired with `translateX(-50%)` is correct in both directions. Rewriting it to `inset-inline-start: 50%` breaks RTL, because the offset flips while the transform doesn't.

```scss
.centred {
  left: 50%;                    // stays physical — this is correct
  transform: translateX(-50%);
}
```

**Vertical rotation is direction-neutral too.** A chevron that points *down* when open should not be overridden for RTL; only the closed state, which points along the inline axis, needs mirroring.

## What isn't mirrored

- **Charts.** ECharts renders its own canvas; axis and legend placement is unchanged. Pass ECharts its own options if you need mirrored axes.
- **Latin text inside an RTL page.** English strings in an RTL container reorder per the Unicode bidi algorithm (`4 of 6 remaining` renders as `of 6 remaining 4`). That's correct bidi behaviour, not a layout bug — it resolves once the content is genuinely RTL. Wrap mixed-direction runs in `<bdi>` or an element with an explicit `dir` if you need to pin them.
- **Icons that aren't directional.** Only chevrons and arrows along the inline axis are flipped; a search or trash icon is not mirrored.

## Verifying a change

LTR rendering must not shift when logical properties are introduced — in a left-to-right document they compute identically to the physical ones they replace. The conversion in this repo was gated on exactly that: 12 representative pages screenshotted before and after and compared by hash, all pixel-identical.
