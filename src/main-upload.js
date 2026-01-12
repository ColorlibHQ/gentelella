// Form Upload.html specific JavaScript with Uppy integration (jQuery-free)

// Bootstrap 5
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Global styles
import './main.scss';

// Essential scripts for layout
import './js/helpers/smartresize.js';
import './js/sidebar.js';
import './js/init.js';

// Uppy for file uploads (modern replacement for Dropzone)
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';

// Import Uppy CSS
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

// Make Uppy available globally
window.Uppy = Uppy;
globalThis.Uppy = Uppy;

// Initialize Uppy when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const uploadContainer = document.querySelector('.uppy-upload');

  if (uploadContainer) {
    try {
      const uppy = new Uppy({
        debug: process.env.NODE_ENV === 'development',
        autoProceed: false,
        restrictions: {
          maxFileSize: 20 * 1024 * 1024, // 20MB
          allowedFileTypes: [
            'image/*',
            'application/pdf',
            '.psd',
            '.doc',
            '.docx',
            '.xls',
            '.xlsx',
            '.ppt',
            '.pptx'
          ]
        }
      });

      uppy.use(Dashboard, {
        inline: true,
        target: '.uppy-upload',
        width: '100%',
        height: 400,
        showProgressDetails: true,
        proudlyDisplayPoweredByUppy: false,
        theme: 'light',
        note: 'Images, PDFs, and Office documents up to 20 MB'
      });

      // For demo purposes - use XHRUpload with a dummy endpoint
      // In production, replace with your actual upload endpoint
      uppy.use(XHRUpload, {
        endpoint: '#',
        formData: true,
        fieldName: 'file'
      });

      // Event handlers
      uppy.on('file-added', (file) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('File added:', file.name);
        }
      });

      uppy.on('upload-success', (file, _response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Upload success:', file.name);
        }
      });

      uppy.on('complete', (result) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Upload complete:', result.successful.length, 'files uploaded');
        }
      });

      // Store reference globally
      window.uppy = uppy;
      globalThis.uppy = uppy;

      if (process.env.NODE_ENV === 'development') {
        console.log('Uppy initialized successfully');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Uppy initialization error:', error);
      }
    }
  }
});
