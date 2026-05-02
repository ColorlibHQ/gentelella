// Gentelella 2026 v4 — runtime shell mount
// At build/dev time the Vite plugin (vite.config.js) injects sidebar/topbar/
// footer directly into each production/*.html. mountShell() is the runtime
// fallback: if the shell isn't already in the DOM (e.g. opening a raw HTML
// file), render it from the same string templates. Either way, mountShell()
// always wires up runtime behavior (mobile drawer, theme toggle).

import { renderShell } from './shell-render.js';
import { openPanel, openMenu } from './menus.js';
import { showToast } from './toast.js';
import { showModal } from './modal.js';

function injectShellIfMissing() {
  const body = document.body;
  if (body.querySelector('.sidebar')) {return;}

  const activeKey = body.dataset.page || '';
  const breadcrumb = body.dataset.breadcrumb
    ? body.dataset.breadcrumb.split('>').map((s) => s.trim()).filter(Boolean)
    : ['Home'];

  const { sidebar, topbar, footer } = renderShell({ activeKey, breadcrumb });

  const tpl = document.createElement('template');
  tpl.innerHTML = sidebar.trim();
  body.insertBefore(tpl.content.firstElementChild, body.firstChild);

  const mainEl = body.querySelector('main.main');
  tpl.innerHTML = topbar.trim();
  if (mainEl) {
    body.insertBefore(tpl.content.firstElementChild, mainEl);
    tpl.innerHTML = footer.trim();
    mainEl.appendChild(tpl.content.firstElementChild);
  }
}

// Sidebar submenus — accordion behavior + sessionStorage memory.
//
// On page load, the group containing the active page auto-opens (server-rendered
// markup). User can manually expand/collapse any group; opening one closes all
// others. The chosen state persists across navigation via sessionStorage so
// the sidebar doesn't snap back to "auto-open" when the user moves to a child
// page that's not in their preferred group.
const SUBMENU_STATE_KEY = 'gentelella:nav-open';

function getStoredOpenIndex() {
  try {
    const raw = sessionStorage.getItem(SUBMENU_STATE_KEY);
    if (raw === null) {return null;}
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? null : n;
  } catch (_e) { return null; }
}

function setStoredOpenIndex(idx) {
  try {
    if (idx === null) {sessionStorage.removeItem(SUBMENU_STATE_KEY);}
    else {sessionStorage.setItem(SUBMENU_STATE_KEY, String(idx));}
  } catch (_e) { /* private mode */ }
}

function bindNavSubmenus() {
  const trees = [...document.querySelectorAll('.sidebar .nav-tree')];
  if (!trees.length) {return;}

  const closeAll = (except) => {
    trees.forEach((t) => {
      if (t === except) {return;}
      t.classList.remove('open');
      const btn = t.querySelector('.nav-toggle');
      if (btn) {btn.setAttribute('aria-expanded', 'false');}
    });
  };

  // Restore the user's last manually-toggled group, if any. Otherwise the
  // server-rendered .open (auto-applied to the active page's group) wins.
  const stored = getStoredOpenIndex();
  if (stored !== null && trees[stored]) {
    closeAll(trees[stored]);
    trees[stored].classList.add('open');
    const btn = trees[stored].querySelector('.nav-toggle');
    if (btn) {btn.setAttribute('aria-expanded', 'true');}
  }

  trees.forEach((tree, i) => {
    const btn = tree.querySelector('.nav-toggle');
    if (!btn) {return;}
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !tree.classList.contains('open');
      closeAll(willOpen ? tree : null);
      tree.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      setStoredOpenIndex(willOpen ? i : null);
    });
  });
}

// Sidebar toggle — desktop collapses to a 64px rail; mobile opens a drawer.
// Same button, viewport-aware behavior. Rail state persists in localStorage.
const RAIL_KEY = 'gentelella:sidebar-rail';

function isDesktop() { return window.matchMedia('(min-width: 769px)').matches; }

function applyRailLabels() {
  // Sets data-rail-label on every nav-link so the CSS tooltip has text to show.
  document.querySelectorAll('.sidebar .nav-link').forEach((link) => {
    const text = link.querySelector('.nav-text')?.textContent.trim();
    if (text) {link.setAttribute('data-rail-label', text);}
  });
}

function bindRailFlyouts() {
  // In rail mode, clicking a parent (.nav-toggle) opens its children as a
  // flyout menu instead of expanding inline. Click again to dismiss.
  // Captures clicks before bindNavSubmenus' handler so the inline-expand
  // behavior never fires when we're collapsed.
  document.querySelectorAll('.sidebar .nav-toggle').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (!document.body.classList.contains('sidebar-rail')) {return;}
      if (!isDesktop()) {return;}
      e.preventDefault();
      e.stopPropagation();
      const tree = btn.closest('.nav-tree');
      if (!tree) {return;}
      const items = [...tree.querySelectorAll('.nav-sublink')].map((a) => ({
        label: a.textContent.trim(),
        action: () => { window.location.href = a.getAttribute('href'); }
      }));
      openMenu(btn, items);
    }, true); // capture phase — runs before bindNavSubmenus
  });
}

function bindSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  if (!sidebar || !toggle) {return;}

  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.hidden = true;
    document.body.appendChild(backdrop);
  }

  // ── Mobile drawer ──
  const drawerClose = () => {
    sidebar.classList.remove('open');
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sidebar-open');
  };
  const drawerOpen = () => {
    sidebar.classList.add('open');
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sidebar-open');
  };

  // ── Desktop rail ──
  const setRail = (on) => {
    document.body.classList.toggle('sidebar-rail', on);
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    toggle.setAttribute('aria-label', on ? 'Expand sidebar' : 'Collapse sidebar');
    try { localStorage.setItem(RAIL_KEY, on ? '1' : '0'); } catch (_e) { /* ignore */ }
    if (on) {applyRailLabels();}
  };

  // Restore stored rail preference (desktop only). Mobile ignores it so the
  // drawer/sidebar isn't shown rail-style on small screens.
  let stored = '0';
  try { stored = localStorage.getItem(RAIL_KEY) || '0'; } catch (_e) { /* ignore */ }
  if (stored === '1' && isDesktop()) {setRail(true);}

  toggle.addEventListener('click', () => {
    if (isDesktop()) {
      setRail(!document.body.classList.contains('sidebar-rail'));
    } else {
      sidebar.classList.contains('open') ? drawerClose() : drawerOpen();
    }
  });
  backdrop.addEventListener('click', drawerClose);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {drawerClose();}
  });

  // Viewport changes: desktop ↔ mobile. Reset state coherently.
  const mq = window.matchMedia('(min-width: 769px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) {
      // Now desktop — close any drawer, restore rail state.
      drawerClose();
      let v = '0';
      try { v = localStorage.getItem(RAIL_KEY) || '0'; } catch (_err) { /* ignore */ }
      setRail(v === '1');
    } else {
      // Now mobile — drop rail mode (drawer takes over).
      document.body.classList.remove('sidebar-rail');
    }
  });

  bindRailFlyouts();
}

function bindThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) {return;}

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  };

  // Sync aria-pressed with the theme set by the pre-paint script.
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  btn.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (_e) { /* private mode */ }
    apply(next);
  });

  // Follow OS theme changes when the user hasn't explicitly chosen.
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', (e) => {
    let stored;
    try { stored = localStorage.getItem('theme'); } catch (_e) { /* ignore */ }
    if (stored) {return;}
    apply(e.matches ? 'dark' : 'light');
  });
}

// ────────────────────────
//  TOPBAR DROPDOWNS
// ────────────────────────

const NOTIFICATIONS = [
  { kind: 'info',   from: 'Stripe',  text: 'Payment of $499.00 received', time: '2m', unread: true },
  { kind: 'task',   from: 'GitHub',  text: 'PR #248 ready for review',     time: '14m', unread: true },
  { kind: 'alert',  from: 'Linear',  text: 'GEN-128 marked as urgent',     time: '1h', unread: true },
  { kind: 'info',   from: 'Vercel',  text: 'Deployment succeeded in 28s',  time: '3h', unread: false },
  { kind: 'info',   from: 'Notion',  text: 'You were mentioned in Q2 OKRs', time: 'Yesterday', unread: false }
];

const MESSAGES = [
  { from: 'Sarah K.',     text: 'Can you take a look at the design?', initials: 'SK', color: 'var(--primary)',  time: '4m', unread: true },
  { from: 'Michael R.',   text: 'Lunch tomorrow at noon?',            initials: 'MR', color: 'var(--blue)',     time: '32m', unread: true },
  { from: 'Emily W.',     text: 'Sprint retro notes posted',          initials: 'EW', color: 'var(--purple)',   time: '2h', unread: false },
  { from: 'Diego R.',     text: 'Customer feedback summary ready',    initials: 'DR', color: 'var(--yellow)',   time: 'Mon', unread: false }
];

function openShortcutsModal() {
  const row = (k, label) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border-color-light);font-size:13px"><span style="color:var(--text)">${label}</span><span>${k.split('+').map((key) => `<kbd style="font-family:var(--font);font-size:11px;background:var(--bg-surface-secondary);border:1px solid var(--border-color);border-radius:3px;padding:2px 6px;margin-left:3px">${key}</kbd>`).join('')}</span></div>`;
  showModal({
    title: 'Keyboard shortcuts',
    size: 'md',
    body: `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 24px">
        <div>
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:4px 0 6px">Global</div>
          ${row('⌘+K', 'Open command palette')}
          ${row('⌘+/', 'This help')}
          ${row('Esc', 'Close modal / palette')}
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:14px 0 6px">Navigation</div>
          ${row('G then D', 'Go to dashboard')}
          ${row('G then I', 'Go to inbox')}
          ${row('G then K', 'Go to kanban')}
        </div>
        <div>
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:4px 0 6px">Inbox</div>
          ${row('J', 'Next message')}
          ${row('K', 'Previous message')}
          ${row('R', 'Reply')}
          ${row('S', 'Star message')}
          ${row('#', 'Move to trash')}
          ${row('C', 'Compose new')}
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:14px 0 6px">Editor</div>
          ${row('⌘+B', 'Bold')}
          ${row('⌘+I', 'Italic')}
          ${row('⌘+K', 'Insert link')}
        </div>
      </div>
    `,
    actions: [{ label: 'Close', variant: 'primary' }]
  });
}

function openSignOutModal() {
  showModal({
    title: 'Sign out?',
    size: 'sm',
    body: '<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin:0">You\'ll need to sign back in to access your dashboard. Any unsaved changes will be lost.</p>',
    actions: [
      { label: 'Cancel', variant: 'ghost' },
      {
        label: 'Sign out',
        variant: 'primary',
        action: () => {
          showToast('Signed out', { variant: 'success' });
          setTimeout(() => { window.location.href = 'login.html'; }, 600);
        }
      }
    ]
  });
}

const USER_MENU = [
  { label: 'Profile',            action: () => { window.location.href = 'profile.html'; } },
  { label: 'Account settings',   action: () => { window.location.href = 'settings.html'; } },
  { label: 'Theme generator',    action: () => { window.location.href = 'theme.html'; } },
  { label: 'Keyboard shortcuts', action: openShortcutsModal },
  '-',
  { label: 'Help & support',     action: () => { window.location.href = 'faq.html'; } },
  { label: 'Lock screen',        action: () => { window.location.href = 'lock_screen.html'; } },
  { label: 'Sign out',           action: openSignOutModal }
];

function buildNotificationsPanel() {
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const wrap = document.createElement('div');
  wrap.className = 'panel-content';
  wrap.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">Notifications</span>
      ${unreadCount ? `<span class="panel-badge">${unreadCount} new</span>` : ''}
      <button type="button" class="panel-action" data-action="mark-all">Mark all read</button>
    </div>
    <div class="panel-list">
      ${NOTIFICATIONS.map((n, i) => `
        <button type="button" class="panel-row${n.unread ? ' unread' : ''}" data-i="${i}">
          <span class="panel-icon panel-icon-${n.kind}" aria-hidden="true">
            ${n.kind === 'alert' ? '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1l7 13H1L8 1z"/><path d="M8 6v4"/><circle cx="8" cy="12" r="0.5"/></svg>'
    : n.kind === 'task' ? '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l3 3 7-7"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 11h.01"/></svg>'}
          </span>
          <span class="panel-body">
            <span class="panel-from">${n.from}</span>
            <span class="panel-text">${n.text}</span>
          </span>
          <span class="panel-time">${n.time}</span>
        </button>
      `).join('')}
    </div>
    <div class="panel-footer">
      <a href="notifications.html" class="panel-link">View all notifications</a>
    </div>
  `;
  return wrap;
}

function buildMessagesPanel() {
  const unreadCount = MESSAGES.filter((m) => m.unread).length;
  const wrap = document.createElement('div');
  wrap.className = 'panel-content';
  wrap.innerHTML = `
    <div class="panel-header">
      <span class="panel-title">Messages</span>
      ${unreadCount ? `<span class="panel-badge">${unreadCount} new</span>` : ''}
      <a href="inbox.html" class="panel-action">Open inbox</a>
    </div>
    <div class="panel-list">
      ${MESSAGES.map((m, i) => `
        <button type="button" class="panel-row${m.unread ? ' unread' : ''}" data-i="${i}">
          <span class="panel-avatar" style="background:${m.color}">${m.initials}</span>
          <span class="panel-body">
            <span class="panel-from">${m.from}</span>
            <span class="panel-text">${m.text}</span>
          </span>
          <span class="panel-time">${m.time}</span>
        </button>
      `).join('')}
    </div>
    <div class="panel-footer">
      <a href="inbox.html" class="panel-link">View all messages</a>
    </div>
  `;
  return wrap;
}

function openNotificationDetail(n) {
  showModal({
    title: n.from,
    size: 'sm',
    body: `
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <div style="width:36px;height:36px;border-radius:8px;background:var(--${n.kind === 'alert' ? 'red' : n.kind === 'task' ? 'green' : 'blue'}-lt);color:var(--${n.kind === 'alert' ? 'red' : n.kind === 'task' ? 'green' : 'blue'});display:flex;align-items:center;justify-content:center;flex-shrink:0">
          ${n.kind === 'alert' ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1l7 13H1L8 1z"/><path d="M8 6v4"/></svg>'
    : n.kind === 'task' ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l3 3 7-7"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3M8 11h.01"/></svg>'}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;color:var(--text);line-height:1.5;margin-bottom:6px">${n.text}</div>
          <div style="font-size:11.5px;color:var(--text-muted)">${n.time}</div>
        </div>
      </div>
    `,
    actions: [
      { label: 'Dismiss', variant: 'ghost' },
      { label: 'View all', variant: 'outline', action: () => { window.location.href = 'notifications.html'; } }
    ]
  });
}

function openMessageDetail(m) {
  showModal({
    title: m.from,
    size: 'md',
    body: `
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border-color-light)">
        <div style="width:38px;height:38px;border-radius:50%;background:${m.color};color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px">${m.initials}</div>
        <div style="flex:1">
          <div style="font-size:13.5px;font-weight:600;color:var(--text)">${m.from}</div>
          <div style="font-size:11.5px;color:var(--text-muted)">${m.time}</div>
        </div>
      </div>
      <div style="font-size:13.5px;color:var(--text);line-height:1.6;margin-bottom:16px">${m.text}</div>
      <textarea class="form-control" rows="3" placeholder="Type a reply…" style="margin-bottom:0"></textarea>
    `,
    actions: [
      { label: 'Cancel', variant: 'ghost' },
      { label: 'Open in inbox', variant: 'outline', action: () => { window.location.href = 'inbox.html'; } },
      { label: 'Send reply', variant: 'primary', action: () => showToast('Reply sent', { variant: 'success' }) }
    ]
  });
}

function bindTopbarPanels() {
  const bell = document.querySelector('.tb-notifications');
  if (bell) {
    bell.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const panel = buildNotificationsPanel();
      panel.addEventListener('click', (ev) => {
        const markAll = ev.target.closest('[data-action="mark-all"]');
        if (markAll) {
          ev.stopPropagation();
          NOTIFICATIONS.forEach((n) => { n.unread = false; });
          panel.querySelectorAll('.panel-row.unread').forEach((r) => r.classList.remove('unread'));
          panel.querySelector('.panel-badge')?.remove();
          bell.querySelector('.dot')?.style.setProperty('display', 'none');
          showToast('All notifications marked read', { variant: 'success' });
          return;
        }
        const row = ev.target.closest('.panel-row');
        if (row) {
          ev.stopPropagation();
          const i = parseInt(row.dataset.i, 10);
          NOTIFICATIONS[i].unread = false;
          row.classList.remove('unread');
          // Close the panel before opening the modal so they don't fight.
          row.closest('.menu-popover')?.remove();
          openNotificationDetail(NOTIFICATIONS[i]);
        }
      });
      openPanel(bell, panel, { className: 'panel-notifications', width: 360 });
    });
  }

  const msg = document.querySelector('.tb-messages');
  if (msg) {
    msg.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const panel = buildMessagesPanel();
      panel.addEventListener('click', (ev) => {
        const row = ev.target.closest('.panel-row');
        if (row) {
          ev.stopPropagation();
          const i = parseInt(row.dataset.i, 10);
          MESSAGES[i].unread = false;
          row.classList.remove('unread');
          row.closest('.menu-popover')?.remove();
          openMessageDetail(MESSAGES[i]);
        }
      });
      openPanel(msg, panel, { className: 'panel-messages', width: 360 });
    });
  }

  const avatar = document.querySelector('.tb-avatar');
  if (avatar) {
    avatar.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      openMenu(avatar, USER_MENU);
    });
  }

  const sidebarMore = document.querySelector('.sidebar-user .more-btn');
  if (sidebarMore) {
    sidebarMore.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      openMenu(sidebarMore, USER_MENU);
    });
  }
}

/**
 * Mount the admin shell (sidebar + topbar + footer + interactivity).
 *
 * Reads three `<body>` data attributes:
 * - `data-shell="admin"` — opt-in. No-op if absent.
 * - `data-page="key"` — matches a {@link import('./shell-render.js').NAV} item to highlight.
 * - `data-breadcrumb="A > B > C"` — `>`-separated; last segment is current.
 *
 * Idempotent: if the build-time Vite plugin already injected the shell HTML
 * (the common case), this only wires up runtime behavior — mobile drawer,
 * theme toggle, notifications/messages/avatar dropdowns.
 */
export function mountShell() {
  const body = document.body;
  if (body.dataset.shell !== 'admin') {return;}

  injectShellIfMissing();
  bindNavSubmenus();
  bindSidebarToggle();
  bindThemeToggle();
  bindTopbarPanels();
}
