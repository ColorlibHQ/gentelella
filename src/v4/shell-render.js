// Gentelella 2026 v4 — shell render (pure)
// String-only renderers. No DOM, no window/document access.
// Imported by:
//   1. The Vite plugin (vite.config.js) to inject shell HTML at build/dev time.
//   2. src/v4/shell.js as a runtime fallback for pages that bypass the plugin.

// NAV items are either flat — { key, href, text, icon, badge? } —
// or a parent with `children: [{ key, href, text, badge? }]` for a submenu.
// The parent is `key`-less; its children carry their own keys for the
// `data-page` highlight match. The parent stays expanded if any child matches.
export const NAV = [
  {
    label: 'General',
    items: [
      {
        text: 'Dashboards', icon: 'dashboard',
        children: [
          { key: 'dashboard',   href: 'index.html',  text: 'Operations' },
          { key: 'dashboard-2', href: 'index2.html', text: 'Analytics' },
          { key: 'dashboard-3', href: 'index3.html', text: 'Sales' },
          { key: 'dashboard-4', href: 'index4.html', text: 'System health' }
        ]
      },
      {
        text: 'Forms', icon: 'forms', badge: { text: 'Hot', cls: 'badge-red' },
        children: [
          { key: 'forms',            href: 'form.html',            text: 'General' },
          { key: 'form-advanced',    href: 'form_advanced.html',   text: 'Advanced controls' },
          { key: 'form-buttons',     href: 'form_buttons.html',    text: 'Buttons' },
          { key: 'form-upload',      href: 'form_upload.html',     text: 'Upload' },
          { key: 'form-validation',  href: 'form_validation.html', text: 'Validation' },
          { key: 'form-wizards',     href: 'form_wizards.html',    text: 'Wizard' }
        ]
      },
      {
        text: 'Tables', icon: 'tables',
        children: [
          { key: 'tables',         href: 'tables.html',         text: 'Static' },
          { key: 'tables-dynamic', href: 'tables_dynamic.html', text: 'Dynamic' }
        ]
      },
      {
        text: 'Charts', icon: 'charts', badge: { text: 'New', cls: 'badge-teal' },
        children: [
          { key: 'charts',       href: 'chartjs.html',     text: 'Chart cards' },
          { key: 'echarts',      href: 'echarts.html',     text: 'ECharts gallery' },
          { key: 'other-charts', href: 'other_charts.html', text: 'SVG charts' }
        ]
      },
      { key: 'calendar', href: 'calendar.html', text: 'Calendar', icon: 'calendar' },
      { key: 'map',      href: 'map.html',      text: 'Map',      icon: 'map' }
    ]
  },
  {
    label: 'Apps',
    items: [
      { key: 'chat',          href: 'chat.html',          text: 'Chat',          icon: 'chat', badge: { text: '3', cls: 'badge-teal' } },
      { key: 'inbox',         href: 'inbox.html',         text: 'Inbox',         icon: 'mail' },
      { key: 'kanban',        href: 'kanban.html',        text: 'Kanban',        icon: 'kanban' },
      { key: 'files',         href: 'file_manager.html',  text: 'Files',         icon: 'files' },
      { key: 'notifications', href: 'notifications.html', text: 'Notifications', icon: 'bell' }
    ]
  },
  {
    label: 'E-commerce',
    items: [
      { key: 'storefront', href: 'e_commerce.html',    text: 'Storefront', icon: 'shop' },
      { key: 'product',    href: 'product_detail.html', text: 'Product',   icon: 'tag' },
      {
        text: 'Orders', icon: 'cart',
        children: [
          { key: 'orders',       href: 'orders.html',       text: 'All orders' },
          { key: 'order-detail', href: 'order_detail.html', text: 'Order detail' }
        ]
      },
      { key: 'invoice', href: 'invoice.html',        text: 'Invoice', icon: 'receipt' },
      { key: 'pricing', href: 'pricing_tables.html', text: 'Pricing', icon: 'price' }
    ]
  },
  {
    label: 'Projects',
    items: [
      { key: 'projects',       href: 'projects.html',       text: 'All projects', icon: 'projects' },
      { key: 'project-detail', href: 'project_detail.html', text: 'Project detail', icon: 'pages' }
    ]
  },
  {
    label: 'UI library',
    items: [
      { key: 'ui',         href: 'general_elements.html', text: 'Elements',   icon: 'ui' },
      { key: 'widgets',    href: 'widgets.html',          text: 'Widgets',    icon: 'pages', badge: { text: '5', cls: 'badge-blue' } },
      { key: 'playground', href: 'playground.html',       text: 'Playground', icon: 'code',  badge: { text: 'New', cls: 'badge-teal' } },
      { key: 'theme',      href: 'theme.html',            text: 'Theme',      icon: 'paint', badge: { text: 'New', cls: 'badge-teal' } },
      { key: 'typography', href: 'typography.html',       text: 'Typography', icon: 'type' },
      { key: 'icons',      href: 'icons.html',            text: 'Icons',      icon: 'icons' },
      { key: 'media',      href: 'media_gallery.html',    text: 'Media',      icon: 'media' }
    ]
  },
  {
    label: 'Admin',
    items: [
      { key: 'users',           href: 'contacts.html',         text: 'Contacts',        icon: 'users' },
      { key: 'user_management', href: 'user_management.html',  text: 'User management', icon: 'profile' },
      { key: 'profile',         href: 'profile.html',          text: 'Your profile',    icon: 'profile' },
      { key: 'settings',        href: 'settings.html',         text: 'Settings',        icon: 'settings' },
      { key: 'faq',             href: 'faq.html',              text: 'Help center',     icon: 'help' }
    ]
  },
  {
    label: 'Layouts',
    items: [
      { key: 'fixed-sidebar', href: 'fixed_sidebar.html', text: 'Fixed sidebar', icon: 'layout' },
      { key: 'fixed-footer',  href: 'fixed_footer.html',  text: 'Fixed footer',  icon: 'layout' },
      { key: 'level2',        href: 'level2.html',        text: 'Nested page',   icon: 'pages' },
      { key: 'plain',         href: 'plain_page.html',    text: 'Blank',         icon: 'pages' }
    ]
  }
];

export const ICONS = {
  dashboard: '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="4" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="10" width="7" height="11" rx="1.5"/></svg>',
  forms:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6M9 13h4"/></svg>',
  tables:    '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M9 10v9M15 10v9"/></svg>',
  charts:    '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19v-9"/></svg>',
  calendar:  '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M8 4v6M16 4v6"/></svg>',
  ui:        '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  pages:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20"/></svg>',
  media:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  users:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>',
  profile:   '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings:  '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>',
  chat:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
  bell:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3a6 6 0 00-6 6c0 6-3 7-3 7h18s-3-1-3-7a6 6 0 00-6-6z"/><path d="M10.5 21a1.5 1.5 0 003 0"/></svg>',
  kanban:    '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="6" height="14" rx="1.5"/><rect x="11" y="3" width="6" height="9" rx="1.5"/><rect x="19" y="3" width="2" height="6" rx="0.5"/></svg>',
  files:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>',
  shop:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l1-5h16l1 5M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9M3 9h18"/><path d="M9 13a3 3 0 006 0"/></svg>',
  tag:       '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 13l-7 7a2 2 0 01-2.83 0L3 12.83V4h8.83L20 12.17a2 2 0 010 2.83z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  cart:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1.5"/><circle cx="20" cy="21" r="1.5"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>',
  help:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>',
  mail:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6"/></svg>',
  map:       '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  receipt:   '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 21V3h14v18l-3-2-3 2-3-2-3 2-2-2z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  price:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="2" x2="12" y2="22"/><path d="M16 6H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H7"/></svg>',
  projects:  '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  type:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
  icons:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
  layout:    '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></svg>',
  code:      '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
  paint:     '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 11H5a2 2 0 00-2 2v2a2 2 0 002 2h2v3a1 1 0 001 1h3a1 1 0 001-1v-3h7a2 2 0 002-2v-2a2 2 0 00-2-2z"/><path d="M19 11V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v6"/></svg>'
};

const CHEVRON = '<svg class="nav-chev" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>';

function renderNavItem(item, activeKey) {
  if (item.children) {
    const childActive = item.children.some((c) => c.key === activeKey);
    const sub = item.children.map((c) => {
      const a = c.key === activeKey;
      return `<a class="nav-sublink${a ? ' active' : ''}" href="${c.href}"${a ? ' aria-current="page"' : ''}>${c.text}${c.badge ? `<span class="badge ${c.badge.cls}">${c.badge.text}</span>` : ''}</a>`;
    }).join('');
    const cls = ['nav-tree'];
    if (childActive) {cls.push('open', 'has-active');}
    return `
      <div class="${cls.join(' ')}">
        <button type="button" class="nav-link nav-toggle" aria-expanded="${childActive ? 'true' : 'false'}">
          ${ICONS[item.icon] || ''}
          <span class="nav-text">${item.text}</span>
          ${item.badge ? `<span class="badge ${item.badge.cls}">${item.badge.text}</span>` : ''}
          ${CHEVRON}
        </button>
        <div class="nav-sub"><div class="nav-sub-inner">${sub}</div></div>
      </div>
    `;
  }
  const a = item.key === activeKey;
  return `
    <a class="nav-link${a ? ' active' : ''}" href="${item.href}"${a ? ' aria-current="page"' : ''}>
      ${ICONS[item.icon] || ''}
      <span class="nav-text">${item.text}</span>
      ${item.badge ? `<span class="badge ${item.badge.cls}">${item.badge.text}</span>` : ''}
    </a>
  `;
}

export function renderSidebar(activeKey) {
  const groups = NAV.map((group) => `
    <div class="nav-group">
      <div class="nav-label">${group.label}</div>
      ${group.items.map((item) => renderNavItem(item, activeKey)).join('')}
    </div>
  `).join('');

  return `
    <aside class="sidebar" aria-label="Primary navigation">
      <div class="sidebar-brand">
        <div class="brand-icon">G</div>
        <div class="brand-name">Gentelella <small>v4</small></div>
      </div>
      <nav class="sidebar-nav">${groups}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="avatar">A<span class="online"></span></div>
          <div class="sidebar-user-info">
            <div class="name">Aigars Silkalns</div>
            <div class="role">Admin</div>
          </div>
          <button class="more-btn" aria-label="More options">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="13" r="1.2"/></svg>
          </button>
        </div>
      </div>
    </aside>
  `;
}

export function renderTopbar(breadcrumb) {
  const crumbs = (breadcrumb || ['Home']).map((c, i, arr) => {
    const isLast = i === arr.length - 1;
    return `${i > 0 ? '<span class="sep" aria-hidden="true">›</span>' : ''}<span${isLast ? ' class="current" aria-current="page"' : ''}>${c}</span>`;
  }).join('');

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>
      </div>
      <div class="search-box">
        <svg class="s-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="M11 11l3.5 3.5"/></svg>
        <input type="text" placeholder="Search pages or run a command…" aria-label="Open command palette">
        <kbd>⌘K</kbd>
      </div>
      <div class="topbar-right">
        <button class="tb-btn theme-toggle" type="button" title="Toggle theme" aria-label="Toggle theme" aria-pressed="false">
          <svg class="theme-icon-light" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          <svg class="theme-icon-dark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="tb-btn tb-notifications" type="button" title="Notifications" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3a6 6 0 00-6 6c0 6-3 7-3 7h18s-3-1-3-7a6 6 0 00-6-6z"/><path d="M10.5 21a1.5 1.5 0 003 0"/></svg>
          <span class="dot"></span>
        </button>
        <button class="tb-btn tb-messages" type="button" title="Messages" aria-label="Messages" aria-haspopup="dialog" aria-expanded="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 6 10-6"/></svg>
        </button>
        <button class="tb-avatar" type="button" aria-label="Account menu" aria-haspopup="menu" aria-expanded="false">A</button>
      </div>
    </header>
  `;
}

export function renderFooter() {
  return `
    <footer class="footer">
      <span>Gentelella — A free Bootstrap admin template by <a href="https://colorlib.com">Colorlib</a></span>
      <span>v4.0 Concept · 2026</span>
    </footer>
  `;
}

export function renderShell({ activeKey = '', breadcrumb = ['Home'] } = {}) {
  return {
    sidebar: renderSidebar(activeKey),
    topbar: renderTopbar(breadcrumb),
    footer: renderFooter()
  };
}

export function parseShellAttrs(attrs) {
  const shell = /data-shell\s*=\s*["']([^"']*)["']/.exec(attrs);
  if (!shell || shell[1] !== 'admin') {return null;}
  const page = /data-page\s*=\s*["']([^"']*)["']/.exec(attrs);
  const bc = /data-breadcrumb\s*=\s*["']([^"']*)["']/.exec(attrs);
  return {
    activeKey: page ? page[1] : '',
    breadcrumb: bc ? bc[1].split('>').map((s) => s.trim()).filter(Boolean) : ['Home']
  };
}
