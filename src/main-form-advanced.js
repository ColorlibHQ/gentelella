// Minimal main.js for form_advanced.html
console.log('🚀 Form Advanced main.js starting...');

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
console.log('✅ jQuery loaded');

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
console.log('✅ Bootstrap loaded');

// Switchery (iOS-style toggle switches)
import Switchery from 'switchery';
window.Switchery = Switchery;
console.log('✅ Switchery loaded');

// TempusDominus DateTimePicker (Bootstrap 5 compatible)
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;
console.log('✅ TempusDominus loaded');

// Global styles (Bootstrap 5 + custom)
import './main.scss';
console.log('✅ Styles loaded');

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';
console.log('✅ TempusDominus CSS loaded');

// Additional CSS for form components
import '@simonwep/pickr/dist/themes/classic.min.css';
import 'ion-rangeslider/css/ion.rangeSlider.min.css';
import 'cropper/dist/cropper.min.css';
console.log('✅ Form component CSS loaded');

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

// Only add form-specific libraries after core is loaded
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Input Mask
    const { default: Inputmask } = await import('inputmask');
    window.Inputmask = Inputmask;
    console.log('✅ Inputmask loaded');

    // Modern Color Picker 
    const { default: Pickr } = await import('@simonwep/pickr');
    window.Pickr = Pickr;
    console.log('✅ Pickr loaded');

    // Ion Range Slider
    await import('ion-rangeslider');
    console.log('✅ Ion Range Slider loaded');

    // jQuery Knob
    await import('jquery-knob');
    console.log('✅ jQuery Knob loaded');

    // Cropper.js
    await import('cropper');
    console.log('✅ Cropper loaded');

    console.log('✅ All form advanced components loaded successfully!');
  } catch (error) {
    console.error('❌ Error loading form components:', error);
  }
});

console.log('✅ Form Advanced main.js fully loaded!'); 