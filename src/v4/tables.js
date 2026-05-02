// Gentelella 2026 v4 — DataTables integration
// Dynamic-imports DataTables only when a [data-datatable] table is present.

import { showToast } from './toast.js';

/**
 * Initialize DataTables on every `<table data-datatable>` on the page.
 * Reads `data-page-length` (default 10) on the table and `data-orderable="false"`
 * on individual `<th>` cells to disable sorting per column.
 *
 * Opt-in extras (just add the attribute to the `<table>`):
 * - `data-selectable` — wire row checkboxes (header checkbox = select all visible).
 * - `data-export="filename"` — show a CSV export button in the table card header.
 *
 * Lazily imports `datatables.net`; the import never fires on pages without a
 * matching table.
 * @returns {Promise<void>}
 */
export async function initTables() {
  const tables = document.querySelectorAll('table[data-datatable]');
  if (!tables.length) {return;}

  const { default: DataTable } = await import('datatables.net');

  tables.forEach((table) => {
    const columnDefs = [];
    table.querySelectorAll('thead th').forEach((th, i) => {
      if (th.dataset.orderable === 'false') {
        columnDefs.push({ targets: i, orderable: false });
      }
    });

    const dt = new DataTable(table, {
      pageLength: parseInt(table.dataset.pageLength || '10', 10),
      lengthChange: false,
      order: [],
      columnDefs,
      language: {
        search: '',
        searchPlaceholder: 'Search…',
        info: 'Showing _START_–_END_ of _TOTAL_',
        infoEmpty: 'No matching records',
        infoFiltered: '(of _MAX_ total)',
        zeroRecords: 'No matches found',
        paginate: { previous: '←', next: '→' }
      }
    });

    if (table.hasAttribute('data-selectable') || hasRowCheckboxes(table)) {
      wireRowSelection(table);
    }
    if (table.hasAttribute('data-export')) {
      wireCsvExport(table, dt);
    }
  });
}

function hasRowCheckboxes(table) {
  return !!table.querySelector('thead input[type="checkbox"]');
}

function wireRowSelection(table) {
  const headerCb = table.querySelector('thead input[type="checkbox"]');

  const updateHeader = () => {
    if (!headerCb) {return;}
    const rowCbs = table.querySelectorAll('tbody input[type="checkbox"]');
    const checked = [...rowCbs].filter((c) => c.checked).length;
    headerCb.checked = checked > 0 && checked === rowCbs.length;
    headerCb.indeterminate = checked > 0 && checked < rowCbs.length;
    table.classList.toggle('has-selection', checked > 0);
    const counter = table.closest('.card')?.querySelector('.bulk-selection-count');
    if (counter) {counter.textContent = checked ? `${checked} selected` : '';}
  };

  if (headerCb) {
    headerCb.addEventListener('change', () => {
      const rowCbs = table.querySelectorAll('tbody input[type="checkbox"]');
      rowCbs.forEach((c) => { c.checked = headerCb.checked; });
      updateHeader();
    });
  }
  table.addEventListener('change', (e) => {
    const cb = e.target.closest('tbody input[type="checkbox"]');
    if (!cb) {return;}
    updateHeader();
  });
}

function wireCsvExport(table, dt) {
  const filename = (table.dataset.export || 'export') + '.csv';
  // Find the export button. If a sibling already exists with [data-export-btn],
  // use it; otherwise inject a small button into the card header (next to the
  // existing actions, if any).
  let btn = table.closest('.card')?.querySelector('[data-export-btn]');
  if (!btn) {
    const header = table.closest('.card')?.querySelector('.card-header');
    if (!header) {return;}
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline btn-sm';
    btn.setAttribute('data-export-btn', '');
    btn.textContent = 'Export CSV';
    let actions = header.querySelector('.card-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'card-actions';
      actions.style.marginLeft = 'auto';
      header.appendChild(actions);
    }
    actions.appendChild(btn);
  }

  btn.addEventListener('click', () => {
    const rows = [];
    const headers = [];
    dt.columns().every(function () {
      const th = this.header();
      if (th && th.dataset.orderable === 'false' && !th.textContent.trim()) {
        headers.push(null); // skip checkbox/action columns
      } else {
        headers.push(th ? th.textContent.trim() : '');
      }
    });
    rows.push(headers.filter((h) => h !== null).map(csvEscape).join(','));

    // Iterate filtered + sorted rows in display order. `indexes()` gives DT
    // indexes; `.row(i).node()` returns the underlying <tr>.
    const indexes = dt.rows({ search: 'applied', order: 'applied' }).indexes();
    for (let n = 0; n < indexes.length; n += 1) {
      const rowEl = dt.row(indexes[n]).node();
      if (!rowEl) {continue;}
      const cells = [];
      [...rowEl.cells].forEach((td, idx) => {
        if (headers[idx] === null) {return;}
        cells.push(csvEscape(td.textContent.trim().replace(/\s+/g, ' ')));
      });
      rows.push(cells.join(','));
    }

    downloadFile(filename, rows.join('\n'), 'text/csv;charset=utf-8;');
    showToast(`Exported ${filename}`, { variant: 'success' });
  });
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) {return `"${s.replace(/"/g, '""')}"`;}
  return s;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
