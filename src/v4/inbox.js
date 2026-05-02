// Inbox — fully interactive mail client for the template demo.
// Self-contained: data, state, and UI all live here. The host page only
// provides an empty <div id="inbox-root"> for us to mount into.
//
// Features:
// - Folders: Inbox / Sent / Drafts / Starred / Trash + four labels
// - Click a message to open it in the reading pane
// - Per-folder counts that update on read/star/move/delete
// - Compose modal (To / Subject / Body) → sends to Sent or saves to Drafts
// - Reply / Forward open compose prefilled
// - Star toggle, archive (move to Inbox→Trash), restore from Trash, delete forever
// - Search across the active folder (subject + body + sender)
// - Keyboard: J/K to navigate, Enter to open, R to reply, # to delete

import { showToast } from './toast.js';
import { showModal } from './modal.js';

// ────────────────────────
//  SEED DATA
// ────────────────────────

let nextId = 1;
const id = () => `msg-${nextId++}`;

/** @type {Array<Message>} */
const seed = [
  // ── Inbox
  m({ folder: 'inbox', unread: true,  starred: true,  label: 'work',     from: 'Sarah K.',     fromEmail: 'sarah@design.co',     subject: 'Re: Q1 design review',          preview: "I've added comments to the figma file. The hero section…", body: "Hey,\n\nI've added comments to the figma file. The hero section needs a tighter type scale, and the donut on the dashboard could use a 2px border to lift it off the surface.\n\nLet me know what you think — I'm around all afternoon.\n\nSarah", time: '9:42 AM' }),
  m({ folder: 'inbox', unread: true,  starred: false, label: 'work',     from: 'GitHub',       fromEmail: 'noreply@github.com', subject: 'PR #248 ready for review',      preview: 'feat(dashboard): wire chart tabs to data source', body: 'Pull request #248 by @aigars is ready for your review.\n\nfeat(dashboard): wire chart tabs to data source\n\n3 files changed, 47 additions, 12 deletions.\n\nView on GitHub →', time: '8:14 AM' }),
  m({ folder: 'inbox', unread: true,  starred: false, label: 'work',     from: 'Stripe',       fromEmail: 'invoicing@stripe.com', subject: 'Your invoice is ready',         preview: 'Invoice #INV-04812 for $499.00 has been generated.', body: 'Invoice #INV-04812\nAmount: $499.00 USD\nDue: Apr 30, 2026\n\nView and pay invoice →\n\nThanks for using Stripe.', time: '7:30 AM' }),
  m({ folder: 'inbox', unread: false, starred: false, label: 'personal', from: 'Michael R.',   fromEmail: 'mike@somewhere.io', subject: 'Lunch tomorrow?',               preview: 'Hey, are you free for lunch tomorrow at the new place?', body: 'Hey,\n\nAre you free for lunch tomorrow at the new place on 4th?\n\n12:30 work?\n\n— Mike', time: 'Yesterday' }),
  m({ folder: 'inbox', unread: false, starred: true,  label: 'work',     from: 'Emily W.',     fromEmail: 'emily@design.co', subject: 'Sprint retro notes',            preview: "Posted the action items from yesterday's retro.", body: "Posted the retro notes — three action items:\n\n1. Move standup to 9:30 (was 9:00)\n2. Add a 'blocked' column to the board\n3. Pair up on the perf work\n\nLink in the channel.", time: 'Yesterday' }),
  m({ folder: 'inbox', unread: false, starred: false, label: 'work',     from: 'Linear',       fromEmail: 'notifications@linear.app', subject: 'You were assigned 3 issues',    preview: 'GEN-128, GEN-129, GEN-131 are now assigned to you.', body: 'Three issues assigned to you:\n\nGEN-128 · Wire empty state on file manager search\nGEN-129 · Fix focus trap on nested modals\nGEN-131 · Migrate icons.html to inline SVG\n\nView in Linear →', time: 'Tue' }),
  m({ folder: 'inbox', unread: false, starred: false, label: null,       from: 'Vercel',       fromEmail: 'updates@vercel.com', subject: 'Deployment succeeded',          preview: 'gentelella-v4.vercel.app deployed in 28s', body: 'Production deployment for gentelella-v4 succeeded.\n\nDuration: 28s\nCommit: e08f69c — Release 2.2.0 — fresh for 2026\n\nView deployment →', time: 'Tue' }),
  m({ folder: 'inbox', unread: false, starred: false, label: 'work',     from: 'Aigars S.',    fromEmail: 'aigars@colorlib.com', subject: 'Draft for landing copy',        preview: 'Take a look when you get a chance — happy to iterate.', body: 'First pass at the landing copy:\n\n> The free Bootstrap admin template, redesigned for 2026.\n> Fresh design system. Real ECharts. Real DataTables. Vite 8, vanilla JS, zero jQuery.\n\nHappy to iterate. — A.', time: 'Mon' }),
  m({ folder: 'inbox', unread: false, starred: false, label: null,       from: 'Notion',       fromEmail: 'team@notion.com', subject: 'Mentioned in Q2 OKRs',          preview: '@you was mentioned in the new Q2 OKRs document.', body: 'You were mentioned in:\n\nQ2 OKRs — 2026\n  > … @aigars to drive the v4 release and migration playbook.\n\nView document →', time: 'Apr 23' }),
  m({ folder: 'inbox', unread: false, starred: false, label: 'work',     from: 'Diego R.',     fromEmail: 'diego@research.co', subject: 'Customer feedback summary',     preview: 'Compiled the top 10 feature requests from interviews.', body: 'Compiled the top 10 feature requests from the last 12 customer interviews:\n\n1. Dark mode (8 mentions) ✓ shipped\n2. Mobile drawer (6) ✓ shipped\n3. Command palette (5) ✓ shipped\n4. Multi-tenant theming\n5. Print-friendly invoice\n…\n\nFull doc linked.', time: 'Apr 22' }),
  m({ folder: 'inbox', unread: false, starred: false, label: 'promotions', from: 'Figma',     fromEmail: 'team@figma.com', subject: '🎁 Your design tools, refreshed',  preview: 'New plugins, faster autosave, and AI features.', body: "Hi Aigars,\n\nWe shipped a bunch of stuff this month — autosave got 4× faster, plugins now run in a sandboxed worker, and our AI assist is in open beta.\n\nWhat's new →", time: 'Apr 20' }),
  m({ folder: 'inbox', unread: false, starred: false, label: 'urgent',   from: 'Security',     fromEmail: 'security@colorlib.com', subject: 'Action required: 2FA reset',     preview: 'Please confirm your 2FA codes have been backed up.', body: "We rotated the 2FA seed for your account on Apr 19.\n\nIf you haven't done so already, please confirm your backup codes are saved somewhere safe. Without them you may be locked out if you lose your device.\n\nReview backup codes →", time: 'Apr 19' }),

  // ── Sent
  m({ folder: 'sent', unread: false, starred: false, label: 'work',     from: 'Me',  to: 'sarah@design.co',  subject: 'Q1 design review',           preview: 'Sharing the figma link — comments welcome.', body: 'Hey Sarah,\n\nSharing the figma link for Q1. Annotated the open questions.\n\nLet me know if anything looks off.\n\n— A.', time: 'Yesterday' }),
  m({ folder: 'sent', unread: false, starred: false, label: 'work',     from: 'Me',  to: 'team@colorlib.com', subject: 'v4 release plan',             preview: 'Cutting the beta tag tomorrow if no blockers come in.', body: 'Quick update — cutting v4.0.0-beta.1 tomorrow morning unless something blocks. PR list and release notes in the doc.\n\n— A.', time: 'Mon' }),
  m({ folder: 'sent', unread: false, starred: false, label: 'personal', from: 'Me',  to: 'mike@somewhere.io', subject: 'Re: Lunch tomorrow?',         preview: '12:30 works for me. See you there.', body: '12:30 works. See you there.', time: 'Yesterday' }),

  // ── Drafts
  m({ folder: 'drafts', unread: false, starred: false, label: null,     from: 'Me', to: 'aigars@colorlib.com', subject: 'Re: Draft for landing copy',  preview: 'Two suggestions on the subhead — instead of …', body: "Two suggestions on the subhead:\n\n1. Lead with the year-anchor (\"redesigned for 2026\") earlier — it's the strongest signal.\n2. \"Real charts. Real tables.\" reads stronger as one beat.", time: 'Today' }),
  m({ folder: 'drafts', unread: false, starred: false, label: null,     from: 'Me', to: '',                    subject: '',                          preview: '', body: '', time: 'Today' }),
  m({ folder: 'drafts', unread: false, starred: false, label: null,     from: 'Me', to: 'diego@research.co',   subject: 'Re: Customer feedback summary', preview: '', body: '', time: 'Apr 22' }),

  // ── Trash
  m({ folder: 'trash', trashed: true, unread: false, starred: false, label: 'promotions', from: 'AppSumo',   fromEmail: 'deals@appsumo.com', subject: '90% off lifetime deals — today only', preview: 'Don\'t miss out…', body: 'Today only — 90% off our top admin templates and dashboards.\n\nUnsubscribe', time: 'Apr 18' })
];

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {'inbox' | 'sent' | 'drafts' | 'trash'} folder
 * @property {boolean} trashed
 * @property {boolean} unread
 * @property {boolean} starred
 * @property {string|null} label
 * @property {string} from
 * @property {string} [fromEmail]
 * @property {string} [to]
 * @property {string} subject
 * @property {string} preview
 * @property {string} body
 * @property {string} time
 */

function m(p) {
  return {
    id: id(),
    folder: p.folder,
    trashed: !!p.trashed,
    unread: !!p.unread,
    starred: !!p.starred,
    label: p.label || null,
    from: p.from,
    fromEmail: p.fromEmail || '',
    to: p.to || '',
    subject: p.subject || '(no subject)',
    preview: p.preview || '',
    body: p.body || '',
    time: p.time
  };
}

// ────────────────────────
//  STATE
// ────────────────────────

const state = {
  /** @type {Array<Message>} */
  messages: seed.slice(),
  /** @type {'inbox' | 'sent' | 'drafts' | 'starred' | 'trash' | string} */
  view: 'inbox',
  /** Active label filter (when view === 'label:<key>') */
  selectedId: null,
  query: ''
};

// ────────────────────────
//  FOLDERS
// ────────────────────────

const FOLDERS = [
  { key: 'inbox',   label: 'Inbox',   icon: '<path d="M2 6l6 4 6-4"/><rect x="2" y="4" width="12" height="9" rx="1.5"/>' },
  { key: 'sent',    label: 'Sent',    icon: '<path d="M2 14L14 2M14 2H6M14 2v8"/>' },
  { key: 'drafts',  label: 'Drafts',  icon: '<path d="M3 3h10v10H3zM6 7l2 2 2-2"/>' },
  { key: 'starred', label: 'Starred', icon: '<path d="M8 1l2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5z"/>' },
  { key: 'trash',   label: 'Trash',   icon: '<path d="M3 5h10l-1 9H4z"/><path d="M5 5V3h6v2"/>' }
];

const LABELS = [
  { key: 'work',       label: 'Work',       color: 'var(--primary)' },
  { key: 'personal',   label: 'Personal',   color: 'var(--blue)' },
  { key: 'promotions', label: 'Promotions', color: 'var(--yellow)' },
  { key: 'urgent',     label: 'Urgent',     color: 'var(--red)' }
];

function viewFilter(msg) {
  if (state.view === 'inbox')   {return msg.folder === 'inbox' && !msg.trashed;}
  if (state.view === 'sent')    {return msg.folder === 'sent' && !msg.trashed;}
  if (state.view === 'drafts')  {return msg.folder === 'drafts' && !msg.trashed;}
  if (state.view === 'starred') {return msg.starred && !msg.trashed;}
  if (state.view === 'trash')   {return msg.trashed;}
  if (state.view.startsWith('label:')) {
    const lbl = state.view.slice(6);
    return msg.label === lbl && !msg.trashed;
  }
  return false;
}

function searchFilter(msg) {
  if (!state.query) {return true;}
  const q = state.query.toLowerCase();
  return msg.subject.toLowerCase().includes(q)
    || msg.body.toLowerCase().includes(q)
    || msg.from.toLowerCase().includes(q)
    || (msg.to || '').toLowerCase().includes(q);
}

function visibleMessages() {
  return state.messages.filter(viewFilter).filter(searchFilter);
}

function unreadCountInFolder(folder) {
  return state.messages.filter((m) => {
    if (folder === 'inbox')   {return m.folder === 'inbox' && !m.trashed && m.unread;}
    if (folder === 'starred') {return m.starred && !m.trashed && m.unread;}
    return false;
  }).length;
}

function totalCountInFolder(folder) {
  return state.messages.filter((m) => {
    if (folder === 'inbox')   {return m.folder === 'inbox' && !m.trashed;}
    if (folder === 'sent')    {return m.folder === 'sent' && !m.trashed;}
    if (folder === 'drafts')  {return m.folder === 'drafts' && !m.trashed;}
    if (folder === 'starred') {return m.starred && !m.trashed;}
    if (folder === 'trash')   {return m.trashed;}
    if (folder.startsWith('label:')) {return m.label === folder.slice(6) && !m.trashed;}
    return false;
  }).length;
}

// ────────────────────────
//  RENDER
// ────────────────────────

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderShell(root) {
  root.innerHTML = `
    <div class="inbox-layout">
      <aside class="inbox-sidebar" id="inbox-sidebar"></aside>
      <div class="inbox-list-pane">
        <div class="inbox-list-toolbar">
          <input type="text" class="inbox-search" placeholder="Search this folder…" aria-label="Search messages">
          <button type="button" class="btn btn-outline btn-sm" id="inbox-mark-read">Mark all read</button>
        </div>
        <div class="inbox-list" id="inbox-list" role="listbox" aria-label="Messages"></div>
      </div>
      <div class="inbox-reader" id="inbox-reader"></div>
    </div>
  `;
}

function renderSidebar() {
  const el = document.getElementById('inbox-sidebar');
  if (!el) {return;}
  const folder = (key) => {
    const f = FOLDERS.find((x) => x.key === key);
    const count = key === 'inbox' || key === 'starred' ? unreadCountInFolder(key) : totalCountInFolder(key);
    const showCount = count > 0 || key === 'inbox';
    return `
      <a class="inbox-folder${state.view === key ? ' active' : ''}" href="#" data-view="${key}">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">${f.icon}</svg>
        ${f.label}
        ${showCount ? `<span class="count">${count}</span>` : ''}
      </a>
    `;
  };
  el.innerHTML = `
    ${FOLDERS.map((f) => folder(f.key)).join('')}
    <div class="inbox-sidebar-label">Labels</div>
    ${LABELS.map((l) => {
    const c = totalCountInFolder(`label:${l.key}`);
    return `
        <a class="inbox-folder${state.view === `label:${l.key}` ? ' active' : ''}" href="#" data-view="label:${l.key}">
          <span class="inbox-label-dot" style="background:${l.color}"></span>
          ${l.label}
          ${c > 0 ? `<span class="count">${c}</span>` : ''}
        </a>
      `;
  }).join('')}
  `;
}

function renderList() {
  const el = document.getElementById('inbox-list');
  if (!el) {return;}
  const items = visibleMessages();
  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 8l9 6 9-6"/></svg>
        </div>
        <div class="empty-state-title">${state.query ? 'No matches' : 'Nothing here'}</div>
        <div class="empty-state-text">${state.query ? 'Try a different search term.' : 'New messages will appear here.'}</div>
      </div>
    `;
    return;
  }
  el.innerHTML = items.map((msg) => `
    <div class="inbox-item${msg.unread ? ' unread' : ''}${msg.id === state.selectedId ? ' selected' : ''}" data-id="${msg.id}" role="option" aria-selected="${msg.id === state.selectedId}" tabindex="0">
      <button type="button" class="inbox-star-btn" data-star="${msg.id}" aria-label="${msg.starred ? 'Unstar' : 'Star'}" aria-pressed="${msg.starred}">
        <svg class="star ${msg.starred ? 'on' : ''}" viewBox="0 0 16 16" fill="${msg.starred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M8 1l2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5z"/></svg>
      </button>
      <div class="inbox-item-body">
        <div class="sender">${escapeHtml(msg.folder === 'sent' || msg.folder === 'drafts' ? `To: ${msg.to || '(no recipient)'}` : msg.from)}</div>
        <div class="subject">${escapeHtml(msg.subject)}${msg.label ? `<span class="inbox-label-pill" data-label="${msg.label}">${escapeHtml(msg.label)}</span>` : ''}</div>
        <div class="preview">${escapeHtml(msg.preview || msg.body.split('\n')[0] || '')}</div>
      </div>
      <div class="meta">${escapeHtml(msg.time)}</div>
    </div>
  `).join('');
}

function renderReader() {
  const el = document.getElementById('inbox-reader');
  if (!el) {return;}
  const msg = state.messages.find((x) => x.id === state.selectedId);
  if (!msg) {
    el.innerHTML = `
      <div class="empty-state inbox-reader-empty">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 8l9 6 9-6"/></svg>
        </div>
        <div class="empty-state-title">Select a message</div>
        <div class="empty-state-text">Click a message in the list to read it here.</div>
      </div>
    `;
    return;
  }

  const isDraft = msg.folder === 'drafts';
  const isTrash = msg.trashed;

  el.innerHTML = `
    <div class="inbox-reader-toolbar">
      <button type="button" class="btn btn-outline btn-sm" data-action="back" aria-label="Back to list">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 3L4 8l6 5"/></svg>
      </button>
      ${isDraft ? `
        <button type="button" class="btn btn-primary btn-sm" data-action="edit-draft">Edit draft</button>
      ` : `
        <button type="button" class="btn btn-outline btn-sm" data-action="reply">Reply</button>
        <button type="button" class="btn btn-outline btn-sm" data-action="forward">Forward</button>
      `}
      <div class="inbox-reader-spacer"></div>
      <button type="button" class="btn btn-ghost btn-sm" data-action="star" aria-pressed="${msg.starred}">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="${msg.starred ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M8 1l2 5 5 .5-4 3.5 1 5-4-2.5-4 2.5 1-5-4-3.5 5-.5z"/></svg>
        ${msg.starred ? 'Starred' : 'Star'}
      </button>
      ${isTrash ? `
        <button type="button" class="btn btn-ghost btn-sm" data-action="restore">Restore</button>
        <button type="button" class="btn btn-danger btn-sm" data-action="delete-forever">Delete forever</button>
      ` : `
        <button type="button" class="btn btn-ghost btn-sm" data-action="trash" aria-label="Move to trash">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5h10l-1 9H4z"/><path d="M5 5V3h6v2"/></svg>
        </button>
      `}
    </div>
    <div class="inbox-reader-content">
      <h2 class="inbox-reader-subject">${escapeHtml(msg.subject)}</h2>
      <div class="inbox-reader-meta">
        <div class="inbox-reader-avatar" style="background:${avatarColor(msg.from)}">${initials(msg.from)}</div>
        <div class="inbox-reader-meta-text">
          <div><strong>${escapeHtml(msg.from)}</strong>${msg.fromEmail ? ` <span class="inbox-reader-email">&lt;${escapeHtml(msg.fromEmail)}&gt;</span>` : ''}</div>
          <div class="inbox-reader-to">${msg.to ? `to ${escapeHtml(msg.to)}` : ''}</div>
        </div>
        <div class="inbox-reader-time">${escapeHtml(msg.time)}</div>
      </div>
      ${msg.label ? `<div class="inbox-label-pill inbox-label-pill-lg" data-label="${msg.label}">${escapeHtml(msg.label)}</div>` : ''}
      <div class="inbox-reader-body">${escapeHtml(msg.body || '(empty draft)').replace(/\n/g, '<br>')}</div>
    </div>
  `;
}

function avatarColor(name) {
  const palette = ['var(--primary)', 'var(--blue)', 'var(--purple)', 'var(--yellow)', 'var(--green)', 'var(--cyan)', 'var(--pink)', 'var(--orange)'];
  let h = 0;
  for (let i = 0; i < name.length; i += 1) {h = (h * 31 + name.charCodeAt(i)) >>> 0;}
  return palette[h % palette.length];
}

function initials(name) {
  if (!name) {return '?';}
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]).join('').toUpperCase();
}

function renderAll() {
  renderSidebar();
  renderList();
  renderReader();
  updateBackLayout();
}

function updateBackLayout() {
  // On mobile, when a message is selected we slide the reader over the list.
  const root = document.getElementById('inbox-root');
  if (!root) {return;}
  root.classList.toggle('reader-open', !!state.selectedId);
}

// ────────────────────────
//  ACTIONS
// ────────────────────────

function setView(view) {
  state.view = view;
  state.selectedId = null;
  state.query = '';
  const search = document.querySelector('.inbox-search');
  if (search) {search.value = '';}
  renderAll();
}

function selectMessage(id) {
  const msg = state.messages.find((x) => x.id === id);
  if (!msg) {return;}
  if (msg.unread) {
    msg.unread = false;
  }
  state.selectedId = id;
  renderSidebar();
  renderList();
  renderReader();
  updateBackLayout();
  syncTopbarUnread();
}

function toggleStar(id) {
  const msg = state.messages.find((x) => x.id === id);
  if (!msg) {return;}
  msg.starred = !msg.starred;
  renderSidebar();
  renderList();
  if (state.selectedId === id) {renderReader();}
}

function trashMessage(id) {
  const msg = state.messages.find((x) => x.id === id);
  if (!msg) {return;}
  msg.trashed = true;
  if (state.selectedId === id) {state.selectedId = null;}
  renderAll();
  showToast('Moved to Trash', { variant: 'success' });
}

function restoreMessage(id) {
  const msg = state.messages.find((x) => x.id === id);
  if (!msg) {return;}
  msg.trashed = false;
  renderAll();
  showToast('Restored', { variant: 'success' });
}

function deleteForever(id) {
  const idx = state.messages.findIndex((x) => x.id === id);
  if (idx < 0) {return;}
  state.messages.splice(idx, 1);
  if (state.selectedId === id) {state.selectedId = null;}
  renderAll();
  showToast('Deleted forever', { variant: 'success' });
}

function markAllRead() {
  let n = 0;
  state.messages.forEach((m) => {
    if (viewFilter(m) && m.unread) { m.unread = false; n += 1; }
  });
  renderSidebar();
  renderList();
  syncTopbarUnread();
  showToast(`Marked ${n} as read`);
}

function syncTopbarUnread() {
  const inboxUnread = unreadCountInFolder('inbox');
  document.querySelectorAll('[data-inbox-count]').forEach((el) => { el.textContent = inboxUnread; });
}

// ────────────────────────
//  COMPOSE
// ────────────────────────

/**
 * @param {Partial<Message>} [prefill]
 * @param {Message} [editingDraft] If set, sending replaces this draft.
 */
function openCompose(prefill = {}, editingDraft = null) {
  const body = document.createElement('div');
  body.className = 'compose-form';
  body.innerHTML = `
    <div class="form-group">
      <label class="form-label" for="compose-to">To</label>
      <input type="email" id="compose-to" class="form-control" placeholder="recipient@example.com" value="${escapeHtml(prefill.to || '')}" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label" for="compose-subject">Subject</label>
      <input type="text" id="compose-subject" class="form-control" placeholder="Subject" value="${escapeHtml(prefill.subject || '')}" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label" for="compose-body">Message</label>
      <textarea id="compose-body" class="form-control" rows="8" placeholder="Write your message…">${escapeHtml(prefill.body || '')}</textarea>
    </div>
  `;

  const collect = () => ({
    to: body.querySelector('#compose-to').value.trim(),
    subject: body.querySelector('#compose-subject').value.trim(),
    body: body.querySelector('#compose-body').value
  });

  showModal({
    title: editingDraft ? 'Edit draft' : 'New message',
    body,
    size: 'lg',
    actions: [
      {
        label: 'Discard',
        variant: 'ghost',
        action: () => {
          if (editingDraft) {
            // Discarding an existing draft removes it.
            const idx = state.messages.findIndex((m) => m.id === editingDraft.id);
            if (idx >= 0) {state.messages.splice(idx, 1);}
            if (state.selectedId === editingDraft.id) {state.selectedId = null;}
            renderAll();
          }
          showToast('Discarded');
        }
      },
      {
        label: 'Save draft',
        variant: 'outline',
        action: () => {
          const data = collect();
          if (!data.to && !data.subject && !data.body) {
            showToast('Empty draft discarded');
            return;
          }
          if (editingDraft) {
            Object.assign(editingDraft, {
              to: data.to,
              subject: data.subject || '(no subject)',
              body: data.body,
              preview: data.body.split('\n')[0].slice(0, 140),
              time: 'Just now'
            });
          } else {
            state.messages.unshift(m({
              folder: 'drafts',
              from: 'Me',
              to: data.to,
              subject: data.subject || '(no subject)',
              preview: data.body.split('\n')[0].slice(0, 140),
              body: data.body,
              time: 'Just now'
            }));
          }
          renderAll();
          showToast('Draft saved', { variant: 'success' });
        }
      },
      {
        label: 'Send',
        variant: 'primary',
        action: () => {
          const data = collect();
          if (!data.to) {
            showToast('Add a recipient', { variant: 'error' });
            return false;
          }
          if (editingDraft) {
            // Convert draft to sent
            const idx = state.messages.findIndex((m) => m.id === editingDraft.id);
            if (idx >= 0) {state.messages.splice(idx, 1);}
            if (state.selectedId === editingDraft.id) {state.selectedId = null;}
          }
          state.messages.unshift(m({
            folder: 'sent',
            from: 'Me',
            to: data.to,
            subject: data.subject || '(no subject)',
            preview: data.body.split('\n')[0].slice(0, 140),
            body: data.body,
            time: 'Just now'
          }));
          renderAll();
          showToast('Message sent', { variant: 'success' });
        }
      }
    ]
  });

  setTimeout(() => body.querySelector('#compose-to')?.focus(), 50);
}

function reply(msg) {
  openCompose({
    to: msg.fromEmail || msg.from,
    subject: msg.subject.startsWith('Re: ') ? msg.subject : `Re: ${msg.subject}`,
    body: `\n\n--- On ${msg.time}, ${msg.from} wrote:\n${msg.body.split('\n').map((l) => `> ${l}`).join('\n')}`
  });
}

function forward(msg) {
  openCompose({
    to: '',
    subject: msg.subject.startsWith('Fwd: ') ? msg.subject : `Fwd: ${msg.subject}`,
    body: `\n\n--- Forwarded message ---\nFrom: ${msg.from}${msg.fromEmail ? ` <${msg.fromEmail}>` : ''}\nDate: ${msg.time}\nSubject: ${msg.subject}\n\n${msg.body}`
  });
}

// ────────────────────────
//  EVENT WIRING
// ────────────────────────

function bindEvents(root) {
  // Folder switching
  root.addEventListener('click', (e) => {
    const folder = e.target.closest('[data-view]');
    if (folder) {
      e.preventDefault();
      setView(folder.dataset.view);
    }
  });

  // Message click
  root.addEventListener('click', (e) => {
    const star = e.target.closest('[data-star]');
    if (star) {
      e.stopPropagation();
      toggleStar(star.dataset.star);
      return;
    }
    const item = e.target.closest('.inbox-item');
    if (item) {selectMessage(item.dataset.id);}
  });

  // Reader toolbar
  root.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (!action || !action.dataset.action) {return;}
    const msg = state.messages.find((x) => x.id === state.selectedId);
    switch (action.dataset.action) {
      case 'back':
        state.selectedId = null;
        renderList();
        renderReader();
        updateBackLayout();
        break;
      case 'reply':           if (msg) {reply(msg);} break;
      case 'forward':         if (msg) {forward(msg);} break;
      case 'edit-draft':      if (msg) {openCompose({ to: msg.to, subject: msg.subject === '(no subject)' ? '' : msg.subject, body: msg.body }, msg);} break;
      case 'star':            if (msg) {toggleStar(msg.id);} break;
      case 'trash':           if (msg) {trashMessage(msg.id);} break;
      case 'restore':         if (msg) {restoreMessage(msg.id);} break;
      case 'delete-forever':  if (msg) {deleteForever(msg.id);} break;
    }
  });

  // Search
  root.addEventListener('input', (e) => {
    if (!e.target.matches('.inbox-search')) {return;}
    state.query = e.target.value.trim();
    renderList();
  });

  // Mark all read button (inside list toolbar) and the page-header one
  root.addEventListener('click', (e) => {
    if (e.target.closest('#inbox-mark-read')) {markAllRead();}
  });
  document.querySelectorAll('.page-actions .btn').forEach((b) => {
    const label = b.textContent.trim().toLowerCase();
    if (label === 'mark all read') {
      b.addEventListener('click', (e) => { e.preventDefault(); markAllRead(); });
    } else if (label === 'compose') {
      b.addEventListener('click', (e) => { e.preventDefault(); openCompose(); });
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('inbox-root')) {return;}
    if (e.target.matches('input, textarea')) {return;}
    const list = visibleMessages();
    const idx = list.findIndex((m) => m.id === state.selectedId);
    if (e.key === 'j' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (list.length === 0) {return;}
      const next = list[Math.min(list.length - 1, idx + 1)] || list[0];
      selectMessage(next.id);
    } else if (e.key === 'k' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (list.length === 0) {return;}
      const prev = list[Math.max(0, idx - 1)] || list[list.length - 1];
      selectMessage(prev.id);
    } else if (e.key === 'r' && state.selectedId) {
      const msg = state.messages.find((x) => x.id === state.selectedId);
      if (msg && msg.folder !== 'drafts') {e.preventDefault(); reply(msg);}
    } else if (e.key === '#' && state.selectedId) {
      e.preventDefault();
      trashMessage(state.selectedId);
    } else if (e.key === 's' && state.selectedId) {
      e.preventDefault();
      toggleStar(state.selectedId);
    } else if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      openCompose();
    }
  });
}

// ────────────────────────
//  PUBLIC API
// ────────────────────────

/**
 * Mount the interactive inbox into `#inbox-root`. Idempotent — if there's
 * already a list inside the root, we re-render in place.
 */
export function initInbox() {
  const root = document.getElementById('inbox-root');
  if (!root) {return;}
  renderShell(root);
  bindEvents(root);
  renderAll();
  syncTopbarUnread();
}
