// Dynamic calendar with full event CRUD via modals.
// - Click a day → modal lists events for that day with edit/delete + Add new.
// - Click an event → modal edits that event (title, color, date) or deletes.
// - "New event" page-action → modal creates an event on the visible month.
// - Prev/next/Today re-render the grid.
// Events are kept in a Map keyed by ISO date string. Procedural events (auto
// Monday-standup etc.) are read-only suggestions until the user materializes
// them by adding/editing.

import { showToast } from './toast.js';
import { showModal, closeModal } from './modal.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const COLOR_OPTIONS = [
  { value: '',       label: 'Teal',   var: 'var(--primary)' },
  { value: 'blue',   label: 'Blue',   var: 'var(--blue)' },
  { value: 'yellow', label: 'Yellow', var: 'var(--yellow)' },
  { value: 'red',    label: 'Red',    var: 'var(--red)' },
  { value: 'purple', label: 'Purple', var: 'var(--purple)' }
];

const SEED = {
  '2026-04-01': [{ title: 'Standup 9am' }],
  '2026-04-03': [{ title: 'Design review', color: 'blue' }],
  '2026-04-06': [{ title: '1:1 with Sara' }],
  '2026-04-07': [{ title: 'Q2 Planning', color: 'yellow' }, { title: 'Lunch demo' }],
  '2026-04-09': [{ title: 'All-hands', color: 'purple' }],
  '2026-04-11': [{ title: 'Launch deadline', color: 'red' }],
  '2026-04-14': [{ title: 'Standup 9am' }],
  '2026-04-15': [{ title: 'Customer call', color: 'blue' }],
  '2026-04-17': [{ title: 'Design review' }],
  '2026-04-18': [{ title: 'Vendor demo', color: 'yellow' }],
  '2026-04-22': [{ title: 'Quarterly review', color: 'purple' }],
  '2026-04-24': [{ title: 'Code freeze', color: 'red' }],
  '2026-04-27': [{ title: 'Standup 9am' }, { title: 'Sprint planning', color: 'blue' }],
  '2026-04-29': [{ title: '1:1 with Aigars' }],
  '2026-04-30': [{ title: 'Release v4.0', color: 'yellow' }]
};

const events = new Map();
let nextId = 1;

function pad(n) { return String(n).padStart(2, '0'); }
function isoKey(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function seedOnce() {
  if (events.size) {return;}
  Object.entries(SEED).forEach(([key, list]) => {
    events.set(key, list.map((e) => ({ id: nextId++, title: e.title, color: e.color || '' })));
  });
}

function proceduralFor(year, month, day) {
  const dow = new Date(year, month, day).getDay();
  const out = [];
  if (dow === 1) {out.push({ title: 'Standup 9am', color: '', procedural: true });}
  if (dow === 5 && day <= 7) {out.push({ title: 'Design review', color: 'blue', procedural: true });}
  return out;
}

function eventsForDay(year, month, day) {
  const key = isoKey(year, month, day);
  const stored = events.get(key);
  if (stored && stored.length) {return stored;}
  // No stored events — suggest procedural ones (still rendered but read-only).
  return proceduralFor(year, month, day);
}

function colorOf(value) {
  return COLOR_OPTIONS.find((c) => c.value === value)?.var ?? 'var(--primary)';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// ────────────────────────
//  Grid render
// ────────────────────────

function render(state) {
  const { gridEl, monthEl, year, month } = state;
  monthEl.textContent = `${MONTHS[month]} ${year}`;

  const today = new Date();
  const todayKey = isoKey(today.getFullYear(), today.getMonth(), today.getDate());

  const first = new Date(year, month, 1);
  const dowMonFirst = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const html = [];
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d) => {
    html.push(`<div class="dow">${d}</div>`);
  });

  for (let i = dowMonFirst; i > 0; i--) {
    html.push(`<div class="calendar-day muted"><span class="day-num">${daysInPrev - i + 1}</span></div>`);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = isoKey(year, month, d);
    const isToday = key === todayKey;
    const dayEvents = eventsForDay(year, month, d);
    const evMarkup = dayEvents.map((e, idx) => `
      <span class="calendar-event${e.color ? ' ' + e.color : ''}" data-event-idx="${idx}" data-day="${d}">${escapeHtml(e.title)}</span>
    `).join('');
    html.push(`<div class="calendar-day${isToday ? ' today' : ''}" data-day="${d}"><span class="day-num">${d}</span>${evMarkup}</div>`);
  }

  const trailing = 42 - dowMonFirst - daysInMonth;
  for (let d = 1; d <= trailing; d++) {
    html.push(`<div class="calendar-day muted"><span class="day-num">${d}</span></div>`);
  }

  gridEl.innerHTML = html.join('');
}

// ────────────────────────
//  Modal flows
// ────────────────────────

function colorRadios(name, selected) {
  return `
    <div class="color-swatches" role="radiogroup" aria-label="Event color">
      ${COLOR_OPTIONS.map((c, i) => `
        <input type="radio" id="${name}-${i}" name="${name}" value="${c.value}" ${c.value === (selected || '') ? 'checked' : ''}>
        <label for="${name}-${i}" style="background:${c.var}" title="${c.label}" aria-label="${c.label}"></label>
      `).join('')}
    </div>
  `;
}

function eventFormHtml({ title = '', color = '', dateValue }) {
  return `
    <form class="modal-form" novalidate>
      <div class="modal-form-row">
        <label for="ev-title">Title</label>
        <input type="text" id="ev-title" name="title" value="${escapeHtml(title)}" placeholder="Event title" autocomplete="off" required>
      </div>
      <div class="modal-form-row">
        <label for="ev-date">Date</label>
        <input type="date" id="ev-date" name="date" value="${dateValue}" required>
      </div>
      <div class="modal-form-row">
        <label>Color</label>
        ${colorRadios('color', color)}
      </div>
    </form>
  `;
}

function getFormValues(bodyEl) {
  const form = bodyEl.querySelector('form');
  if (!form) {return null;}
  const fd = new FormData(form);
  return {
    title: (fd.get('title') || '').toString().trim(),
    color: (fd.get('color') || '').toString(),
    date:  (fd.get('date')  || '').toString()
  };
}

function openEventEditor(state, key, idx) {
  const list = events.get(key) || [];
  const ev = list[idx];
  if (!ev) {return;}
  const { year, month, day } = parseKey(key);
  const dateValue = isoKey(year, month, day);

  showModal({
    title: 'Edit event',
    body: eventFormHtml({ title: ev.title, color: ev.color, dateValue }),
    actions: [
      {
        label: 'Delete',
        variant: 'outline',
        action: ({ close }) => {
          const arr = events.get(key) || [];
          arr.splice(idx, 1);
          if (!arr.length) {events.delete(key);}
          else {events.set(key, arr);}
          render(state);
          showToast(`Deleted: ${ev.title}`);
          close();
          return false;
        },
        closeOnAction: false
      },
      { label: 'Cancel', variant: 'outline' },
      {
        label: 'Save',
        variant: 'primary',
        action: ({ body }) => {
          const v = getFormValues(body);
          if (!v || !v.title) { showToast('Title is required', { variant: 'warning' }); return false; }
          // Remove from old key
          const oldArr = events.get(key) || [];
          oldArr.splice(idx, 1);
          if (!oldArr.length) {events.delete(key);} else {events.set(key, oldArr);}
          // Insert into new key
          const newArr = events.get(v.date) || [];
          newArr.push({ id: ev.id, title: v.title, color: v.color });
          events.set(v.date, newArr);
          // If date moved outside the visible month, jump there.
          const np = parseKey(v.date);
          if (np.year !== state.year || np.month !== state.month) {
            state.year = np.year; state.month = np.month;
          }
          render(state);
          showToast(`Saved: ${v.title}`, { variant: 'success' });
          return true;
        }
      }
    ]
  });
}

function openCreateForm(state, presetDate) {
  const dateValue = presetDate || (() => {
    // Default: today if today is in the visible month, else the 1st of the visible month.
    const t = new Date();
    if (t.getFullYear() === state.year && t.getMonth() === state.month) {
      return isoKey(t.getFullYear(), t.getMonth(), t.getDate());
    }
    return isoKey(state.year, state.month, 1);
  })();

  showModal({
    title: 'New event',
    body: eventFormHtml({ dateValue }),
    actions: [
      { label: 'Cancel', variant: 'outline' },
      {
        label: 'Create',
        variant: 'primary',
        action: ({ body }) => {
          const v = getFormValues(body);
          if (!v || !v.title) { showToast('Title is required', { variant: 'warning' }); return false; }
          const arr = events.get(v.date) || [];
          arr.push({ id: nextId++, title: v.title, color: v.color });
          events.set(v.date, arr);
          const np = parseKey(v.date);
          if (np.year !== state.year || np.month !== state.month) {
            state.year = np.year; state.month = np.month;
          }
          render(state);
          showToast(`Created: ${v.title}`, { variant: 'success' });
          return true;
        }
      }
    ]
  });
}

function openDayModal(state, year, month, day) {
  const key = isoKey(year, month, day);
  const dateLabel = `${MONTHS[month]} ${day}, ${year}`;

  const renderListHtml = () => {
    const list = events.get(key) || [];
    const procList = list.length ? [] : proceduralFor(year, month, day);
    if (!list.length && !procList.length) {
      return `<div class="modal-events-empty">No events yet for ${dateLabel}.</div>`;
    }
    if (list.length) {
      return `
        <div class="modal-events-list">
          ${list.map((e, idx) => `
            <div class="modal-event-row">
              <span class="swatch" style="background:${colorOf(e.color)}"></span>
              <span class="title">${escapeHtml(e.title)}</span>
              <span class="row-actions">
                <button type="button" class="row-btn" data-edit="${idx}" aria-label="Edit ${escapeHtml(e.title)}">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9z"/></svg>
                </button>
                <button type="button" class="row-btn" data-delete="${idx}" aria-label="Delete ${escapeHtml(e.title)}">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h10M6 4V2h4v2M5 4l1 9h4l1-9"/></svg>
                </button>
              </span>
            </div>
          `).join('')}
        </div>
      `;
    }
    // Procedural-only suggestion (read-only)
    return `
      <div class="modal-events-list">
        ${procList.map((e) => `
          <div class="modal-event-row" style="opacity:.75">
            <span class="swatch" style="background:${colorOf(e.color)}"></span>
            <span class="title">${escapeHtml(e.title)} <small style="color:var(--text-muted);font-weight:normal">· suggested</small></span>
          </div>
        `).join('')}
      </div>
    `;
  };

  const { dialog, body } = showModal({
    title: dateLabel,
    body: renderListHtml(),
    actions: [
      { label: 'Close', variant: 'outline' },
      {
        label: 'Add event',
        variant: 'primary',
        action: () => {
          openCreateForm(state, key);
          return true; // close this modal first; create modal opens on top
        }
      }
    ]
  });

  // Delegate edit/delete inside the modal body.
  body.addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-delete]');
    if (editBtn) {
      const idx = parseInt(editBtn.dataset.edit, 10);
      closeModal();
      // After close transition, open the editor for that event.
      setTimeout(() => openEventEditor(state, key, idx), 200);
    } else if (delBtn) {
      const idx = parseInt(delBtn.dataset.delete, 10);
      const list = events.get(key) || [];
      const ev = list[idx];
      list.splice(idx, 1);
      if (!list.length) {events.delete(key);} else {events.set(key, list);}
      render(state);
      // Re-render the modal body in place
      body.innerHTML = renderListHtml();
      if (ev) {showToast(`Deleted: ${ev.title}`);}
    }
  });

  return { dialog, body };
}

// ────────────────────────
//  Public init
// ────────────────────────

export function initCalendar() {
  const gridEl = document.querySelector('.calendar-grid');
  const monthEl = document.querySelector('.calendar-month');
  if (!gridEl || !monthEl) {return;}

  seedOnce();

  const initial = monthEl.textContent.trim().split(/\s+/);
  const initialMonth = MONTHS.indexOf(initial[0]);
  const initialYear = parseInt(initial[1], 10);

  const state = {
    gridEl,
    monthEl,
    year: Number.isFinite(initialYear) ? initialYear : new Date().getFullYear(),
    month: initialMonth >= 0 ? initialMonth : new Date().getMonth()
  };

  render(state);

  // Prev / next month — calendar-toolbar nav buttons
  const navBtns = document.querySelectorAll('.calendar-toolbar .nav-btns .card-opt-btn');
  if (navBtns[0]) {navBtns[0].addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    state.month -= 1;
    if (state.month < 0) { state.month = 11; state.year -= 1; }
    render(state);
  });}
  if (navBtns[1]) {navBtns[1].addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    state.month += 1;
    if (state.month > 11) { state.month = 0; state.year += 1; }
    render(state);
  });}

  // Page-action buttons
  document.querySelectorAll('.page-actions .btn').forEach((b) => {
    const label = b.textContent.trim().toLowerCase();
    if (label === 'today') {
      b.addEventListener('click', (e) => {
        e.stopPropagation(); e.preventDefault();
        const now = new Date();
        state.year = now.getFullYear();
        state.month = now.getMonth();
        render(state);
      });
    } else if (label.includes('new event')) {
      b.addEventListener('click', (e) => {
        e.stopPropagation(); e.preventDefault();
        openCreateForm(state);
      });
    }
  });

  // Click in the grid → event editor or day modal
  gridEl.addEventListener('click', (e) => {
    const eventEl = e.target.closest('[data-event-idx]');
    if (eventEl) {
      e.stopPropagation();
      const day = parseInt(eventEl.dataset.day, 10);
      const idx = parseInt(eventEl.dataset.eventIdx, 10);
      const key = isoKey(state.year, state.month, day);
      const stored = events.get(key);
      if (stored && stored[idx]) {
        openEventEditor(state, key, idx);
      } else {
        // Procedural — open day modal so user can promote the suggestion.
        openDayModal(state, state.year, state.month, day);
      }
      return;
    }
    const dayEl = e.target.closest('[data-day]');
    if (dayEl && !dayEl.classList.contains('muted')) {
      const day = parseInt(dayEl.dataset.day, 10);
      openDayModal(state, state.year, state.month, day);
    }
  });
}
