// Very basic main.js for form_advanced.html - just core functionality
console.log('🚀 Basic Form main.js starting...');

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
// Also ensure global access
globalThis.jQuery = globalThis.$ = $;
console.log('✅ jQuery loaded and globally accessible');

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
console.log('✅ Bootstrap loaded');

// Global styles (Bootstrap 5 + custom) - most important for layout
import './main.scss';
console.log('✅ Styles loaded');

// Essential scripts for layout
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';
console.log('✅ Core scripts loaded');

// TempusDominus for date/time pickers (synchronous import)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
console.log('✅ TempusDominus loaded');

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';
console.log('✅ TempusDominus CSS loaded');

// Switchery for iOS-style toggles (synchronous import)
import * as SwitcheryModule from 'switchery';
window.Switchery = SwitcheryModule.default || SwitcheryModule;
console.log('✅ Switchery loaded');

// Input Mask for input formatting (synchronous import)
import * as InputmaskModule from 'inputmask';
window.Inputmask = InputmaskModule.default || InputmaskModule;
console.log('✅ Inputmask loaded');

// Ion Range Slider (synchronous import)
import 'ion-rangeslider';
console.log('✅ Ion Range Slider loaded');

// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
console.log('✅ Ion Range Slider CSS loaded');

// Modern Color Picker (Pickr) (synchronous import)
import * as PickrModule from '@simonwep/pickr';
window.Pickr = PickrModule.default || PickrModule;
console.log('✅ Pickr color picker loaded');

// Pickr CSS - Multiple themes
import '@simonwep/pickr/dist/themes/classic.min.css';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import '@simonwep/pickr/dist/themes/nano.min.css';
console.log('✅ Pickr CSS loaded (Classic, Monolith, Nano themes)');

// jQuery Knob for circular inputs (synchronous import)
import 'jquery-knob';
console.log('✅ jQuery Knob loaded');

// Cropper.js for image cropping (synchronous import)
import * as CropperModule from 'cropper';
window.Cropper = CropperModule.default || CropperModule;
console.log('✅ Cropper.js loaded');

// Cropper CSS
import 'cropper/dist/cropper.min.css';
console.log('✅ Cropper CSS loaded');

console.log('✅ Enhanced form main.js fully loaded!');

// Debug: Check if all global variables are set
setTimeout(() => {
    console.log('🔍 Final check - Global variables status:');
    console.log('  window.Inputmask:', typeof window.Inputmask);
    console.log('  window.Pickr:', typeof window.Pickr);
    console.log('  window.Cropper:', typeof window.Cropper);
    console.log('  window.Switchery:', typeof window.Switchery);
    console.log('  window.TempusDominus:', typeof window.TempusDominus);
    console.log('  window.jQuery:', typeof window.jQuery);
    console.log('  $.fn.ionRangeSlider:', window.jQuery && window.jQuery.fn.ionRangeSlider ? 'available' : 'missing');
    console.log('  $.fn.knob:', window.jQuery && window.jQuery.fn.knob ? 'available' : 'missing');
}, 100); 