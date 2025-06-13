// Very basic main.js for form_advanced.html - just core functionality

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
// Also ensure global access
globalThis.jQuery = globalThis.$ = $;

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Global styles (Bootstrap 5 + custom) - most important for layout
import './main.scss';

// Essential scripts for layout
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// TempusDominus for date/time pickers (synchronous import)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
globalThis.TempusDominus = TempusDominus;

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Switchery for iOS-style toggles (synchronous import)
import * as SwitcheryModule from 'switchery';
window.Switchery = SwitcheryModule.default || SwitcheryModule;
globalThis.Switchery = SwitcheryModule.default || SwitcheryModule;

// Input Mask for input formatting (synchronous import)
import * as InputmaskModule from 'inputmask';
window.Inputmask = InputmaskModule.default || InputmaskModule;
globalThis.Inputmask = InputmaskModule.default || InputmaskModule;

// Ion Range Slider (synchronous import)
import 'ion-rangeslider';

// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

// Modern Color Picker (Pickr) (synchronous import)
import * as PickrModule from '@simonwep/pickr';
window.Pickr = PickrModule.default || PickrModule;
globalThis.Pickr = PickrModule.default || PickrModule;

// Pickr CSS - Multiple themes
import '@simonwep/pickr/dist/themes/classic.min.css';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import '@simonwep/pickr/dist/themes/nano.min.css';

// jQuery Knob for circular inputs (synchronous import)
import 'jquery-knob';

// Cropper.js for image cropping (synchronous import)
import * as CropperModule from 'cropper';
window.Cropper = CropperModule.default || CropperModule;
globalThis.Cropper = CropperModule.default || CropperModule;

// Cropper CSS
import 'cropper/dist/cropper.min.css';

// Create a library availability checker for inline scripts
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