// Very basic main.js for form_advanced.html - just core functionality
console.log('🚀 Starting main-form-basic.js...');

// Import jQuery setup first
import $ from './jquery-setup.js';
console.log('✅ jQuery imported:', typeof $);
window.jQuery = window.$ = $;
// Also ensure global access
globalThis.jQuery = globalThis.$ = $;
console.log('✅ jQuery available globally:', typeof window.$, typeof window.jQuery);

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
console.log('✅ TempusDominus imported:', typeof TempusDominus);
window.TempusDominus = TempusDominus;
globalThis.TempusDominus = TempusDominus;

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Switchery for iOS-style toggles (synchronous import)
import * as SwitcheryModule from 'switchery';
console.log('✅ Switchery imported:', typeof SwitcheryModule);
window.Switchery = SwitcheryModule.default || SwitcheryModule;
globalThis.Switchery = SwitcheryModule.default || SwitcheryModule;

// Input Mask for input formatting (synchronous import)
import * as InputmaskModule from 'inputmask';
console.log('✅ Inputmask imported:', typeof InputmaskModule);
window.Inputmask = InputmaskModule.default || InputmaskModule;
globalThis.Inputmask = InputmaskModule.default || InputmaskModule;

// Ion Range Slider (synchronous import)
import 'ion-rangeslider';
console.log('✅ Ion Range Slider imported');

// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

// Modern Color Picker (Pickr) (synchronous import)
import * as PickrModule from '@simonwep/pickr';
console.log('✅ Pickr imported:', typeof PickrModule);
window.Pickr = PickrModule.default || PickrModule;
globalThis.Pickr = PickrModule.default || PickrModule;

// Pickr CSS - Multiple themes
import '@simonwep/pickr/dist/themes/classic.min.css';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import '@simonwep/pickr/dist/themes/nano.min.css';

// jQuery Knob for circular inputs (synchronous import)
import 'jquery-knob';
console.log('✅ jQuery Knob imported');

// Cropper.js 2.0 for image cropping (using cropperjs package)
import * as CropperModule from 'cropperjs';
console.log('✅ Cropper imported:', typeof CropperModule);
window.Cropper = CropperModule.default || CropperModule;
globalThis.Cropper = CropperModule.default || CropperModule;

// Note: cropperjs v2.0+ doesn't include CSS, using inline styles

// Create a library availability checker for inline scripts
window.waitForLibraries = function(libraries, callback, timeout = 5000) {
  const startTime = Date.now();
  
  function check() {
    const allAvailable = libraries.every(lib => {
      return (typeof window[lib] !== 'undefined') || (typeof globalThis[lib] !== 'undefined');
    });
    
    if (allAvailable) {
      console.log('✅ All libraries available, calling callback');
      callback();
    } else if (Date.now() - startTime < timeout) {
      console.log('⏳ Waiting for libraries...', libraries.filter(lib => 
        typeof window[lib] === 'undefined' && typeof globalThis[lib] === 'undefined'
      ));
      setTimeout(check, 50);
    } else {
      console.warn('⚠️ Timeout waiting for libraries:', libraries.filter(lib => 
        typeof window[lib] === 'undefined' && typeof globalThis[lib] === 'undefined'
      ));
      callback(); // Call anyway to prevent hanging
    }
  }
  
  check();
};

console.log('✅ main-form-basic.js loaded completely');

// Dispatch a custom event when all modules are loaded
window.dispatchEvent(new CustomEvent('form-libraries-loaded', { 
  detail: { 
    timestamp: Date.now(),
    libraries: {
      jQuery: typeof window.$,
      TempusDominus: typeof window.TempusDominus,
      Cropper: typeof window.Cropper,
      Pickr: typeof window.Pickr,
      Inputmask: typeof window.Inputmask,
      Switchery: typeof window.Switchery
    }
  } 
}));

// Also immediately trigger initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOMContentLoaded fired, libraries status:');
  console.log('jQuery:', typeof window.$);
  console.log('TempusDominus:', typeof window.TempusDominus);
  console.log('Cropper:', typeof window.Cropper);
  console.log('Pickr:', typeof window.Pickr);
  console.log('Inputmask:', typeof window.Inputmask);
  console.log('Switchery:', typeof window.Switchery);
  
  // Try to initialize directly
  if (typeof window.initializeFormComponents === 'function') {
    console.log('🚀 Calling initializeFormComponents directly...');
    window.initializeFormComponents();
  }

  // -----------------------------
  // Cropper.js v2 demo
  // -----------------------------
  const sourceImg = document.getElementById('cropper-source');
  if (sourceImg && window.Cropper) {
    console.log('🖼️ Initializing Cropper.js v2 instance');
    const cropperInstance = new window.Cropper(sourceImg, {
      container: sourceImg.parentElement
    });
    window.cropper = cropperInstance; // expose globally for debugging

    // Helper to refresh preview canvas
    const previewEl = document.getElementById('cropper-preview');
    const refreshPreview = () => {
      if (!previewEl) return;
      const currentSel = cropperInstance.getCropperSelection();
      if (!currentSel || currentSel.hidden) {
        previewEl.innerHTML = '<span class="text-muted small">No selection</span>';
        return;
      }
      currentSel.$toCanvas().then(canvas => {
        previewEl.innerHTML = '';
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        previewEl.appendChild(canvas);
      }).catch(err => console.error('Preview render error:', err));
    };

    // Rotate button
    const rotateBtn = document.getElementById('cropper-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        try {
          const imgElement = cropperInstance.getCropperImage();
          imgElement && imgElement.$rotate(90);
          refreshPreview();
        } catch (err) {
          console.error('Rotate failed:', err);
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('cropper-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        try {
          cropperInstance.getCropperImage()?.$resetTransform();
          cropperInstance.getCropperSelection()?.$reset();
          refreshPreview();
        } catch (err) {
          console.error('Reset failed:', err);
        }
      });
    }

    // Download button
    const downloadBtn = document.getElementById('cropper-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const selection = cropperInstance.getCropperSelection();
        if (!selection) return;
        selection.$toCanvas().then(canvas => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/jpeg');
          link.download = 'cropped-image.jpg';
          link.click();
        }).catch(err => console.error('Download failed:', err));
      });
    }

    // Listen for any selection change events on the canvas
    cropperInstance.getCropperCanvas()?.addEventListener('change', refreshPreview);

    // Initial preview render after load
    setTimeout(refreshPreview, 600);
  } else {
    console.warn('⚠️ Cropper source image or library not found. Skipping Cropper.js v2 initialization');
  }
}); 