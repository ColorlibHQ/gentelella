// Charts Module - Only loaded when needed

// Chart.js v4 - Modern charting library
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

// Leaflet for maps
import 'leaflet';
import 'leaflet/dist/leaflet.css';

// Skycons for animated weather icons (used in some charts)
import SkyconsFactory from 'skycons';
const Skycons = SkyconsFactory(window);
window.Skycons = Skycons;

// Mini charts now handled by Chart.js instead of jQuery Sparkline


export default {
  Chart,
  Skycons,
  L: window.L,
  initialized: true
};
