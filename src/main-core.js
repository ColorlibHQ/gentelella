// CORE ESSENTIALS - Only what every page needs
// Import jQuery setup first - still needed for some widgets
import $ from './jquery-setup.js';

// Bootstrap 5 - Essential for all pages
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Initialize Bootstrap tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize all popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
});

// Day.js for basic date manipulation - lightweight alternative to moment.js
import dayjs from 'dayjs';
window.dayjs = dayjs;

// NProgress (Loading bar) - used across many pages
import NProgress from 'nprogress';
window.NProgress = NProgress;

// Essential UI components needed on most pages
import 'jquery-ui/ui/widget.js';

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Core scripts that all pages need
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// Dynamic loader for page-specific modules
window.loadModule = async function(moduleName) {
  try {
    switch(moduleName) {
      case 'charts':
        return await import('./modules/charts.js');
      case 'forms':
        return await import('./modules/forms.js');
      case 'tables':
        return await import('./modules/tables.js');
      case 'ui':
        return await import('./modules/ui.js');
      case 'dashboard':
        return await import('./modules/dashboard.js');
      default:
        console.warn(`Module ${moduleName} not found`);
        return null;
    }
  } catch (error) {
    console.error(`Failed to load module ${moduleName}:`, error);
    return null;
  }
}; 