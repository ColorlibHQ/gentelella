/**
 * Table Performance Optimizer
 * Fixes performance issues with large DataTables
 */

/**
 * Optimize large tables by implementing lazy loading and progressive enhancement
 */
export function optimizeTablePerformance() {
  // Add loading skeleton for tables while DataTables initializes
  addTableLoadingSkeletons();

  // Implement progressive table initialization with delays between each table
  initializeTablesProgressively();

  // Add intersection observer for lazy loading of off-screen tables
  implementLazyTableLoading();

  // Optimize table dimensions to prevent layout shifts
  optimizeTableDimensions();
}

/**
 * Add loading skeletons to prevent layout shifts
 */
function addTableLoadingSkeletons() {
  const tables = document.querySelectorAll('table[id^="datatable"]');

  tables.forEach(table => {
    // Add a minimum height to prevent layout shift
    table.style.minHeight = '400px';

    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'table-loading-overlay';
    loadingDiv.innerHTML = `
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading table...</span>
        </div>
        <span class="ms-2">Initializing table...</span>
      </div>
    `;
    loadingDiv.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    `;

    // Make parent container relative
    const parent = table.closest('.table-responsive') || table.parentElement;
    parent.style.position = 'relative';
    parent.appendChild(loadingDiv);

    // Store reference for removal later
    table.loadingOverlay = loadingDiv;
  });
}

/**
 * Initialize tables progressively with delays to prevent blocking
 */
function initializeTablesProgressively() {
  const tableConfigs = [
    { id: 'datatable', delay: 0 },
    { id: 'datatable-checkbox', delay: 300 },
    { id: 'datatable-buttons', delay: 600 },
    { id: 'datatable-responsive', delay: 900 }
  ];

  tableConfigs.forEach(config => {
    setTimeout(() => {
      initializeSpecificTable(config.id);
    }, config.delay);
  });
}

/**
 * Initialize a specific table with optimized settings
 */
function initializeSpecificTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table || table.dataTableInstance) {
    return;
  }

  try {
    // Basic configuration optimized for performance
    const config = {
      pageLength: 25, // Smaller page size for better performance
      processing: true,
      deferRender: true, // Only render visible rows
      stateSave: true, // Save user state
      responsive: true,
      autoWidth: false,
      dom:
        '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
        '<"row"<"col-sm-12"tr>>' +
        '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
      language: {
        processing: 'Loading...',
        loadingRecords: 'Loading...',
        emptyTable: 'No data available'
      },
      initComplete: function () {
        // Remove loading overlay when table is ready
        if (table.loadingOverlay) {
          table.loadingOverlay.remove();
          delete table.loadingOverlay;
        }
        console.log(`✅ Table ${tableId} initialized successfully`);
      }
    };

    // Add specific features based on table type
    if (tableId === 'datatable-buttons') {
      config.buttons = ['copy', 'csv', 'excel', 'pdf', 'print'];
      config.dom = 'Bfrtip';
    }

    // Initialize DataTable - check both global DataTable and jQuery DataTable
    if (typeof DataTable !== 'undefined') {
      const dataTable = new DataTable(table, config);
      table.dataTableInstance = dataTable;
    } else if (typeof window.$ !== 'undefined' && $.fn.DataTable) {
      const dataTable = $(table).DataTable(config);
      table.dataTableInstance = dataTable;
    }
  } catch (error) {
    console.error(`❌ Failed to initialize table ${tableId}:`, error);
    // Remove loading overlay even on error
    if (table.loadingOverlay) {
      table.loadingOverlay.remove();
      delete table.loadingOverlay;
    }
  }
}

/**
 * Implement lazy loading for tables not in viewport
 */
function implementLazyTableLoading() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const table = entry.target;
            const tableId = table.id;

            // Initialize table when it becomes visible
            if (!table.dataTableInstance) {
              setTimeout(() => {
                initializeSpecificTable(tableId);
              }, 100);
            }

            // Stop observing once initialized
            observer.unobserve(table);
          }
        });
      },
      {
        rootMargin: '100px' // Start loading 100px before element is visible
      }
    );

    // Observe tables that aren't in the initial viewport
    document.querySelectorAll('table[id^="datatable"]').forEach((table, index) => {
      if (index > 1) {
        // Only lazy load tables after the first 2 (since we now have 4 total)
        observer.observe(table);
      }
    });
  }
}

/**
 * Optimize table dimensions to prevent layout shifts
 */
function optimizeTableDimensions() {
  const style = document.createElement('style');
  style.textContent = `
    /* Prevent layout shifts during DataTable initialization */
    .table-responsive {
      min-height: 400px;
    }
    
    table[id^="datatable"] {
      width: 100% !important;
      min-height: 300px;
    }
    
    /* Smooth transitions for DataTable state changes */
    .dataTables_wrapper {
      transition: opacity 0.3s ease;
    }
    
    /* Loading overlay styles */
    .table-loading-overlay {
      transition: opacity 0.3s ease;
    }
    
    /* Performance optimizations */
    .dataTables_processing {
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #666;
      font-size: 14px;
      padding: 10px 20px;
    }
  `;
  document.head.appendChild(style);
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Only run on tables_dynamic.html page
    if (window.location.pathname.includes('tables_dynamic.html')) {
      optimizeTablePerformance();
    }
  });
}
