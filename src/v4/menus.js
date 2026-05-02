// Lightweight popover menu anchored to a trigger button.
// One open menu at a time; clicking outside, pressing Escape, or scrolling
// closes it.

import { showToast } from './toast.js';

let openMenuEl = null;
let openMenuTrigger = null;

export function closeMenu() {
  if (!openMenuEl) {return;}
  openMenuEl.remove();
  if (openMenuTrigger) {openMenuTrigger.setAttribute('aria-expanded', 'false');}
  openMenuEl = null;
  openMenuTrigger = null;
}

function buildMenu(items) {
  const menu = document.createElement('div');
  menu.className = 'menu-popover';
  menu.setAttribute('role', 'menu');
  items.forEach((item) => {
    if (item === '-') {
      const sep = document.createElement('div');
      sep.className = 'menu-separator';
      menu.appendChild(sep);
      return;
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-item';
    btn.setAttribute('role', 'menuitem');
    btn.textContent = item.label;
    btn.addEventListener('click', () => {
      // Capture the trigger before closeMenu() clears it so action() can
      // still reference the card that owns this menu.
      const trigger = openMenuTrigger;
      closeMenu();
      // Run the action if provided. No fallback toast — silent items are
      // intentional (decorative menus on demo cards).
      if (typeof item.action === 'function') {item.action(trigger);}
    });
    menu.appendChild(btn);
  });
  return menu;
}

function position(menu, trigger) {
  const rect = trigger.getBoundingClientRect();
  // Render to measure size; default placement: right-aligned below trigger.
  menu.style.visibility = 'hidden';
  document.body.appendChild(menu);
  const mw = menu.offsetWidth;
  const mh = menu.offsetHeight;
  const margin = 6;
  let top = rect.bottom + margin;
  let left = rect.right - mw;
  // Flip up if not enough room below.
  if (top + mh > window.innerHeight - 8) {top = rect.top - mh - margin;}
  // Clamp horizontally.
  left = Math.max(8, Math.min(left, window.innerWidth - mw - 8));
  menu.style.top = `${Math.round(top)}px`;
  menu.style.left = `${Math.round(left)}px`;
  menu.style.visibility = '';
}

/**
 * @typedef {{ label: string, action?: () => void }} MenuItem
 *   A single menu entry. If `action` is omitted, clicking it shows a toast with the label.
 * @typedef {MenuItem | '-'} MenuEntry
 *   Pass the literal string `'-'` as a divider between groups.
 */

/**
 * Open a popover menu anchored to a trigger element. Toggles closed if called
 * again with the same trigger. Auto-closes on outside click, Escape, scroll, or resize.
 * @param {HTMLElement} trigger Element to anchor against; receives `aria-expanded`.
 * @param {MenuEntry[]} items
 */
export function openMenu(trigger, items) {
  if (openMenuTrigger === trigger) {
    closeMenu();
    return;
  }
  closeMenu();
  const menu = buildMenu(items);
  position(menu, trigger);
  openMenuEl = menu;
  openMenuTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  // Focus first item for keyboard users.
  const first = menu.querySelector('.menu-item');
  if (first) {first.focus();}
}

/**
 * Like {@link openMenu}, but renders arbitrary content inside a wider container —
 * for notification panels, message previews, user menus with avatars, etc.
 * Same toggle/positioning/dismiss behavior.
 * @param {HTMLElement} trigger
 * @param {HTMLElement | string} content Element to mount, or HTML string.
 *   If you pass a string, ensure it's trusted — it's assigned via `innerHTML`.
 * @param {{ className?: string, width?: number }} [opts]
 *   `className` adds an extra class for theming (e.g. 'panel-notifications').
 *   `width` sets a fixed pixel width.
 */
export function openPanel(trigger, content, opts = {}) {
  if (openMenuTrigger === trigger) {
    closeMenu();
    return;
  }
  closeMenu();
  const panel = document.createElement('div');
  panel.className = `menu-popover menu-panel ${opts.className || ''}`.trim();
  panel.setAttribute('role', 'dialog');
  if (opts.width) {panel.style.width = `${opts.width}px`;}
  if (typeof content === 'string') {panel.innerHTML = content;}
  else {panel.appendChild(content);}
  position(panel, trigger);
  openMenuEl = panel;
  openMenuTrigger = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  // Focus first focusable inside the panel for keyboard users.
  const first = panel.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
  if (first) {first.focus();}
}

// Global dismissers — registered once at module load.
document.addEventListener('click', (e) => {
  if (!openMenuEl) {return;}
  if (openMenuEl.contains(e.target)) {return;}
  if (openMenuTrigger && openMenuTrigger.contains(e.target)) {return;}
  closeMenu();
}, true);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openMenuEl) {
    const t = openMenuTrigger;
    closeMenu();
    if (t) {t.focus();}
  }
});
window.addEventListener('scroll', closeMenu, { passive: true, capture: true });
window.addEventListener('resize', closeMenu);

// Default card menu — fed into openMenu(trigger, ...) by the card-opt-btn
// click handler in main-v4.js. Each action receives the trigger element
// (the 3-dot button that opened the menu) so it can locate its parent card.
export const DEFAULT_CARD_MENU = [
  {
    label: 'Refresh',
    action: (trigger) => {
      const card = trigger?.closest('.card');
      if (!card) {return;}
      card.classList.add('is-refreshing');
      setTimeout(() => card.classList.remove('is-refreshing'), 700);
      if (card.querySelector('[data-chart]')) {
        document.documentElement.dispatchEvent(new CustomEvent('themechange'));
      }
      showToast('Refreshed', { variant: 'success' });
    }
  },
  {
    label: 'Move up',
    action: (trigger) => {
      const card = trigger?.closest('.card');
      const prev = card?.previousElementSibling;
      if (card && prev && prev.classList.contains('card')) {
        card.parentNode.insertBefore(card, prev);
      }
    }
  },
  {
    label: 'Move down',
    action: (trigger) => {
      const card = trigger?.closest('.card');
      const next = card?.nextElementSibling;
      if (card && next && next.classList.contains('card')) {
        card.parentNode.insertBefore(next, card);
      }
    }
  },
  '-',
  {
    label: 'Hide card',
    action: (trigger) => {
      const card = trigger?.closest('.card');
      if (!card) {return;}
      const placeholder = document.createComment('hidden-card');
      card.style.transition = 'opacity 200ms, transform 200ms';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.97)';
      setTimeout(() => {
        card.parentNode.insertBefore(placeholder, card);
        card.remove();
      }, 220);
      showToast('Card hidden — click here to undo', { duration: 5000 });
      // Hijack the next toast click to restore the card.
      setTimeout(() => {
        const toast = document.querySelector('.toast-host .toast:last-child');
        if (!toast) {return;}
        toast.style.cursor = 'pointer';
        toast.addEventListener('click', () => {
          if (placeholder.parentNode) {
            placeholder.parentNode.insertBefore(card, placeholder);
            placeholder.remove();
            card.style.opacity = '1';
            card.style.transform = '';
          }
        }, { once: true });
      }, 30);
    }
  }
];
