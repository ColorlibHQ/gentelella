// Import jQuery setup first - still needed for some widgets
import $ from './jquery-setup.js';

// Ensure jQuery is available globally IMMEDIATELY
window.jQuery = window.$ = $;

// Debug log to confirm script is loading
console.log('🚀 Gentelella main.js loading...');

// Import jQuery-dependent vendor libraries AFTER jQuery is global
import '../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js';

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;

// Initialize Bootstrap tooltips
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize all popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
});

// NProgress (Loading bar)
import NProgress from 'nprogress';
window.NProgress = NProgress;

// Chart.js v4 - No jQuery dependency 
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

// Leaflet (for maps)
import * as L from 'leaflet';
window.L = L;

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Leaflet CSS
import 'leaflet/dist/leaflet.css';

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Pickr CSS
import '@simonwep/pickr/dist/themes/classic.min.css';



// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

// Cropper CSS
import 'cropper/dist/cropper.min.css';

// Legacy scripts that depend on global jQuery - LOAD IN CORRECT ORDER
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// Confirm all components loaded
console.log('✅ Gentelella main.js fully loaded!');

// Day.js for date manipulation (modern replacement for moment.js)
import dayjs from 'dayjs';
window.dayjs = dayjs;

// Tempus Dominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus, DateTime } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
window.DateTime = DateTime;

// jQuery Sparkline (Small charts)
import 'jquery-sparkline';

// Select2 (Enhanced select boxes)
import 'select2';

// Ion Range Slider
import 'ion-rangeslider';

// Skycons (Animated weather icons)
import SkyconsFactory from 'skycons';
const Skycons = SkyconsFactory(window);
window.Skycons = Skycons;

// Autosize (Auto-resizing textareas)
import autosize from 'autosize';
window.autosize = autosize;

// Flot charts
import 'flot/dist/es5/jquery.flot.js';
import 'flot/source/jquery.flot.pie.js';
import 'flot/source/jquery.flot.time.js';
import 'flot/source/jquery.flot.stack.js';
import 'flot/source/jquery.flot.resize.js';

// ECharts
import * as echarts from 'echarts';
window.echarts = echarts;

// Input Mask
import Inputmask from 'inputmask';
window.Inputmask = Inputmask;

// Modern Color Picker
import Pickr from '@simonwep/pickr';
window.Pickr = Pickr;

// jQuery Knob
import 'jquery-knob';

// Cropper.js for image cropping
import 'cropper';



