/**
 * UI Components Module
 * Handles panel toolbox, progress bars, and toast notifications
 * Modernized from jQuery to vanilla JavaScript
 */

// Import canonical DOM utilities
import DOM from '../utils/dom.js';

// Import development logger
import logger from '../utils/logger.js';

/**
 * Panel Toolbox Functionality - Bootstrap 5 Compatible
 * Uses Bootstrap Collapse for animations (initialized in init.js)
 * This module handles close functionality only
 */
export function initializePanelToolbox() {
  // Close panel functionality - uses CSS fade transition
  DOM.selectAll('.close-link').forEach(link => {
    DOM.on(link, 'click', function (e) {
      e.preventDefault();
      const panel = DOM.closest(this, '.x_panel');
      if (panel) {
        // Fade out and remove panel
        panel.style.transition = 'opacity 0.3s ease';
        panel.style.opacity = '0';
        setTimeout(() => {
          panel.remove();
        }, 300);
      }
    });
  });

  // NOTE: Collapse functionality is now handled via Bootstrap Collapse API
  // See init.js for the Bootstrap-based collapse implementation

  logger.log('Panel toolbox initialized (jQuery-free)');
}

/**
 * Progress Bar Animations
 * Already modern - moved from init.js
 */
export function initializeProgressBars() {
  // Animate all progress bars with data-transitiongoal
  const progressBars = DOM.selectAll('.progress-bar[data-transitiongoal]');

  progressBars.forEach(bar => {
    const targetPercent = parseInt(bar.getAttribute('data-transitiongoal'), 10);
    const displayText = bar.getAttribute('data-display-text') !== 'false';

    // Remove any inline width styles to allow animation
    bar.style.removeProperty('width');

    // Set initial state with !important to override any CSS
    bar.style.setProperty('width', '0%', 'important');
    bar.setAttribute('aria-valuenow', '0');

    // Animate to target value
    setTimeout(() => {
      bar.style.setProperty('transition', 'width 1s ease-in-out', 'important');
      bar.style.setProperty('width', targetPercent + '%', 'important');
      bar.setAttribute('aria-valuenow', targetPercent);

      if (displayText) {
        bar.textContent = targetPercent + '%';
      }
    }, 100);
  });

  // Handle App Versions progress bars (widget_summary containers)
  const appVersionBars = DOM.selectAll('.widget_summary .progress-bar');
  appVersionBars.forEach(bar => {
    // Skip if already processed with data-transitiongoal
    if (bar.getAttribute('data-transitiongoal')) {
      return;
    }

    // Extract target percentage from inline style
    const inlineWidth = bar.style.width;
    if (inlineWidth && inlineWidth.includes('%')) {
      const targetPercent = parseInt(inlineWidth.replace('%', ''), 10);

      // Remove inline width and animate
      bar.style.removeProperty('width');
      bar.style.setProperty('width', '0%', 'important');
      bar.setAttribute('aria-valuenow', '0');

      // Animate to target value with delay for staggered effect
      const delay = Array.from(appVersionBars).indexOf(bar) * 100 + 200;
      setTimeout(() => {
        bar.style.setProperty('transition', 'width 1s ease-in-out', 'important');
        bar.style.setProperty('width', targetPercent + '%', 'important');
        bar.setAttribute('aria-valuenow', targetPercent);
      }, delay);
    }
  });

  // For other progress bars without data-transitiongoal, just show them immediately
  const staticProgressBars = DOM.selectAll('.progress-bar:not([data-transitiongoal])');
  staticProgressBars.forEach(bar => {
    // Skip App Versions bars as they're handled above
    if (DOM.closest(bar, '.widget_summary')) {
      return;
    }

    const currentPercent = bar.style.width || bar.getAttribute('aria-valuenow') + '%' || '0%';
    bar.style.width = currentPercent;
  });

  logger.log('Progress bars initialized (jQuery-free)');
}

/**
 * Toast Notifications
 * Bootstrap 5 native implementation - MODERNIZED
 */
export function initializeToasts() {
  // Initialize all toast elements
  const toastElements = DOM.selectAll('.toast');

  toastElements.forEach(toastEl => {
    // Use Bootstrap 5 native Toast API instead of jQuery plugin
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      const toast = new bootstrap.Toast(toastEl);

      // Auto-show toasts marked with data-show
      if (toastEl.getAttribute('data-show') === 'true') {
        toast.show();
      }
    }
  });

  logger.log('Toasts initialized (jQuery-free)');
}

/**
 * Bootstrap Component Initialization
 * Using Bootstrap 5 native APIs - MODERNIZED
 */
export function initializeBootstrapComponents() {
  // Initialize tooltips - MODERNIZED from jQuery
  if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
    DOM.selectAll('[data-bs-toggle="tooltip"]').forEach(element => {
      new bootstrap.Tooltip(element);
    });
  }

  // Initialize popovers - MODERNIZED from jQuery
  if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
    DOM.selectAll('[data-bs-toggle="popover"]').forEach(element => {
      new bootstrap.Popover(element);
    });
  }

  logger.log('Bootstrap components initialized (jQuery-free)');
}

// Export DOM utilities for other modules
export { DOM };

// Auto-initialize when module loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializePanelToolbox();
    initializeProgressBars();
    initializeToasts();
    initializeBootstrapComponents();
  });
}
