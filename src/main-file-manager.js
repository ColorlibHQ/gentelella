// File Manager Main Entry Point
import './main.scss';
import './utils/dom-modern.js';
import './modules/file-manager-permissions.js';
import './js/sidebar-modern.js';

// Initialize DOM utilities
if (!window.DOM) {
  window.DOM = require('./utils/dom-modern.js').default;
}

// File Manager Application
class FileManager {
  constructor() {
    this.currentView = 'grid';
    this.files = [];
    this.folders = [];
    this.currentPath = ['Home', 'Documents', 'Projects'];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeDragAndDrop();
    this.initializeUpload();
    this.initializeViewToggle();
  }

  setupEventListeners() {
    // New folder button
    const newFolderBtn = DOM.select('#new-folder-btn');
    if (newFolderBtn) {
      newFolderBtn.addEventListener('click', () => this.createNewFolder());
    }

    // Upload button
    const uploadBtn = DOM.select('#upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => this.triggerUpload());
    }

    // Download button
    const downloadBtn = DOM.select('#download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.handleDownload());
    }

    // View toggle buttons
    const gridViewBtn = DOM.select('#grid-view-btn');
    const listViewBtn = DOM.select('#list-view-btn');
    if (gridViewBtn && listViewBtn) {
      gridViewBtn.addEventListener('click', () => this.switchView('grid'));
      listViewBtn.addEventListener('click', () => this.switchView('list'));
    }

    // Folder click events
    const fileItems = DOM.selectAll('.file-item');
    fileItems.forEach(item => {
      if (item.querySelector('.fa-folder')) {
        item.addEventListener('click', () => this.enterFolder(item.querySelector('.file-name').textContent));
      }
    });
  }

  initializeDragAndDrop() {
    const fileItems = DOM.selectAll('.file-item');
    fileItems.forEach(item => {
      item.addEventListener('dragstart', (e) => this.handleDragStart(e));
      item.addEventListener('dragenter', (e) => this.handleDragEnter(e));
      item.addEventListener('dragover', (e) => this.handleDragOver(e));
      item.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      item.addEventListener('drop', (e) => this.handleDrop(e));
      item.addEventListener('dragend', (e) => this.handleDragEnd(e));
    });
  }

  handleDragStart(e) {
    // Generate a unique ID for the item if it doesn't have one
    const draggedItem = e.target.closest('.file-item');
    if (draggedItem) {
      if (!draggedItem.id) {
        draggedItem.id = 'file-item-' + Date.now();
      }
      e.dataTransfer.setData('text/plain', draggedItem.id);
      draggedItem.classList.add('dragging');
    }
  }

  handleDragEnter(e) {
    if (e.target.classList.contains('file-item')) {
      e.target.classList.add('drag-over');
    }
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDragLeave(e) {
    if (e.target.classList.contains('file-item')) {
      e.target.classList.remove('drag-over');
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    const draggedItem = DOM.select(`#${draggedItemId}`);
    const dropTarget = e.target.closest('.file-item');

    if (draggedItem && dropTarget && draggedItem !== dropTarget) {
      // Check if drop target is a folder
      if (dropTarget.querySelector('.fa-folder')) {
        // Move file to folder (simulation)
        const fileContainer = DOM.select('.file-container');
        if (fileContainer) {
          // Remove from current position
          fileContainer.removeChild(draggedItem);
          // In a real app, you would update the backend and reload the folder contents
          this.showNotification('File moved to folder successfully');
        }
      } else {
        // Swap positions if dropping on another file
        const fileContainer = DOM.select('.file-container');
        if (fileContainer) {
          const siblings = Array.from(fileContainer.children);
          const draggedIndex = siblings.indexOf(draggedItem);
          const targetIndex = siblings.indexOf(dropTarget);
          
          if (draggedIndex < targetIndex) {
            fileContainer.insertBefore(draggedItem, dropTarget.nextSibling);
          } else {
            fileContainer.insertBefore(draggedItem, dropTarget);
          }
          this.showNotification('File position swapped');
        }
      }
    }

    // Remove drag classes
    DOM.selectAll('.file-item').forEach(item => {
      item.classList.remove('drag-over');
    });
    if (draggedItem) {
      draggedItem.classList.remove('dragging');
    }
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
    DOM.selectAll('.file-item').forEach(item => {
      item.classList.remove('drag-over');
    });
  }

  initializeUpload() {
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-upload-input';
    fileInput.multiple = true;
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Handle file selection
    fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // Store reference for later use
    this.fileInput = fileInput;
  }

  triggerUpload() {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  uploadFiles(files) {
    Array.from(files).forEach(file => {
      this.uploadFile(file);
    });
  }

  uploadFile(file) {
    // Simulate upload progress
    const progress = this.createProgressBar(file);
    let uploaded = 0;
    const total = file.size;

    const interval = setInterval(() => {
      uploaded += total * 0.1;
      const percentage = Math.min((uploaded / total) * 100, 100);
      progress.style.width = `${percentage}%`;

      if (percentage >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progress.parentElement.remove();
          this.showNotification(`File ${file.name} uploaded successfully`);
        }, 500);
      }
    }, 500);
  }

  createProgressBar(file) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'upload-progress';
    progressContainer.innerHTML = `
      <div class="progress-info">
        <span class="file-name">${file.name}</span>
        <span class="file-size">${this.formatFileSize(file.size)}</span>
      </div>
      <div class="progress">
        <div class="progress-bar" style="width: 0%; background-color: #1abb9c;"></div>
      </div>
    `;

    const container = DOM.select('.file-container');
    if (container) {
      container.insertBefore(progressContainer, container.firstChild);
    }

    return progressContainer.querySelector('.progress-bar');
  }

  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  initializeViewToggle() {
    // Already set up in setupEventListeners
  }

  switchView(view) {
    this.currentView = view;
    const fileContainer = DOM.select('.file-container');
    if (fileContainer) {
      if (view === 'grid') {
        fileContainer.classList.remove('list-view');
        fileContainer.classList.add('grid-view');
        DOM.addClass('#grid-view-btn', 'active');
        DOM.removeClass('#list-view-btn', 'active');
      } else {
        fileContainer.classList.remove('grid-view');
        fileContainer.classList.add('list-view');
        DOM.addClass('#list-view-btn', 'active');
        DOM.removeClass('#grid-view-btn', 'active');
      }
    }
  }

  enterFolder(folderName) {
    // Update breadcrumb navigation
    const breadcrumb = DOM.select('.breadcrumb');
    if (breadcrumb) {
      // Get current active item
      const activeItem = breadcrumb.querySelector('.active');
      if (activeItem) {
        // Convert current active item to a clickable link
        activeItem.classList.remove('active');
        const folderNameText = activeItem.textContent.trim();
        activeItem.innerHTML = `<a href="#">${folderNameText}</a>`;
        
        // Create new breadcrumb item as active
        const newBreadcrumbItem = document.createElement('li');
        newBreadcrumbItem.className = 'active';
        newBreadcrumbItem.innerHTML = `<span>${folderName}</span>`;
        breadcrumb.appendChild(newBreadcrumbItem);
      }
    }

    // Simulate entering folder - in a real app, you would fetch the folder contents
    this.showNotification(`Entered folder: ${folderName}`);
  }

  handleDownload() {
    // Simulate download functionality
    this.showNotification('Download started');
  }

  createNewFolder() {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      // Add folder to file container
      const fileContainer = DOM.select('.file-container');
      if (fileContainer) {
        const folderItem = document.createElement('div');
        folderItem.className = 'file-item';
        folderItem.draggable = true;
        folderItem.innerHTML = `
          <div class="file-icon">
            <i class="fas fa-folder fa-3x text-warning"></i>
          </div>
          <div class="file-name">${folderName}</div>
          <div class="file-info">Folder • Created just now</div>
        `;
        // Add click event listener to new folder
        folderItem.addEventListener('click', () => this.enterFolder(folderName));
        fileContainer.appendChild(folderItem);
        this.initializeDragAndDrop(); // Reinitialize drag and drop for new item
        // Add click event for new folder
        folderItem.addEventListener('click', () => this.enterFolder(folderName));
      }
      this.showNotification(`Folder "${folderName}" created successfully`);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'file-manager-notification';
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }
}

// Initialize File Manager when DOM is ready
DOM.ready(() => {
  window.fileManager = new FileManager();
  
  // Initialize sidebar if initSidebar function is available
  if (typeof initSidebar === 'function') {
    initSidebar();
  }
});

// Export for potential use in other modules
export default FileManager;