// Minimal main.js for form_advanced.html

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
globalThis.jQuery = globalThis.$ = $;

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;
globalThis.Switchery = Switchery;

// TempusDominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
globalThis.TempusDominus = TempusDominus;

// Global styles (Bootstrap 5 + custom)
import './main.scss';

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Additional CSS for form components
import '@simonwep/pickr/dist/themes/classic.min.css';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import 'cropper/dist/cropper.min.css';

// Add the essential JavaScript functionality
try {
  // Import helpers and sidebar
  await import('./js/helpers/smartresize-modern.js');
  await import('./js/sidebar-modern.js');
  await import('./js/init-modern.js');
} catch (error) {
}

// Create a library availability checker for inline scripts
window.waitForLibraries = function (libraries, callback, timeout = 5000) {
  const startTime = Date.now();

  function check() {
    const allAvailable = libraries.every(lib => {
      return typeof window[lib] !== 'undefined' || typeof globalThis[lib] !== 'undefined';
    });

    if (allAvailable) {
      callback();
    } else if (Date.now() - startTime < timeout) {
      setTimeout(check, 50);
    } else {
        'Timeout waiting for libraries:',
        libraries.filter(
          lib => typeof window[lib] === 'undefined' && typeof globalThis[lib] === 'undefined'
        )
      );
      callback(); // Call anyway to prevent hanging
    }
  }

  check();
};

// Only add form-specific libraries after core is loaded
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Input Mask
    const { default: Inputmask } = await import('inputmask');
    window.Inputmask = Inputmask;
    globalThis.Inputmask = Inputmask;

    // Modern Color Picker
    const { default: Pickr } = await import('@simonwep/pickr');
    window.Pickr = Pickr;
    globalThis.Pickr = Pickr;

    // Ion Range Slider
    await import('ion-rangeslider');

    // jQuery Knob
    await import('jquery-knob');

    // Cropper.js
    await import('cropper');
  } catch (error) {
  }
});
