# Gentelella Changelog

## 2.0.0 - 20.06.2025 🎉

**Major Stable Release - Bootstrap 5 with Modern Build System**

### 🚀 New Features
- **Vite Build System**: Lightning-fast development with hot-reload and optimized production builds
- **Bootstrap 5.3.7**: Complete migration to latest Bootstrap with modern design system
- **Smart Code Splitting**: 90% smaller initial bundle (79KB vs 779KB) with conditional module loading
- **Modern JavaScript**: ES6+ modules with dynamic imports and tree shaking
- **Performance Optimized**: 40-70% faster page loads with intelligent caching

### 🔧 Major Improvements
- **Morris.js Complete Removal**: Replaced with modern Chart.js implementation
  - Renamed `morisjs.html` → `chart3.html` with updated navigation
  - Removed all Morris.js CSS and JavaScript code
  - Updated 35+ HTML files with new Chart.js references
- **jQuery Easing Fixes**: Resolved all `TypeError: jQuery.easing[this.easing] is not a function` errors
  - Added jQuery UI easing effects with fallback functions
  - Fixed EasyPieChart and progress bar animations
- **Enhanced Navigation**: Consistent search bar implementation across all pages
- **Error Page Redesign**: Modern 403, 404, 500 pages with consistent branding

### 🎨 UI/UX Enhancements
- **Responsive Design**: Mobile-first approach with optimized touch interfaces
- **Login Page**: Complete redesign with modern card layout and form validation
- **Pricing Tables**: Pure Bootstrap 5 implementation with interactive features
- **Fixed Sidebar/Footer**: Proper Bootstrap 5 compatibility and positioning

### 🛠️ Technical Updates
- **Dependencies**: Updated all packages to latest stable versions
- **SASS Structure**: Organized and optimized stylesheet architecture
- **TypeScript Ready**: Full TypeScript support available
- **Cross-Browser**: Tested compatibility with modern browsers

### 📦 Bundle Optimization
- **Core Bundle**: 79KB essential libraries
- **Chart Module**: 219KB (loads only on chart pages)
- **Form Module**: 200KB (loads only on form pages)
- **Table Module**: DataTables functionality on demand
- **Dashboard Module**: Dashboard-specific widgets

### 🐛 Bug Fixes
- Fixed all reported Bootstrap 4 to 5 migration issues
- Resolved SASS deprecation warnings
- Fixed dropdown functionality across all pages
- Corrected responsive behavior on mobile devices
- Eliminated JavaScript console errors

### 💻 Developer Experience
- Hot-reload development server
- Optimized build process with cache-busting
- Smart asset optimization
- Improved documentation and examples

### Note

Earlier there were no changelog at all and we have introduced one now and we will start from version 1.0.0. However, keep in mind that this is far from being first version as there have been dozens of commits.

### 1.0.0 - 25.03.2016

* Fixed dataTables
* Added new dataTable variations

### 1.1.0 - 26.04.2016

* Add multilevel menu
* Mobile comptibility enhancement

### 1.2.0 - 19.05.2016

* Fix menu not become active if url contains parameters
* Fix form upload form not adjust on large number of files
* Remove invalid css
* Add compose message functionalities
* Add fixed sidebar functionalities

### 1.3.0 - 01.06.2016

* Fix menu not become active if url contains parameters
* Fix form upload form not adjust on large number of files
* Remove invalid css
* Add compose message functionalities
* Add fixed footer functionalities

### Gentelella 2.0-beta1

* Updated Bootstrap to 4.3.1
* Updated all dependencies
* Fixed all reported bugs

This version is tested but we would recommend not to use it in production right away. Please install it for testing purposes and report back if there are any problems to be fixed.
