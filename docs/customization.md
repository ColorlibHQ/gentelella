---
layout: default
title: Customization Guide
nav_order: 7
---

# Customization Guide
{: .no_toc }

Learn how to customize and extend Gentelella Admin Template to match your brand and requirements
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Branding and Theming

### Color Scheme Customization

#### Primary Colors

Override Bootstrap variables in `src/scss/variables.scss`:

```scss
// Brand colors
$primary: #73879C;      // Main brand color
$secondary: #6c757d;    // Secondary color
$success: #26B99A;      // Success actions
$info: #3498DB;         // Information
$warning: #F39C12;      // Warnings
$danger: #E74C3C;       // Errors

// Sidebar colors
$sidebar-bg: #2A3F54;
$sidebar-text: #E7E7E7;
$sidebar-text-hover: #ffffff;
$sidebar-active-bg: $primary;

// Dashboard colors
$dashboard-bg: #F7F7F7;
$card-bg: #ffffff;
$card-border: #E6E9ED;

// Text colors
$text-primary: #73879C;
$text-secondary: #ABB1B7;
$text-dark: #566573;
```

#### Dark Theme Support

Create `src/scss/themes/_dark.scss`:

```scss
// Dark theme variables
[data-theme="dark"] {
  --bs-body-bg: #1a1a1a;
  --bs-body-color: #ffffff;
  --bs-card-bg: #2d2d2d;
  --bs-border-color: #404040;
  
  // Sidebar dark theme
  .left_col {
    background: #0F1419;
    
    .nav-link {
      color: #CCCCCC;
      
      &:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
      
      &.active {
        background: var(--bs-primary);
        color: #ffffff;
      }
    }
  }
  
  // Cards and panels
  .x_panel {
    background: var(--bs-card-bg);
    border: 1px solid var(--bs-border-color);
    
    .x_title {
      border-bottom: 1px solid var(--bs-border-color);
      
      h2 {
        color: var(--bs-body-color);
      }
    }
  }
  
  // Tables
  .table {
    --bs-table-bg: var(--bs-card-bg);
    --bs-table-border-color: var(--bs-border-color);
    color: var(--bs-body-color);
  }
  
  // Forms
  .form-control {
    background-color: #3d3d3d;
    border-color: var(--bs-border-color);
    color: var(--bs-body-color);
    
    &:focus {
      background-color: #4d4d4d;
      border-color: var(--bs-primary);
    }
  }
}
```

#### Theme Toggle Implementation

```javascript
// src/js/theme-toggle.js
class ThemeToggle {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }
  
  init() {
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', this.theme);
    
    // Create toggle button
    this.createToggleButton();
    
    // Listen for toggle events
    document.addEventListener('theme-toggle', this.toggle.bind(this));
  }
  
  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'btn btn-outline-secondary theme-toggle';
    button.innerHTML = this.theme === 'dark' 
      ? '<i class="fa fa-sun"></i>' 
      : '<i class="fa fa-moon"></i>';
    
    button.addEventListener('click', () => this.toggle());
    
    // Add to navbar
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.appendChild(button);
      navbar.appendChild(li);
    }
  }
  
  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    // Update button icon
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.innerHTML = this.theme === 'dark' 
        ? '<i class="fa fa-sun"></i>' 
        : '<i class="fa fa-moon"></i>';
    }
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { theme: this.theme }
    }));
  }
  
  getTheme() {
    return this.theme;
  }
}

// Initialize theme toggle
new ThemeToggle();
```

### Logo and Branding

#### Custom Logo Implementation

```scss
// src/scss/components/_logo.scss
.site_title {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: $sidebar-text;
  text-decoration: none;
  
  .logo {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  .brand-text {
    font-size: 18px;
    font-weight: 600;
    
    .brand-suffix {
      font-size: 12px;
      font-weight: 400;
      opacity: 0.8;
      display: block;
      line-height: 1;
    }
  }
}

// Responsive logo
@media (max-width: 768px) {
  .site_title {
    .brand-text {
      display: none;
    }
  }
}
```

```html
<!-- Update logo in HTML files -->
<a href="index.html" class="site_title">
  <div class="logo">
    <img src="/images/logo.svg" alt="Your Brand">
  </div>
  <span class="brand-text">
    Your Brand
    <small class="brand-suffix">Admin Panel</small>
  </span>
</a>
```

### Typography Customization

#### Custom Font Integration

```scss
// src/scss/base/_typography.scss
// Import custom fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

// Typography variables
$font-family-base: 'Inter', 'Segoe UI', Roboto, sans-serif;
$font-family-heading: 'Inter', 'Segoe UI', Roboto, sans-serif;
$font-family-monospace: 'SF Mono', Monaco, 'Cascadia Code', monospace;

// Font sizes
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-base: 1rem;    // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px

// Font weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Line heights
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// Apply typography
body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-normal;
}

// Headings
h1, h2, h3, h4, h5, h6 {
  font-family: $font-family-heading;
  font-weight: $font-weight-semibold;
  line-height: $line-height-tight;
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

// Code and monospace
code, pre {
  font-family: $font-family-monospace;
}
```

---

## Layout Customization

### Sidebar Modifications

#### Collapsible Sidebar

```javascript
// src/js/sidebar.js
class Sidebar {
  constructor() {
    this.sidebar = document.querySelector('.left_col');
    this.mainContent = document.querySelector('.right_col');
    this.toggleBtn = document.querySelector('.sidebar-toggle');
    this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    
    this.init();
  }
  
  init() {
    // Apply saved state
    if (this.isCollapsed) {
      this.collapse();
    }
    
    // Create toggle button if it doesn't exist
    if (!this.toggleBtn) {
      this.createToggleButton();
    }
    
    // Add event listeners
    this.toggleBtn?.addEventListener('click', () => this.toggle());
    
    // Handle responsive behavior
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }
  
  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'btn btn-link sidebar-toggle';
    button.innerHTML = '<i class="fa fa-bars"></i>';
    
    // Add to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.insertBefore(button, navbar.firstChild);
    }
    
    this.toggleBtn = button;
  }
  
  toggle() {
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }
  
  collapse() {
    this.sidebar?.classList.add('collapsed');
    this.mainContent?.classList.add('sidebar-collapsed');
    this.isCollapsed = true;
    localStorage.setItem('sidebar-collapsed', 'true');
    
    // Update toggle button icon
    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = '<i class="fa fa-bars"></i>';
    }
  }
  
  expand() {
    this.sidebar?.classList.remove('collapsed');
    this.mainContent?.classList.remove('sidebar-collapsed');
    this.isCollapsed = false;
    localStorage.setItem('sidebar-collapsed', 'false');
    
    // Update toggle button icon
    if (this.toggleBtn) {
      this.toggleBtn.innerHTML = '<i class="fa fa-times"></i>';
    }
  }
  
  handleResize() {
    const width = window.innerWidth;
    
    // Auto-collapse on mobile
    if (width < 768) {
      this.collapse();
    } else if (width > 1200 && this.isCollapsed) {
      this.expand();
    }
  }
}

// Initialize sidebar
new Sidebar();
```

```scss
// src/scss/components/_sidebar.scss
.left_col {
  width: 230px;
  transition: all 0.3s ease;
  
  &.collapsed {
    width: 70px;
    
    .nav_title {
      .brand-text {
        display: none;
      }
    }
    
    .main_menu_side {
      .nav > li > a {
        text-align: center;
        padding: 12px 0;
        
        .menu-text {
          display: none;
        }
        
        .fa {
          margin-right: 0;
        }
      }
      
      .child_menu {
        display: none !important;
      }
    }
  }
}

.right_col {
  margin-left: 230px;
  transition: all 0.3s ease;
  
  &.sidebar-collapsed {
    margin-left: 70px;
  }
}

@media (max-width: 768px) {
  .left_col {
    transform: translateX(-100%);
    
    &.mobile-show {
      transform: translateX(0);
    }
  }
  
  .right_col {
    margin-left: 0;
  }
}
```

#### Custom Menu Items

```javascript
// src/js/menu-builder.js
class MenuBuilder {
  constructor(menuConfig) {
    this.config = menuConfig;
    this.menuContainer = document.querySelector('#sidebar-menu');
    this.buildMenu();
  }
  
  buildMenu() {
    if (!this.menuContainer) return;
    
    this.menuContainer.innerHTML = '';
    
    this.config.sections.forEach(section => {
      const sectionElement = this.createSection(section);
      this.menuContainer.appendChild(sectionElement);
    });
  }
  
  createSection(section) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'menu_section';
    
    if (section.title) {
      const title = document.createElement('h3');
      title.textContent = section.title;
      sectionDiv.appendChild(title);
    }
    
    const menuList = document.createElement('ul');
    menuList.className = 'nav side-menu';
    
    section.items.forEach(item => {
      const menuItem = this.createMenuItem(item);
      menuList.appendChild(menuItem);
    });
    
    sectionDiv.appendChild(menuList);
    return sectionDiv;
  }
  
  createMenuItem(item) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    
    // Set link properties
    if (item.url) {
      a.href = item.url;
    }
    
    // Add icon
    if (item.icon) {
      const icon = document.createElement('i');
      icon.className = `fa fa-${item.icon}`;
      a.appendChild(icon);
    }
    
    // Add text
    const textSpan = document.createElement('span');
    textSpan.className = 'menu-text';
    textSpan.textContent = item.label;
    a.appendChild(textSpan);
    
    // Add submenu indicator
    if (item.children && item.children.length > 0) {
      const chevron = document.createElement('span');
      chevron.className = 'fa fa-chevron-down';
      a.appendChild(chevron);
      
      // Create submenu
      const submenu = this.createSubmenu(item.children);
      li.appendChild(submenu);
    }
    
    // Add click handler for submenus
    a.addEventListener('click', (e) => {
      if (item.children && item.children.length > 0) {
        e.preventDefault();
        this.toggleSubmenu(li);
      }
    });
    
    li.appendChild(a);
    return li;
  }
  
  createSubmenu(items) {
    const ul = document.createElement('ul');
    ul.className = 'nav child_menu';
    ul.style.display = 'none';
    
    items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.url || '#';
      a.textContent = item.label;
      
      li.appendChild(a);
      ul.appendChild(li);
    });
    
    return ul;
  }
  
  toggleSubmenu(parentLi) {
    const submenu = parentLi.querySelector('.child_menu');
    const chevron = parentLi.querySelector('.fa-chevron-down, .fa-chevron-up');
    
    if (submenu.style.display === 'none') {
      submenu.style.display = 'block';
      chevron.className = chevron.className.replace('chevron-down', 'chevron-up');
    } else {
      submenu.style.display = 'none';
      chevron.className = chevron.className.replace('chevron-up', 'chevron-down');
    }
  }
}

// Menu configuration
const menuConfig = {
  sections: [
    {
      title: 'General',
      items: [
        {
          label: 'Dashboard',
          icon: 'home',
          children: [
            { label: 'Dashboard 1', url: 'index.html' },
            { label: 'Dashboard 2', url: 'index2.html' },
            { label: 'Dashboard 3', url: 'index3.html' }
          ]
        },
        {
          label: 'Analytics',
          icon: 'bar-chart-o',
          url: 'analytics.html'
        }
      ]
    },
    {
      title: 'Forms',
      items: [
        {
          label: 'Form Elements',
          icon: 'edit',
          url: 'form.html'
        },
        {
          label: 'Form Validation',
          icon: 'check-square-o',
          url: 'form_validation.html'
        }
      ]
    }
  ]
};

// Initialize menu
new MenuBuilder(menuConfig);
```

### Header Customization

#### Custom Navigation Bar

```scss
// src/scss/components/_navbar.scss
.nav_menu {
  background: #ffffff;
  border-bottom: 1px solid #E6E9ED;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  .navbar-nav {
    align-items: center;
    
    .nav-item {
      margin: 0 5px;
      
      .nav-link {
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(115, 135, 156, 0.1);
          color: $primary;
        }
      }
      
      // User dropdown
      &.dropdown {
        .dropdown-menu {
          border: none;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          border-radius: 8px;
          margin-top: 8px;
          
          .dropdown-item {
            padding: 12px 20px;
            
            &:hover {
              background: rgba(115, 135, 156, 0.1);
            }
          }
        }
      }
    }
  }
  
  // Breadcrumb
  .breadcrumb {
    background: transparent;
    margin: 0;
    padding: 0;
    
    .breadcrumb-item {
      color: #566573;
      
      &.active {
        color: $primary;
        font-weight: 500;
      }
      
      a {
        color: #566573;
        text-decoration: none;
        
        &:hover {
          color: $primary;
        }
      }
    }
  }
}
```

#### Search Functionality

```javascript
// src/js/search.js
class GlobalSearch {
  constructor() {
    this.searchInput = document.getElementById('global-search');
    this.searchResults = document.getElementById('search-results');
    this.searchData = [];
    
    this.init();
  }
  
  async init() {
    if (!this.searchInput) return;
    
    // Load search data
    await this.loadSearchData();
    
    // Add event listeners
    this.searchInput.addEventListener('input', 
      this.debounce(this.handleSearch.bind(this), 300));
    
    this.searchInput.addEventListener('focus', this.showResults.bind(this));
    document.addEventListener('click', this.hideResults.bind(this));
  }
  
  async loadSearchData() {
    // Load searchable content
    this.searchData = [
      { title: 'Dashboard', url: 'index.html', category: 'Page' },
      { title: 'Form Elements', url: 'form.html', category: 'Page' },
      { title: 'Tables', url: 'tables.html', category: 'Page' },
      { title: 'Charts', url: 'chartjs.html', category: 'Page' },
      // Add more searchable items
    ];
  }
  
  handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      this.hideResults();
      return;
    }
    
    const results = this.searchData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    ).slice(0, 10);
    
    this.displayResults(results, query);
  }
  
  displayResults(results, query) {
    if (!this.searchResults) return;
    
    this.searchResults.innerHTML = '';
    
    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'search-no-results';
      noResults.textContent = 'No results found';
      this.searchResults.appendChild(noResults);
    } else {
      results.forEach(result => {
        const item = this.createResultItem(result, query);
        this.searchResults.appendChild(item);
      });
    }
    
    this.showResults();
  }
  
  createResultItem(result, query) {
    const item = document.createElement('a');
    item.className = 'search-result-item';
    item.href = result.url;
    
    const title = document.createElement('div');
    title.className = 'search-result-title';
    title.innerHTML = this.highlightQuery(result.title, query);
    
    const category = document.createElement('div');
    category.className = 'search-result-category';
    category.textContent = result.category;
    
    item.appendChild(title);
    item.appendChild(category);
    
    return item;
  }
  
  highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  showResults() {
    if (this.searchResults) {
      this.searchResults.style.display = 'block';
    }
  }
  
  hideResults(event) {
    if (event && this.searchInput.contains(event.target)) return;
    
    if (this.searchResults) {
      this.searchResults.style.display = 'none';
    }
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize search
new GlobalSearch();
```

---

## Component Customization

### Custom Dashboard Widgets

#### Widget Factory

```javascript
// src/js/widgets/widget-factory.js
class WidgetFactory {
  static createWidget(type, config) {
    switch (type) {
      case 'stat':
        return new StatWidget(config);
      case 'chart':
        return new ChartWidget(config);
      case 'list':
        return new ListWidget(config);
      case 'progress':
        return new ProgressWidget(config);
      default:
        throw new Error(`Unknown widget type: ${type}`);
    }
  }
}

class BaseWidget {
  constructor(config) {
    this.config = config;
    this.container = null;
  }
  
  render(container) {
    this.container = container;
    this.container.innerHTML = this.template();
    this.afterRender();
  }
  
  template() {
    return '<div>Base Widget</div>';
  }
  
  afterRender() {
    // Override in subclasses
  }
  
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

class StatWidget extends BaseWidget {
  template() {
    return `
      <div class="x_panel tile fixed_height_320">
        <div class="x_title">
          <h2>${this.config.title}</h2>
        </div>
        <div class="x_content">
          <div class="widget-stat">
            <div class="stat-icon">
              <i class="fa fa-${this.config.icon}"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">${this.config.value}</div>
              <div class="stat-label">${this.config.label}</div>
              ${this.config.change ? `
                <div class="stat-change ${this.config.change > 0 ? 'positive' : 'negative'}">
                  <i class="fa fa-${this.config.change > 0 ? 'arrow-up' : 'arrow-down'}"></i>
                  ${Math.abs(this.config.change)}%
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

class ChartWidget extends BaseWidget {
  template() {
    return `
      <div class="x_panel">
        <div class="x_title">
          <h2>${this.config.title}</h2>
        </div>
        <div class="x_content">
          <canvas id="chart-${this.config.id}" width="400" height="200"></canvas>
        </div>
      </div>
    `;
  }
  
  afterRender() {
    this.initChart();
  }
  
  async initChart() {
    const { Chart } = await import('chart.js/auto');
    const ctx = document.getElementById(`chart-${this.config.id}`);
    
    new Chart(ctx, {
      type: this.config.chartType || 'line',
      data: this.config.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        ...this.config.options
      }
    });
  }
}
```

#### Widget Configuration

```javascript
// src/js/dashboard-config.js
const dashboardConfig = {
  widgets: [
    {
      id: 'users-stat',
      type: 'stat',
      grid: { x: 0, y: 0, w: 3, h: 1 },
      config: {
        title: 'Total Users',
        value: '2,564',
        label: 'Active Users',
        icon: 'users',
        change: 12.5
      }
    },
    {
      id: 'revenue-stat',
      type: 'stat',
      grid: { x: 3, y: 0, w: 3, h: 1 },
      config: {
        title: 'Revenue',
        value: '$52,147',
        label: 'This Month',
        icon: 'dollar',
        change: -3.2
      }
    },
    {
      id: 'sales-chart',
      type: 'chart',
      grid: { x: 0, y: 1, w: 6, h: 2 },
      config: {
        title: 'Sales Overview',
        chartType: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#73879C',
            backgroundColor: 'rgba(115, 135, 156, 0.1)'
          }]
        }
      }
    }
  ]
};

// Initialize dashboard
class Dashboard {
  constructor(config) {
    this.config = config;
    this.widgets = new Map();
    this.container = document.getElementById('dashboard-container');
  }
  
  init() {
    this.createGrid();
    this.renderWidgets();
  }
  
  createGrid() {
    this.container.className = 'dashboard-grid';
  }
  
  renderWidgets() {
    this.config.widgets.forEach(widgetConfig => {
      const widget = WidgetFactory.createWidget(
        widgetConfig.type, 
        widgetConfig.config
      );
      
      const widgetContainer = this.createWidgetContainer(widgetConfig);
      widget.render(widgetContainer);
      
      this.widgets.set(widgetConfig.id, widget);
    });
  }
  
  createWidgetContainer(config) {
    const container = document.createElement('div');
    container.className = 'dashboard-widget';
    container.style.gridColumn = `${config.grid.x + 1} / ${config.grid.x + config.grid.w + 1}`;
    container.style.gridRow = `${config.grid.y + 1} / ${config.grid.y + config.grid.h + 1}`;
    
    this.container.appendChild(container);
    return container;
  }
}

// Initialize dashboard
new Dashboard(dashboardConfig).init();
```

### Form Builder

#### Dynamic Form Generator

```javascript
// src/js/forms/form-builder.js
class FormBuilder {
  constructor(container, schema) {
    this.container = container;
    this.schema = schema;
    this.fields = new Map();
  }
  
  build() {
    const form = document.createElement('form');
    form.className = 'dynamic-form';
    form.setAttribute('data-validate', 'true');
    
    this.schema.fields.forEach(fieldConfig => {
      const field = this.createField(fieldConfig);
      form.appendChild(field);
    });
    
    // Add submit button
    if (this.schema.submit) {
      const submitBtn = this.createSubmitButton(this.schema.submit);
      form.appendChild(submitBtn);
    }
    
    this.container.appendChild(form);
    this.initializeValidation();
    
    return form;
  }
  
  createField(config) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-group row mb-3';
    
    // Create label
    if (config.label) {
      const label = document.createElement('label');
      label.className = 'col-form-label col-md-3 col-sm-3';
      label.textContent = config.label;
      label.setAttribute('for', config.name);
      fieldContainer.appendChild(label);
    }
    
    // Create field wrapper
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'col-md-6 col-sm-6';
    
    // Create field based on type
    const field = this.createFieldByType(config);
    fieldWrapper.appendChild(field);
    
    // Add help text
    if (config.help) {
      const helpText = document.createElement('small');
      helpText.className = 'form-text text-muted';
      helpText.textContent = config.help;
      fieldWrapper.appendChild(helpText);
    }
    
    fieldContainer.appendChild(fieldWrapper);
    this.fields.set(config.name, field);
    
    return fieldContainer;
  }
  
  createFieldByType(config) {
    switch (config.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return this.createInput(config);
      case 'textarea':
        return this.createTextarea(config);
      case 'select':
        return this.createSelect(config);
      case 'checkbox':
        return this.createCheckbox(config);
      case 'radio':
        return this.createRadioGroup(config);
      case 'file':
        return this.createFileInput(config);
      case 'date':
        return this.createDateInput(config);
      default:
        return this.createInput(config);
    }
  }
  
  createInput(config) {
    const input = document.createElement('input');
    input.type = config.type || 'text';
    input.name = config.name;
    input.id = config.name;
    input.className = 'form-control';
    
    if (config.placeholder) input.placeholder = config.placeholder;
    if (config.value) input.value = config.value;
    if (config.required) input.required = true;
    if (config.pattern) input.pattern = config.pattern;
    if (config.min) input.min = config.min;
    if (config.max) input.max = config.max;
    
    return input;
  }
  
  createSelect(config) {
    const select = document.createElement('select');
    select.name = config.name;
    select.id = config.name;
    select.className = 'form-control';
    
    if (config.multiple) {
      select.multiple = true;
      select.className += ' select2';
    }
    
    if (config.placeholder) {
      const placeholderOption = document.createElement('option');
      placeholderOption.value = '';
      placeholderOption.textContent = config.placeholder;
      placeholderOption.disabled = true;
      placeholderOption.selected = true;
      select.appendChild(placeholderOption);
    }
    
    if (config.options) {
      config.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.selected) optionElement.selected = true;
        select.appendChild(optionElement);
      });
    }
    
    return select;
  }
  
  createTextarea(config) {
    const textarea = document.createElement('textarea');
    textarea.name = config.name;
    textarea.id = config.name;
    textarea.className = 'form-control';
    textarea.rows = config.rows || 4;
    
    if (config.placeholder) textarea.placeholder = config.placeholder;
    if (config.value) textarea.value = config.value;
    if (config.required) textarea.required = true;
    
    return textarea;
  }
  
  getData() {
    const data = {};
    this.fields.forEach((field, name) => {
      if (field.type === 'checkbox') {
        data[name] = field.checked;
      } else if (field.type === 'radio') {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        data[name] = checked ? checked.value : null;
      } else {
        data[name] = field.value;
      }
    });
    return data;
  }
  
  setData(data) {
    Object.entries(data).forEach(([name, value]) => {
      const field = this.fields.get(name);
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = value;
        } else {
          field.value = value;
        }
      }
    });
  }
  
  initializeValidation() {
    // Initialize form validation if Parsley is available
    if (window.Parsley) {
      const form = this.container.querySelector('form');
      $(form).parsley();
    }
  }
}

// Form schema example
const userFormSchema = {
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter email',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'Select role',
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' },
        { value: 'moderator', label: 'Moderator' }
      ],
      required: true
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Biography',
      placeholder: 'Tell us about yourself',
      rows: 4
    }
  ],
  submit: {
    text: 'Create User',
    className: 'btn btn-primary'
  }
};

// Usage
const formContainer = document.getElementById('form-container');
const formBuilder = new FormBuilder(formContainer, userFormSchema);
const form = formBuilder.build();
```

---

## Advanced Customization

### Plugin System

#### Plugin Architecture

```javascript
// src/js/core/plugin-system.js
class PluginSystem {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }
  
  registerPlugin(name, plugin) {
    if (this.plugins.has(name)) {
      console.warn(`Plugin ${name} already registered`);
      return;
    }
    
    // Initialize plugin
    if (typeof plugin.init === 'function') {
      plugin.init(this);
    }
    
    this.plugins.set(name, plugin);
    console.log(`Plugin ${name} registered successfully`);
  }
  
  getPlugin(name) {
    return this.plugins.get(name);
  }
  
  addHook(hookName, callback, priority = 10) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    
    this.hooks.get(hookName).push({ callback, priority });
    
    // Sort by priority
    this.hooks.get(hookName).sort((a, b) => a.priority - b.priority);
  }
  
  async executeHook(hookName, data = {}) {
    if (!this.hooks.has(hookName)) {
      return data;
    }
    
    const hooks = this.hooks.get(hookName);
    let result = data;
    
    for (const hook of hooks) {
      try {
        const hookResult = await hook.callback(result);
        if (hookResult !== undefined) {
          result = hookResult;
        }
      } catch (error) {
        console.error(`Error in hook ${hookName}:`, error);
      }
    }
    
    return result;
  }
  
  removeHook(hookName, callback) {
    if (!this.hooks.has(hookName)) return;
    
    const hooks = this.hooks.get(hookName);
    const index = hooks.findIndex(hook => hook.callback === callback);
    
    if (index > -1) {
      hooks.splice(index, 1);
    }
  }
}

// Global plugin system instance
window.GentelellaPlugins = new PluginSystem();
```

#### Example Plugin

```javascript
// src/js/plugins/notification-plugin.js
const NotificationPlugin = {
  name: 'notifications',
  
  init(pluginSystem) {
    this.pluginSystem = pluginSystem;
    this.notifications = [];
    this.container = null;
    
    this.createContainer();
    this.bindHooks();
  },
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  },
  
  bindHooks() {
    // Hook into form submissions
    this.pluginSystem.addHook('form.submit.success', (data) => {
      this.show('Form submitted successfully!', 'success');
      return data;
    });
    
    this.pluginSystem.addHook('form.submit.error', (data) => {
      this.show('Error submitting form', 'error');
      return data;
    });
  },
  
  show(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fa fa-${this.getIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.remove(notification));
    
    // Auto remove after duration
    setTimeout(() => this.remove(notification), duration);
    
    this.container.appendChild(notification);
    this.notifications.push(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('notification-show');
    });
  },
  
  remove(notification) {
    notification.classList.add('notification-hide');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 300);
  },
  
  getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || icons.info;
  }
};

// Register plugin
window.GentelellaPlugins.registerPlugin('notifications', NotificationPlugin);
```

---

## Next Steps

- **[API Integration]({{ site.baseurl }}/docs/api-integration/)** - Connect with backend APIs
- **[Security Guide]({{ site.baseurl }}/docs/security/)** - Implement security best practices
- **[Testing Guide]({{ site.baseurl }}/docs/testing/)** - Test your customizations

---

{: .highlight }
💡 **Pro Tip**: Start with small customizations and gradually build complexity. Always test your changes across different screen sizes and browsers to ensure compatibility. 