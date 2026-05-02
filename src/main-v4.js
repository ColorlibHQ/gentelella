// Gentelella 2026 v4 — entry
// Self-contained dashboard skin. Loads only the v4 design system.

import './scss/v4/main.scss';
import { mountShell } from './v4/shell.js';
import { initCharts } from './v4/charts.js';
import { initTables } from './v4/tables.js';
import { openMenu, DEFAULT_CARD_MENU } from './v4/menus.js';
import { initCommandPalette } from './v4/command-palette.js';
import { initPageActions } from './v4/page-actions.js';

mountShell();
initCharts();
initTables();
initCommandPalette();
initPageActions();

// Service worker — only in production builds (skip on dev so HMR isn't fought
// by the cache). Path uses Vite's BASE_URL so subpath deploys (e.g.
// preview.colorlib.com/theme/foo/) register the SW at the right scope.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swPath = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swPath).catch(() => { /* ignore */ });
  });
}

// Lazy-load page-specific modules only when their host element is on the page.
if (document.getElementById('inbox-root')) {
  import('./v4/inbox.js').then((m) => m.initInbox());
}
if (document.querySelector('.calendar-grid')) {
  import('./v4/calendar.js').then((m) => m.initCalendar());
}
if (document.querySelector('.settings-content')) {
  import('./v4/settings.js').then((m) => m.initSettings());
}
if (document.querySelector('[data-date-range], [data-rich-text], [data-multi-select]')) {
  import('./v4/form-controls.js').then((m) => m.initFormControls());
}

// ────────────────────────
//  Delegated interactions
// ────────────────────────

// Toggle switches
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.toggle');
  if (toggle) {toggle.classList.toggle('on');}
});

// Todo checkboxes — toggle .done on the cb + row, then refresh any
// `[data-todo-counter]` element inside the parent card so the "X of Y
// remaining" subtitle stays in sync with the actual checkboxes.
document.addEventListener('click', (e) => {
  const cb = e.target.closest('.todo-cb');
  if (!cb) {return;}
  cb.classList.toggle('done');
  const row = cb.closest('.todo-row');
  if (row) {row.classList.toggle('done');}
  // Update counter text within the same card.
  const card = cb.closest('.card');
  if (!card) {return;}
  const counter = card.querySelector('[data-todo-counter]');
  if (!counter) {return;}
  const all = card.querySelectorAll('.todo-row');
  const done = card.querySelectorAll('.todo-row.done');
  const remaining = all.length - done.length;
  // Format: "<remaining> of <total> remaining" — matches existing copy.
  counter.textContent = `${remaining} of ${all.length} remaining`;
});

// Tab groups: works for any container of .chart-tab buttons (chart cards,
// calendar view switcher, generic tab strips). Adds .active to the clicked
// tab and removes it from siblings in the same parent.
document.addEventListener('click', (e) => {
  const tab = e.target.closest('.chart-tab');
  if (!tab) {return;}
  tab.parentElement.querySelectorAll('.chart-tab').forEach((t) => t.classList.remove('active'));
  tab.classList.add('active');
});

// Card option buttons → popover menu.
// Calendar nav buttons (prev/next month) are also .card-opt-btn but live
// inside .calendar-toolbar; calendar.js stops propagation on those clicks
// so they never reach this handler.
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.card-opt-btn');
  if (!btn) {return;}
  // Skip if the click was already handled (e.g. calendar prev/next).
  if (e.defaultPrevented) {return;}
  e.preventDefault();
  openMenu(btn, DEFAULT_CARD_MENU);
});

// Chip dismiss (× icon) and chip toggle.
document.addEventListener('click', (e) => {
  const closer = e.target.closest('.chip-close');
  if (closer) {
    const chip = closer.closest('.chip');
    if (chip) {
      chip.style.transition = 'opacity 150ms, transform 150ms';
      chip.style.opacity = '0';
      chip.style.transform = 'scale(0.85)';
      setTimeout(() => chip.remove(), 160);
    }
    return;
  }
  const chip = e.target.closest('.chip');
  if (chip) {chip.classList.toggle('active');}
});

// Form submit — let HTML5 validation run, then fake-submit on valid forms.
// Lazy-imports the toast helper so the dependency stays out of the entry chunk.
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (!(form instanceof HTMLFormElement)) {return;}
  // Native :invalid forms still get the browser's validation UI before we
  // see the submit event, so reaching here means the form is already valid.
  e.preventDefault();
  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
  const label = (submitBtn?.textContent || submitBtn?.value || 'Saved').trim();
  import('./v4/toast.js').then(({ showToast }) => showToast(`${label} ✓`, { variant: 'success' }));
  if (form.dataset.resetOnSubmit !== 'false') {form.reset();}
});

// Topbar search box opens the command palette — wired by initCommandPalette.
// Page-actions (Print / Export / Compose / Add / etc.) wired via initPageActions.
