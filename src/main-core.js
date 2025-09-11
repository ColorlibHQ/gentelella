// CORE ESSENTIALS - Only what every page needs (jQuery-free)

// Import and expose security utilities globally
import { sanitizeHtml, sanitizeText, setSafeInnerHTML } from './utils/security.js';
window.sanitizeHtml = sanitizeHtml;
window.sanitizeText = sanitizeText;
window.setSafeInnerHTML = setSafeInnerHTML;

// Import and expose validation utilities globally
import * as ValidationUtils from './utils/validation.js';
window.ValidationUtils = ValidationUtils;

// Import modern DOM utilities
import DOM from './utils/dom-modern.js';

// Bootstrap 5 - Essential for all pages
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Initialize Bootstrap tooltips and popovers
document.addEventListener('DOMContentLoaded', function () {
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

// Essential UI components are now handled by Bootstrap 5 and custom modules

// Add global error boundary to catch and handle errors gracefully
window.addEventListener('error', event => {
  // Only log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error({
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  }

  // Could send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: sendErrorToService(event.error);
  }
});

// Performance monitoring for module loading
window.moduleLoadTimes = new Map();

// Console logging in development only
if (process.env.NODE_ENV === 'development') {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    originalLog(`[${new Date().toLocaleTimeString()}]`, ...args);
  };

  console.error = (...args) => {
    originalError(`[${new Date().toLocaleTimeString()}] ❌`, ...args);
  };

  console.warn = (...args) => {
    originalWarn(`[${new Date().toLocaleTimeString()}] ⚠️`, ...args);
  };
}

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Core scripts that all pages need
import './js/helpers/smartresize-modern.js';
import './js/sidebar-modern.js';
import './js/init-modern.js';

// Module loading cache to prevent duplicate loads
window.moduleCache = new Map();

// Loading states for better UX
window.showModuleLoadingState = function (moduleName) {
  const indicator = document.createElement('div');
  indicator.id = `loading-${moduleName}`;
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1ABB9C;
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 13px;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  `;
  indicator.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Loading ${moduleName}...`;
  document.body.appendChild(indicator);
  return indicator;
};

window.hideModuleLoadingState = function (indicator) {
  if (indicator && indicator.parentNode) {
    indicator.style.opacity = '0';
    indicator.style.transform = 'translateX(100%)';
    indicator.style.transition = 'all 0.3s ease';
    setTimeout(() => indicator.remove(), 300);
  }
};

// Enhanced dynamic loader for page-specific modules
window.loadModule = async function (moduleName, showLoading = true) {
  // Check cache first
  if (window.moduleCache.has(moduleName)) {
    return window.moduleCache.get(moduleName);
  }

  let loadingIndicator;
  if (showLoading) {
    loadingIndicator = window.showModuleLoadingState(moduleName);
  }

  try {
    const startTime = performance.now();
    let module;

    switch (moduleName) {
      case 'charts':
        module = await import('./modules/charts.js');
        break;
      case 'forms':
        module = await import('./modules/forms.js');
        break;
      case 'tables':
        module = await import('./modules/tables-modern.js');
        break;
      case 'tables-modern':
        module = await import('./modules/tables-modern.js');
        break;
      case 'ui':
        module = await import('./modules/ui-components.js');
        break;
      case 'dashboard':
        module = await import('./modules/dashboard.js');
        break;
      case 'weather':
        module = await import('./modules/weather.js');
        break;
      case 'maps':
        module = await import('./modules/maps.js');
        break;
      case 'echarts':
        module = await import('./modules/echarts-modern.js');
        break;
      default:
        return null;
    }

    // Cache the module and record load time
    window.moduleCache.set(moduleName, module);
    const loadTime = performance.now() - startTime;
    window.moduleLoadTimes.set(moduleName, loadTime);

    return module;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
    }
    return null;
  } finally {
    if (loadingIndicator) {
      window.hideModuleLoadingState(loadingIndicator);
    }
  }
};

// Utility to preload modules for better performance
window.preloadModules = async function (moduleNames) {
  const promises = moduleNames.map(name => window.loadModule(name, false));
  const results = await Promise.allSettled(promises);
  return results;
};

// Debug utility to show module loading stats (development only)
window.getModuleStats = function () {
  if (process.env.NODE_ENV === 'development') {

    Array.from(window.moduleLoadTimes.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([module, time]) => {
      });

    const totalTime = Array.from(window.moduleLoadTimes.values()).reduce((a, b) => a + b, 0);
  }
};

// Enhanced page readiness detector
window.waitForPageReady = function (callback, timeout = 10000) {
  const startTime = Date.now();

  function checkReady() {
    const basicReady = document.readyState === 'complete';
    const bootstrapReady = typeof window.bootstrap !== 'undefined';
    const scriptsReady = typeof window.loadModule !== 'undefined';

    if (basicReady && bootstrapReady && scriptsReady) {
      callback();
    } else if (Date.now() - startTime < timeout) {
      setTimeout(checkReady, 50);
    } else {
      callback();
    }
  }

  checkReady();
};
