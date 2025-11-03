# Gentelella Changelog

## 2.1.1 - 11.09.2025

**Maintenance Release - Dependency Updates, Chart Fixes & UI Improvements**

### Dependency Updates
- **Latest Dependencies**: All dependencies updated to latest versions for security and performance
  - Vite 7.1.4 → 7.1.5
  - Bootstrap 5.3.6 → 5.3.8
  - ECharts 5.6.0 → 6.0.0 (major version upgrade)
  - Chart.js 4.4.2 → 4.5.0
  - jQuery 3.6.1 → 3.7.1
  - TypeScript 5.8.3 → 5.9.2
  - ESLint 9.34.0 → 9.35.0
  - SASS 1.92.0 → 1.92.1
  - DataTables 2.3.3 → 2.3.4 with all related packages
  - Font Awesome 7.0.0 → 7.0.1
- **Security Updates**: Ruby 3.3.9 and Nokogiri 1.18.9 resolve all CVE vulnerabilities

### Chart & Widget Improvements
- **ECharts Functionality**: Fixed all missing charts on echarts.html page
  - Added missing pyramid sales funnel chart with improved readability
  - Fixed world map visualization
  - Enhanced chart sizing and positioning
- **Widget System Enhancement**: Improved content density in widgets.html
  - Enhanced metric cards with additional context information
  - Added growth indicators and supplementary metrics
  - Professional styling with hover effects and better typography
- **Chart Color Consistency**: Fixed Device Usage chart colors to match label indicators
- **Interactive Maps**: Fixed visitors location map and skycons weather icons on index.html

### UI/UX Improvements
- **Sidebar Profile Enhancement**: Improved sidebar name section for better scalability
  - Reduced font size from default h4 to 14px for optimal space utilization
  - Added proper typography with font-weight 400 and line-height 1.2
  - Enhanced profile_info container with flexbox layout for better vertical centering
  - Added word-wrapping and break-word support for long names
  - Limited to 2.4em max-height to prevent sidebar expansion while allowing up to 2 lines
  - Gracefully handles both short names and longer names without breaking layout

### Developer Experience
- **Dev Server Stability**: Fixed development server crashes with auto-restart capability
  - Enhanced Vite configuration for better stability
  - Added dev:watch script for automatic server restart
  - Improved file watching and HMR reliability
- **Console Log Cleanup**: Production builds now clean with comprehensive console statement removal
  - Enhanced Terser configuration for complete console removal
  - Development-only console logging with environment checks
- **Build Optimization**: Enhanced production build configuration
  - Better chunk splitting and manual chunks optimization
  - Improved Terser settings with additional compression options

### Technical Enhancements
- **ES Module Support**: Added "type": "module" to package.json for modern JavaScript
- **Code Quality**: Enhanced ESLint and Prettier configurations
- **Bundle Analysis**: Improved build analysis tools and documentation

## 2.1.0 - 28.07.2025

**Enhancement Release - jQuery-Free Core System & Brand Refresh**

### New Features
- **jQuery-Free Core System**: Complete main-core.js modernization with vanilla JavaScript
  - Dynamic module loading with caching and performance monitoring  
  - Loading states and visual indicators for better UX
  - Enhanced error handling and development debugging tools
- **Brand-Consistent Favicon Suite**: Modern favicon system with complete browser support
  - SVG-first approach for sharp display across all devices
  - Apple Touch Icon, Android Chrome icons, and PWA manifest
  - Modern standard implementation with proper fallbacks

### UI/UX Improvements  
- **Top Navigation Alignment**: Perfect vertical centering of user profile and notification elements
- **Modern DOM Utilities**: Comprehensive jQuery-free DOM manipulation library
  - Slide animations, fade effects, and smooth transitions
  - Event handling and element manipulation without jQuery dependency
- **Enhanced Visual Consistency**: Improved spacing and alignment throughout interface

### Technical Enhancements
- **Console Log Cleanup**: Production-ready code with clean, professional output
  - Development-only logging wrapped in environment checks
  - Removed verbose initialization messages and debug output
- **Code Quality**: Streamlined codebase with reduced development artifacts
- **Performance Optimizations**: Further improvements to module loading system

### Bug Fixes
- Fixed loadModule reference errors when using main-minimal.js
- Resolved favicon display issues in legacy browsers  
- Corrected navigation element positioning and alignment
- Eliminated development console noise in production builds

### File Structure
- Added centralized DOM utilities (`src/utils/dom-modern.js`)
- Updated favicon implementation with proper size variants
- Cleaned development files and reduced repository size

### Developer Experience
- Improved error boundaries and debugging capabilities
- Enhanced module performance monitoring and statistics
- Better development vs production environment handling

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
