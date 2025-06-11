// jQuery Global Setup
import $ from 'jquery';

// Ensure jQuery is available globally before anything else
if (typeof window !== 'undefined') {
  window.jQuery = window.$ = $;
  
  // Verify the assignment worked
  if (!window.jQuery || !window.$) {
    console.error('CRITICAL: jQuery global assignment failed!');
  }
}

export default $; 