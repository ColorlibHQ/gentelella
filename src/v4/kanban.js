// Kanban board with HTML5 drag-and-drop. Cards can be dragged between
// columns; columns are reorderable too. Click a card to edit/delete in a
// modal. No persistence — state lives in memory.

import { showToast } from './toast.js';
import { showModal } from './modal.js';

const COLUMNS = [
  { id: 'todo',    title: 'To do',       color: 'var(--text-muted)' },
  { id: 'doing',   title: 'In progress', color: 'var(--blue)' },
  { id: 'review',  title: 'Review',      color: 'var(--yellow)' },
  { id: 'done',    title: 'Done',        color: 'var(--green)' }
];

const LABELS = [
  { id: 'design',  text: 'Design',  color: 'purple' },
  { id: 'eng',     text: 'Eng',     color: 'blue' },
  { id: 'pm',      text: 'PM',      color: 'green' },
  { id: 'bug',     text: 'Bug',     color: 'red' },
  { id: 'urgent',  text: 'Urgent',  color: 'red' },
  { id: 'docs',    text: 'Docs',    color: 'yellow' }
];

const ASSIGNEES = {
  SK: { name: 'Sarah Kowalski', color: 'azure' },
  MR: { name: 'Michael Reyes',  color: 'purple' },
  EW: { name: 'Emily Wang',     color: 'yellow' },
  MK: { name: 'Mark Kim',       color: 'red' },
  LP: { name: 'Lina Park',      color: 'green' },
  DR: { name: 'Diego Reyes',    color: 'blue' },
  YT: { name: 'Yuki Tanaka',    color: 'primary' },
  TH: { name: 'Tom Hardy',      color: 'purple' }
};

const COLOR_VAR = {
  primary: 'var(--primary)', azure: 'var(--azure)', blue: 'var(--blue)',
  purple: 'var(--purple)', yellow: 'var(--yellow)', red: 'var(--red)',
  green: 'var(--green)'
};

let nextId = 1;
const CARDS = [
  { id: nextId++, col: 'todo',   title: 'Define onboarding email sequence',  desc: 'Three-message welcome flow with day 1, 3, 7 cadence',           labels: ['pm'],          assignees: ['EW'],       due: 'May 02', priority: 'medium' },
  { id: nextId++, col: 'todo',   title: 'Refresh icon system',                desc: 'Move from heroicons to a custom set with consistent stroke',     labels: ['design'],      assignees: ['SK'],       due: 'May 05', priority: 'low' },
  { id: nextId++, col: 'todo',   title: 'Audit a11y on form pages',           desc: '',                                                                labels: ['eng', 'docs'], assignees: ['MR', 'TH'], due: 'May 08', priority: 'medium' },
  { id: nextId++, col: 'todo',   title: 'Plan Q3 OKRs',                       desc: 'Workshop with leads to define Q3 outcomes',                      labels: ['pm'],          assignees: ['EW'],       due: 'May 15', priority: 'low' },

  { id: nextId++, col: 'doing',  title: 'Implement drag-and-drop kanban',    desc: 'Use HTML5 drag API, no library',                                 labels: ['eng'],         assignees: ['MR'],       due: 'Apr 30', priority: 'high' },
  { id: nextId++, col: 'doing',  title: 'Design product detail page',         desc: 'Gallery + variants + reviews + related',                         labels: ['design'],      assignees: ['SK'],       due: 'Apr 30', priority: 'high' },
  { id: nextId++, col: 'doing',  title: 'Write FAQ content',                  desc: '15 articles across 5 categories',                                labels: ['docs'],        assignees: ['EW'],       due: 'May 01', priority: 'medium' },

  { id: nextId++, col: 'review', title: 'Fix DataTables sort indicators',    desc: 'Replace empty span with proper chevron SVG',                     labels: ['bug', 'eng'],  assignees: ['MR'],       due: 'Apr 29', priority: 'medium' },
  { id: nextId++, col: 'review', title: 'Notifications dropdown',             desc: 'Bell button → panel with sample notifications',                  labels: ['eng'],         assignees: ['TH'],       due: 'Apr 29', priority: 'medium' },

  { id: nextId++, col: 'done',   title: 'Build chat page',                    desc: '',                                                                labels: ['eng'],         assignees: ['MR'],       due: 'Apr 28', priority: 'high' },
  { id: nextId++, col: 'done',   title: 'Build settings page',                desc: '',                                                                labels: ['eng', 'design'], assignees: ['SK', 'TH'], due: 'Apr 28', priority: 'high' },
  { id: nextId++, col: 'done',   title: 'Migrate to Vite 8',                  desc: '',                                                                labels: ['eng'],         assignees: ['MR'],       due: 'Apr 25', priority: 'medium' },
  { id: nextId++, col: 'done',   title: 'Add dark mode',                      desc: 'Pre-paint script, token overrides, ECharts theme observer',      labels: ['eng', 'design'], assignees: ['MR', 'SK'], due: 'Apr 25', priority: 'high' }
];

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function getLabel(id) { return LABELS.find((l) => l.id === id); }

function renderCard(card) {
  const labels = card.labels.map((id) => {
    const l = getLabel(id);
    return l ? `<span class="kanban-label kanban-label-${l.color}">${l.text}</span>` : '';
  }).join('');
  const avatars = card.assignees.map((a) => {
    const info = ASSIGNEES[a];
    return info ? `<span class="kanban-avatar" style="background:${COLOR_VAR[info.color]}" title="${escapeHtml(info.name)}">${a}</span>` : '';
  }).join('');
  const priorityIcon = card.priority === 'high'
    ? '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--red)" stroke-width="2"><path d="M3 12V4l5 4 5-4v8"/></svg>'
    : card.priority === 'low'
      ? '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--text-muted)" stroke-width="2"><path d="M3 4v8l5-4 5 4V4"/></svg>'
      : '';
  return `
    <article class="kanban-card" draggable="true" data-id="${card.id}">
      ${labels ? `<div class="kanban-card-labels">${labels}</div>` : ''}
      <div class="kanban-card-title">${escapeHtml(card.title)}</div>
      ${card.desc ? `<div class="kanban-card-desc">${escapeHtml(card.desc)}</div>` : ''}
      <div class="kanban-card-foot">
        <div class="kanban-card-meta">
          ${priorityIcon}
          ${card.due ? `<span class="due-date">${escapeHtml(card.due)}</span>` : ''}
        </div>
        <div class="kanban-card-avatars">${avatars}</div>
      </div>
    </article>
  `;
}

function renderColumn(col) {
  const cards = CARDS.filter((c) => c.col === col.id);
  return `
    <section class="kanban-column" data-col="${col.id}">
      <header class="kanban-column-head">
        <span class="dot" style="background:${col.color}"></span>
        <span class="title">${escapeHtml(col.title)}</span>
        <span class="count">${cards.length}</span>
        <button type="button" class="kanban-add" data-add-col="${col.id}" aria-label="Add card to ${col.title}">+</button>
      </header>
      <div class="kanban-column-body" data-drop="${col.id}">
        ${cards.map(renderCard).join('')}
      </div>
      <button type="button" class="kanban-column-foot" data-add-col="${col.id}">+ Add card</button>
    </section>
  `;
}

function render() {
  document.getElementById('kanban-board').innerHTML = COLUMNS.map(renderColumn).join('');
}

// ── Drag and drop ──

let draggedId = null;

function setupDnD(boardEl) {
  boardEl.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.kanban-card');
    if (!card) {return;}
    draggedId = parseInt(card.dataset.id, 10);
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    // Firefox needs data set on dataTransfer to actually drag.
    e.dataTransfer.setData('text/plain', String(draggedId));
  });

  boardEl.addEventListener('dragend', (e) => {
    const card = e.target.closest('.kanban-card');
    if (card) {card.classList.remove('dragging');}
    document.querySelectorAll('.kanban-column-body.drop-target').forEach((el) => el.classList.remove('drop-target'));
    draggedId = null;
  });

  boardEl.addEventListener('dragover', (e) => {
    const body = e.target.closest('[data-drop]');
    if (!body) {return;}
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    body.classList.add('drop-target');
    // Find the card we're hovering over to insert before/after
    const dragging = document.querySelector('.kanban-card.dragging');
    if (!dragging) {return;}
    const after = getDragAfterElement(body, e.clientY);
    if (after === null) {body.appendChild(dragging);}
    else {body.insertBefore(dragging, after);}
  });

  boardEl.addEventListener('dragleave', (e) => {
    const body = e.target.closest('[data-drop]');
    if (body && !body.contains(e.relatedTarget)) {body.classList.remove('drop-target');}
  });

  boardEl.addEventListener('drop', (e) => {
    const body = e.target.closest('[data-drop]');
    if (!body || draggedId === null) {return;}
    e.preventDefault();
    body.classList.remove('drop-target');
    const newCol = body.dataset.drop;
    const card = CARDS.find((c) => c.id === draggedId);
    if (card && card.col !== newCol) {
      card.col = newCol;
      // Re-order cards based on DOM order in target column
      reorderCardsFromDom();
      render();
      setupDnD(boardEl); // re-attach listeners after re-render
      const colTitle = COLUMNS.find((c) => c.id === newCol)?.title || newCol;
      showToast(`Moved to ${colTitle}`);
    } else {
      // Same column — just persist new order
      reorderCardsFromDom();
    }
  });
}

function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll('.kanban-card:not(.dragging)')];
  return els.reduce((closest, el) => {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {return { offset, element: el };}
    return closest;
  }, { offset: -Infinity, element: null }).element;
}

function reorderCardsFromDom() {
  // Re-sort the CARDS array to match DOM order (per column)
  const ordered = [];
  COLUMNS.forEach((col) => {
    const body = document.querySelector(`[data-drop="${col.id}"]`);
    if (!body) {return;}
    body.querySelectorAll('.kanban-card').forEach((cardEl) => {
      const id = parseInt(cardEl.dataset.id, 10);
      const card = CARDS.find((c) => c.id === id);
      if (card) {ordered.push(card);}
    });
  });
  // Replace contents of CARDS in place
  CARDS.length = 0;
  ordered.forEach((c) => CARDS.push(c));
}

// ── Card editor modal ──

function openCardEditor(cardId) {
  const isNew = !cardId;
  const card = isNew
    ? { id: nextId++, col: 'todo', title: '', desc: '', labels: [], assignees: [], due: '', priority: 'medium' }
    : CARDS.find((c) => c.id === cardId);
  if (!card) {return;}

  const labelChips = LABELS.map((l) => `
    <button type="button" class="chip${card.labels.includes(l.id) ? ' active' : ''}" data-label="${l.id}">${l.text}</button>
  `).join('');

  const assigneeChips = Object.entries(ASSIGNEES).map(([k, info]) => `
    <button type="button" class="kanban-assignee-chip${card.assignees.includes(k) ? ' active' : ''}" data-assignee="${k}" title="${escapeHtml(info.name)}">
      <span class="av" style="background:${COLOR_VAR[info.color]}">${k}</span>
      <span>${escapeHtml(info.name)}</span>
    </button>
  `).join('');

  const body = `
    <form class="modal-form" novalidate>
      <div class="modal-form-row">
        <label for="kc-title">Title</label>
        <input type="text" id="kc-title" name="title" value="${escapeHtml(card.title)}" placeholder="Task title" autocomplete="off" required>
      </div>
      <div class="modal-form-row">
        <label for="kc-desc">Description</label>
        <textarea id="kc-desc" name="desc" rows="3" placeholder="Optional notes…">${escapeHtml(card.desc)}</textarea>
      </div>
      <div class="modal-form-row">
        <label>Labels</label>
        <div class="kanban-chip-group" data-group="labels">${labelChips}</div>
      </div>
      <div class="modal-form-row">
        <label>Assignees</label>
        <div class="kanban-chip-group" data-group="assignees">${assigneeChips}</div>
      </div>
      <div class="modal-form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label for="kc-due">Due date</label>
          <input type="text" id="kc-due" name="due" value="${escapeHtml(card.due)}" placeholder="May 15">
        </div>
        <div>
          <label for="kc-priority">Priority</label>
          <select id="kc-priority" name="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div class="modal-form-row">
        <label for="kc-col">Column</label>
        <select id="kc-col" name="col">
          ${COLUMNS.map((c) => `<option value="${c.id}">${c.title}</option>`).join('')}
        </select>
      </div>
    </form>
  `;

  const actions = [];
  if (!isNew) {
    actions.push({ label: 'Delete', variant: 'outline', closeOnAction: false, action: () => {
      const i = CARDS.findIndex((c) => c.id === cardId);
      if (i > -1) {
        const c = CARDS[i];
        CARDS.splice(i, 1);
        render();
        setupDnD(document.getElementById('kanban-board'));
        showToast(`Deleted: ${c.title}`);
      }
      return true;
    } });
  }
  actions.push({ label: 'Cancel', variant: 'outline' });
  actions.push({ label: isNew ? 'Create' : 'Save', variant: 'primary', action: ({ body: bodyEl }) => {
    const form = bodyEl.querySelector('form');
    const fd = new FormData(form);
    const title = (fd.get('title') || '').toString().trim();
    if (!title) { showToast('Title is required', { variant: 'warning' }); return false; }
    card.title = title;
    card.desc  = (fd.get('desc')  || '').toString().trim();
    card.due   = (fd.get('due')   || '').toString().trim();
    card.priority = (fd.get('priority') || 'medium').toString();
    card.col   = (fd.get('col')   || 'todo').toString();
    card.labels = Array.from(bodyEl.querySelectorAll('[data-group="labels"] .chip.active')).map((b) => b.dataset.label);
    card.assignees = Array.from(bodyEl.querySelectorAll('[data-group="assignees"] .kanban-assignee-chip.active')).map((b) => b.dataset.assignee);
    if (isNew) {CARDS.push(card);}
    render();
    setupDnD(document.getElementById('kanban-board'));
    showToast(isNew ? `Created: ${title}` : `Saved: ${title}`, { variant: 'success' });
    return true;
  } });

  const { dialog } = showModal({ title: isNew ? 'New card' : 'Edit card', body, actions, size: 'lg' });

  // Sync select defaults (HTML escaping doesn't preserve <select> selected on innerHTML insertion)
  dialog.querySelector('#kc-col').value = card.col;
  dialog.querySelector('#kc-priority').value = card.priority || 'medium';

  // Toggle chips
  dialog.querySelectorAll('.kanban-chip-group .chip, .kanban-chip-group .kanban-assignee-chip').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      b.classList.toggle('active');
    });
  });
}

// ── Init ──

export function initKanban() {
  const board = document.getElementById('kanban-board');
  if (!board) {return;}

  render();
  setupDnD(board);

  board.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-col]');
    if (addBtn) {
      e.stopPropagation();
      const col = addBtn.dataset.addCol;
      // Open the new-card modal then patch the column select to pre-select
      // the column the user clicked "+" on.
      openCardEditor(null);
      // Set the col in the just-opened modal
      const sel = document.querySelector('.modal-backdrop .modal-body #kc-col');
      if (sel) {sel.value = col;}
      return;
    }
    const cardEl = e.target.closest('.kanban-card');
    if (cardEl && !cardEl.classList.contains('dragging')) {
      const id = parseInt(cardEl.dataset.id, 10);
      openCardEditor(id);
    }
  });

  // Filter input
  document.getElementById('kanban-filter')?.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.kanban-card').forEach((card) => {
      const id = parseInt(card.dataset.id, 10);
      const c = CARDS.find((x) => x.id === id);
      if (!c) {return;}
      const match = !q || c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
}
