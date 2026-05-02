// Settings page interactivity:
// - Persist every toggle / radio / form input to localStorage by stable key
// - Restore values on next visit
// - Save / Cancel buttons reflect dirty state and roll back on Cancel
// - Integration "Connect" buttons toggle to "Disconnect" with persistence
// - Revoke session removes the row
// - Danger-zone actions open confirm modals

import { showToast } from './toast.js';
import { showModal } from './modal.js';

const STORAGE_KEY = 'gentelella:settings';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (_e) {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_e) { /* private mode */ }
}

// ────────────────────────
//  TOGGLES — persist by label text
// ────────────────────────

function toggleKey(toggle) {
  const row = toggle.closest('.settings-toggle-row');
  const label = row?.querySelector('.label')?.textContent.trim();
  if (!label) {return null;}
  const section = toggle.closest('.settings-section')?.id || 'general';
  return `toggle:${section}:${label}`;
}

function initToggles() {
  const stored = load();
  document.querySelectorAll('.settings-toggle-list .toggle').forEach((t) => {
    const k = toggleKey(t);
    if (!k) {return;}
    if (Object.prototype.hasOwnProperty.call(stored, k)) {
      t.classList.toggle('on', !!stored[k]);
    }
  });

  // Click is already handled globally; we listen for the change to persist.
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.settings-toggle-list .toggle');
    if (!t) {return;}
    // Wait one tick so the global handler updates the class first.
    setTimeout(() => {
      const k = toggleKey(t);
      if (!k) {return;}
      const data = load();
      data[k] = t.classList.contains('on');
      save(data);
    }, 0);
  });
}

// ────────────────────────
//  RADIO + INPUT persistence (theme, density)
// ────────────────────────

function initRadios() {
  const stored = load();
  document.querySelectorAll('.theme-options input[type="radio"]').forEach((r) => {
    const k = `radio:${r.name}`;
    if (stored[k] === r.value) {r.checked = true;}
    r.addEventListener('change', () => {
      if (!r.checked) {return;}
      const data = load();
      data[k] = r.value;
      save(data);
      // Side-effect: theme radio actually applies the theme.
      if (r.name === 'theme') {applyThemeChoice(r.value);}
    });
  });
}

function applyThemeChoice(choice) {
  if (choice === 'system') {
    try { localStorage.removeItem('theme'); } catch (_e) { /* ignore */ }
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } else {
    try { localStorage.setItem('theme', choice); } catch (_e) { /* ignore */ }
    document.documentElement.setAttribute('data-theme', choice);
  }
  const btn = document.querySelector('.theme-toggle');
  if (btn) {btn.setAttribute('aria-pressed', choice === 'dark' ? 'true' : 'false');}
}

// ────────────────────────
//  PROFILE FORM — Save / Cancel
// ────────────────────────

function initProfileForm() {
  // The settings page wraps profile fields in a <form>. Find the first form
  // inside the settings-content area.
  const profileForm = document.querySelector('.settings-content form');
  if (!profileForm) {return;}

  const inputs = [...profileForm.querySelectorAll('input, textarea, select')];
  const stored = load();
  inputs.forEach((el) => {
    const k = `field:${el.id || el.name}`;
    if (!k.endsWith(':') && Object.prototype.hasOwnProperty.call(stored, k)) {
      el.value = stored[k];
    }
  });

  const initial = inputs.map((el) => el.value);
  let dirty = false;

  const saveBtn = profileForm.querySelector('button[type="submit"]');
  const cancelBtn = profileForm.querySelector('button[type="reset"]');
  if (saveBtn) {saveBtn.disabled = true;}
  if (cancelBtn) {cancelBtn.disabled = true;}

  const checkDirty = () => {
    const current = inputs.map((el) => el.value);
    dirty = current.some((v, i) => v !== initial[i]);
    if (saveBtn) {saveBtn.disabled = !dirty;}
    if (cancelBtn) {cancelBtn.disabled = !dirty;}
  };

  inputs.forEach((el) => el.addEventListener('input', checkDirty));

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dirty) {return;}
    const data = load();
    inputs.forEach((el) => {
      const k = `field:${el.id || el.name}`;
      if (!k.endsWith(':')) {data[k] = el.value;}
    });
    save(data);
    inputs.forEach((el, i) => { initial[i] = el.value; });
    dirty = false;
    if (saveBtn) {saveBtn.disabled = true;}
    if (cancelBtn) {cancelBtn.disabled = true;}
    showToast('Profile saved', { variant: 'success' });
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!dirty) {return;}
      inputs.forEach((el, i) => { el.value = initial[i]; });
      checkDirty();
      showToast('Changes discarded');
    });
  }
}

// ────────────────────────
//  INTEGRATIONS — connect/disconnect
// ────────────────────────

function initIntegrations() {
  const stored = load();
  document.querySelectorAll('.integration').forEach((card) => {
    const titleEl = card.querySelector('.title');
    const btn = card.querySelector('.btn');
    if (!titleEl || !btn) {return;}
    const key = `integration:${titleEl.textContent.trim()}`;

    const isConnected = () => {
      if (Object.prototype.hasOwnProperty.call(stored, key)) {return stored[key];}
      // Default state from existing markup label
      return /connected/i.test(btn.textContent);
    };

    const paint = () => {
      const connected = isConnected();
      btn.textContent = connected ? 'Connected ✓' : 'Connect';
      btn.classList.toggle('btn-primary', !connected);
      btn.classList.toggle('btn-outline', connected);
    };
    paint();

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const data = load();
      data[key] = !isConnected();
      Object.assign(stored, data);
      save(data);
      paint();
      showToast(data[key] ? `${titleEl.textContent.trim()} connected` : `${titleEl.textContent.trim()} disconnected`, { variant: data[key] ? 'success' : 'default' });
    });
  });
}

// ────────────────────────
//  SESSIONS — revoke
// ────────────────────────

function initSessions() {
  document.querySelectorAll('.session-row').forEach((row) => {
    const btn = row.querySelector('.btn');
    if (!btn || btn.textContent.trim().toLowerCase() !== 'revoke') {return;}
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const device = row.querySelector('.device')?.textContent.trim() || 'session';
      showModal({
        title: 'Revoke session?',
        body: `<p style="font-size:13px;line-height:1.6;color:var(--text-secondary)">This will sign out <strong>${device}</strong> immediately. The user will need to sign in again.</p>`,
        actions: [
          { label: 'Cancel', variant: 'ghost' },
          {
            label: 'Revoke',
            variant: 'danger',
            action: () => {
              row.style.transition = 'opacity 200ms, transform 200ms';
              row.style.opacity = '0';
              row.style.transform = 'translateX(8px)';
              setTimeout(() => row.remove(), 220);
              showToast(`Revoked: ${device}`, { variant: 'success' });
            }
          }
        ]
      });
    });
  });
}

// ────────────────────────
//  DANGER ZONE
// ────────────────────────

function initDanger() {
  document.querySelectorAll('.danger-row .btn').forEach((btn) => {
    const label = btn.textContent.trim().toLowerCase();
    if (label === 'export') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = load();
        const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), settings: data }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gentelella-export.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
        showToast('Workspace export ready', { variant: 'success' });
      });
    } else if (label === 'transfer') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showModal({
          title: 'Transfer workspace ownership',
          body: `
            <p style="font-size:13px;line-height:1.6;color:var(--text-secondary);margin-bottom:14px">Transfer ownership to another team member. You'll keep your account but lose admin privileges.</p>
            <div class="form-group">
              <label class="form-label" for="transfer-to">Transfer to</label>
              <select id="transfer-to" class="form-control">
                <option>Sarah Kowalski (sarah@example.com)</option>
                <option>Michael Reyes (michael@example.com)</option>
                <option>Emily Wang (emily@example.com)</option>
              </select>
            </div>
          `,
          actions: [
            { label: 'Cancel', variant: 'ghost' },
            {
              label: 'Transfer',
              variant: 'danger',
              action: (ctx) => {
                const to = ctx.body.querySelector('#transfer-to').value;
                showToast(`Transfer initiated to ${to}`, { variant: 'success' });
              }
            }
          ]
        });
      });
    } else if (label === 'delete') {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showModal({
          title: 'Delete account permanently?',
          body: `
            <p style="font-size:13px;line-height:1.6;color:var(--text-secondary);margin-bottom:14px">This will <strong>permanently delete</strong> your account, all projects, and all associated data. This action cannot be undone.</p>
            <div class="form-group">
              <label class="form-label" for="confirm-delete">Type <code style="background:var(--bg-surface-secondary);padding:1px 4px;border-radius:3px">DELETE</code> to confirm</label>
              <input id="confirm-delete" class="form-control" autocomplete="off">
            </div>
          `,
          actions: [
            { label: 'Cancel', variant: 'ghost' },
            {
              label: 'Delete account',
              variant: 'danger',
              action: (ctx) => {
                const v = ctx.body.querySelector('#confirm-delete').value;
                if (v !== 'DELETE') {
                  showToast('Type DELETE to confirm', { variant: 'error' });
                  return false;
                }
                showToast('Account deletion initiated', { variant: 'error' });
              }
            }
          ]
        });
      });
    }
  });
}

// ────────────────────────
//  TEAM — Invite + Manage
// ────────────────────────

function initTeam() {
  const inviteBtn = [...document.querySelectorAll('#team .btn-primary')]
    .find((b) => b.textContent.trim().toLowerCase().includes('invite'));
  if (inviteBtn) {
    inviteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showModal({
        title: 'Invite team member',
        body: `
          <div class="form-group">
            <label class="form-label" for="invite-email">Email</label>
            <input type="email" id="invite-email" class="form-control" placeholder="colleague@example.com" autocomplete="off">
          </div>
          <div class="form-group">
            <label class="form-label" for="invite-role">Role</label>
            <select id="invite-role" class="form-control">
              <option>Member</option>
              <option>Admin</option>
              <option>Designer</option>
              <option>Engineer</option>
              <option>PM</option>
            </select>
          </div>
        `,
        actions: [
          { label: 'Cancel', variant: 'ghost' },
          {
            label: 'Send invite',
            variant: 'primary',
            action: (ctx) => {
              const email = ctx.body.querySelector('#invite-email').value.trim();
              if (!email) {
                showToast('Add an email address', { variant: 'error' });
                return false;
              }
              showToast(`Invite sent to ${email}`, { variant: 'success' });
            }
          }
        ]
      });
    });
  }

  document.querySelectorAll('#team .session-row .btn').forEach((btn) => {
    if (btn.textContent.trim().toLowerCase() !== 'manage') {return;}
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const row = btn.closest('.session-row');
      const name = row?.querySelector('.device')?.textContent.trim() || 'Member';
      const meta = row?.querySelector('.meta')?.textContent.trim() || '';
      showModal({
        title: `Manage ${name}`,
        body: `
          <p style="font-size:13px;line-height:1.6;color:var(--text-secondary);margin-bottom:14px">${meta}</p>
          <div class="form-group">
            <label class="form-label">Role</label>
            <select class="form-control" id="manage-role">
              <option>Member</option><option>Admin</option><option>Designer</option><option>Engineer</option><option>PM</option>
            </select>
          </div>
        `,
        actions: [
          { label: 'Remove', variant: 'danger', action: () => {
            row.remove();
            showToast(`${name} removed from team`);
          } },
          { label: 'Cancel', variant: 'ghost' },
          { label: 'Save', variant: 'primary', action: (ctx) => {
            const role = ctx.body.querySelector('#manage-role').value;
            showToast(`${name} → ${role}`, { variant: 'success' });
          } }
        ]
      });
    });
  });
}

/**
 * Wire up all settings interactions. Idempotent on a single page load.
 */
export function initSettings() {
  if (initSettings._wired) {return;}
  initSettings._wired = true;
  initToggles();
  initRadios();
  initProfileForm();
  initIntegrations();
  initSessions();
  initDanger();
  initTeam();
}
