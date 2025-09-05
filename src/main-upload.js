// Form Upload.html specific JavaScript with Dropzone integration

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
globalThis.jQuery = globalThis.$ = $;

// Bootstrap 5
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;
globalThis.bootstrap = bootstrap;

// Global styles
import './main.scss';

// Essential scripts for layout
import './js/helpers/smartresize-modern.js';
import './js/sidebar-modern.js';
import './js/init-modern.js';

// Dropzone for file uploads
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

// Make Dropzone available globally
window.Dropzone = Dropzone;
globalThis.Dropzone = Dropzone;

// Configure Dropzone defaults
Dropzone.autoDiscover = false;

// Initialize Dropzone when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const dropzoneElement = document.querySelector('.dropzone');

  if (dropzoneElement) {
    try {
      const myDropzone = new Dropzone(dropzoneElement, {
        url: '#', // Since this is a demo, we'll use a dummy URL
        maxFilesize: 20, // MB
        acceptedFiles: 'image/*,application/pdf,.psd,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
        addRemoveLinks: true,
        dictDefaultMessage: `
                    <div class="text-center">
                        <i class="fa fa-cloud-upload" style="font-size: 48px; color: #26B99A; margin-bottom: 10px;"></i>
                        <h4>Drop files here or click to upload</h4>
                        <p class="text-muted">Maximum file size: 20MB</p>
                    </div>
                `,
        dictRemoveFile: 'Remove file',
        dictCancelUpload: 'Cancel upload',
        dictUploadCanceled: 'Upload canceled',
        dictCancelUploadConfirmation: 'Are you sure you want to cancel this upload?',
        dictRemoveFileConfirmation: 'Are you sure you want to remove this file?',

        // Custom styling
        previewTemplate: `
                    <div class="dz-preview dz-file-preview">
                        <div class="dz-image">
                            <img data-dz-thumbnail />
                        </div>
                        <div class="dz-details">
                            <div class="dz-size"><span data-dz-size></span></div>
                            <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress">
                            <span class="dz-upload" data-dz-uploadprogress></span>
                        </div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                        <div class="dz-success-mark">
                            <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>Check</title>
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" fill="#26B99A"></path>
                                </g>
                            </svg>
                        </div>
                        <div class="dz-error-mark">
                            <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>Error</title>
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g stroke="#747474" stroke-opacity="0.198794158" fill="#E74C3C" fill-rule="nonzero">
                                        <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="dz-remove" data-dz-remove></div>
                    </div>
                `,

        init: function () {
          this.on('addedfile', function (file) {});

          this.on('removedfile', function (file) {});

          this.on('success', function (file, response) {});

          this.on('error', function (file, errorMessage) {});

          // Since this is a demo, simulate successful uploads
          this.on('sending', function (file, xhr, formData) {
            // Simulate upload success after 2 seconds
            setTimeout(() => {
              this.emit('success', file, 'Upload successful (demo)');
              this.emit('complete', file);
            }, 2000);

            // Prevent actual sending since this is demo
            xhr.abort();
          });
        }
      });

      // Store reference globally
      window.myDropzone = myDropzone;
      globalThis.myDropzone = myDropzone;
    } catch (error) {
    }
  } else {
  }
});
