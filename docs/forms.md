# Forms

v4 ships standard form inputs styled to match the design system plus three custom controls (date range, multi-select, rich text editor) that opt in via data attributes.

Live demos: [`production/form.html`](../production/form.html), [`production/form_advanced.html`](../production/form_advanced.html), [`production/form_validation.html`](../production/form_validation.html), [`production/form_wizards.html`](../production/form_wizards.html), [`production/form_upload.html`](../production/form_upload.html).

## Standard inputs

```html
<div class="form-group">
  <label class="form-label" for="email">Email <span class="required">*</span></label>
  <input type="email" id="email" class="form-control" name="email" placeholder="you@example.com" required>
  <div class="form-help">We'll never share your email.</div>
</div>
```

| Class | Purpose |
| --- | --- |
| `.form-group` | Wraps a label + input + help as a vertical stack |
| `.form-label` | Form label |
| `.form-label .required` | Inline red asterisk on required fields |
| `.form-control` | Text input (any `<input>` type, plus `<textarea>` and `<select>`) |
| `.form-help` | Subtle help text under the input |
| `.form-error` | Error message (paired with `.form-control.is-invalid`) |
| `.form-row` | Multi-column row of fields; add `.cols-3` for three columns |
| `.form-actions` | Button row at the bottom of a form (add `.right` to right-align) |

### Textareas

```html
<div class="form-group">
  <label class="form-label" for="notes">Notes</label>
  <textarea id="notes" class="form-control" rows="4"></textarea>
</div>
```

Set `rows="N"` for a desired height — v4 doesn't impose a min-height the way Bootstrap does.

### Selects

```html
<div class="form-group">
  <label class="form-label" for="country">Country</label>
  <select id="country" class="form-control">
    <option>United States</option>
    <option>Latvia</option>
    <option>Japan</option>
  </select>
</div>
```

Native `<select>` is fine. For multi-select, use the custom control below.

### Inputs with prefix or suffix

```html
<div class="form-group">
  <label class="form-label" for="price">Price</label>
  <div class="input-affix">
    <span class="affix prefix">$</span>
    <input type="number" id="price" class="form-control" placeholder="0.00">
    <span class="affix">.00</span>
  </div>
</div>
```

The leading affix gets `.affix.prefix`; trailing affixes are just `.affix`. For an input with a leading **icon** (e.g. a search magnifying glass), use `.input-group` with `.input-icon` instead — see [`_forms.scss`](../src/scss/v4/_forms.scss).

### Checkboxes and radios

```html
<label class="form-check">
  <input type="checkbox" name="terms">
  <span>I agree to the terms</span>
</label>

<label class="form-check">
  <input type="radio" name="plan" value="pro">
  <span>Pro plan</span>
</label>
```

## Validation

HTML5 native validation works out of the box (`required`, `type="email"`, `pattern`, `min`/`max`, `minlength`). The browser's bubble UI is fine for simple cases.

For inline error messages, add `.is-invalid` to the input and render a `.form-error` below it:

```html
<div class="form-group">
  <label class="form-label" for="email">Email</label>
  <input type="email" id="email" class="form-control is-invalid" value="invalid">
  <div class="form-error">Please enter a valid email.</div>
</div>
```

Or use `reportValidity()` from your submit handler:

```js
form.addEventListener('submit', (e) => {
  if (!form.reportValidity()) {
    e.preventDefault();
    return;
  }
  // submit handler
});
```

The full example with validation states is [`production/form_validation.html`](../production/form_validation.html).

## Form wizard

A 6-step wizard with progress indicator lives at [`production/form_wizards.html`](../production/form_wizards.html). Copy the markup pattern — the step navigation is delegated event handling on `.wizard-step` buttons.

## Upload (drag-and-drop)

[`production/form_upload.html`](../production/form_upload.html) — drop zone with file preview. Standard `<input type="file">` under the hood with a click-and-drag overlay.

## Custom controls

Three opt-in form controls. Each is rendered into a wrapper element by [`src/v4/form-controls.js`](../src/v4/form-controls.js) when the page has the relevant `data-*` attribute. Module is lazy-loaded only when needed.

### Date range picker

The wrap must contain a single `<input>` — the picker makes it `readOnly` and writes the resolved range into its `value`:

```html
<div class="form-group">
  <label class="form-label" for="range">Date range</label>
  <div data-date-range>
    <input type="text" id="range" name="range" class="form-control" placeholder="Pick a range">
  </div>
</div>
```

Clicking the input opens a popover with month navigation and 6 presets: **Today**, **Last 7 days**, **Last 30 days**, **This month**, **Last month**, **This year**. Picking a range fires `change` on the wrap (not on the input) with the dates in `event.detail`:

```js
wrap.addEventListener('change', (e) => {
  console.log(e.detail);  // { from: Date, to: Date }
});
```

The widget doesn't read initial `data-from` / `data-min` / `data-max` attributes — it starts empty. For an initial value, set the `<input>`'s `value` to a display string before init and call `initFormControls()` again; for min/max constraints, fork `initDateRange` in [`src/v4/form-controls.js`](../src/v4/form-controls.js).

### Multi-select

Options can come from a child `<select multiple>` (keeps native form submission working) or from a `data-options="a,b,c"` attribute:

```html
<!-- Option A: native select (preferred when in a form) -->
<div class="form-group">
  <label class="form-label" for="tags">Tags</label>
  <div data-multi-select>
    <select id="tags" multiple>
      <option value="urgent">Urgent</option>
      <option value="bug">Bug</option>
      <option value="feature" selected>Feature</option>
      <option value="design">Design</option>
    </select>
  </div>
</div>

<!-- Option B: data-options when you don't need form submission -->
<div data-multi-select data-options="urgent,bug,feature,design"></div>
```

The widget hides the native `<select>` (when present) and renders a chip-style multi-select with search. Form submission uses the underlying select; selections fire `change` on both the underlying `<select>` (bubbles) and the wrap (with `detail.values`):

```js
wrap.addEventListener('change', (e) => {
  if (e.detail?.values) {
    console.log(e.detail.values);  // ['feature', 'design']
  }
});
```

### Rich text editor

```html
<div class="form-group">
  <label class="form-label" for="description">Description</label>
  <div data-rich-text>
    <textarea id="description" name="description">Initial content as HTML</textarea>
  </div>
</div>
```

A lightweight contenteditable editor with **B / I / U / Heading / Quote / bulleted list / numbered list** buttons (and ⌘B/I/U shortcuts via `document.execCommand`). The toolbar is rendered into the wrap; the underlying `<textarea>` stays in the DOM so standard form submission keeps working.

The editor mirrors its content into the textarea on every keystroke and fires an `input` event on the wrap with the HTML in `event.detail`:

```js
wrap.addEventListener('input', (e) => {
  console.log(e.detail);  // current innerHTML string
});
```

**Note**: this is a deliberately minimal editor for simple cases. It uses `document.execCommand`, which is deprecated but still works everywhere; output is whatever the browser produces. If you need tables, embeds, collaborative editing, or rigorous pasted-HTML sanitization, swap in [TipTap](https://tiptap.dev/) or [Quill](https://quilljs.com/). v2 shipped Quill — it was dropped from v4 for size.

## Lazy loading

[`src/v4/form-controls.js`](../src/v4/form-controls.js) is only imported when at least one of `[data-date-range]`, `[data-rich-text]`, or `[data-multi-select]` is on the page. The lazy-import block in [`src/main-v4.js`](../src/main-v4.js):

```js
if (document.querySelector('[data-date-range], [data-rich-text], [data-multi-select]')) {
  import('./v4/form-controls.js').then((m) => m.initFormControls());
}
```

So a page with plain inputs only doesn't pay for the custom controls.

## Programmatic init

If you add a custom-control wrapper to the DOM after page load (e.g. inside a modal), re-run init:

```js
import { initFormControls } from './v4/form-controls.js';
initFormControls();
```

It's idempotent — already-initialized wrappers are skipped.

## File upload buttons

```html
<label class="btn btn-outline">
  <input type="file" hidden>
  Choose file
</label>
```

For drag-and-drop, see [`production/form_upload.html`](../production/form_upload.html).

## Where to look

- [`src/v4/form-controls.js`](../src/v4/form-controls.js) — custom controls
- [`src/scss/v4/_forms.scss`](../src/scss/v4/_forms.scss) — input styles
- All `production/form_*.html` pages — live examples
