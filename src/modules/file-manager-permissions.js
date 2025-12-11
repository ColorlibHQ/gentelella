// File Manager Permissions Module
import '../utils/dom-modern.js';

class FilePermissions {
  constructor() {
    this.permissions = {
      view: true,
      edit: true,
      manage: false
    };
    this.init();
  }

  init() {
    this.createPermissionsModal();
    this.setupEventListeners();
  }

  createPermissionsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'permissions-modal';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'permissions-modal-label');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="permissions-modal-label">File Permissions</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="permission-section">
              <h6>Permissions</h6>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="view-permission" checked>
                <label class="form-check-label" for="view-permission">
                  View
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="edit-permission" checked>
                <label class="form-check-label" for="edit-permission">
                  Edit
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="manage-permission">
                <label class="form-check-label" for="manage-permission">
                  Manage
                </label>
              </div>
            </div>
            <div class="permission-section">
              <h6>Share With</h6>
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Enter email or name">
                <button class="btn btn-primary" type="button">Add</button>
              </div>
              <div class="shared-users">
                <div class="user-share">
                  <img src="/images/img.jpg" alt="User" class="img-circle" width="32">
                  <span>John Doe</span>
                  <span class="permission-level">Edit</span>
                  <button class="btn btn-sm btn-danger">Remove</button>
                </div>
                <div class="user-share">
                  <img src="/images/img.jpg" alt="User" class="img-circle" width="32">
                  <span>Jane Smith</span>
                  <span class="permission-level">View</span>
                  <button class="btn btn-sm btn-danger">Remove</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="save-permissions">Save Changes</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  setupEventListeners() {
    // Save permissions button
    const saveBtn = DOM.select('#save-permissions');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.savePermissions());
    }

    // Checkboxes
    const viewCheckbox = DOM.select('#view-permission');
    const editCheckbox = DOM.select('#edit-permission');
    const manageCheckbox = DOM.select('#manage-permission');

    if (viewCheckbox) {
      viewCheckbox.addEventListener('change', (e) => {
        this.permissions.view = e.target.checked;
        if (!this.permissions.view) {
          this.permissions.edit = false;
          this.permissions.manage = false;
          editCheckbox.checked = false;
          manageCheckbox.checked = false;
        }
      });
    }

    if (editCheckbox) {
      editCheckbox.addEventListener('change', (e) => {
        this.permissions.edit = e.target.checked;
        if (this.permissions.edit) {
          this.permissions.view = true;
          viewCheckbox.checked = true;
        }
        if (!this.permissions.edit) {
          this.permissions.manage = false;
          manageCheckbox.checked = false;
        }
      });
    }

    if (manageCheckbox) {
      manageCheckbox.addEventListener('change', (e) => {
        this.permissions.manage = e.target.checked;
        if (this.permissions.manage) {
          this.permissions.view = true;
          this.permissions.edit = true;
          viewCheckbox.checked = true;
          editCheckbox.checked = true;
        }
      });
    }
  }

  savePermissions() {
    // Save permissions logic
    console.log('Permissions saved:', this.permissions);
    const modal = DOM.select('#permissions-modal');
    if (modal) {
      const bootstrapModal = new window.bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
    if (window.fileManager) {
      window.fileManager.showNotification('Permissions updated successfully');
    }
  }

  openPermissionsModal() {
    const modal = DOM.select('#permissions-modal');
    if (modal) {
      const bootstrapModal = new window.bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }
}

// Initialize permissions module when DOM is ready
DOM.ready(() => {
  window.filePermissions = new FilePermissions();
});

export default FilePermissions;