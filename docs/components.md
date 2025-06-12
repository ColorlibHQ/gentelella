---
layout: default
title: Components Guide
nav_order: 4
---

# Components Guide
{: .no_toc }

Complete reference for all components available in Gentelella Admin Template
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Dashboard Components

### Dashboard Layouts

Gentelella includes three pre-designed dashboard layouts:

#### Main Dashboard (`index.html`)
- **Revenue widgets** with animated counters
- **Real-time charts** showing trends and analytics  
- **Activity timeline** with user interactions
- **Quick stats** cards with icons
- **To-do lists** with progress tracking

```html
<!-- Revenue Widget Example -->
<div class="col-md-3 col-sm-6">
  <div class="x_panel tile fixed_height_320">
    <div class="x_title">
      <h2>Total Revenue</h2>
    </div>
    <div class="x_content">
      <span class="chart" data-percent="73">
        <span class="percent">73</span>
      </span>
      <h3>$52,147</h3>
      <div class="sidebar-widget">
        <h4>Revenue breakdown</h4>
        <canvas id="revenue-chart"></canvas>
      </div>
    </div>
  </div>
</div>
```

#### Dashboard 2 (`index2.html`)
- **Full-width charts** for detailed analytics
- **Map integration** with geographical data
- **Compact widgets** for KPIs
- **News feed** with updates

#### Dashboard 3 (`index3.html`)
- **Calendar integration** with events
- **Weather widget** with forecasts
- **Social media stats** counters
- **Project timeline** view

### Widget Cards

#### Tile Widgets
```html
<div class="tile_count">
  <div class="col-md-2 col-sm-4 tile_stats_count">
    <span class="count_top"><i class="fa fa-user"></i> Total Users</span>
    <div class="count">2500</div>
    <span class="count_bottom"><i class="green">4% </i> From last Week</span>
  </div>
</div>
```

#### Info Box Widgets
```html
<div class="col-md-4 col-sm-4">
  <div class="x_panel tile fixed_height_320 overflow_hidden">
    <div class="x_title">
      <h2>Network Activities</h2>
    </div>
    <div class="x_content">
      <table class="countries_list">
        <tbody>
          <tr>
            <td>United States</td>
            <td class="fs-15 fw-700 text-right">2,371</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

---

## Chart Components

### Chart.js Integration

#### Line Charts
```javascript
// Initialize line chart
import Chart from 'chart.js/auto';

const ctx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: '#73879C',
      backgroundColor: 'rgba(115, 135, 156, 0.1)',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});
```

#### Bar Charts
```html
<div class="x_panel">
  <div class="x_title">
    <h2>Monthly Sales</h2>
  </div>
  <div class="x_content">
    <canvas id="barChart" width="400" height="200"></canvas>
  </div>
</div>
```

#### Pie Charts
```javascript
const pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#73879C', '#26B99A', '#3498DB']
    }]
  }
});
```

### Morris.js Charts

#### Line Charts
```javascript
Morris.Line({
  element: 'line-chart',
  data: [
    { y: '2023-01', a: 100, b: 90 },
    { y: '2023-02', a: 75,  b: 65 },
    { y: '2023-03', a: 50,  b: 40 }
  ],
  xkey: 'y',
  ykeys: ['a', 'b'],
  labels: ['Series A', 'Series B']
});
```

#### Area Charts
```javascript
Morris.Area({
  element: 'area-chart',
  data: [
    { period: '2023-01', sales: 2666, downloads: 2647 },
    { period: '2023-02', sales: 2778, downloads: 2294 }
  ],
  xkey: 'period',
  ykeys: ['sales', 'downloads'],
  labels: ['Sales', 'Downloads']
});
```

### Sparkline Charts

```javascript
$('.sparkline').sparkline([5,6,7,2,0,-4,-2,4], {
  type: 'line',
  width: '100%',
  height: '30',
  lineColor: '#26B99A',
  fillColor: 'rgba(38, 185, 154, 0.3)'
});
```

### Gauge Charts

```javascript
import Gauge from 'gauge.js';

const gauge = new Gauge(document.getElementById('gauge')).setOptions({
  angle: 0.15,
  lineWidth: 0.2,
  radiusScale: 1,
  pointer: {
    length: 0.6,
    strokeWidth: 0.035,
    color: '#000000'
  },
  limitMax: false,
  limitMin: false,
  colorStart: '#6FADCF',
  colorStop: '#8FC0DA',
  strokeColor: '#E0E0E0',
  generateGradient: true,
  highDpiSupport: true
});

gauge.maxValue = 100;
gauge.setMinValue(0);
gauge.animationSpeed = 32;
gauge.set(67);
```

---

## Form Components

### Basic Form Elements

#### Input Fields
```html
<div class="form-group row">
  <label class="col-form-label col-md-3 col-sm-3">Email</label>
  <div class="col-md-6 col-sm-6">
    <input type="email" class="form-control" placeholder="Enter email">
  </div>
</div>
```

#### Select Dropdowns
```html
<div class="form-group row">
  <label class="col-form-label col-md-3 col-sm-3">Country</label>
  <div class="col-md-6 col-sm-6">
    <select class="form-control">
      <option>Choose option</option>
      <option>United States</option>
      <option>United Kingdom</option>
    </select>
  </div>
</div>
```

### Advanced Form Components

#### Select2 Enhanced Dropdowns
```html
<select class="form-control select2" multiple="multiple">
  <option value="AK">Alaska</option>
  <option value="HI">Hawaii</option>
  <option value="CA">California</option>
</select>
```

```javascript
// Initialize Select2
$('.select2').select2({
  theme: 'bootstrap-5',
  width: '100%',
  placeholder: 'Select options...'
});
```

#### Date/Time Pickers
```html
<div class="form-group">
  <label>Date Range:</label>
  <div>
    <input type="text" class="form-control" id="reservation" 
           placeholder="Select date range">
  </div>
</div>
```

```javascript
import { DateTime } from 'tempus-dominus';

new DateTime(document.getElementById('reservation'), {
  display: {
    components: {
      calendar: true,
      date: true,
      month: true,
      year: true,
      decades: true,
      clock: false
    }
  }
});
```

#### Range Sliders
```html
<div class="form-group">
  <label>Price Range:</label>
  <input type="text" id="range-slider" value="" name="range">
</div>
```

```javascript
$("#range-slider").ionRangeSlider({
  type: "double",
  min: 0,
  max: 1000,
  from: 200,
  to: 500,
  prefix: "$"
});
```

#### File Upload with Dropzone
```html
<div class="dropzone" id="file-dropzone">
  <div class="dz-message">
    <h3>Drop files here or click to upload</h3>
  </div>
</div>
```

```javascript
import Dropzone from 'dropzone';

new Dropzone("#file-dropzone", {
  url: "/upload",
  maxFilesize: 10,
  acceptedFiles: ".jpeg,.jpg,.png,.gif"
});
```

#### Rich Text Editor
```html
<div class="form-group">
  <label>Content:</label>
  <div id="editor" class="form-control" style="height: 300px;">
    <p>Initial content...</p>
  </div>
</div>
```

### Form Validation

#### Bootstrap Validation
```html
<form class="needs-validation" novalidate>
  <div class="form-group">
    <label for="validationCustom01">First name</label>
    <input type="text" class="form-control" id="validationCustom01" 
           placeholder="First name" required>
    <div class="invalid-feedback">
      Please provide a valid first name.
    </div>
  </div>
  <button class="btn btn-primary" type="submit">Submit</button>
</form>
```

#### Parsley.js Validation
```html
<form data-parsley-validate>
  <div class="form-group">
    <label>Email *</label>
    <input type="email" class="form-control" 
           data-parsley-type="email" required>
  </div>
  <div class="form-group">
    <label>Password *</label>
    <input type="password" class="form-control" 
           data-parsley-minlength="6" required>
  </div>
</form>
```

---

## Table Components

### Basic Tables

#### Responsive Table
```html
<div class="table-responsive">
  <table class="table table-striped table-bordered">
    <thead>
      <tr>
        <th>Name</th>
        <th>Position</th>
        <th>Office</th>
        <th>Salary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Tiger Nixon</td>
        <td>System Architect</td>
        <td>Edinburgh</td>
        <td>$320,800</td>
      </tr>
    </tbody>
  </table>
</div>
```

### DataTables Integration

#### Basic DataTable
```html
<table id="datatable" class="table table-striped table-bordered" 
       style="width:100%">
  <thead>
    <tr>
      <th>Name</th>
      <th>Position</th>
      <th>Office</th>
      <th>Age</th>
      <th>Start date</th>
      <th>Salary</th>
    </tr>
  </thead>
</table>
```

```javascript
$('#datatable').DataTable({
  ajax: '/api/employees',
  columns: [
    { data: 'name' },
    { data: 'position' },
    { data: 'office' },
    { data: 'age' },
    { data: 'start_date' },
    { data: 'salary' }
  ],
  responsive: true,
  pageLength: 25,
  dom: 'Bfrtip',
  buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
});
```

#### Advanced DataTable Features
```javascript
$('#advanced-datatable').DataTable({
  processing: true,
  serverSide: true,
  ajax: {
    url: '/api/data',
    type: 'POST'
  },
  columns: [
    { data: 'id', searchable: false },
    { data: 'name' },
    { data: 'email' },
    { 
      data: 'actions',
      orderable: false,
      searchable: false,
      render: function(data, type, row) {
        return `
          <button class="btn btn-sm btn-primary edit-btn" data-id="${row.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}">Delete</button>
        `;
      }
    }
  ],
  order: [[0, 'desc']],
  pageLength: 50,
  lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
});
```

---

## UI Elements

### Navigation Components

#### Sidebar Navigation
```html
<div class="col-md-3 left_col">
  <div class="left_col scroll-view">
    <div class="navbar nav_title" style="border: 0;">
      <a href="index.html" class="site_title">
        <i class="fa fa-paw"></i> <span>Gentelella!</span>
      </a>
    </div>
    
    <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
      <div class="menu_section">
        <h3>General</h3>
        <ul class="nav side-menu">
          <li><a><i class="fa fa-home"></i> Home <span class="fa fa-chevron-down"></span></a>
            <ul class="nav child_menu">
              <li><a href="index.html">Dashboard</a></li>
              <li><a href="index2.html">Dashboard2</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

#### Breadcrumbs
```html
<div class="page-title">
  <div class="title_left">
    <h3>Form Elements</h3>
  </div>
  <div class="title_right">
    <div class="col-md-5 col-sm-5 form-group pull-right top_search">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Search for...">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button">Go!</button>
        </span>
      </div>
    </div>
  </div>
</div>
```

### Modal Components

#### Basic Modal
```html
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">
          <span aria-hidden="true">&times;</span>
        </button>
        <h4 class="modal-title">Modal title</h4>
      </div>
      <div class="modal-body">
        <p>Modal body content...</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

#### Large Modal with Form
```html
<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Large Modal</h4>
      </div>
      <div class="modal-body">
        <form>
          <!-- Form content -->
        </form>
      </div>
    </div>
  </div>
</div>
```

### Alert Components

#### Bootstrap Alerts
```html
<div class="alert alert-success alert-dismissible">
  <button type="button" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
  <strong>Success!</strong> This is a success alert.
</div>

<div class="alert alert-danger alert-dismissible">
  <button type="button" class="close" data-dismiss="alert">
    <span aria-hidden="true">&times;</span>
  </button>
  <strong>Error!</strong> Something went wrong.
</div>
```

#### PNotify Notifications
```javascript
import PNotify from 'pnotify';

// Success notification
new PNotify({
  title: 'Success!',
  text: 'Your changes have been saved.',
  type: 'success',
  styling: 'bootstrap4'
});

// Error notification
new PNotify({
  title: 'Error!',
  text: 'An error occurred while processing your request.',
  type: 'error',
  styling: 'bootstrap4'
});
```

### Progress Components

#### Progress Bars
```html
<div class="progress">
  <div class="progress-bar progress-bar-success" role="progressbar" 
       aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:40%">
    40% Complete (success)
  </div>
</div>

<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated" 
       role="progressbar" aria-valuenow="75" aria-valuemin="0" 
       aria-valuemax="100" style="width:75%">
    75%
  </div>
</div>
```

#### Animated Progress with JavaScript
```javascript
function animateProgress(selector, targetPercentage) {
  const progressBar = document.querySelector(selector);
  let currentPercentage = 0;
  
  const interval = setInterval(() => {
    if (currentPercentage >= targetPercentage) {
      clearInterval(interval);
      return;
    }
    
    currentPercentage++;
    progressBar.style.width = currentPercentage + '%';
    progressBar.textContent = currentPercentage + '%';
  }, 20);
}

// Usage
animateProgress('.progress-bar', 85);
```

---

## Map Components

### jVectorMap Integration

#### World Map
```html
<div id="world-map" style="height: 400px;"></div>
```

```javascript
$('#world-map').vectorMap({
  map: 'world_mill',
  backgroundColor: 'transparent',
  regionStyle: {
    initial: {
      fill: '#73879C',
      "fill-opacity": 1,
      stroke: '#fff',
      "stroke-width": 1,
      "stroke-opacity": 1
    }
  },
  series: {
    regions: [{
      values: {
        "US": 298,
        "SA": 200,
        "AU": 760,
        "IN": 2000000,
        "GB": 120
      },
      scale: ['#26B99A', '#E74C3C'],
      normalizeFunction: 'polynomial'
    }]
  }
});
```

#### Regional Map
```javascript
$('#usa-map').vectorMap({
  map: 'us_aea',
  backgroundColor: 'transparent',
  regionsSelectable: true,
  series: {
    regions: [{
      values: {
        "US-CA": 200,
        "US-TX": 300,
        "US-NY": 250
      },
      scale: ['#3498DB', '#E74C3C']
    }]
  }
});
```

---

## Calendar Components

### FullCalendar Integration

```html
<div id="calendar"></div>
```

```javascript
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const calendarEl = document.getElementById('calendar');
const calendar = new Calendar(calendarEl, {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  initialDate: new Date(),
  navLinks: true,
  selectable: true,
  selectMirror: true,
  select: function(arg) {
    const title = prompt('Event Title:');
    if (title) {
      calendar.addEvent({
        title: title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay
      });
    }
    calendar.unselect();
  },
  eventClick: function(arg) {
    if (confirm('Are you sure you want to delete this event?')) {
      arg.event.remove();
    }
  },
  editable: true,
  dayMaxEvents: true,
  events: [
    {
      title: 'All Day Event',
      start: '2023-01-01'
    },
    {
      title: 'Long Event',
      start: '2023-01-07',
      end: '2023-01-10'
    }
  ]
});

calendar.render();
```

---

## Media Components

### Image Gallery

```html
<div class="row">
  <div class="col-md-4">
    <a href="images/large1.jpg" class="fancybox" rel="gallery1" 
       title="Image 1">
      <img src="images/thumb1.jpg" class="img-responsive" alt="">
    </a>
  </div>
  <div class="col-md-4">
    <a href="images/large2.jpg" class="fancybox" rel="gallery1" 
       title="Image 2">
      <img src="images/thumb2.jpg" class="img-responsive" alt="">
    </a>
  </div>
</div>
```

```javascript
$('.fancybox').fancybox({
  openEffect: 'elastic',
  closeEffect: 'elastic',
  helpers: {
    title: {
      type: 'inside'
    }
  }
});
```

---

## Next Steps

- **[Customization Guide]({{ site.baseurl }}/docs/customization/)** - Learn how to customize these components
- **[Performance Guide]({{ site.baseurl }}/docs/performance/)** - Optimize component loading
- **[API Reference]({{ site.baseurl }}/docs/api/)** - Detailed API documentation
- **[Examples]({{ site.baseurl }}/docs/examples/)** - See components in action

---

{: .highlight }
💡 **Pro Tip**: Use the smart loading system to load only the components you need on each page. This significantly improves performance while maintaining functionality. 