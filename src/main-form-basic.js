// jQuery-free main.js for form_advanced.html - modern alternatives

// Bootstrap 5 - No jQuery dependency needed
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Global styles (Bootstrap 5 + custom) - most important for layout
import './main.scss';

// Essential scripts for layout - modern versions
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// TempusDominus for date/time pickers
import { TempusDominus } from '@eonasdan/tempus-dominus';
window.TempusDominus = TempusDominus;

// TempusDominus CSS
import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';

// Toggle switches now use Bootstrap 5 native form-switch component

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
// Pickr uses UMD format - import as namespace and get the class
import * as PickrModule from '@simonwep/pickr';
const Pickr = PickrModule.default || PickrModule;
window.Pickr = Pickr;

// Pickr CSS - All themes
import '@simonwep/pickr/dist/themes/classic.min.css';
import '@simonwep/pickr/dist/themes/monolith.min.css';
import '@simonwep/pickr/dist/themes/nano.min.css';

// ECharts for circular gauge controls (jQuery Knob replacement)
import * as echarts from 'echarts';
window.echarts = echarts;

// Cropper.js v2 for image cropping (uses web components, no CSS needed)
import Cropper from 'cropperjs';
window.Cropper = Cropper;

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
        TempusDominus: typeof window.TempusDominus,
        Cropper: typeof window.Cropper,
        Pickr: typeof window.Pickr,
        Inputmask: typeof window.Inputmask,
        Bootstrap: typeof window.bootstrap,
        ECharts: typeof window.echarts
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
  // Cropper.js v2 initialization (web component API)
  // -----------------------------
  const sourceImg = document.getElementById('cropper-source');
  const cropperWrapper = document.getElementById('cropper-wrapper');
  if (sourceImg && cropperWrapper && window.Cropper) {
    // Hide the original image - Cropper v2 will create its own canvas
    sourceImg.style.display = 'none';

    // Cropper.js v2 uses a web component-based approach
    const cropperInstance = new window.Cropper(sourceImg, {
      container: cropperWrapper
    });
    window.cropper = cropperInstance;

    // Helper to update preview
    const previewEl = document.getElementById('cropper-preview');
    const updatePreview = async () => {
      if (!previewEl) return;
      try {
        const selection = cropperInstance.getCropperSelection();
        if (selection && !selection.hidden) {
          const canvas = await selection.$toCanvas();
          previewEl.innerHTML = '';
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          previewEl.appendChild(canvas);
        }
      } catch (e) {
        // Ignore preview errors
      }
    };

    // Rotate button
    const rotateBtn = document.getElementById('cropper-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        const image = cropperInstance.getCropperImage();
        if (image) {
          image.$rotate(90);
          setTimeout(updatePreview, 100);
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('cropper-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const image = cropperInstance.getCropperImage();
        const selection = cropperInstance.getCropperSelection();
        if (image) image.$resetTransform();
        if (selection) selection.$reset();
        setTimeout(updatePreview, 100);
      });
    }

    // Download button
    const downloadBtn = document.getElementById('cropper-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        const selection = cropperInstance.getCropperSelection();
        if (!selection) return;
        try {
          const canvas = await selection.$toCanvas();
          canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'cropped-image.jpg';
            link.click();
            URL.revokeObjectURL(url);
          }, 'image/jpeg', 0.95);
        } catch (e) {
          console.warn('Failed to download cropped image:', e);
        }
      });
    }

    // Listen for selection changes
    const canvas = cropperInstance.getCropperCanvas();
    if (canvas) {
      canvas.addEventListener('change', updatePreview);
    }

    // Initial preview after load
    setTimeout(updatePreview, 500);
  }
});
