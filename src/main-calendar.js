// Calendar.html specific JavaScript with FullCalendar integration

// Import jQuery setup first
import $ from './jquery-setup.js';
window.jQuery = window.$ = $;
globalThis.jQuery = globalThis.$ = $;

// Import DOMPurify for XSS protection
import DOMPurify from 'dompurify';

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

// FullCalendar Core and Plugins
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

// Make FullCalendar available globally
window.FullCalendar = { Calendar, dayGridPlugin, interactionPlugin, timeGridPlugin };
globalThis.FullCalendar = { Calendar, dayGridPlugin, interactionPlugin, timeGridPlugin };

// Global variables
let currentCalendar = null;
let selectedEvent = null;

// Sample events with professional content
const sampleEvents = [
  {
    id: '1',
    title: 'Quarterly Business Review',
    start: '2032-06-01T09:00:00',
    end: '2032-06-01T11:00:00',
    backgroundColor: '#26B99A',
    borderColor: '#26B99A',
    description:
      'Quarterly review meeting with stakeholders to discuss performance metrics and strategic planning.',
    location: 'Conference Room A',
    category: 'meeting'
  },
  {
    id: '2',
    title: 'Team Standup Meeting',
    start: '2032-06-05T14:00:00',
    end: '2032-06-05T14:30:00',
    backgroundColor: '#5A738E',
    borderColor: '#5A738E',
    description: 'Daily team standup to discuss progress, blockers, and sprint planning.',
    location: 'Meeting Room B',
    category: 'meeting'
  },
  {
    id: '3',
    title: 'Product Launch Conference',
    start: '2032-06-12T10:00:00',
    end: '2032-06-14T17:00:00',
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
    description:
      'Annual product launch conference featuring new product announcements and industry insights.',
    location: 'Convention Center',
    category: 'conference'
  },
  {
    id: '4',
    title: 'Technical Workshop',
    start: '2032-06-15T13:00:00',
    end: '2032-06-15T16:00:00',
    backgroundColor: '#F39C12',
    borderColor: '#F39C12',
    description:
      'Hands-on technical workshop covering new development frameworks and best practices.',
    location: 'Training Room',
    category: 'workshop'
  },
  {
    id: '5',
    title: 'Project Deadline',
    start: '2032-06-20',
    backgroundColor: '#9B59B6',
    borderColor: '#9B59B6',
    description: 'Final deadline for Q2 project deliverables.',
    category: 'deadline',
    allDay: true
  }
];

// Utility functions
function formatDateForInput(date) {
  if (!date) {
    return '';
  }
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function generateEventId() {
  return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  if (calendarEl) {
    currentCalendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      weekends: true,
      editable: true,
      droppable: true,
      height: 'auto',

      events: sampleEvents,

      // Event handlers
      select: function (selectInfo) {
        openNewEventModal(selectInfo);
      },

      eventClick: function (eventClickInfo) {
        selectedEvent = eventClickInfo.event;
        showEventDetails(eventClickInfo.event);
      },

      eventDidMount: function (info) {
        // Add tooltip to events
        info.el.setAttribute('title', info.event.title);
        if (info.event.extendedProps.description) {
          info.el.setAttribute('data-bs-toggle', 'tooltip');
          info.el.setAttribute('data-bs-title', info.event.extendedProps.description);
        }
      }
    });

    currentCalendar.render();

    // Make calendar available globally
    window.calendar = currentCalendar;
    globalThis.calendar = currentCalendar;

    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
      tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  }

  // Modal event handlers
  setupModalHandlers();
});

function openNewEventModal(selectInfo) {
  const modal = new bootstrap.Modal(document.getElementById('CalenderModalNew'));

  // Pre-fill dates if provided
  if (selectInfo) {
    document.getElementById('eventStartDate').value = formatDateForInput(selectInfo.start);
    if (selectInfo.end) {
      document.getElementById('eventEndDate').value = formatDateForInput(selectInfo.end);
    }
    document.getElementById('allDayEvent').checked = selectInfo.allDay;
  }

  // Clear form
  document.getElementById('newEventForm').reset();
  document.getElementById('eventColor').value = '#26B99A';

  modal.show();
}

function showEventDetails(event) {
  const modal = new bootstrap.Modal(document.getElementById('EventDetailsModal'));
  const contentEl = document.getElementById('eventDetailsContent');

  const startDate = event.start ? event.start.toLocaleDateString() : 'Not specified';
  const startTime = event.start && !event.allDay ? event.start.toLocaleTimeString() : '';
  const endDate = event.end ? event.end.toLocaleDateString() : '';
  const endTime = event.end && !event.allDay ? event.end.toLocaleTimeString() : '';

  // Sanitize all user-controlled data to prevent XSS attacks
  const safeTitle = DOMPurify.sanitize(event.title || '');
  const safeDescription = event.extendedProps.description
    ? DOMPurify.sanitize(event.extendedProps.description)
    : '';
  const safeLocation = event.extendedProps.location
    ? DOMPurify.sanitize(event.extendedProps.location)
    : '';
  const safeCategory = event.extendedProps.category
    ? DOMPurify.sanitize(event.extendedProps.category)
    : '';

  const eventDetailsHtml = `
        <div class="row mb-3">
            <div class="col-md-3"><strong>Title:</strong></div>
            <div class="col-md-9">${safeTitle}</div>
        </div>
        <div class="row mb-3">
            <div class="col-md-3"><strong>Start:</strong></div>
            <div class="col-md-9">${startDate} ${startTime}</div>
        </div>
        ${
  event.end
    ? `
        <div class="row mb-3">
            <div class="col-md-3"><strong>End:</strong></div>
            <div class="col-md-9">${endDate} ${endTime}</div>
        </div>
        `
    : ''
}
        ${
  safeDescription
    ? `
        <div class="row mb-3">
            <div class="col-md-3"><strong>Description:</strong></div>
            <div class="col-md-9">${safeDescription}</div>
        </div>
        `
    : ''
}
        ${
  safeLocation
    ? `
        <div class="row mb-3">
            <div class="col-md-3"><strong>Location:</strong></div>
            <div class="col-md-9">${safeLocation}</div>
        </div>
        `
    : ''
}
        ${
  safeCategory
    ? `
        <div class="row mb-3">
            <div class="col-md-3"><strong>Category:</strong></div>
            <div class="col-md-9"><span class="badge bg-secondary">${safeCategory}</span></div>
        </div>
        `
    : ''
}
    `;

  // Final sanitization of the entire HTML block
  contentEl.innerHTML = DOMPurify.sanitize(eventDetailsHtml);

  modal.show();
}

function openEditEventModal(event) {
  const modal = new bootstrap.Modal(document.getElementById('CalenderModalEdit'));

  // Populate form with event data
  document.getElementById('editEventTitle').value = event.title || '';
  document.getElementById('editEventColor').value = event.backgroundColor || '#26B99A';
  document.getElementById('editEventStartDate').value = formatDateForInput(event.start);
  document.getElementById('editEventEndDate').value = formatDateForInput(event.end);
  document.getElementById('editAllDayEvent').checked = event.allDay || false;
  document.getElementById('editEventDescription').value = event.extendedProps.description || '';
  document.getElementById('editEventLocation').value = event.extendedProps.location || '';
  document.getElementById('editEventCategory').value = event.extendedProps.category || '';

  modal.show();
}

function setupModalHandlers() {
  // Save new event
  document.getElementById('saveNewEvent').addEventListener('click', function () {
    const form = document.getElementById('newEventForm');

    if (form.checkValidity()) {
      const formData = new FormData(form);
      const eventData = {
        id: generateEventId(),
        title: formData.get('title'),
        start: formData.get('start'),
        end: formData.get('end'),
        allDay: formData.has('allDay'),
        backgroundColor: formData.get('color'),
        borderColor: formData.get('color'),
        description: formData.get('description'),
        location: formData.get('location'),
        category: formData.get('category')
      };

      // Add to calendar
      currentCalendar.addEvent(eventData);

      // Close modal
      bootstrap.Modal.getInstance(document.getElementById('CalenderModalNew')).hide();

      // Show success message
      showToast('Event created successfully!', 'success');
    } else {
      form.classList.add('was-validated');
    }
  });

  // Save edited event
  document.getElementById('saveEditEvent').addEventListener('click', function () {
    if (selectedEvent) {
      const form = document.getElementById('editEventForm');

      if (form.checkValidity()) {
        const formData = new FormData(form);

        // Update event properties
        selectedEvent.setProp('title', formData.get('title'));
        selectedEvent.setProp('backgroundColor', formData.get('color'));
        selectedEvent.setProp('borderColor', formData.get('color'));
        selectedEvent.setStart(formData.get('start'));
        selectedEvent.setEnd(formData.get('end'));
        selectedEvent.setAllDay(formData.has('allDay'));
        selectedEvent.setExtendedProp('description', formData.get('description'));
        selectedEvent.setExtendedProp('location', formData.get('location'));
        selectedEvent.setExtendedProp('category', formData.get('category'));

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('CalenderModalEdit')).hide();

        // Show success message
        showToast('Event updated successfully!', 'success');
      } else {
        form.classList.add('was-validated');
      }
    }
  });

  // Delete event
  document.getElementById('deleteEvent').addEventListener('click', function () {
    if (selectedEvent && confirm('Are you sure you want to delete this event?')) {
      selectedEvent.remove();

      // Close modal
      bootstrap.Modal.getInstance(document.getElementById('CalenderModalEdit')).hide();

      // Show success message
      showToast('Event deleted successfully!', 'success');
    }
  });

  // Edit event button from details modal
  document.getElementById('editEventBtn').addEventListener('click', function () {
    if (selectedEvent) {
      // Close details modal
      bootstrap.Modal.getInstance(document.getElementById('EventDetailsModal')).hide();

      // Open edit modal
      setTimeout(() => openEditEventModal(selectedEvent), 300);
    }
  });

  // Clear form validation on modal close
  document.getElementById('CalenderModalNew').addEventListener('hidden.bs.modal', function () {
    document.getElementById('newEventForm').classList.remove('was-validated');
    document.getElementById('newEventForm').reset();
  });

  document.getElementById('CalenderModalEdit').addEventListener('hidden.bs.modal', function () {
    document.getElementById('editEventForm').classList.remove('was-validated');
    selectedEvent = null;
  });
}

function showToast(message, type = 'info') {
  const toastContainer = document.querySelector('.toast-container') || createToastContainer();
  const toastId = 'toast_' + Date.now();

  const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary';

  const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });

  toast.show();

  // Remove toast element after it's hidden
  toastElement.addEventListener('hidden.bs.toast', function () {
    toastElement.remove();
  });
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container position-fixed top-0 end-0 p-3';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
}
