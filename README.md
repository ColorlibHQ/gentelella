# Gentelella Admin Template

**Modern Bootstrap 5 Admin Dashboard Template with Vite Build System**

Gentelella is a powerful, free-to-use Bootstrap 5 admin template that has been completely modernized with Vite, performance optimizations, and the latest web technologies. This template provides a comprehensive foundation for building admin panels, dashboards, and back-end applications.

[![Gentelella Bootstrap Admin Template](https://colorlib.com/wp/wp-content/uploads/sites/2/gentelella-admin-template-preview.jpg "Gentelella Theme Browser Preview")](https://colorlib.com/polygon/gentelella/index.html)

**[View Live Demo](https://colorlib.com/polygon/gentelella/index.html)**

## What's New in v2.1.4 (Latest Release - January 13, 2026)

- **Go Pro Sidebar Link** - Premium templates promotion with UTM tracking
- **Sidebar Badge System** - Colorful Pro, Hot, New, and Updated badges
- **Avatar Redesign** - Colorful circular backgrounds with white icons
- **Progress Bar Fixes** - Fixed invisible progress bars across dashboards
- **Uppy File Upload** - Replaced Dropzone.js with modern Uppy uploader
- **Cross-Page Consistency** - Unified sidebar menu across all 33 template pages

### Previous Release: v2.1.3

- **Bootstrap Icons Integration** - Added Bootstrap Icons for modern, minimalist sidebar navigation
- **Header Navigation Rebuilt** - Proper Bootstrap 5 flexbox utilities for top navigation layout
- **Sidebar UI Improvements** - Centered collapsed logo, right-aligned chevron arrows
- **Code Quality & Cleanup** - Removed legacy jQuery files, standardized naming conventions
- **126 Unit Tests** - Comprehensive test coverage with Vitest framework
- **CSS Variables System** - New custom properties for easier theming

### Previous Release: v2.1.2

- **Comprehensive Dependency Updates** - All dependencies updated to their latest versions
- **Vite 7.3.1** - Latest build system with performance improvements
- **ESLint 9.39.2** - Updated linting with comprehensive browser globals configuration
- **Font Awesome 7.1.0** - Latest icon library

### Previous Release: v2.1.1

- **jQuery-Free Core System** - Complete main-core.js modernization with vanilla JavaScript
- **Brand-Consistent Favicon Suite** - Modern favicon system with comprehensive browser support
- **Perfect UI Alignment** - Precision vertical centering for navigation elements
- **Production-Ready Code** - Clean console output with professional debugging
- **Enhanced Mobile Experience** - Improved touch interactions and responsive behavior
- **Modern DOM Utilities** - Comprehensive jQuery-free DOM manipulation library

### Previous Major Release: v2.0.0

- **🚀 Vite Build System** - Lightning-fast development and optimized production builds
- **📦 Bootstrap 5.3.7** - Latest Bootstrap with modern design system  
- **⚡ Performance Optimized** - 90% smaller initial bundle size with smart code splitting
- **🔧 Modern JavaScript** - ES6+ modules with dynamic imports
- **🎯 TypeScript Ready** - Full TypeScript support available
- **📱 Mobile First** - Responsive design optimized for all devices
- **🎨 Morris.js Eliminated** - Complete replacement with modern Chart.js

## 📊 Performance Improvements

- **Before**: 779 KB monolithic JavaScript bundle
- **After**: 79 KB initial load + smart chunk loading
- **Result**: **90% smaller initial bundle** with **40-70% faster page loads**

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/puikinsh/gentelella.git
cd gentelella

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
# Development with hot reload
npm run dev

# Production build with optimizations
npm run build

# Preview production build locally
npm run preview
```

## 🏗️ Project Structure

```
gentelella/
├── production/           # HTML templates and static assets
│   ├── *.html           # 42 pre-built admin pages
│   └── images/          # Image assets
├── src/                 # Source files
│   ├── main-core.js     # Core essentials (79 KB, jQuery-free)
│   ├── main.scss        # Styles entry point
│   ├── js/              # Custom JavaScript (modernized)
│   ├── scss/            # Custom SASS files
│   ├── utils/           # Modern utility libraries
│   │   └── dom-modern.js # jQuery-free DOM manipulation
│   └── modules/         # Feature-specific modules
│       ├── charts.js    # Chart functionality (219 KB)
│       ├── forms.js     # Form enhancements (200 KB)
│       ├── tables.js    # DataTables functionality
│       └── dashboard.js # Dashboard widgets
├── dist/                # Production build output
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🎯 Smart Loading System

The template uses intelligent code splitting with modern JavaScript:

- **Core Bundle** (79 KB): Essential libraries with jQuery-free DOM utilities
- **Chart Module** (219 KB): Only loads on pages with charts
- **Form Module** (200 KB): Only loads on pages with advanced forms  
- **Table Module**: Only loads on pages with DataTables
- **Dashboard Module**: Only loads dashboard-specific widgets

## ⚡ Modern JavaScript Architecture

### jQuery-Free Core System
- **Vanilla JavaScript**: All core functionality uses modern DOM APIs
- **Dynamic Loading**: Intelligent module loading with caching and performance monitoring
- **Error Boundaries**: Robust error handling with development debugging tools
- **Loading States**: Visual indicators for better user experience

### DOM Utilities Library
- **Complete jQuery Replacement**: Full-featured DOM manipulation without dependencies
- **Animation Support**: Slide, fade, and custom animations using CSS transitions
- **Event Management**: Modern event handling with custom event support
- **Responsive Utilities**: Mobile-first responsive behavior management

## 📱 Responsive Design

Built with mobile-first approach:
- **Phones**: Optimized touch interfaces
- **Tablets**: Adaptive layouts
- **Desktops**: Full-featured experience
- **Large Screens**: Enhanced productivity layouts

## 🛠️ Customization

### Adding New Pages

1. Create HTML file in `production/` directory
2. Add entry to `vite.config.js` input configuration
3. Reference appropriate modules for functionality needed

### Custom Styling

```scss
// src/scss/custom.scss
.my-custom-component {
  // Your custom styles
}
```

### Color Schemes (2026 Modern Collection)

Gentelella includes 10 professionally designed color schemes that users can switch between at runtime. Each theme is carefully crafted for accessibility and modern aesthetics.

#### Available Themes

| Theme         | Primary Color       | Description            | Best For                   |
| ------------- | ------------------- | ---------------------- | -------------------------- |
| **Default**   | Emerald `#10b981`   | Modern emerald green   | General purpose            |
| **Ocean**     | Sky `#0ea5e9`       | Deep blue professional | Corporate, enterprise      |
| **Sunset**    | Orange `#f97316`    | Warm coral/orange      | Creative, marketing        |
| **Lavender**  | Violet `#8b5cf6`    | Soft purple/violet     | Design tools, SaaS         |
| **Forest**    | Green `#22c55e`     | Natural green tones    | Health, environmental      |
| **Midnight**  | Cyan `#22d3ee`      | Dark mode optimized    | Developer tools, night use |
| **Rose**      | Pink `#ec4899`      | Modern pink/magenta    | Fashion, lifestyle         |
| **Slate**     | Slate `#64748b`     | Neutral monochrome     | Content-focused apps       |
| **Indigo**    | Indigo `#6366f1`    | Classic tech blue      | Tech, productivity         |
| **Teal**      | Teal `#14b8a6`      | Calming teal           | Healthcare, wellness       |

#### Usage

##### HTML Attribute (Recommended)

```html
<html data-theme="ocean">
```

##### CSS Class

```html
<body class="theme-ocean">
```

##### JavaScript Theme Switcher

```javascript
// Set theme
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
}

// Initialize
loadTheme();

// Switch to ocean theme
setTheme('ocean');
```

##### Theme Selector Dropdown Example

```html
<select onchange="setTheme(this.value)">
  <option value="">Default (Emerald)</option>
  <option value="ocean">Ocean</option>
  <option value="sunset">Sunset</option>
  <option value="lavender">Lavender</option>
  <option value="forest">Forest</option>
  <option value="midnight">Midnight (Dark)</option>
  <option value="rose">Rose</option>
  <option value="slate">Slate</option>
  <option value="indigo">Indigo</option>
  <option value="teal">Teal</option>
</select>
```

### Adding Features

```javascript
// Load modules conditionally
if (document.querySelector('.chart-container')) {
  const charts = await loadModule('charts');
}
```

### Modern Favicon System

The template includes a comprehensive favicon suite optimized for 2025 standards:

- **SVG-first approach** - Sharp display across all devices and screen densities
- **Apple Touch Icon** - Optimized for iOS devices and web apps
- **Android Chrome Icons** - PWA-ready with multiple sizes (192x192, 512x512)
- **Legacy ICO support** - Fallback for older browsers
- **Web App Manifest** - Complete PWA integration with theme colors

## 📦 Available Components

### Dashboard Features
- **Multiple Dashboard Layouts** - 3 different dashboard designs
- **Widgets** - Various dashboard widgets and cards
- **Charts** - Chart.js, ECharts, Sparklines integration
- **Maps** - Interactive world maps with jVectorMap

### Form Components
- **Advanced Forms** - Multi-step wizards, validation
- **Form Elements** - Rich text editors, date pickers
- **File Upload** - Drag & drop file upload with progress
- **Input Enhancements** - Autocomplete, tags, switches

### UI Elements
- **Tables** - DataTables with sorting, filtering, pagination
- **Typography** - Comprehensive typography system
- **Icons** - Font Awesome 7 + Bootstrap Icons
- **Media Gallery** - Image gallery with lightbox
- **Calendar** - Full-featured calendar component

### Additional Pages
- **E-commerce** - Product listings, shopping cart
- **User Management** - Profiles, contacts, projects
- **Authentication** - Login, registration pages
- **Error Pages** - 403, 404, 500 error pages

## 🎨 Built With

### Core Technologies
- **🚀 Vite 7.0.6** - Ultra-fast ES module build system with 90% smaller bundle size
- **📦 Bootstrap 5.3.6** - Latest Bootstrap with modern design system
- **🎨 SASS Modules** - Modern CSS architecture with custom theme variables
- **⚡ Vanilla JavaScript** - Modern DOM APIs with jQuery-free core system
- **🔧 Modern DOM Utilities** - Custom library for jQuery-free DOM manipulation

### Charts & Visualization
- **Chart.js 4.4.2** - Modern charting library (Morris.js completely removed)
- **ECharts 5.6.0** - Professional data visualization
- **Sparklines** - Mini charts and graphs
- **jVectorMap** - Interactive world maps

### Form & UI Libraries
- **Select2** - Enhanced select dropdowns
- **Tempus Dominus** - Bootstrap 5 date/time picker
- **Ion Range Slider** - Range slider component
- **Switchery** - iOS-style toggle switches
- **DataTables** - Advanced table functionality

### Utilities
- **Day.js** - Lightweight date library
- **NProgress** - Progress bars for page loading
- **Autosize** - Auto-resizing textareas
- **Font Awesome 7 + Bootstrap Icons** - Icon libraries

## 🔧 Configuration

### Vite Configuration

The template includes optimized Vite configuration with:
- Smart code splitting for optimal loading
- Asset optimization with cache-busting
- Development server with hot reload
- Production builds with compression

### Performance Features

- **Tree Shaking** - Removes unused code
- **Code Splitting** - Loads only what's needed
- **Caching Strategy** - Optimized for browser caching

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Various Platforms

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use the built-in GitHub Actions
- **Traditional Hosting**: Upload `dist` folder contents

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
git clone https://github.com/your-username/gentelella.git
cd gentelella
npm install
npm run dev
```

## 📚 Documentation & Demo

- **[Live Demo](https://colorlib.com/polygon/gentelella/index.html)** - See the template in action
- **[Component Documentation](https://colorlibhq.github.io/gentelella/)** - Detailed component guide
- **[Performance Guide](PERFORMANCE_OPTIMIZATIONS.md)** - Optimization details
- **[Componentization Plan](COMPONENTIZATION_GAMEPLAN.md)** - Future modularization

## 💼 Showcase Your Work

We would love to see how you use this awesome admin template. You can notify us about your site, app or service by tweeting to [@colorlib](https://twitter.com/colorlib). Once the list grows long enough we will write a post similar to [this showcase](https://colorlib.com/wp/avada-theme-examples/) to feature the best examples.

## 📦 Installation via Package Managers

```bash
# npm
npm install gentelella --save

# yarn  
yarn add gentelella

# bower (legacy)
bower install gentelella --save
```

## 🌍 Community Integrations

Gentelella has been integrated into various frameworks:

- **[Rails](https://github.com/mwlang/gentelella-rails)** - Ruby on Rails integration
- **[Laravel](https://github.com/Labs64/laravel-boilerplate)** - PHP Laravel boilerplate  
- **[Django](https://github.com/GiriB/django-gentelella)** - Python Django app
- **[Angular](https://github.com/kmkatsma/angular2-webpack-starter-gentelella)** - Angular integration
- **[React](https://github.com/thomaslwq/react-admin)** - React implementation
- **[Symfony](https://github.com/mamless/Gentella-admin-Symfony-6)** - Symfony 6 integration
- **[Yii](https://github.com/yiister/yii2-gentelella)** - Yii framework integration
- **[Flask](https://github.com/afourmy/flask-gentelella)** - Python Flask app
- **[CakePHP](https://github.com/backstageel/cakephp-gentelella-theme)** - CakePHP integration
- **[Aurelia](https://github.com/kmkatsma/aurelia-gentelella)** - Aurelia TypeScript integration
- **[Gentelella RTL](https://github.com/mortezakarimi/gentelella-rtl)** - Right-to-left language support

Let us know if you have done integration for this admin template on other platforms and frameworks and we'll be happy to share your work.

## 🎨 Other Templates and Resources by Colorlib

- **[Free Bootstrap Admin Templates](https://colorlib.com/wp/free-bootstrap-admin-dashboard-templates/)** - Collection of the best free Bootstrap admin dashboard templates
- **[Free Admin Templates](https://colorlib.com/wp/free-html5-admin-dashboard-templates/)** - Comprehensive list of free HTML5 admin dashboard templates  
- **[Angular Templates](https://colorlib.com/wp/angularjs-admin-templates/)** - Popular admin templates based on Angular
- **[WordPress Admin Templates](https://colorlib.com/wp/wordpress-admin-dashboard-themes-plugins/)** - WordPress admin dashboard templates and plugins
- **[WordPress Themes](https://colorlib.com/wp/free-wordpress-themes/)** - Large selection of free WordPress themes
- **[Colorlib Blog](https://colorlib.com/)** - Web design and development resources

## 📄 License

Gentelella is licensed under **The MIT License (MIT)**. You can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software. 

**Attribution Required**: [Colorlib](https://colorlib.com/) must be credited as the original author.

## 👥 Maintainers

- **[Colorlib](https://colorlib.com/)** - Original design and development
- **[Aigars Silkalns](https://github.com/silkalns)** - Lead developer and maintainer

## 🙏 Acknowledgments

- Bootstrap team for the amazing CSS framework
- All contributors who have helped improve this template
- The open-source community for the excellent libraries

---

**Made with ❤️ by [Colorlib](https://colorlib.com/)**
