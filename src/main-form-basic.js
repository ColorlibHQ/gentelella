// jQuery-free main.js for form_advanced.html - modern alternatives

// Import security utilities
import { sanitizeHtml } from './utils/security.js';

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Global styles (Bootstrap 5 + custom) - most important for layout
import './main.scss';

// Essential scripts for layout - modern versions
import './js/helpers/smartresize-modern.js';
import './js/sidebar-modern.js';
import './js/init-modern.js';

// TempusDominus for date/time pickers
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Switchery for iOS-style toggles
import Switchery from 'switchery';
window.Switchery = Switchery;

// Input Mask for input formatting
import Inputmask from 'inputmask';
window.Inputmask = Inputmask;

// NoUiSlider (Ion Range Slider replacement)
import noUiSlider from 'nouislider';
window.noUiSlider = noUiSlider;

// NoUiSlider CSS
import 'nouislider/dist/nouislider.css';

// Choices.js (Select2 replacement)
import Choices from 'choices.js';
window.Choices = Choices;

// Choices.js CSS
import 'choices.js/public/assets/styles/choices.min.css';

// Modern Color Picker (Pickr)
import * as PickrModule from '@simonwep/pickr';
const Pickr = PickrModule.default || PickrModule.Pickr || PickrModule;
window.Pickr = Pickr;

// Pickr CSS - Classic theme
import '@simonwep/pickr/dist/themes/classic.min.css';

// Chart.js for circular progress (jQuery Knob replacement)
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
window.Chart = Chart;

// Cropper.js 2.0 for image cropping (using cropperjs package)
import * as CropperModule from 'cropperjs';

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
      callback(); // Call anyway to prevent hanging
    }
  }

  check();
};

// Dispatch a custom event when all modules are loaded
window.dispatchEvent(
  new CustomEvent('form-libraries-loaded', {
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
  })
);

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
      if (!previewEl) {
        return;
      }
      const currentSel = cropperInstance.getCropperSelection();
      if (!currentSel || currentSel.hidden) {
        previewEl.innerHTML = sanitizeHtml('<span class="text-muted small">No selection</span>');
        return;
      }
      currentSel
        .$toCanvas()
        .then(canvas => {
          previewEl.innerHTML = sanitizeHtml('');
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          previewEl.appendChild(canvas);
        });
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
        }
      });
    }

    // Download button
    const downloadBtn = document.getElementById('cropper-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const selection = cropperInstance.getCropperSelection();
        if (!selection) {
          return;
        }
        selection
          .$toCanvas()
          .then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'cropped-image.jpg';
            link.click();
          });
      });
    }

    // Listen for any selection change events on the canvas
    cropperInstance.getCropperCanvas()?.addEventListener('change', refreshPreview);

    // Initial preview render after load
    setTimeout(refreshPreview, 600);
  }
});
