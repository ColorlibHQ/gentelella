// Charts Module - Only loaded when needed


// Chart.js v4 - Modern charting library
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

// JQVMap for geographical charts
import 'jqvmap';
import 'jqvmap/dist/maps/jquery.vmap.world.js';

// Skycons for animated weather icons (used in some charts)
import SkyconsFactory from 'skycons';
const Skycons = SkyconsFactory(window);
window.Skycons = Skycons;

// jQuery Sparkline for mini charts
import 'jquery-sparkline';

// Morris.js removed - using Chart.js instead

export default {
  Chart,
  Skycons,
  initialized: true
}; 