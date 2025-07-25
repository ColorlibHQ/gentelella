// jQuery Global Setup with Enhanced Browser Compatibility
import $ from 'jquery';

// Ensure jQuery is available globally with multiple assignment methods
if (typeof window !== 'undefined') {
  // Primary assignment
  window.jQuery = window.$ = $;

  // Additional assignment methods for stricter browsers
  globalThis.jQuery = globalThis.$ = $;

  // Force assignment to global scope (Safari compatibility)
  if (typeof global !== 'undefined') {
    global.jQuery = global.$ = $;
  }

  // Verify the assignment worked
  if (!window.jQuery || !window.$) {
    console.error('CRITICAL: jQuery global assignment failed!');
  }
}

export default $;
