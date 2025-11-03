// Inbox.html specific JavaScript with Bootstrap WYSIWYG editor

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
globalThis.jQuery = globalThis.$ = $;

// Import security utilities
import { sanitizeHtml } from './utils/security.js';

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

// Bootstrap WYSIWYG Editor
// bootstrap-wysiwyg removed - was unused dependency

// Initialize WYSIWYG editor when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Check if we have the required elements
  const editorEl = document.getElementById('editor');
  const toolbarEl = document.querySelector('[data-role="editor-toolbar"]');

  if (editorEl && toolbarEl && window.jQuery) {
    try {
      // Initialize the WYSIWYG editor
      $(editorEl).wysiwyg({
        toolbarSelector: '[data-role="editor-toolbar"]',
        activeToolbarClass: 'btn-info',
        hotKeys: {
          'ctrl+b meta+b': 'bold',
          'ctrl+i meta+i': 'italic',
          'ctrl+u meta+u': 'underline',
          'ctrl+z meta+z': 'undo',
          'ctrl+y meta+y meta+shift+z': 'redo'
        }
      });

      // Style the editor
      $(editorEl).css({
        'min-height': '200px',
        padding: '10px',
        border: '1px solid #E6E9ED',
        'border-radius': '4px',
        'background-color': '#fff'
      });

      // Add some default content
      $(editorEl).html(sanitizeHtml('<p>Start typing your message here...</p>'));

      // Handle toolbar button states
      $(editorEl).on('keyup mouseup', function () {
        // Update toolbar button states based on current selection
        $('[data-role="editor-toolbar"] [data-edit]').each(function () {
          const command = $(this).data('edit');
          if (document.queryCommandState(command)) {
            $(this).addClass('active btn-info');
          } else {
            $(this).removeClass('active btn-info');
          }
        });
      });

      // Handle file upload for images
      $('#file-upload').on('change', function (e) {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const img =
              '<img src="' +
              event.target.result +
              '" class="img-responsive" style="max-width: 100%; height: auto;">';
            $(editorEl).append(img);
          };
          reader.readAsDataURL(file);
        }
      });
    } catch (error) {
    }
  } else {
  }
});

// Handle send button
document.addEventListener('click', function (e) {
  if (e.target.matches('[data-action="send"]')) {
    e.preventDefault();
    const content = document.getElementById('editor').innerHTML;

    // Show success message
    if (window.bootstrap && window.bootstrap.Toast) {
      const toastHtml = `
                <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            Message sent successfully!
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;

      const toastContainer = document.createElement('div');
      toastContainer.innerHTML = sanitizeHtml(toastHtml);
      document.body.appendChild(toastContainer);

      const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
      toast.show();
    } else {
      alert('Message sent successfully!');
    }
  }
});
