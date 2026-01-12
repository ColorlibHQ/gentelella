// Inbox.html specific JavaScript with Quill rich text editor

// Import security utilities
import { sanitizeHtml } from './utils/security.js';

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

// Quill Rich Text Editor (replaces jQuery WYSIWYG)
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Make Quill available globally for debugging
window.Quill = Quill;

// Store editor instance globally
let quillEditor = null;

// Initialize Quill editor when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const editorContainer = document.getElementById('editor-container');

  if (editorContainer) {
    try {
      // Initialize Quill with Snow theme
      quillEditor = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Type your message here...',
        modules: {
          toolbar: [
            [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      });

      // Store instance globally for access
      window.quillEditor = quillEditor;
    } catch (error) {
      console.error('Failed to initialize Quill editor:', error);
    }
  }

  // Handle file attachment for images
  const attachFile = document.getElementById('attach-file');
  if (attachFile) {
    attachFile.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file && file.type.match('image.*') && quillEditor) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const range = quillEditor.getSelection(true);
          quillEditor.insertEmbed(range.index, 'image', event.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }
});

// Handle send button
document.addEventListener('click', function (e) {
  if (
    e.target.matches('#send') ||
    e.target.matches('[data-action="send"]') ||
    e.target.closest('#send')
  ) {
    e.preventDefault();

    // Get content from Quill
    const content = quillEditor ? quillEditor.root.innerHTML : '';

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
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      toastContainer.innerHTML = sanitizeHtml(toastHtml);
      document.body.appendChild(toastContainer);

      const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
      toast.show();

      // Remove container after toast hides
      toastContainer.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
      });
    } else {
      alert('Message sent successfully!');
    }
  }
});