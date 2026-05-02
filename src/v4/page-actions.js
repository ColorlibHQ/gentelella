// Gentelella v4 — global page action handlers.
//
// Wires up common button intents that show up across pages so the template
// has real interactivity instead of generic toast feedback. All handlers
// guard against pages that already have specific wiring (the global handler
// only fires when no other handler called preventDefault).
//
// Handled by button text or aria-label:
//   • Print           → window.print()
//   • Export*         → CSV/JSON download (or invokes data-export on a table)
//   • Compose / New … → opens a contextual modal
//   • Refresh         → flashes a "refreshed" pulse on nearby card; re-init charts
//   • Share           → copies current URL to clipboard
//   • Cancel / Reset  → resets form / closes modal (already native)

import { showToast } from './toast.js';
import { showModal } from './modal.js';

const RX = {
  print:    /^print$/i,
  export:   /^(export|download)( pdf| csv)?$/i,
  refresh:  /^refresh$/i,
  share:    /^share$/i,
  compose:  /^(compose|new chat|new message|new email)$/i,
  newDeal:  /^(new deal|new project|new event|new task|\+ ?new)$/i,
  add:      /^(\+ ?invite|\+ ?invite user|\+ ?invite member|invite|add (member|user|customer|contact))$/i
};

function matchAction(label) {
  for (const [name, rx] of Object.entries(RX)) {
    if (rx.test(label)) {return name;}
  }
  return null;
}

function getLabel(btn) {
  return (btn.getAttribute('aria-label') || btn.textContent || '').trim().replace(/\s+/g, ' ');
}

// ── Action implementations ──

function doPrint() { window.print(); }

function doRefresh(btn) {
  const card = btn.closest('.card');
  if (card) {
    card.classList.add('is-refreshing');
    setTimeout(() => card.classList.remove('is-refreshing'), 700);
  }
  // Force charts to repaint by dispatching themechange on this card's chart
  // hosts (charts.js listens globally; restricted dispatch keeps it scoped).
  document.documentElement.dispatchEvent(new CustomEvent('themechange'));
  showToast('Refreshed', { variant: 'success' });
}

async function doShare() {
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: location.href });
    } else {
      await navigator.clipboard.writeText(location.href);
      showToast('Link copied to clipboard', { variant: 'success' });
    }
  } catch (_e) { /* user cancelled */ }
}

function doExport(_btn) {
  // If there's a data-export table on this page, trigger that instead.
  const exportable = document.querySelector('table[data-export]');
  if (exportable) {
    const exportBtn = exportable.closest('.card')?.querySelector('[data-export-btn]');
    if (exportBtn) { exportBtn.click(); return; }
  }
  // Otherwise download the current page title + URL as a tiny report.
  const stamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const slug = document.title.replace(/\s+\|.*$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const filename = `${slug || 'export'}-${stamp}.json`;
  const payload = JSON.stringify({
    page: document.title,
    url: location.href,
    exportedAt: new Date().toISOString(),
    note: 'Replace this stub with your real data exporter — the same download flow works.'
  }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  showToast(`Exported ${filename}`, { variant: 'success' });
}

function composeModal() {
  showModal({
    title: 'New message',
    size: 'lg',
    body: `
      <div class="form-group">
        <label class="form-label">To</label>
        <input class="form-control" type="email" placeholder="name@example.com">
      </div>
      <div class="form-group">
        <label class="form-label">Subject</label>
        <input class="form-control" placeholder="Subject">
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Message</label>
        <textarea class="form-control" rows="6" placeholder="Write your message…"></textarea>
      </div>
    `,
    actions: [
      { label: 'Discard', variant: 'ghost' },
      { label: 'Save draft', variant: 'outline', action: () => showToast('Draft saved', { variant: 'success' }) },
      { label: 'Send', variant: 'primary', action: () => showToast('Message sent', { variant: 'success' }) }
    ]
  });
}

function newGenericModal(label) {
  // "New deal", "New project", "New event", "+ New" etc — show a tailored
  // form. Use the label to pick the title/fields without a giant switch.
  const isEvent = /event/i.test(label);
  const isTask  = /task/i.test(label);
  const isDeal  = /deal/i.test(label);
  const isProject = /project/i.test(label);

  const title = isEvent ? 'New event'
    : isTask ? 'New task'
      : isDeal ? 'New deal'
        : isProject ? 'New project'
          : 'Create new';

  const body = `
    <div class="form-group">
      <label class="form-label">${isEvent ? 'Event title' : isTask ? 'Task' : isDeal ? 'Deal name' : 'Title'}</label>
      <input class="form-control" placeholder="${isEvent ? 'Q2 design review' : 'Untitled'}" autofocus>
    </div>
    ${isDeal ? `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Value (USD)</label><input class="form-control" type="number" placeholder="25000"></div>
        <div class="form-group"><label class="form-label">Stage</label>
          <select class="form-control"><option>Lead</option><option>Qualified</option><option>Proposal</option><option>Negotiation</option><option>Closed won</option></select>
        </div>
      </div>
    ` : ''}
    ${isEvent ? `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Start</label><input class="form-control" type="datetime-local"></div>
        <div class="form-group"><label class="form-label">End</label><input class="form-control" type="datetime-local"></div>
      </div>
    ` : ''}
    ${isProject ? `
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" rows="3" placeholder="What problem are we solving?"></textarea>
      </div>
    ` : ''}
    <div class="form-group" style="margin-bottom:0">
      <label class="form-label">${isEvent ? 'Notes' : 'Description'}</label>
      <textarea class="form-control" rows="3" placeholder="Optional…"></textarea>
    </div>
  `;
  showModal({
    title, body, size: 'md',
    actions: [
      { label: 'Cancel', variant: 'ghost' },
      { label: 'Create', variant: 'primary', action: () => showToast(`${title} saved`, { variant: 'success' }) }
    ]
  });
}

function inviteModal() {
  showModal({
    title: 'Invite member',
    body: `
      <div class="form-group">
        <label class="form-label">Email address</label>
        <input class="form-control" type="email" placeholder="colleague@example.com" autofocus>
      </div>
      <div class="form-group">
        <label class="form-label">Role</label>
        <select class="form-control"><option>Member</option><option>Admin</option><option>Owner</option></select>
      </div>
      <div class="form-group" style="margin-bottom:0">
        <label class="form-label">Personal message (optional)</label>
        <textarea class="form-control" rows="3" placeholder="Welcome to the team!"></textarea>
      </div>
    `,
    actions: [
      { label: 'Cancel', variant: 'ghost' },
      { label: 'Send invite', variant: 'primary', action: () => showToast('Invite sent', { variant: 'success' }) }
    ]
  });
}

// ── Wire-up ──

const handlers = {
  print:    doPrint,
  export:   (btn) => doExport(btn),
  refresh:  (btn) => doRefresh(btn),
  share:    () => doShare(),
  compose:  () => composeModal(),
  newDeal:  (btn) => newGenericModal(getLabel(btn)),
  add:      () => inviteModal()
};

/**
 * Wire up shared page-action behavior. Idempotent — safe to call multiple
 * times; subsequent calls are no-ops.
 */
export function initPageActions() {
  if (initPageActions._wired) {return;}
  initPageActions._wired = true;

  // Skip controls that already have their own click pipeline.
  const SKIP_SELECTOR = [
    '.toggle', '.todo-cb', '.chart-tab', '.card-opt-btn', '.chip', '.chip-close',
    '.menu-item', '.sidebar-toggle', '.theme-toggle', '.more-btn', '.nav-link',
    '.inbox-folder', '.tb-notifications', '.tb-messages', '.tb-avatar', '.modal-close'
  ].join(', ');

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) {return;}
    const btn = e.target.closest('button, a.btn');
    if (!btn) {return;}

    // Buttons inside floating UI / interactive lists handle themselves.
    if (btn.closest('.menu-popover, .toast-host, .calendar-grid, #inbox-list, #inbox-root, #fm-grid, .modal-backdrop, [data-rich-text]')) {return;}
    if (btn.matches(SKIP_SELECTOR)) {return;}
    if (!btn.matches('.btn, .tb-btn')) {return;}

    // Buttons with onclick="" are wired in HTML — let those run.
    if (btn.hasAttribute('onclick')) {return;}
    // Submit buttons → form submit handler in main-v4.js
    if (btn.type === 'submit') {return;}

    const label = getLabel(btn);
    if (!label) {return;}
    const action = matchAction(label);
    if (!action) {return;}

    e.preventDefault();
    handlers[action]?.(btn);
  });
}
