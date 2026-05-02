// Reusable modal dialog. One open at a time; backdrop click, Escape, and
// the close button all dismiss. Focus is moved into the dialog on open and
// restored on close. Tab is trapped inside while open.

let openBackdrop = null;
let previousFocus = null;
let onCloseHook = null;

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function isModalOpen() { return !!openBackdrop; }

export function closeModal({ skipHook = false } = {}) {
  if (!openBackdrop) {return;}
  const el = openBackdrop;
  el.classList.remove('show');
  document.body.classList.remove('modal-open');

  const cleanup = () => { if (el.isConnected) {el.remove();} };
  el.addEventListener('transitionend', cleanup, { once: true });
  setTimeout(cleanup, 280);

  const hook = onCloseHook;
  const focusBack = previousFocus;
  openBackdrop = null;
  onCloseHook = null;
  previousFocus = null;

  if (focusBack && typeof focusBack.focus === 'function') {focusBack.focus();}
  if (!skipHook && typeof hook === 'function') {hook();}
}

/**
 * @typedef {Object} ModalAction
 * @property {string} label
 * @property {'primary' | 'outline' | 'danger' | 'ghost'} [variant]
 * @property {(ctx: { dialog: HTMLElement, body: HTMLElement, close: () => void }) => void} [action]
 * @property {boolean} [closeOnAction] If true (default), the modal closes after `action` runs.
 */

/**
 * Show a centered modal dialog with focus trap, ESC + backdrop dismiss.
 * @param {Object} [opts]
 * @param {string} [opts.title]
 * @param {string | HTMLElement} [opts.body] HTML string (assigned via innerHTML) or element to mount.
 * @param {ModalAction[]} [opts.actions] Footer buttons.
 * @param {'sm' | 'md' | 'lg'} [opts.size]
 * @param {() => void} [opts.onClose] Fires after the modal is dismissed (any reason).
 * @returns {{ dialog: HTMLElement, body: HTMLElement, close: () => void }}
 */
export function showModal({ title, body = '', actions = [], size = 'md', onClose } = {}) {
  closeModal({ skipHook: true });

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const dialog = document.createElement('div');
  dialog.className = `modal-dialog modal-${size}`;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  if (title) {dialog.setAttribute('aria-label', title);}

  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <h2 class="modal-title">${title || ''}</h2>
    <button type="button" class="modal-close" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8"/></svg>
    </button>
  `;

  const bodyEl = document.createElement('div');
  bodyEl.className = 'modal-body';
  if (body instanceof HTMLElement) {bodyEl.appendChild(body);}
  else {bodyEl.innerHTML = body;}

  dialog.appendChild(header);
  dialog.appendChild(bodyEl);

  let footer = null;
  if (actions.length) {
    footer = document.createElement('div');
    footer.className = 'modal-footer';
    actions.forEach((a) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn-${a.variant || 'outline'}`;
      btn.textContent = a.label;
      btn.addEventListener('click', () => {
        const ctx = { dialog, body: bodyEl, close: () => closeModal() };
        const result = typeof a.action === 'function' ? a.action(ctx) : null;
        // Action can return false to keep the modal open (e.g. validation failed).
        if (result === false) {return;}
        if (a.closeOnAction !== false) {closeModal();}
      });
      footer.appendChild(btn);
    });
    dialog.appendChild(footer);
  }

  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);
  document.body.classList.add('modal-open');

  // Animation in: requestAnimationFrame so the .show class transition fires.
  requestAnimationFrame(() => backdrop.classList.add('show'));

  // Close handlers
  header.querySelector('.modal-close').addEventListener('click', () => closeModal());
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) {closeModal();} });

  // Focus trap
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') {return;}
    const f = dialog.querySelectorAll(FOCUSABLE);
    if (!f.length) {return;}
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Track focus for restoration
  previousFocus = document.activeElement;
  openBackdrop = backdrop;
  onCloseHook = onClose;

  // Initial focus: first focusable in body, else first action, else close button
  const firstInBody = bodyEl.querySelector(FOCUSABLE);
  if (firstInBody) {firstInBody.focus();}
  else if (footer && footer.querySelector('.btn-primary')) {footer.querySelector('.btn-primary').focus();}
  else {header.querySelector('.modal-close').focus();}

  return { dialog, body: bodyEl, close: () => closeModal() };
}

// Global Escape handler — registered once.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openBackdrop) {
    e.stopPropagation();
    closeModal();
  }
});
