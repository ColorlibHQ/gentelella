// Lightweight toast — a single host container, queue is just stacked DOM
// nodes, each self-removes on transitionend after a timeout.

let host;
function getHost() {
  if (host && host.isConnected) {return host;}
  host = document.createElement('div');
  host.className = 'toast-host';
  host.setAttribute('role', 'status');
  host.setAttribute('aria-live', 'polite');
  document.body.appendChild(host);
  return host;
}

/**
 * Show a transient toast notification at the top-right of the viewport.
 * @param {string} message Text to display.
 * @param {{ variant?: 'default' | 'success' | 'error' | 'info', duration?: number }} [opts]
 *   - `variant` styles the toast (default 'default'). 'success' / 'error' / 'info'.
 *   - `duration` ms before auto-dismiss (default 2600). Click also dismisses.
 * @returns {HTMLDivElement} The toast element (in case the caller wants to dismiss early).
 */
export function showToast(message, opts = {}) {
  const { variant = 'default', duration = 2600 } = opts;
  const node = document.createElement('div');
  node.className = `toast toast-${variant}`;
  node.textContent = message;
  getHost().appendChild(node);

  // Force reflow so the slide-in transition fires.
  node.getBoundingClientRect();
  node.classList.add('show');

  const dismiss = () => {
    node.classList.remove('show');
    node.addEventListener('transitionend', () => node.remove(), { once: true });
  };
  setTimeout(dismiss, duration);
  node.addEventListener('click', dismiss);
  return node;
}
