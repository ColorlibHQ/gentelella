// Dashboard Module - Only loaded on dashboard pages
console.log('Loading dashboard module...');

// Dashboard-specific widgets
import '../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js';

// Map functionality for dashboard
import 'jqvmap';
import 'jqvmap/dist/maps/jquery.vmap.world.js';

// Dashboard notifications and widgets
// Note: Additional dashboard-specific libraries can be added here

export default {
  initialized: true
}; 