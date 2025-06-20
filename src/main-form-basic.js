// Very basic main.js for form_advanced.html - just core functionality

// Import jQuery setup first
import $ from './jquery-setup.js';

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

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Switchery for iOS-style toggles (synchronous import)
import * as SwitcheryModule from 'switchery';

// Input Mask for input formatting (synchronous import)
import * as InputmaskModule from 'inputmask';

// Ion Range Slider (synchronous import)
import 'ion-rangeslider';

// Ion Range Slider CSS
import 'ion-rangeslider/css/ion.rangeSlider.min.css';

// Modern Color Picker (Pickr) (synchronous import)
import * as PickrModule from '@simonwep/pickr';

// Pickr CSS - Multiple themes
import '@simonwep/pickr/dist/themes/classic.min.css';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import '@simonwep/pickr/dist/themes/nano.min.css';

// jQuery Knob for circular inputs (synchronous import)
import 'jquery-knob';

// Cropper.js 2.0 for image cropping (using cropperjs package)
import * as CropperModule from 'cropperjs';

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
      callback(); // Call anyway to prevent hanging
    }
  }
  
  check();
};

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
  // Try to initialize directly
  if (typeof window.initializeFormComponents === 'function') {
    window.initializeFormComponents();
  }

  // -----------------------------
  // Cropper.js v2 demo
  // -----------------------------
  const sourceImg = document.getElementById('cropper-source');
  if (sourceImg && window.Cropper) {
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