// Import jQuery setup first - this ensures global availability
import $ from './jquery-setup.js';

// Import jQuery UI core and widget factory first
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/progressbar.js';

// Import Chart.js and make it globally available
import Chart from 'chart.js/dist/Chart.bundle.js';
window.Chart = Chart;

console.log('✓ Chart.js loaded:', !!window.Chart);
console.log('✓ jQuery UI progressbar available:', !!$.fn.progressbar);

// Global styles 
import './main.scss';

// Bootstrap (after jQuery is ready)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Legacy scripts that depend on global jQuery
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js'; 