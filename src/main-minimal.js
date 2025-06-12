// Minimal test - adding back essential functionality step by step
console.log('🚀 Minimal main.js starting...');

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
console.log('✅ jQuery loaded');

// Import jQuery-dependent vendor libraries AFTER jQuery is global
import '../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js';
console.log('✅ Bootstrap-progressbar loaded');

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;
console.log('✅ Switchery loaded');

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
console.log('✅ Bootstrap loaded');

// TempusDominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
console.log('✅ TempusDominus loaded');

// GaugeJS - Modern gauge library (Bootstrap 5 compatible)
import Gauge from 'gauge.js';
window.Gauge = Gauge;
console.log('✅ GaugeJS loaded');

// Chart.js v4 - No jQuery dependency 
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;
console.log('✅ Chart.js loaded');

// ECharts - Apache ECharts library
import * as echarts from 'echarts';
window.echarts = echarts;
console.log('✅ ECharts loaded');

// Skycons (Animated weather icons)
import skycons from 'skycons';
const Skycons = skycons(typeof window !== 'undefined' ? window : global);
window.Skycons = Skycons;
console.log('✅ Skycons loaded');

// Leaflet (for maps)
import * as L from 'leaflet';
window.L = L;
console.log('✅ Leaflet loaded');

// Global styles (Bootstrap 5 + custom)
import './main.scss';
console.log('✅ Styles loaded');

// Leaflet CSS
import 'leaflet/dist/leaflet.css';
console.log('✅ Leaflet CSS loaded');

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';
console.log('✅ TempusDominus CSS loaded');

// Add the essential JavaScript functionality
try {
  // Import helpers and sidebar
  await import('./js/helpers/smartresize.js');
  console.log('✅ Smartresize helper loaded');
  
  await import('./js/sidebar.js');
  console.log('✅ Sidebar functionality loaded');
  
  await import('./js/init.js');
  console.log('✅ Initialization scripts loaded');
  
} catch (error) {
  console.error('❌ Error loading JavaScript modules:', error);
}

console.log('✅ All core components loaded successfully!'); 