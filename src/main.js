// Import jQuery setup first - this ensures global availability
import $ from './jquery-setup.js';

// Import jQuery UI core and widget factory first
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/progressbar.js';

// Import Chart.js and make it globally available
import Chart from 'chart.js/dist/Chart.bundle.js';
window.Chart = Chart;

// Import additional vendor libraries for dashboard widgets
import '../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js';
import '../vendors/jqvmap/dist/jquery.vmap.js';
import '../vendors/jqvmap/dist/maps/jquery.vmap.world.js';

// Global styles 
import './main.scss';

// Bootstrap (after jQuery is ready)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Legacy scripts that depend on global jQuery
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// Load gauge.js after everything else
setTimeout(() => {
  const script = document.createElement('script');
  script.src = '/vendors/gauge.js/dist/gauge.min.js';
  script.onload = () => {
    // Re-enable gauge functionality after library loads
    if (typeof Gauge !== 'undefined' && $('#chart_gauge_01').length) {
      var gauge = new Gauge(document.getElementById("chart_gauge_01")).setOptions({
        colorStart: '#55BF3B',
        colorStop: '#55BF3B',
        strokeColor: '#E0E0E0',
        generateGradient: true,
        percentColors: [[0.0, "#a9d70b"], [0.50, "#f9c802"], [1.0, "#ff0000"]]
      });
      gauge.maxValue = 100;
      gauge.animationSpeed = 32;
      gauge.set(75);
      document.getElementById("gauge-text").innerHTML = "75";
    }
  };
  document.head.appendChild(script);
}, 1000); 