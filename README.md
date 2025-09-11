# Gentelella Admin Template

**Modern Bootstrap 5 Admin Dashboard Template with Vite Build System**

Gentelella is a powerful, free-to-use Bootstrap 5 admin template that has been completely modernized with Vite, performance optimizations, and the latest web technologies. This template provides a comprehensive foundation for building admin panels, dashboards, and back-end applications.

![Gentelella Bootstrap Admin Template](https://colorlib.com/wp/wp-content/uploads/sites/2/gentelella-admin-template-preview.jpg "Gentelella Theme Browser Preview")

## What's New in v2.1.1 (Latest Release - September 11, 2025)

- **Latest Dependencies** - All dependencies updated to latest versions for security and performance
- **ECharts 6.0.0** - Major upgrade to latest ECharts with all chart types working
- **Enhanced Widget System** - Improved widget content density and professional styling
- **Dev Server Stability** - Fixed development server crashes with auto-restart capability
- **Console Log Cleanup** - Production builds now clean with comprehensive console statement removal
- **Security Updates** - Ruby 3.3.9 and Nokogiri 1.18.9 resolve all CVE vulnerabilities
- **Chart Functionality Fixes** - Fixed visitors map, skycons weather icons, and device usage chart colors
- **Production Optimization** - Enhanced Terser configuration with better minification

### Previous Release: v2.1.0

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
- **Icons** - Font Awesome 6
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
- **Font Awesome 6** - Icon library

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
