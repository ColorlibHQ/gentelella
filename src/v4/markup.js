// Gentelella v4 — markup helpers.
//
// Pure functions that return HTML strings. Use them when building content
// dynamically (rows from a fetched list, cards from an array, etc.) so you
// stop hand-writing 20–30 line scaffolds in every page script. Static pages
// keep their hand-written HTML — these aren't a templating engine, they're
// a duplication killer for JS-driven content.
//
// All user-supplied strings are auto-escaped via `escapeHtml`. Pass raw SVG
// or trusted HTML through fields documented as "html-trusted".

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Escape a string for safe insertion into HTML text or attribute values.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).replace(/[&<>"']/g, (c) => ESC[c]);
}

const e = escapeHtml;

// ────────────────────────────────────────────────────────────────────────
//  Page header — used on 46 pages
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} PageHeaderOptions
 * @property {string} title          Main page title.
 * @property {string} [pretitle]     Section label above the title.
 * @property {string} [actionsHtml]  html-trusted: raw markup for action buttons.
 */

/**
 * Render a `.page-header` block.
 * @param {PageHeaderOptions} opts
 * @returns {string}
 */
export function pageHeader({ title, pretitle, actionsHtml }) {
  const pre = pretitle ? `<div class="page-pretitle">${e(pretitle)}</div>` : '';
  const actions = actionsHtml ? `<div class="page-actions">${actionsHtml}</div>` : '';
  return `<div class="page-header"><div class="page-header-row"><div>${pre}<div class="page-title">${e(title)}</div></div>${actions}</div></div>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Stat tile — used on 8 dashboard pages
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {'teal'|'green'|'blue'|'yellow'|'red'|'purple'|'pink'|'azure'} StatColor
 *
 * @typedef {object} StatTileOptions
 * @property {string}    label
 * @property {string}    value
 * @property {StatColor} [color]      Defaults to 'teal'.
 * @property {string}    [iconHtml]   html-trusted: raw SVG markup for the icon.
 * @property {string}    [subtext]
 * @property {{ pct: string, direction: 'up'|'down' }} [change]
 */

/**
 * Render a `.card .stat` tile (icon + label + value + optional change/subtext).
 * @param {StatTileOptions} opts
 * @returns {string}
 */
export function statTile({ label, value, color = 'teal', iconHtml = '', subtext, change }) {
  const icon = iconHtml ? `<div class="stat-icon ${e(color)}">${iconHtml}</div>` : '';
  const chg = change
    ? `<span class="stat-change ${e(change.direction)}">${e(change.pct)}</span>`
    : '';
  const sub = subtext ? `<div class="stat-subtext">${e(subtext)}</div>` : '';
  return `<div class="card"><div class="stat">${icon}<div class="stat-content"><div class="stat-label">${e(label)}</div><div class="stat-value-row"><span class="stat-value">${e(value)}</span>${chg}</div>${sub}</div></div></div>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Status badge — used on 16+ pages
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {'green'|'blue'|'yellow'|'red'|'gray'} StatusColor
 */

/**
 * Render a `.status` pill. Pass the visible label and the status color.
 * @param {string} label
 * @param {StatusColor} color
 * @returns {string}
 */
export function statusBadge(label, color) {
  return `<span class="status status-${e(color)}">${e(label)}</span>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Customer cell — table cell with avatar + name (10 pages)
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} CustomerCellOptions
 * @property {string} name
 * @property {string} [initials]      Two letters; defaults to first letters of name.
 * @property {string} [avatarColor]   CSS color value for the avatar background.
 */

/**
 * Render a `.cell-customer` block (avatar circle + name). Use as the inner
 * HTML of a `<td>`.
 * @param {CustomerCellOptions} opts
 * @returns {string}
 */
export function customerCell({ name, initials, avatarColor = 'var(--primary)' }) {
  const init = initials ?? name.split(/\s+/).slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  return `<div class="cell-customer"><div class="cell-avatar" style="background:${e(avatarColor)}">${e(init)}</div><span class="cell-strong">${e(name)}</span></div>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Activity item — used in feeds, audit logs (5 pages)
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} ActivityItemOptions
 * @property {string} bodyHtml         html-trusted: rendered message (often contains <strong>).
 * @property {string} time             Relative timestamp like "2 min ago".
 * @property {string} [initials]
 * @property {string} [avatarBg]       CSS background for the avatar (any gradient or color).
 */

/**
 * Render an `<li class="activity-item">` row. Wrap multiple in
 * `<ul class="activity-list">…</ul>`.
 * @param {ActivityItemOptions} opts
 * @returns {string}
 */
export function activityItem({ bodyHtml, time, initials = '', avatarBg = 'var(--primary)' }) {
  return `<li class="activity-item"><div class="activity-avatar" style="background:${e(avatarBg)}">${e(initials)}</div><div><div class="activity-body">${bodyHtml}</div><div class="activity-time">${e(time)}</div></div></li>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Visitor / distribution row (5 pages)
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} VisitorRowOptions
 * @property {string}        name
 * @property {number}        pct        0–100; rendered as "NN%" and as the bar fill width.
 * @property {string}        [flag]     Emoji or short prefix (rendered before the name).
 */

/**
 * Render a `.visitor-row` (label + percentage + horizontal bar).
 * @param {VisitorRowOptions} opts
 * @returns {string}
 */
export function visitorRow({ name, pct, flag = '' }) {
  const f = flag ? `<span class="visitor-flag">${e(flag)}</span>` : '';
  const w = Math.max(0, Math.min(100, pct));
  return `<div class="visitor-row">${f}<span class="visitor-name">${e(name)}</span><span class="visitor-pct">${w}%</span><div class="visitor-bar"><div class="fill" style="width:${w}%"></div></div></div>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Empty state — used as a fallback when a list/table has 0 results
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} EmptyStateOptions
 * @property {string} title
 * @property {string} [desc]        Description text below the title.
 * @property {string} [iconHtml]    html-trusted: raw SVG.
 * @property {string} [actionHtml]  html-trusted: a button or link.
 */

/**
 * Render an empty-state block (icon + title + description + optional CTA).
 * @param {EmptyStateOptions} opts
 * @returns {string}
 */
export function emptyState({ title, desc, iconHtml, actionHtml }) {
  const icon = iconHtml ? `<div class="empty-state-icon">${iconHtml}</div>` : '';
  const d = desc ? `<div class="empty-state-desc">${e(desc)}</div>` : '';
  const a = actionHtml ? `<div class="empty-state-action">${actionHtml}</div>` : '';
  return `<div class="empty-state">${icon}<div class="empty-state-title">${e(title)}</div>${d}${a}</div>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Banner — error/info/warn/success messages (12+ occurrences)
// ────────────────────────────────────────────────────────────────────────

/**
 * @typedef {'danger'|'warning'|'info'|'success'} BannerVariant
 *
 * @typedef {object} BannerOptions
 * @property {string}        body
 * @property {BannerVariant} [variant]     Defaults to 'info'.
 * @property {string}        [title]
 * @property {string}        [iconHtml]    html-trusted: raw SVG.
 * @property {string}        [actionsHtml] html-trusted: action buttons.
 */

/**
 * Render a `.banner` alert (icon + title + body + actions).
 * @param {BannerOptions} opts
 * @returns {string}
 */
export function banner({ body, variant = 'info', title, iconHtml, actionsHtml }) {
  const icon = iconHtml ? `<div class="banner-icon">${iconHtml}</div>` : '';
  const t = title ? `<strong>${e(title)}</strong> ` : '';
  const a = actionsHtml ? `<div class="banner-actions">${actionsHtml}</div>` : '';
  return `<div class="banner banner-${e(variant)}">${icon}<div class="banner-body">${t}${e(body)}</div>${a}</div>`;
}

// ────────────────────────────────────────────────────────────────────────
//  Skeleton row — table loading state
// ────────────────────────────────────────────────────────────────────────

/**
 * Render N skeleton rows (each with `cols` cells of pulsing placeholder).
 * Returns a string of `<tr>…</tr>` ready to drop into a `<tbody>`.
 * @param {number} cols   Number of columns per row.
 * @param {number} [rows] Number of rows. Defaults to 5.
 * @returns {string}
 */
export function skeletonRows(cols, rows = 5) {
  const cell = '<td><span class="skeleton skeleton-text" style="width:80%"></span></td>';
  const row = `<tr>${cell.repeat(cols)}</tr>`;
  return row.repeat(rows);
}
