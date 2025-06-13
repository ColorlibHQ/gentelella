// Minimal test - adding back essential functionality step by step

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
globalThis.jQuery = globalThis.$ = $;

// Import jQuery-dependent vendor libraries AFTER jQuery is global

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;
globalThis.Switchery = Switchery;

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// TempusDominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
globalThis.TempusDominus = TempusDominus;

// Chart.js v4 - No jQuery dependency 
import { Chart, registerables } from 'chart.js';
try {
  Chart.register(...registerables);
  window.Chart = Chart;
  globalThis.Chart = Chart;
  console.log('✅ Chart.js loaded successfully');
} catch (error) {
  console.error('❌ Chart.js registration error:', error);
  window.Chart = Chart; // Still assign even if registration fails
  globalThis.Chart = Chart;
}

// ECharts - Apache ECharts library
import * as echarts from 'echarts';
window.echarts = echarts;
globalThis.echarts = echarts;
console.log('✅ ECharts loaded successfully');

// Skycons (Animated weather icons)
import SkyconsFactory from 'skycons';
try {
  const Skycons = SkyconsFactory(typeof window !== 'undefined' ? window : globalThis);
  window.Skycons = Skycons;
  globalThis.Skycons = Skycons;
  console.log('✅ Skycons loaded successfully');
} catch (error) {
  console.error('❌ Skycons loading error:', error);
}

// Leaflet (for maps)
import * as L from 'leaflet';
window.L = L;
globalThis.L = L;
console.log('✅ Leaflet loaded successfully');

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Leaflet CSS
import 'leaflet/dist/leaflet.css';

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Ion Range Slider
import 'ion-rangeslider';
window.ionRangeSlider = true;

// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

// Input Mask
import Inputmask from 'inputmask';
window.Inputmask = Inputmask;
globalThis.Inputmask = Inputmask;

// Modern Color Picker
import Pickr from '@simonwep/pickr';
window.Pickr = Pickr;
globalThis.Pickr = Pickr;

// Pickr CSS
import '@simonwep/pickr/dist/themes/classic.min.css';

// jQuery Knob (needs jQuery to be global first)
import 'jquery-knob';

// Cropper.js for image cropping
import 'cropper';

// Cropper CSS
import 'cropper/dist/cropper.min.css';

// Create a library availability checker for inline scripts BEFORE importing init.js
window.waitForLibraries = function(libraries, callback, timeout = 5000) {
  const startTime = Date.now();
  
  function check() {
    const allAvailable = libraries.every(lib => {
      return (typeof window[lib] !== 'undefined') || (typeof globalThis[lib] !== 'undefined');
    });
    
    if (allAvailable) {
      callback();
    } else if (Date.now() - startTime < timeout) {
      setTimeout(check, 50);
    } else {
      console.warn('Timeout waiting for libraries:', libraries.filter(lib => 
        typeof window[lib] === 'undefined' && typeof globalThis[lib] === 'undefined'
      ));
      callback(); // Call anyway to prevent hanging
    }
  }
  
  check();
};

// Add the essential JavaScript functionality - SYNCHRONOUS imports to ensure proper order
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// Final verification
console.log('✅ Main minimal initialization complete');
console.log('Available libraries:', {
  jQuery: !!(window.jQuery || globalThis.jQuery),
  Chart: !!(window.Chart || globalThis.Chart),
  echarts: !!(window.echarts || globalThis.echarts),
  Skycons: !!(window.Skycons || globalThis.Skycons),
  L: !!(window.L || globalThis.L),
  TempusDominus: !!(window.TempusDominus || globalThis.TempusDominus)
}); 