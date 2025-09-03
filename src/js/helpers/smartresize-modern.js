/**
 * Modern SmartResize - jQuery-free version
 * Debounced resize event handler for better performance
 */

// Debounce function to limit resize event frequency
function debounce(func, wait = 250, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) {
        func(...args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func(...args);
    }
  };
}

// Smart resize functionality
const smartResize = {
  handlers: new Set(),

  // Add a resize handler
  add(handler, wait = 250) {
    const debouncedHandler = debounce(handler, wait);
    this.handlers.add(debouncedHandler);
    window.addEventListener('resize', debouncedHandler);
    return debouncedHandler;
  },

  // Remove a resize handler
  remove(handler) {
    window.removeEventListener('resize', handler);
    this.handlers.delete(handler);
  },

  // Clear all handlers
  clear() {
    this.handlers.forEach(handler => {
      window.removeEventListener('resize', handler);
    });
    this.handlers.clear();
  }
};

// Extend Window prototype for jQuery-like API
if (!window.smartResize) {
  window.smartResize = smartResize;
}

// Also provide a simple function for direct use
window.addSmartResize = (handler, wait) => smartResize.add(handler, wait);
window.removeSmartResize = handler => smartResize.remove(handler);

console.log('✅ Modern smart resize initialized (jQuery-free)');

export default smartResize;
