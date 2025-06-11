// Import jQuery setup first - still needed for some widgets
import $ from './jquery-setup.js';

// Import jQuery UI core and widget factory for specific widgets
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/progressbar.js';

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Chart.js v4 - No jQuery dependency 
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

// Additional vendor libraries for dashboard widgets
import '../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js';
import '../vendors/jqvmap/dist/jquery.vmap.js';
import '../vendors/jqvmap/dist/maps/jquery.vmap.world.js';

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Legacy scripts that depend on global jQuery
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// Load gauge.js with proper timing
document.addEventListener('DOMContentLoaded', function() {
    // Load gauge.js after DOM is ready
    setTimeout(() => {
        import('../vendors/gauge.js/dist/gauge.min.js').then(() => {
            console.log('✅ Gauge.js loaded successfully');
            // Trigger custom event for gauge initialization
            document.dispatchEvent(new Event('gaugeLoaded'));
        }).catch(err => {
            console.warn('⚠️ Gauge.js failed to load:', err);
        });
    }, 1000);
}); 