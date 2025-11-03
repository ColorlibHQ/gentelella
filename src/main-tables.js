// Dedicated entry point for tables_dynamic.html
// Ensures proper DataTables initialization without conflicts

// Import security utilities
import './utils/security.js';

// Bootstrap 5 - No jQuery dependency
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Global styles
import './main.scss';

// DataTables with all extensions - LOAD FIRST
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

// Make DataTable globally available immediately
window.DataTable = DataTable;
globalThis.DataTable = DataTable;

// DOM utilities for vanilla JS operations
const DOM = {
  ready: (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => [...document.querySelectorAll(selector)]
};

window.DOM = DOM;

// Essential JavaScript functionality - modern versions
import './js/helpers/smartresize-modern.js';
import './js/sidebar-modern.js';
import './js/init-modern.js';

// Initialize DataTables immediately when DOM is ready
DOM.ready(() => {

  // Small delay to ensure all modules are loaded
  setTimeout(() => {

    if (typeof window.DataTable === 'undefined') {
      return;
    }

    try {
      // Initialize basic DataTable
      const basicTable = DOM.select('#datatable');
      if (basicTable) {
        const dt1 = new DataTable(basicTable, {
          responsive: true,
          pageLength: 10,
          lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
          order: [[0, 'asc']],
          language: {
            search: 'Search employees:',
            lengthMenu: 'Show _MENU_ entries per page',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries',
            paginate: {
              first: 'First',
              last: 'Last',
              next: 'Next',
              previous: 'Previous'
            }
          }
        });
      }

      // Initialize DataTable with Buttons
      const buttonsTable = DOM.select('#datatable-buttons');
      if (buttonsTable) {
        const dt2 = new DataTable(buttonsTable, {
          responsive: true,
          pageLength: 10,
          dom: 'Bfrtip',
          buttons: [
            {
              extend: 'copy',
              text: '<i class="fas fa-copy"></i> Copy',
              className: 'btn btn-secondary btn-sm'
            },
            {
              extend: 'csv',
              text: '<i class="fas fa-file-csv"></i> CSV',
              className: 'btn btn-success btn-sm'
            },
            {
              extend: 'excel',
              text: '<i class="fas fa-file-excel"></i> Excel',
              className: 'btn btn-primary btn-sm'
            },
            {
              extend: 'print',
              text: '<i class="fas fa-print"></i> Print',
              className: 'btn btn-info btn-sm'
            }
          ],
          language: {
            search: 'Search records:',
            lengthMenu: 'Show _MENU_ entries per page',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries'
          }
        });
      }

      // Initialize Responsive DataTable
      const responsiveTable = DOM.select('#datatable-responsive');
      if (responsiveTable) {
        const dt3 = new DataTable(responsiveTable, {
          responsive: true,
          pageLength: 10,
          order: [[0, 'asc']],
          language: {
            search: 'Search records:',
            lengthMenu: 'Show _MENU_ entries per page',
            info: 'Showing _START_ to _END_ of _TOTAL_ entries'
          },
          columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: -1 }
          ]
        });
      }


    } catch (error) {
    }
  }, 300);
});

