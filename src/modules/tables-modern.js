/**
 * Modern Tables Module - jQuery-Free DataTables
 * Uses DataTables 2.x with native JavaScript and Bootstrap 5
 * Completely eliminates jQuery dependency for tables
 */

// Import DataTables with Bootstrap 5 styling (jQuery-free)
import DataTable from 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-fixedheader';
import 'datatables.net-keytable';

// Modern DOM utilities
const DOM = {
  select: selector => document.querySelector(selector),
  selectAll: selector => [...document.querySelectorAll(selector)],
  exists: selector => document.querySelector(selector) !== null,
  getAttribute: (element, attr) => element?.getAttribute(attr),
  addClass: (element, className) => element?.classList.add(className),
  removeClass: (element, className) => element?.classList.remove(className)
};

/**
 * Initialize Modern DataTables - JQUERY ELIMINATED
 * Uses DataTables 2.x native JavaScript API
 */
export function initializeModernDataTables() {
  console.log('🎯 Initializing modern DataTables (jQuery-free)...');

  // Find all tables marked for DataTable initialization
  const tableElements = DOM.selectAll('.datatable, [data-table], .table-responsive table');

  if (tableElements.length === 0) {
    console.log('ℹ️ No tables found for DataTable initialization');
    return;
  }

  const initializedTables = [];

  tableElements.forEach(table => {
    try {
      // Skip if already initialized
      if (table.dataTableInstance) {
        return;
      }

      // Get configuration from data attributes
      const config = getTableConfig(table);

      // Initialize DataTable with modern JavaScript (no jQuery)
      const dataTable = new DataTable(table, config);

      // Store reference for external access
      table.dataTableInstance = dataTable;
      initializedTables.push({ table, instance: dataTable });

      console.log(`✅ DataTable initialized: ${table.id || 'table-' + initializedTables.length}`);
    } catch (error) {
      console.error('❌ Failed to initialize DataTable:', error);
    }
  });

  // Initialize specific table implementations
  initializeAdvancedTables();
  initializeExportTables();
  initializeResponsiveTables();

  console.log(`✅ ${initializedTables.length} DataTables initialized successfully`);
  return initializedTables;
}

/**
 * Get table configuration from data attributes
 */
function getTableConfig(table) {
  const baseConfig = {
    // Bootstrap 5 styling (built-in with datatables.net-bs5)
    responsive: true,
    autoWidth: false,

    // Modern pagination
    pagingType: 'simple_numbers',

    // Language configuration
    language: {
      search: 'Search:',
      lengthMenu: 'Show _MENU_ entries',
      info: 'Showing _START_ to _END_ of _TOTAL_ entries',
      infoEmpty: 'Showing 0 to 0 of 0 entries',
      infoFiltered: '(filtered from _MAX_ total entries)',
      paginate: {
        first: 'First',
        last: 'Last',
        next: 'Next',
        previous: 'Previous'
      },
      emptyTable: 'No data available in table',
      zeroRecords: 'No matching records found'
    },

    // Bootstrap 5 compatible DOM structure
    dom:
      '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
      '<"row"<"col-sm-12"tr>>' +
      '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>'
  };

  // Get configuration from data attributes
  const pageLength = parseInt(DOM.getAttribute(table, 'data-page-length')) || 10;
  const searching = DOM.getAttribute(table, 'data-searching') !== 'false';
  const ordering = DOM.getAttribute(table, 'data-ordering') !== 'false';
  const paging = DOM.getAttribute(table, 'data-paging') !== 'false';
  const info = DOM.getAttribute(table, 'data-info') !== 'false';
  const responsive = DOM.getAttribute(table, 'data-responsive') !== 'false';

  return {
    ...baseConfig,
    pageLength,
    searching,
    ordering,
    paging,
    info,
    responsive
  };
}

/**
 * Advanced Tables with Custom Features
 */
function initializeAdvancedTables() {
  // Tables with custom search functionality
  DOM.selectAll('.advanced-table').forEach(table => {
    if (table.dataTableInstance) {
      const dataTable = table.dataTableInstance;

      // Add custom search functionality
      const customSearch = DOM.select(`[data-table-search="${table.id}"]`);
      if (customSearch) {
        customSearch.addEventListener('input', function () {
          dataTable.search(this.value).draw();
        });
      }

      // Add column-specific filters
      DOM.selectAll(`[data-column-filter="${table.id}"]`).forEach(filter => {
        const columnIndex = parseInt(DOM.getAttribute(filter, 'data-column'));
        filter.addEventListener('change', function () {
          dataTable.column(columnIndex).search(this.value).draw();
        });
      });
    }
  });
}

/**
 * Tables with Export Functionality
 */
function initializeExportTables() {
  DOM.selectAll('.export-table, [data-export]').forEach(table => {
    if (!table.dataTableInstance) {
      return;
    }

    try {
      // Add export buttons using DataTables buttons extension
      const dataTable = table.dataTableInstance;

      // Configure export buttons
      const exportConfig = {
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'copy',
            text: 'Copy',
            className: 'btn btn-secondary btn-sm'
          },
          {
            extend: 'csv',
            text: 'CSV',
            className: 'btn btn-success btn-sm'
          },
          {
            extend: 'excel',
            text: 'Excel',
            className: 'btn btn-primary btn-sm'
          },
          {
            extend: 'pdf',
            text: 'PDF',
            className: 'btn btn-danger btn-sm'
          },
          {
            extend: 'print',
            text: 'Print',
            className: 'btn btn-info btn-sm'
          }
        ]
      };

      // Update table configuration with buttons
      dataTable.destroy();
      const newTable = new DataTable(table, {
        ...getTableConfig(table),
        ...exportConfig
      });

      table.dataTableInstance = newTable;

      console.log(`✅ Export functionality added to table: ${table.id || 'unnamed'}`);
    } catch (error) {
      console.error('❌ Failed to add export functionality:', error);
    }
  });
}

/**
 * Responsive Tables with Mobile Optimization
 */
function initializeResponsiveTables() {
  DOM.selectAll('.responsive-table').forEach(table => {
    if (!table.dataTableInstance) {
      return;
    }

    const dataTable = table.dataTableInstance;

    // Add responsive breakpoint handling
    dataTable.on('responsive-display', function (e, datatable, row, showHide, update) {
      if (showHide) {
        // Row details shown
        DOM.addClass(row.node(), 'row-details-open');
      } else {
        // Row details hidden
        DOM.removeClass(row.node(), 'row-details-open');
      }
    });

    // Add mobile-friendly search
    if (window.innerWidth < 768) {
      const searchInput = DOM.select('.dataTables_filter input', table.parentNode);
      if (searchInput) {
        searchInput.placeholder = 'Search...';
        DOM.addClass(searchInput, 'form-control-sm');
      }
    }
  });
}

/**
 * Real-time Table Updates - MODERN IMPLEMENTATION
 */
export function updateTableData(tableId, newData) {
  const table = DOM.select(`#${tableId}`);
  if (!table || !table.dataTableInstance) {
    console.warn(`⚠️ Table not found or not initialized: ${tableId}`);
    return false;
  }

  try {
    const dataTable = table.dataTableInstance;

    // Clear existing data
    dataTable.clear();

    // Add new data
    dataTable.rows.add(newData);

    // Redraw table
    dataTable.draw();

    console.log(`✅ Table data updated: ${tableId}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to update table data:', error);
    return false;
  }
}

/**
 * Table Utility Functions - MODERN IMPLEMENTATION
 */
export const TableUtils = {
  /**
   * Get table data as array
   */
  getTableData(tableId) {
    const table = DOM.select(`#${tableId}`);
    if (table && table.dataTableInstance) {
      return table.dataTableInstance.rows().data().toArray();
    }
    return [];
  },

  /**
   * Add row to table
   */
  addRow(tableId, rowData) {
    const table = DOM.select(`#${tableId}`);
    if (table && table.dataTableInstance) {
      table.dataTableInstance.row.add(rowData).draw();
      return true;
    }
    return false;
  },

  /**
   * Remove row from table
   */
  removeRow(tableId, rowIndex) {
    const table = DOM.select(`#${tableId}`);
    if (table && table.dataTableInstance) {
      table.dataTableInstance.row(rowIndex).remove().draw();
      return true;
    }
    return false;
  },

  /**
   * Search table
   */
  searchTable(tableId, searchTerm) {
    const table = DOM.select(`#${tableId}`);
    if (table && table.dataTableInstance) {
      table.dataTableInstance.search(searchTerm).draw();
      return true;
    }
    return false;
  },

  /**
   * Export table data
   */
  exportTable(tableId, format = 'csv') {
    const table = DOM.select(`#${tableId}`);
    if (table && table.dataTableInstance) {
      const dataTable = table.dataTableInstance;

      switch (format.toLowerCase()) {
        case 'csv':
          dataTable.button('.buttons-csv').trigger();
          break;
        case 'excel':
          dataTable.button('.buttons-excel').trigger();
          break;
        case 'pdf':
          dataTable.button('.buttons-pdf').trigger();
          break;
        case 'print':
          dataTable.button('.buttons-print').trigger();
          break;
        default:
          console.warn(`⚠️ Unsupported export format: ${format}`);
          return false;
      }
      return true;
    }
    return false;
  },

  /**
   * Destroy all tables
   */
  destroyAllTables() {
    DOM.selectAll('.datatable, [data-table]').forEach(table => {
      if (table.dataTableInstance) {
        table.dataTableInstance.destroy();
        table.dataTableInstance = null;
      }
    });
    console.log('✅ All DataTables destroyed');
  },

  /**
   * Reinitialize table
   */
  reinitializeTable(tableId) {
    const table = DOM.select(`#${tableId}`);
    if (table) {
      if (table.dataTableInstance) {
        table.dataTableInstance.destroy();
      }

      const dataTable = new DataTable(table, getTableConfig(table));
      table.dataTableInstance = dataTable;

      console.log(`✅ Table reinitialized: ${tableId}`);
      return true;
    }
    return false;
  }
};

/**
 * Initialize Sample Data Tables for Demo
 */
export function initializeSampleTables() {
  // Sample data for demonstration
  const sampleData = [
    ['John Doe', 'Software Engineer', 'New York', '$85,000', '2023-01-15'],
    ['Jane Smith', 'Product Manager', 'San Francisco', '$120,000', '2022-08-20'],
    ['Mike Johnson', 'Designer', 'Los Angeles', '$75,000', '2023-03-10'],
    ['Sarah Wilson', 'Data Scientist', 'Chicago', '$95,000', '2022-12-05'],
    ['David Brown', 'DevOps Engineer', 'Seattle', '$110,000', '2023-02-28']
  ];

  // Create sample table if demo container exists
  const demoContainer = DOM.select('#demo-table-container');
  if (demoContainer) {
    const tableHTML = `
      <table id="demo-table" class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          ${sampleData
    .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
    .join('')}
        </tbody>
      </table>
    `;

    demoContainer.innerHTML = tableHTML;

    // Initialize the demo table
    const demoTable = new DataTable('#demo-table', {
      responsive: true,
      pageLength: 5,
      dom: 'Bfrtip',
      buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
    });

    console.log('✅ Demo table created and initialized');
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize modern DataTables (jQuery-free)
    initializeModernDataTables();

    // Initialize sample tables for demo
    initializeSampleTables();
  });
}

// Export utilities for external use
export { DOM };
