// Gentelella v4 — advanced form controls (date-range, rich-text, multi-select).
// Auto-init on DOM ready: any element with the relevant data attribute gets
// upgraded. No external dependencies.

// ────────────────────────
//  DATE-RANGE PICKER
// ────────────────────────
// Markup:
//   <div class="date-range" data-date-range>
//     <input type="text" class="form-control" placeholder="Pick a date range" readonly>
//   </div>
// Public events: emits 'change' on the wrapper with detail { from, to }.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function fmt(d) {
  if (!d) {return '';}
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isoDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function buildMonth(year, month, fromTs, toTs, hoverTs) {
  // Monday-first grid; ISO weekday: Mon = 0 .. Sun = 6.
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) {cells.push(null);}
  for (let d = 1; d <= daysInMonth; d += 1) {cells.push(new Date(year, month, d));}
  while (cells.length % 7 !== 0) {cells.push(null);}

  const html = cells.map((cell) => {
    if (!cell) {return '<div class="dr-cell empty"></div>';}
    const ts = isoDay(cell);
    const cls = ['dr-cell'];
    if (fromTs && ts === fromTs) {cls.push('selected', 'range-start');}
    if (toTs && ts === toTs) {cls.push('selected', 'range-end');}
    if (fromTs && toTs && ts > fromTs && ts < toTs) {cls.push('in-range');}
    if (fromTs && !toTs && hoverTs && ts > fromTs && ts <= hoverTs) {cls.push('in-range', 'preview');}
    if (ts === isoDay(new Date())) {cls.push('today');}
    return `<button type="button" class="${cls.join(' ')}" data-ts="${ts}">${cell.getDate()}</button>`;
  }).join('');

  return `
    <div class="dr-month">
      <div class="dr-month-head">${MONTHS[month]} ${year}</div>
      <div class="dr-dow">${DOW.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="dr-grid">${html}</div>
    </div>
  `;
}

function initDateRange(wrap) {
  if (wrap.dataset.drInit) {return;}
  wrap.dataset.drInit = '1';
  const input = wrap.querySelector('input');
  if (!input) {return;}
  input.readOnly = true;

  const state = {
    from: null,   // Date
    to: null,     // Date
    hover: null,  // Date (during pick)
    pivot: new Date()  // shown month
  };

  const popover = document.createElement('div');
  popover.className = 'dr-popover';
  popover.hidden = true;
  document.body.appendChild(popover);

  const presets = [
    { label: 'Today',         get: () => { const d = new Date(); return [d, d]; } },
    { label: 'Last 7 days',   get: () => { const a = new Date(); const b = new Date(); a.setDate(a.getDate() - 6); return [a, b]; } },
    { label: 'Last 30 days',  get: () => { const a = new Date(); const b = new Date(); a.setDate(a.getDate() - 29); return [a, b]; } },
    { label: 'This month',    get: () => { const b = new Date(); const a = new Date(b.getFullYear(), b.getMonth(), 1); return [a, b]; } },
    { label: 'Last month',    get: () => { const t = new Date(); const a = new Date(t.getFullYear(), t.getMonth() - 1, 1); const b = new Date(t.getFullYear(), t.getMonth(), 0); return [a, b]; } },
    { label: 'This year',     get: () => { const b = new Date(); const a = new Date(b.getFullYear(), 0, 1); return [a, b]; } }
  ];

  const render = () => {
    const m1 = state.pivot;
    const m2 = new Date(m1.getFullYear(), m1.getMonth() + 1, 1);
    const fromTs = state.from ? isoDay(state.from) : null;
    const toTs = state.to ? isoDay(state.to) : null;
    const hoverTs = state.hover ? isoDay(state.hover) : null;
    popover.innerHTML = `
      <div class="dr-presets">
        ${presets.map((p) => `<button type="button" class="dr-preset" data-preset="${p.label}">${p.label}</button>`).join('')}
      </div>
      <div class="dr-cal">
        <div class="dr-nav">
          <button type="button" class="dr-prev" aria-label="Previous month"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 4L6 8l4 4"/></svg></button>
          <div class="dr-spacer"></div>
          <button type="button" class="dr-next" aria-label="Next month"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 4l4 4-4 4"/></svg></button>
        </div>
        <div class="dr-months">
          ${buildMonth(m1.getFullYear(), m1.getMonth(), fromTs, toTs, hoverTs)}
          ${buildMonth(m2.getFullYear(), m2.getMonth(), fromTs, toTs, hoverTs)}
        </div>
        <div class="dr-footer">
          <div class="dr-summary">${state.from ? fmt(state.from) : '—'} → ${state.to ? fmt(state.to) : '—'}</div>
          <div style="display:flex;gap:6px">
            <button type="button" class="btn btn-ghost btn-sm" data-action="clear">Clear</button>
            <button type="button" class="btn btn-primary btn-sm" data-action="apply" ${state.from ? '' : 'disabled'}>Apply</button>
          </div>
        </div>
      </div>
    `;
  };

  const position = () => {
    const r = input.getBoundingClientRect();
    popover.style.position = 'fixed';
    popover.style.top = `${r.bottom + 6}px`;
    popover.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - popover.offsetWidth - 8))}px`;
  };

  const open = () => {
    popover.hidden = false;
    render();
    requestAnimationFrame(position);
    wrap.classList.add('open');
  };
  const close = () => { popover.hidden = true; wrap.classList.remove('open'); };

  input.addEventListener('focus', open);
  input.addEventListener('click', open);

  popover.addEventListener('click', (e) => {
    const cell = e.target.closest('.dr-cell:not(.empty)');
    if (cell) {
      const ts = parseInt(cell.dataset.ts, 10);
      const d = new Date(ts);
      if (!state.from || (state.from && state.to)) {
        state.from = d; state.to = null; state.hover = null;
      } else if (ts < isoDay(state.from)) {
        state.to = state.from; state.from = d;
      } else {
        state.to = d;
      }
      render();
      return;
    }
    if (e.target.closest('.dr-prev')) { state.pivot = new Date(state.pivot.getFullYear(), state.pivot.getMonth() - 1, 1); render(); }
    else if (e.target.closest('.dr-next')) { state.pivot = new Date(state.pivot.getFullYear(), state.pivot.getMonth() + 1, 1); render(); }
    else if (e.target.closest('[data-preset]')) {
      const p = presets.find((x) => x.label === e.target.closest('[data-preset]').dataset.preset);
      if (p) { const [a, b] = p.get(); state.from = a; state.to = b; state.pivot = new Date(a.getFullYear(), a.getMonth(), 1); render(); }
    }
    else if (e.target.closest('[data-action="clear"]')) { state.from = state.to = null; render(); }
    else if (e.target.closest('[data-action="apply"]')) {
      input.value = state.from ? `${fmt(state.from)} → ${fmt(state.to || state.from)}` : '';
      wrap.dispatchEvent(new CustomEvent('change', { detail: { from: state.from, to: state.to || state.from } }));
      close();
    }
  });

  popover.addEventListener('mouseover', (e) => {
    if (state.from && !state.to) {
      const cell = e.target.closest('.dr-cell:not(.empty)');
      if (cell) { state.hover = new Date(parseInt(cell.dataset.ts, 10)); render(); }
    }
  });

  document.addEventListener('click', (e) => {
    if (popover.hidden) {return;}
    if (popover.contains(e.target) || wrap.contains(e.target)) {return;}
    close();
  }, true);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !popover.hidden) {close();} });
  window.addEventListener('resize', () => { if (!popover.hidden) {position();} });
}

// ────────────────────────
//  RICH TEXT EDITOR
// ────────────────────────
// Markup:
//   <div class="rich-text" data-rich-text>
//     <textarea name="bio" hidden></textarea>
//   </div>
// The hidden textarea is kept in sync with the editor's HTML so the parent
// form picks it up on submit.
function initRichText(wrap) {
  if (wrap.dataset.rtInit) {return;}
  wrap.dataset.rtInit = '1';

  const textarea = wrap.querySelector('textarea');
  const initial = textarea?.value || wrap.innerHTML;

  wrap.innerHTML = `
    <div class="rt-toolbar" role="toolbar" aria-label="Formatting">
      <button type="button" data-cmd="bold" aria-label="Bold" title="Bold (⌘B)"><strong>B</strong></button>
      <button type="button" data-cmd="italic" aria-label="Italic" title="Italic (⌘I)"><em>I</em></button>
      <button type="button" data-cmd="underline" aria-label="Underline" title="Underline (⌘U)"><span style="text-decoration:underline">U</span></button>
      <span class="rt-sep"></span>
      <button type="button" data-block="h2" aria-label="Heading 2" title="Heading">H</button>
      <button type="button" data-block="blockquote" aria-label="Quote" title="Quote">"</button>
      <button type="button" data-cmd="insertUnorderedList" aria-label="Bulleted list" title="Bulleted list">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="3" cy="4" r="1" fill="currentColor"/><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><line x1="6" y1="4" x2="14" y2="4"/><line x1="6" y1="8" x2="14" y2="8"/><line x1="6" y1="12" x2="14" y2="12"/></svg>
      </button>
      <button type="button" data-cmd="insertOrderedList" aria-label="Numbered list" title="Numbered list">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><text x="2" y="6" font-size="6" font-family="monospace" fill="currentColor">1</text><text x="2" y="11" font-size="6" font-family="monospace" fill="currentColor">2</text><text x="2" y="15" font-size="6" font-family="monospace" fill="currentColor">3</text><line x1="7" y1="4" x2="14" y2="4"/><line x1="7" y1="9" x2="14" y2="9"/><line x1="7" y1="14" x2="14" y2="14"/></svg>
      </button>
      <span class="rt-sep"></span>
      <button type="button" data-cmd="link" aria-label="Insert link" title="Link (⌘K)">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 9l2-2M5 5H4a3 3 0 100 6h2M11 11h1a3 3 0 100-6h-2"/></svg>
      </button>
      <button type="button" data-cmd="formatBlock" data-arg="<pre>" aria-label="Code block" title="Code"><code>&lt;/&gt;</code></button>
      <span class="rt-sep"></span>
      <button type="button" data-cmd="removeFormat" aria-label="Clear formatting" title="Clear">×</button>
    </div>
    <div class="rt-editor" contenteditable="true" role="textbox" aria-multiline="true">${initial}</div>
  `;

  if (textarea) {wrap.appendChild(textarea);}

  const editor = wrap.querySelector('.rt-editor');
  const toolbar = wrap.querySelector('.rt-toolbar');

  const sync = () => {
    if (textarea) {textarea.value = editor.innerHTML;}
    wrap.dispatchEvent(new CustomEvent('input', { detail: editor.innerHTML }));
  };

  const exec = (cmd, arg = null) => {
    if (cmd === 'link') {
      // eslint-disable-next-line no-alert -- minimal link picker; replace with a modal in your app if needed.
      const url = prompt('Link URL:', 'https://');
      if (url) {document.execCommand('createLink', false, url);}
    } else {
      // execCommand is deprecated but the only zero-dependency option that
      // works across every modern browser. Acceptable for a template demo.
      document.execCommand(cmd, false, arg);
    }
    editor.focus();
    sync();
  };

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cmd], button[data-block]');
    if (!btn) {return;}
    e.preventDefault();
    if (btn.dataset.block) {exec('formatBlock', `<${btn.dataset.block}>`);}
    else {exec(btn.dataset.cmd, btn.dataset.arg);}
  });

  editor.addEventListener('input', sync);
  editor.addEventListener('keydown', (e) => {
    if (!(e.metaKey || e.ctrlKey)) {return;}
    const map = { b: 'bold', i: 'italic', u: 'underline', k: 'link' };
    const cmd = map[e.key.toLowerCase()];
    if (cmd) { e.preventDefault(); exec(cmd); }
  });
}

// ────────────────────────
//  MULTI-SELECT (chips + autocomplete)
// ────────────────────────
// Markup:
//   <div class="multi-select" data-multi-select data-options="One,Two,Three">
//     <select multiple hidden></select>
//   </div>
// Reads options from data-options (comma-separated) or from a child <select>.
function initMultiSelect(wrap) {
  if (wrap.dataset.msInit) {return;}
  wrap.dataset.msInit = '1';

  let options;
  const select = wrap.querySelector('select');
  if (select) {
    options = [...select.options].map((o) => ({ value: o.value, label: o.textContent }));
  } else if (wrap.dataset.options) {
    options = wrap.dataset.options.split(',').map((s) => s.trim()).filter(Boolean).map((v) => ({ value: v, label: v }));
  } else {
    options = [];
  }

  const selected = new Set(
    select ? [...select.selectedOptions].map((o) => o.value) : []
  );

  wrap.innerHTML = `
    <div class="ms-input" tabindex="0">
      <div class="ms-chips"></div>
      <input type="text" class="ms-search" placeholder="Type to search…" aria-label="Search options" autocomplete="off">
      <svg class="ms-chev" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6l4 4 4-4"/></svg>
    </div>
    <div class="ms-menu" hidden role="listbox"></div>
  `;
  if (select) {wrap.appendChild(select);}

  const inputEl = wrap.querySelector('.ms-input');
  const chipsEl = wrap.querySelector('.ms-chips');
  const searchEl = wrap.querySelector('.ms-search');
  const menuEl = wrap.querySelector('.ms-menu');

  const renderChips = () => {
    chipsEl.innerHTML = [...selected].map((v) => {
      const opt = options.find((o) => o.value === v);
      const label = opt ? opt.label : v;
      return `<span class="ms-chip">${escapeHtml(label)}<button type="button" data-remove="${escapeAttr(v)}" aria-label="Remove">×</button></span>`;
    }).join('');
  };

  const renderMenu = () => {
    const q = searchEl.value.trim().toLowerCase();
    const filtered = options.filter((o) => !selected.has(o.value) && (!q || o.label.toLowerCase().includes(q)));
    if (!filtered.length) {
      menuEl.innerHTML = `<div class="ms-empty">${q ? 'No matches' : 'All selected'}</div>`;
    } else {
      menuEl.innerHTML = filtered.map((o, i) => `
        <button type="button" class="ms-option${i === 0 ? ' active' : ''}" data-value="${escapeAttr(o.value)}">${escapeHtml(o.label)}</button>
      `).join('');
    }
  };

  const sync = () => {
    if (select) {
      [...select.options].forEach((o) => { o.selected = selected.has(o.value); });
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    wrap.dispatchEvent(new CustomEvent('change', { detail: { values: [...selected] } }));
  };

  const add = (val) => { selected.add(val); renderChips(); renderMenu(); sync(); searchEl.value = ''; searchEl.focus(); };
  const remove = (val) => { selected.delete(val); renderChips(); renderMenu(); sync(); };

  const open = () => { menuEl.hidden = false; wrap.classList.add('open'); renderMenu(); };
  const close = () => { menuEl.hidden = true; wrap.classList.remove('open'); };

  inputEl.addEventListener('click', () => { searchEl.focus(); open(); });
  searchEl.addEventListener('focus', open);
  searchEl.addEventListener('input', renderMenu);
  searchEl.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !searchEl.value && selected.size) {
      const last = [...selected].pop();
      remove(last);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const opts = [...menuEl.querySelectorAll('.ms-option')];
      if (!opts.length) {return;}
      const i = opts.findIndex((o) => o.classList.contains('active'));
      const ni = e.key === 'ArrowDown' ? (i + 1) % opts.length : (i - 1 + opts.length) % opts.length;
      opts.forEach((o) => o.classList.remove('active'));
      opts[ni].classList.add('active');
      opts[ni].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = menuEl.querySelector('.ms-option.active');
      if (active) {add(active.dataset.value);}
    } else if (e.key === 'Escape') { close(); }
  });

  menuEl.addEventListener('click', (e) => {
    const opt = e.target.closest('.ms-option');
    if (opt) {add(opt.dataset.value);}
  });
  chipsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (btn) {remove(btn.dataset.remove);}
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {close();}
  });

  renderChips();
  renderMenu();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

/**
 * Wire up every advanced form control on the page. Idempotent.
 */
export function initFormControls() {
  document.querySelectorAll('[data-date-range]').forEach(initDateRange);
  document.querySelectorAll('[data-rich-text]').forEach(initRichText);
  document.querySelectorAll('[data-multi-select]').forEach(initMultiSelect);
}
