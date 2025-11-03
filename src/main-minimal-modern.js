// Modern jQuery-Free Minimal Bundle
// Complete replacement for jQuery dependencies

// Native DOM utilities (jQuery replacement) - LOAD FIRST
const DOM = {
  ready: (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => [...document.querySelectorAll(selector)],
  addClass: (element, className) => element?.classList.add(className),
  removeClass: (element, className) => element?.classList.remove(className),
  toggleClass: (element, className) => element?.classList.toggle(className),
  hasClass: (element, className) => element?.classList.contains(className),
  closest: (element, selector) => element?.closest(selector),
  find: (element, selector) => element?.querySelector(selector),
  findAll: (element, selector) => [...(element?.querySelectorAll(selector) || [])],
  animate: (element, properties, duration = 1000, easing = 'ease') => {
    return new Promise(resolve => {
      const transitions = [];
      Object.keys(properties).forEach(prop => {
        const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        element.style.setProperty('transition', `${prop} ${duration}ms ${easing}`);
        element.style[camelProp] = properties[prop];
        transitions.push(`${prop} ${duration}ms ${easing}`);
      });

      element.style.transition = transitions.join(', ');

      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }
};

// Make DOM utilities available globally immediately
window.DOM = DOM;

// Import security utilities for XSS protection
import './utils/security.js';

// Native easing functions (jQuery-free)
const EasingFunctions = {
  easeOutElastic: function (t, b, c, d) {
    let s = 1.70158; let p = 0; let a = c;
    if (t === 0) {return b;}
    if ((t /= d) === 1) {return b + c;}
    if (!p) {p = d * 0.3;}
    if (a < Math.abs(c)) {
      a = c; s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },
  easeInOutQuart: function (t, b, c, d) {
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }
};

window.EasingFunctions = EasingFunctions;

// Import jQuery-free vendor libraries

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;
globalThis.Switchery = Switchery;

// Choices.js (Select2 replacement)
import Choices from 'choices.js';
window.Choices = Choices;

// NoUiSlider (Ion Range Slider replacement)
import noUiSlider from 'nouislider';
window.noUiSlider = noUiSlider;

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// TempusDominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
globalThis.TempusDominus = TempusDominus;

// Chart.js v4 - No jQuery dependency
import { Chart, registerables } from 'chart.js';
try {
  Chart.register(...registerables);
  window.Chart = Chart;
  globalThis.Chart = Chart;
} catch (error) {
  window.Chart = Chart;
  globalThis.Chart = Chart;
}

// ECharts - Apache ECharts library
import * as echarts from 'echarts';
window.echarts = echarts;
globalThis.echarts = echarts;

// Skycons (Animated weather icons)
import SkyconsFactory from 'skycons';
try {
  const Skycons = SkyconsFactory(typeof window !== 'undefined' ? window : globalThis);
  window.Skycons = Skycons;
  globalThis.Skycons = Skycons;
} catch (error) {
}

// Leaflet (for maps)
import * as L from 'leaflet';
window.L = L;
globalThis.L = L;

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Add global error handlers to prevent uncaught promise rejections
window.addEventListener('unhandledrejection', event => {
  event.preventDefault();
});

window.addEventListener('error', event => {
});

// CSS imports for libraries
import 'leaflet/dist/leaflet.css';
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';
import 'nouislider/dist/nouislider.css';
import 'choices.js/public/assets/styles/choices.min.css';
import '@simonwep/pickr/dist/themes/classic.min.css';

// Input Mask
import Inputmask from 'inputmask';
window.Inputmask = Inputmask;
globalThis.Inputmask = Inputmask;

// Modern Color Picker
import * as PickrModule from '@simonwep/pickr';
const Pickr = PickrModule.default || PickrModule.Pickr || PickrModule;
window.Pickr = Pickr;
globalThis.Pickr = Pickr;

// Cropper.js for image cropping
import Cropper from 'cropperjs';
window.Cropper = Cropper;
globalThis.Cropper = Cropper;

// DataTables (Bootstrap 5 styling) - Modern vanilla JS usage
import DataTable from 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-fixedheader';
import 'datatables.net-keytable';

// Required for export functionality
import JSZip from 'jszip';
window.JSZip = JSZip;

// Make DataTable globally available for chart initializer
window.DataTable = DataTable;
globalThis.DataTable = DataTable;

// Modern DataTable initialization
document.addEventListener('DOMContentLoaded', () => {
  const advancedTableEl = document.getElementById('advancedDataTable');
  if (advancedTableEl && !advancedTableEl.dataTableInstance) {
    try {
      const dataTable = new DataTable(advancedTableEl, {
        responsive: true,
        pageLength: 10,
        lengthChange: true,
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, 'All']
        ],
        searching: true,
        ordering: true,
        info: true,
        paging: true,
        columnDefs: [
          { orderable: false, targets: [5] },
          { className: 'text-center', targets: [3, 5] }
        ],
        language: {
          search: 'Search invoices:',
          lengthMenu: 'Show _MENU_ invoices per page',
          info: 'Showing _START_ to _END_ of _TOTAL_ invoices',
          paginate: {
            first: 'First',
            last: 'Last',
            next: 'Next',
            previous: 'Previous'
          }
        }
      });
      advancedTableEl.dataTableInstance = dataTable;
    } catch (error) {
    }
  }
});

// Import table performance optimizer
import './utils/table-optimizer.js';

// Initialize DataTables for other pages
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('tables.html')) {
    const advancedTable = document.getElementById('advancedDataTable');
    if (advancedTable && !advancedTable.dataTableInstance) {
      try {
        const dataTable = new DataTable(advancedTable, {
          responsive: true,
          pageLength: 10,
          lengthMenu: [
            [5, 10, 25, 50],
            [5, 10, 25, 50]
          ],
          order: [[0, 'asc']],
          language: {
            search: 'Search employees:',
            lengthMenu: 'Show _MENU_ employees per page',
            info: 'Showing _START_ to _END_ of _TOTAL_ employees',
            paginate: {
              first: 'First',
              last: 'Last',
              next: 'Next',
              previous: 'Previous'
            }
          },
          columnDefs: [
            {
              orderable: false,
              targets: [6]
            }
          ]
        });
        advancedTable.dataTableInstance = dataTable;
      } catch (error) {
      }
    }
  }
});

// DOM utilities are already defined at the top of the file

// Import comprehensive chart initializer
import './chart-initializer.js';

// Widget-specific initialization (jQuery-free)
DOM.ready(() => {

  // The chart initializer handles all chart initialization
  // No need for manual chart initialization here anymore

  // Initialize progress bars (vanilla JS) - keep this as it's not chart-related
  function initProgressBars() {
    const progressBars = DOM.selectAll('.progress .progress-bar');

    progressBars.forEach(bar => {
      if (bar.getAttribute('data-transitiongoal')) {return;}

      const goal = parseInt(bar.dataset.transitiongoal) || 0;

      if (goal > 0) {
        bar.style.width = '0%';
        bar.style.transition = 'width 1s ease-in-out';

        setTimeout(() => {
          bar.style.width = goal + '%';
        }, 100);
      }
    });
  }

  // Initialize non-chart elements
  initProgressBars();
});

// Universal Progress Bars Initialization (vanilla JS)
function initUniversalProgressBars() {
  const allProgressBars = DOM.selectAll('.progress-bar');

  if (allProgressBars.length > 0) {
    allProgressBars.forEach((bar, index) => {
      if (bar.classList.contains('animation-complete')) {return;}

      let targetWidth = null;
      const transitionGoal = bar.getAttribute('data-transitiongoal');

      if (transitionGoal) {
        targetWidth = transitionGoal + '%';
      } else {
        const inlineWidth = bar.style.width;
        const computedStyle = window.getComputedStyle(bar);
        const currentWidth = inlineWidth || computedStyle.width;

        if (currentWidth && currentWidth !== '0px' && currentWidth !== '0%' && currentWidth !== 'auto') {
          targetWidth = currentWidth;
        }
      }

      if (targetWidth) {
        bar.setAttribute('data-target-width', targetWidth);
        bar.style.setProperty('--bar-width', targetWidth);
        bar.style.width = '0%';
        bar.style.transition = 'width 0.8s ease-out';

        setTimeout(() => {
          bar.style.width = targetWidth;
          setTimeout(() => {
            bar.style.transition = 'none';
            bar.style.width = targetWidth;
            bar.classList.add('animation-complete');
          }, 1000);
        }, index * 100 + 300);
      }
    });
  }
}

// Initialize universal progress bars on DOM ready
DOM.ready(() => {
  setTimeout(initUniversalProgressBars, 200);
});

// Import essential JavaScript functionality - modern versions
import './js/helpers/smartresize-modern.js';
import './js/sidebar-modern.js';
import './js/init-modern.js';

// Import weather and maps modules for index.html
import './modules/weather.js';
import './modules/maps.js';

// Import echarts module for echarts.html
import './modules/echarts-modern.js';

