// Minimal test - adding back essential functionality step by step

// Import jQuery setup first - needed for all jQuery-dependent features
import $ from './jquery-setup.js';

// Ensure jQuery is available globally FIRST - this is critical for Vite builds
window.jQuery = window.$ = $;
globalThis.jQuery = globalThis.$ = $;

// jQuery UI effect.js (provides easing functions)
import 'jquery-ui/ui/effect.js';

// Ensure basic easing functions are available as fallbacks
if (!$.easing) {
  $.easing = {};
}

// Add missing easing functions as fallbacks
$.extend($.easing, {
  easeOutElastic: function(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutQuart: function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }
});

// Import jQuery-dependent vendor libraries AFTER jQuery is global

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;
globalThis.Switchery = Switchery;

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// TempusDominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
globalThis.TempusDominus = TempusDominus;

// Chart.js v4 - No jQuery dependency - CRITICAL: Ensure this is available BEFORE init.js
import { Chart, registerables } from 'chart.js';
try {
  Chart.register(...registerables);
  window.Chart = Chart;
  globalThis.Chart = Chart;
} catch (error) {
  console.error('❌ Chart.js registration error:', error);
  window.Chart = Chart; // Still assign even if registration fails
  globalThis.Chart = Chart;
}

// jQuery Sparkline (for mini charts in widgets)
import 'jquery-sparkline';

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
  console.error('Skycons loading error:', error);
}

// Leaflet (for maps)
import * as L from 'leaflet';
window.L = L;
globalThis.L = L;

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Add global error handlers to prevent uncaught promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('🚨 Unhandled promise rejection:', event.reason);
  // Prevent the default browser behavior (like logging to console)
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  console.warn('🚨 Global error caught:', event.error);
});

// Leaflet CSS
import 'leaflet/dist/leaflet.css';

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Ion Range Slider
import 'ion-rangeslider';
window.ionRangeSlider = true;

// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

// Input Mask
import Inputmask from 'inputmask';
window.Inputmask = Inputmask;
globalThis.Inputmask = Inputmask;

// Modern Color Picker
import Pickr from '@simonwep/pickr';
window.Pickr = Pickr;
globalThis.Pickr = Pickr;

// Pickr CSS
import '@simonwep/pickr/dist/themes/classic.min.css';

// jQuery Knob (needs jQuery to be global first)
import 'jquery-knob';

// Cropper.js for image cropping
import Cropper from 'cropperjs';
window.Cropper = Cropper;
globalThis.Cropper = Cropper;

// DataTables (Bootstrap 5 styling)
import DataTable from 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';

// DataTables Extensions for tables_dynamic.html
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-fixedheader';
import 'datatables.net-keytable';

// Required for export functionality
import JSZip from 'jszip';
window.JSZip = JSZip;

document.addEventListener('DOMContentLoaded', () => {
  const advancedTableEl = document.getElementById('advancedDataTable');
  if (advancedTableEl) {
    try {
      new DataTable(advancedTableEl, {
        responsive: true,
        pageLength: 10,
        lengthChange: true,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        searching: true,
        ordering: true,
        info: true,
        paging: true,
        columnDefs: [
          { orderable: false, targets: [5] }, // Disable sorting on Actions column
          { className: "text-center", targets: [3, 5] } // Center align Status and Actions
        ],
        language: {
          search: "Search invoices:",
          lengthMenu: "Show _MENU_ invoices per page",
          info: "Showing _START_ to _END_ of _TOTAL_ invoices",
          paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous"
          }
        }
      });
      
    } catch (error) {
      console.error('❌ DataTable initialization failed:', error);
    }
  }
});

// Initialize DataTables for tables_dynamic.html specifically
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the tables_dynamic page
  if (window.location.pathname.includes('tables_dynamic.html')) {
    
    
    // Wait a short moment to ensure all assets are loaded
    setTimeout(() => {
    
    // Initialize all DataTables with proper configurations
    
    // Basic DataTable
    if (document.getElementById('datatable') && !$.fn.DataTable.isDataTable('#datatable')) {
      new DataTable('#datatable', {
        responsive: true,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        language: {
          search: "Search employees:",
          lengthMenu: "Show _MENU_ employees per page",
          info: "Showing _START_ to _END_ of _TOTAL_ employees"
        }
      });
      
    }

    // DataTable with checkboxes
    if (document.getElementById('datatable-checkbox') && !$.fn.DataTable.isDataTable('#datatable-checkbox')) {
      new DataTable('#datatable-checkbox', {
        responsive: true,
        pageLength: 10,
        order: [[1, 'asc']],
        columnDefs: [
          { orderable: false, targets: [0] }
        ],
        language: {
          search: "Search employees:",
          lengthMenu: "Show _MENU_ employees per page",
          info: "Showing _START_ to _END_ of _TOTAL_ employees"
        }
      });
      
    }

    // DataTable with buttons
    if (document.getElementById('datatable-buttons') && !$.fn.DataTable.isDataTable('#datatable-buttons')) {
      new DataTable('#datatable-buttons', {
        responsive: true,
        pageLength: 10,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'copy',
            className: 'btn btn-sm btn-outline-secondary',
            text: '<i class="fas fa-copy me-1"></i>Copy'
          },
          {
            extend: 'csv',
            className: 'btn btn-sm btn-outline-success',
            text: '<i class="fas fa-file-csv me-1"></i>CSV'
          },
          {
            extend: 'excel',
            className: 'btn btn-sm btn-outline-success',
            text: '<i class="fas fa-file-excel me-1"></i>Excel'
          },
          {
            extend: 'pdf',
            className: 'btn btn-sm btn-outline-danger',
            text: '<i class="fas fa-file-pdf me-1"></i>PDF'
          },
          {
            extend: 'print',
            className: 'btn btn-sm btn-outline-primary',
            text: '<i class="fas fa-print me-1"></i>Print'
          }
        ],
        language: {
          search: "Search employees:",
          lengthMenu: "Show _MENU_ employees per page",
          info: "Showing _START_ to _END_ of _TOTAL_ employees"
        }
      });
      
    }

    // DataTable with fixed header
    if (document.getElementById('datatable-fixed-header') && !$.fn.DataTable.isDataTable('#datatable-fixed-header')) {
      new DataTable('#datatable-fixed-header', {
        responsive: true,
        pageLength: 10,
        fixedHeader: true,
        language: {
          search: "Search employees:",
          lengthMenu: "Show _MENU_ employees per page",
          info: "Showing _START_ to _END_ of _TOTAL_ employees"
        }
      });
      
    }

    // DataTable with KeyTable extension
    if (document.getElementById('datatable-keytable') && !$.fn.DataTable.isDataTable('#datatable-keytable')) {
      new DataTable('#datatable-keytable', {
        responsive: true,
        pageLength: 10,
        keys: true,
        language: {
          search: "Search employees:",
          lengthMenu: "Show _MENU_ employees per page",
          info: "Showing _START_ to _END_ of _TOTAL_ employees"
        }
      });
      
    }

    // Responsive DataTable
    if (document.getElementById('datatable-responsive') && !$.fn.DataTable.isDataTable('#datatable-responsive')) {
      new DataTable('#datatable-responsive', {
        responsive: true,
        pageLength: 10,
        language: {
          search: "Search employees:",
          lengthMenu: "Show _MENU_ employees per page",
          info: "Showing _START_ to _END_ of _TOTAL_ employees"
        }
      });
      
    }

    // Add custom styles for DataTables buttons
    const style = document.createElement('style');
    style.textContent = `
      .dt-buttons {
        margin-bottom: 1rem;
      }
      .dt-buttons .btn {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .dataTables_wrapper .dataTables_filter input {
        border: 1px solid #ddd;
        border-radius: 0.375rem;
        padding: 0.375rem 0.75rem;
      }
      .dataTables_wrapper .dataTables_length select {
        border: 1px solid #ddd;
        border-radius: 0.375rem;
        padding: 0.375rem 0.75rem;
      }
    `;
    document.head.appendChild(style);

    
    }, 100); // Close the setTimeout
  }

  // Initialize DataTables for tables.html page
  if (window.location.pathname.includes('tables.html')) {
    
    
    // Advanced DataTable for Employee Management
    if (document.getElementById('advancedDataTable') && !$.fn.DataTable.isDataTable('#advancedDataTable')) {
      try {
        new DataTable('#advancedDataTable', {
          responsive: true,
          pageLength: 10,
          lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
          order: [[0, 'asc']],
          language: {
            search: "Search employees:",
            lengthMenu: "Show _MENU_ employees per page",
            info: "Showing _START_ to _END_ of _TOTAL_ employees",
            paginate: {
              first: "First",
              last: "Last",
              next: "Next",
              previous: "Previous"
            }
          },
          columnDefs: [
            { 
              orderable: false, 
              targets: [6] // Actions column
            }
          ]
        });
        
      } catch (error) {
        console.error('❌ Failed to initialize Advanced DataTable:', error);
      }
    }

    
  }
});

// Create a library availability checker for inline scripts BEFORE importing init.js
window.waitForLibraries = function(libraries, callback, timeout = 5000) {
  const startTime = Date.now();
  
  function check() {
    const allAvailable = libraries.every(lib => {
      return (typeof window[lib] !== 'undefined') || (typeof globalThis[lib] !== 'undefined');
    });
    
    if (allAvailable) {
      callback();
    } else if (Date.now() - startTime < timeout) {
      setTimeout(check, 50);
    } else {
      // Only warn in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Timeout waiting for libraries:', libraries.filter(lib => 
          typeof window[lib] === 'undefined' && typeof globalThis[lib] === 'undefined'
        ));
      }
      callback(); // Call anyway to prevent hanging
    }
  }
  
  check();
};

// CRITICAL: Ensure all globals are available before importing the JS modules
// Add the essential JavaScript functionality - SYNCHRONOUS imports to ensure proper order
import './js/helpers/smartresize.js';
import './js/sidebar.js';

// IMPORTANT: Load init.js synchronously but ensure all globals are ready first
// Import init.js synchronously - all dependencies should be loaded by now
import './js/init.js';

// Import page-specific chart initializations

// Widget-specific initialization
$(document).ready(function() {
  // Initialize Sparklines
  function initSparklines() {
    if (typeof $.fn.sparkline === 'undefined') {
      return;
    }
    
    // Sparkline chart configurations
    $(".sparkline_one, .sparkline_two").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 4, 5, 6, 3, 5, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
      type: 'line',
      width: '100%',
      height: '30',
      lineColor: '#26B99A',
      fillColor: '#ccc',
      lineWidth: 2,
      spotColor: '#26B99A',
      minSpotColor: '#26B99A'
    });
    
    $(".sparkline_three").sparkline([2, 4, 3, 4, 5, 4, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6], {
      type: 'line',
      width: '100%',
      height: '30',
      lineColor: '#34495E',
      fillColor: '#ccc',
      lineWidth: 2,
      spotColor: '#34495E',
      minSpotColor: '#34495E'
    });
  }
  
  // Initialize Charts
  function initWidgetCharts() {
    // Only run if Chart.js is available
    if (typeof Chart === 'undefined') {
      
      return;
    }
    
    // Chart configuration
    const commonChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          display: false
        },
        x: {
          display: false
        }
      }
    };
    
    // Initialize line charts for widgets
    const lineChartCanvases = ['canvas_line', 'canvas_line1', 'canvas_line2', 'canvas_line3', 'canvas_line4'];
    
    lineChartCanvases.forEach(canvasId => {
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
              data: [12, 19, 3, 5, 2, 3, 15, 8, 12, 7, 14, 9],
              borderColor: '#26B99A',
              backgroundColor: 'rgba(38, 185, 154, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }]
          },
          options: commonChartOptions
        });
      }
    });
    
    // Initialize doughnut charts
    const doughnutCanvases = ['canvas_doughnut', 'canvas_doughnut2', 'canvas_doughnut3', 'canvas_doughnut4'];
    
    doughnutCanvases.forEach(canvasId => {
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
              data: [30, 25, 25, 20],
              backgroundColor: ['#26B99A', '#3498DB', '#E74C3C', '#F39C12'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    });
    
    // Initialize Agent Performance chart for index3.html
    const agentPerformanceChart = document.getElementById('agentPerformanceChart');
    if (agentPerformanceChart) {
      const ctx = agentPerformanceChart.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Agent A', 'Agent B', 'Agent C', 'Agent D'],
          datasets: [{
            label: 'Orders',
            data: [8, 6, 5, 5],
            backgroundColor: [
              'rgba(52, 152, 219, 0.8)',
              'rgba(26, 188, 156, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(243, 156, 18, 0.8)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { 
              display: false 
            } 
          },
          scales: { 
            x: { 
              beginAtZero: true 
            } 
          }
        }
      });
    }
  }
  
  // Initialize circular progress (jQuery Knob)
  function initCircularProgress() {
    if (typeof $.fn.knob === 'undefined') {
      return;
    }
    
    $(".chart").each(function() {
      const $this = $(this);
      const percent = $this.data('percent') || 50;
      
      $this.knob({
        angleArc: 250,
        angleOffset: -125,
        readOnly: true,
        width: 100,
        height: 100,
        fgColor: "#26B99A",
        bgColor: "#E8E8E8",
        thickness: 0.1,
        lineCap: "round"
      });
      
      // Animate the knob
      $({ animatedVal: 0 }).animate({ animatedVal: percent }, {
        duration: 1000,
        easing: "swing",
        step: function() {
          $this.val(Math.ceil(this.animatedVal)).trigger('change');
        }
      });
    });
  }
  
  // Initialize progress bars
  function initProgressBars() {
    $('.progress .progress-bar').each(function() {
      const $this = $(this);
      
      // Skip bars with data-transitiongoal as they're handled by initUniversalProgressBars
      if ($this.attr('data-transitiongoal')) {
        return;
      }
      
      const goal = $this.data('transitiongoal') || 0;
      
      // Animate progress bar
      $this.animate({
        width: goal + '%'
      }, 1000, 'easeInOutQuart');
    });
  }
  
  // Run all initializations with a delay to ensure dependencies are loaded
  setTimeout(() => {
    
    initSparklines();
    initWidgetCharts();
    initCircularProgress();
    initProgressBars();
  }, 200); // Small delay to ensure init.js has run first


});

// Universal Progress Bars Initialization
function initUniversalProgressBars() {
  // Find all progress bars across all pages
  const allProgressBars = document.querySelectorAll('.progress-bar');
  
  if (allProgressBars.length > 0) {
    allProgressBars.forEach((bar, index) => {
      // Skip if already animated
      if (bar.classList.contains('animation-complete')) {
        return;
      }
      
      let targetWidth = null;
      
      // Check for data-transitiongoal attribute first (Top Campaign Performance)
      const transitionGoal = bar.getAttribute('data-transitiongoal');
      if (transitionGoal) {
        targetWidth = transitionGoal + '%';
      } else {
        // Read the existing inline width style
        const inlineWidth = bar.style.width;
        const computedStyle = window.getComputedStyle(bar);
        const currentWidth = inlineWidth || computedStyle.width;
        
        // Only use meaningful width values
        if (currentWidth && currentWidth !== '0px' && currentWidth !== '0%' && currentWidth !== 'auto') {
          targetWidth = currentWidth;
        }
      }
      
      // Animate if we have a target width
      if (targetWidth) {
        // Store the target width
        bar.setAttribute('data-target-width', targetWidth);
        bar.style.setProperty('--bar-width', targetWidth);
        
        // Start animation from 0%
        bar.style.width = '0%';
        bar.style.transition = 'width 0.8s ease-out';
        
        // Animate to target width with staggered delay
        setTimeout(() => {
          bar.style.width = targetWidth;
          
          // Lock the width permanently after animation
          setTimeout(() => {
            bar.style.transition = 'none';
            bar.style.width = targetWidth;
            bar.classList.add('animation-complete');
          }, 1000);
        }, index * 100 + 300); // Staggered animation
      }
    });
  }
}

// Initialize universal progress bars on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initUniversalProgressBars, 200);
}); 