// Import jQuery setup first - still needed for some widgets
import $ from './jquery-setup.js';

// Import jQuery UI core and widget factory for specific widgets
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/progressbar.js';

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

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

// Day.js for date manipulation (modern replacement for moment.js)
import dayjs from 'dayjs';
window.dayjs = dayjs;

// Chart.js v4 - No jQuery dependency 
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

// Tempus Dominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus, DateTime } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
window.DateTime = DateTime;



// GaugeJS - Modern gauge library (Bootstrap 5 compatible)
import { Gauge } from 'gaugejs';
window.Gauge = Gauge;

// NProgress (Loading bar)
import NProgress from 'nprogress';
window.NProgress = NProgress;

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

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;

// Remaining vendor libraries for dashboard widgets (not available on npm)
import '../vendors/bootstrap-progressbar/bootstrap-progressbar.min.js';
import 'jqvmap';
import 'jqvmap/dist/maps/jquery.vmap.world.js';

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// Legacy scripts that depend on global jQuery
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js'; 