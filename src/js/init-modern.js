/**
 * Modern Init.js - jQuery Eliminated
 * This is the new, modernized version of init.js with all jQuery dependencies removed
 * Only contains functionality that hasn't been moved to separate modules
 */

// Modern DOM utilities (no jQuery dependency)
const DOM = {
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => [...document.querySelectorAll(selector)],
  exists: (selector) => document.querySelector(selector) !== null,
  on: (element, event, handler) => element.addEventListener(event, handler),
  find: (element, selector) => element.querySelector(selector),
  closest: (element, selector) => element.closest(selector),
  addClass: (element, className) => element.classList.add(className),
  removeClass: (element, className) => element.classList.remove(className),
  toggle: (element, className) => element.classList.toggle(className)
};

/**
 * NOTE: DataTables initialization moved to modern tables module
 * No longer uses jQuery - uses DataTables 2.x native JavaScript API
 * See: /modules/tables-modern.js
 */

/**
 * Date Picker Initialization - MODERNIZED
 * Uses modern date picker libraries instead of jQuery UI
 */
function initializeDatePickers() {
  // Modern date picker using Tempus Dominus (already available)
  if (typeof TempusDominus !== 'undefined') {
    DOM.selectAll('.datepicker, [data-datepicker]').forEach(element => {
      try {
        new TempusDominus(element, {
          display: {
            components: {
              clock: false,
              seconds: false
            }
          },
          localization: {
            format: 'MM/dd/yyyy'
          }
        });

        console.log(`✅ Date picker initialized: ${element.id || 'unnamed'}`);

      } catch (error) {
        console.error('❌ Failed to initialize date picker:', error);
      }
    });
  }

  // Date range pickers - already handled by TempusDominus in main.js
  console.log('✅ Date pickers initialization complete');
}

/**
 * Form Validation - MODERNIZED FROM JQUERY
 * Uses HTML5 validation APIs instead of jQuery validation plugin
 */
function initializeFormValidation() {
  DOM.selectAll('form[data-validate], .needs-validation').forEach(form => {
    DOM.on(form, 'submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        
        // Add visual feedback for invalid fields
        DOM.selectAll(':invalid', form).forEach(field => {
          DOM.addClass(field, 'is-invalid');
          
          // Show custom error message if provided
          const errorMsg = field.getAttribute('data-error-message');
          if (errorMsg) {
            let errorDiv = DOM.find(field.parentNode, '.invalid-feedback');
            if (!errorDiv) {
              errorDiv = document.createElement('div');
              errorDiv.className = 'invalid-feedback';
              field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = errorMsg;
          }
        });
      }
      
      DOM.addClass(form, 'was-validated');
    });

    // Remove error styling when field becomes valid
    DOM.selectAll('input, select, textarea', form).forEach(field => {
      DOM.on(field, 'input', function() {
        if (field.checkValidity()) {
          DOM.removeClass(field, 'is-invalid');
          DOM.addClass(field, 'is-valid');
        }
      });
    });
  });

  console.log('✅ Modern form validation initialized');
}

/**
 * Tabs and Accordion - MODERNIZED FROM JQUERY
 * Uses Bootstrap 5 native JavaScript API
 */
function initializeTabsAndAccordions() {
  // Bootstrap 5 tabs - no additional initialization needed
  // They work automatically with data attributes

  // Custom tab functionality for non-Bootstrap tabs
  DOM.selectAll('.custom-tabs').forEach(tabContainer => {
    const tabButtons = DOM.selectAll('.tab-button', tabContainer);
    const tabPanes = DOM.selectAll('.tab-pane', tabContainer);

    tabButtons.forEach(button => {
      DOM.on(button, 'click', function() {
        const targetId = this.getAttribute('data-target');
        const targetPane = DOM.select(targetId);

        if (targetPane) {
          // Hide all panes
          tabPanes.forEach(pane => {
            DOM.removeClass(pane, 'active');
            pane.style.display = 'none';
          });

          // Remove active class from all buttons
          tabButtons.forEach(btn => DOM.removeClass(btn, 'active'));

          // Show target pane and activate button
          DOM.addClass(targetPane, 'active');
          targetPane.style.display = 'block';
          DOM.addClass(this, 'active');
        }
      });
    });
  });

  console.log('✅ Tabs and accordions initialized');
}

/**
 * Modals - MODERNIZED FROM JQUERY
 * Uses Bootstrap 5 native Modal API
 */
function initializeModals() {
  // Bootstrap 5 modals work automatically, but we can add custom functionality
  DOM.selectAll('.modal').forEach(modalElement => {
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modal = new bootstrap.Modal(modalElement);
      
      // Store modal instance for external access
      modalElement.modalInstance = modal;

      // Custom event handlers
      modalElement.addEventListener('shown.bs.modal', function() {
        // Auto-focus first input in modal
        const firstInput = DOM.select('input, textarea, select', this);
        if (firstInput) firstInput.focus();
      });
    }
  });

  console.log('✅ Modals initialized');
}

/**
 * Drag and Drop - MODERN HTML5 IMPLEMENTATION
 * Replaces jQuery UI sortable with native HTML5 drag and drop
 */
function initializeDragAndDrop() {
  DOM.selectAll('.sortable, [data-sortable]').forEach(container => {
    const items = DOM.selectAll('.sortable-item, [data-sortable-item]', container);

    items.forEach(item => {
      item.draggable = true;

      DOM.on(item, 'dragstart', function(e) {
        e.dataTransfer.setData('text/plain', '');
        DOM.addClass(this, 'dragging');
      });

      DOM.on(item, 'dragend', function() {
        DOM.removeClass(this, 'dragging');
      });
    });

    DOM.on(container, 'dragover', function(e) {
      e.preventDefault();
      const dragging = DOM.select('.dragging', this);
      const siblings = [...DOM.selectAll('.sortable-item:not(.dragging)', this)];
      
      const nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.getBoundingClientRect().top + sibling.offsetHeight / 2;
      });

      this.insertBefore(dragging, nextSibling);
    });
  });

  console.log('✅ Drag and drop initialized');
}

/**
 * Search and Filter - MODERNIZED FROM JQUERY
 * Native JavaScript search functionality
 */
function initializeSearchAndFilter() {
  DOM.selectAll('.search-input, [data-search]').forEach(searchInput => {
    const targetSelector = searchInput.getAttribute('data-target') || '.searchable-item';
    const targetElements = DOM.selectAll(targetSelector);

    DOM.on(searchInput, 'input', function() {
      const query = this.value.toLowerCase().trim();

      targetElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const matches = text.includes(query);
        
        element.style.display = matches ? '' : 'none';
        
        // Add/remove highlight class
        if (matches && query) {
          DOM.addClass(element, 'search-match');
        } else {
          DOM.removeClass(element, 'search-match');
        }
      });

      // Show count of visible items
      const visibleCount = targetElements.filter(el => el.style.display !== 'none').length;
      const countElement = DOM.select('.search-count');
      if (countElement) {
        countElement.textContent = `${visibleCount} items found`;
      }
    });
  });

  console.log('✅ Search and filter initialized');
}

/**
 * Keyboard Shortcuts - MODERN IMPLEMENTATION
 * Replaces jQuery hotkeys with native keyboard event handling
 */
function initializeKeyboardShortcuts() {
  const shortcuts = {
    'Ctrl+/': () => DOM.select('.search-input')?.focus(),
    'Escape': () => {
      // Close modals
      DOM.selectAll('.modal.show').forEach(modal => {
        if (modal.modalInstance) {
          modal.modalInstance.hide();
        }
      });
      
      // Clear search
      DOM.selectAll('.search-input').forEach(input => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      });
    }
  };

  document.addEventListener('keydown', function(e) {
    const key = (e.ctrlKey ? 'Ctrl+' : '') + 
                (e.altKey ? 'Alt+' : '') + 
                (e.shiftKey ? 'Shift+' : '') + 
                (e.key === ' ' ? 'Space' : e.key);

    if (shortcuts[key]) {
      e.preventDefault();
      shortcuts[key]();
    }
  });

  console.log('✅ Keyboard shortcuts initialized');
}

/**
 * Main Initialization - MODERNIZED FROM JQUERY
 * Coordinates all modern initialization functions
 */
function initializeModernComponents() {
  console.log('🚀 Initializing modern components...');

  try {
    // Initialize components that still need initialization
    initializeDatePickers();
    initializeFormValidation();
    initializeTabsAndAccordions();
    initializeModals();
    initializeDragAndDrop();
    initializeSearchAndFilter();
    initializeKeyboardShortcuts();

    // DataTables now handled by modern tables module (jQuery-free)

    console.log('✅ All modern components initialized successfully');

  } catch (error) {
    console.error('❌ Failed to initialize modern components:', error);
  }
}

/**
 * Module Loading Status Indicator
 */
function showLoadingStatus() {
  const statusElement = document.createElement('div');
  statusElement.id = 'module-loading-status';
  statusElement.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #26B99A;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 9999;
    transition: opacity 0.3s;
  `;
  statusElement.textContent = '✅ Modern components loaded';
  document.body.appendChild(statusElement);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    statusElement.style.opacity = '0';
    setTimeout(() => statusElement.remove(), 300);
  }, 3000);
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeModernComponents();
    
    // Show loading status in development
    if (process.env.NODE_ENV !== 'production') {
      showLoadingStatus();
    }
  });
}

// Export for external use
export {
  initializeModernComponents,
  initializeDatePickers,
  initializeFormValidation,
  DOM
};