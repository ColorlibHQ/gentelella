# Gentelella Changelog

## 2.1.4 - 13.01.2026

**UI Polish & Navigation Enhancement Release**

### New Features

- **Go Pro Sidebar Link**: Added prominent "Go Pro" menu item linking to DashboardPack premium templates
  - Positioned at top of sidebar for visibility
  - Includes UTM tracking for analytics
  - Opens in new tab for seamless user experience

- **Sidebar Badge System**: Introduced colorful badges throughout sidebar navigation
  - "Pro" badge (yellow) on Go Pro link
  - "Hot" badge (red) on UI Elements menu
  - "New" badge (green) on Data Presentation menu
  - "Updated" badge (blue) on ECharts and Landing Page items
  - Consistent 52px width across all badges with right alignment

### UI/UX Improvements

- **Avatar/Profile Thumbnails**: Redesigned profile icons in activity feeds
  - Colorful circular backgrounds (aero, green, blue, purple, orange, red)
  - White icons for better contrast and modern look
  - Flexbox centering for perfect alignment

- **Progress Bar Fixes**: Fixed invisible progress bars across dashboard pages
  - Added proper background color to `.progress` container
  - Removed conflicting CSS variable override that was zeroing out widths
  - Consistent 8px height with rounded corners

- **Spacing Consistency**: Removed extra `<br>` tag causing uneven card spacing on index.html

### File Upload Modernization

- **Uppy Integration**: Replaced legacy Dropzone.js with modern Uppy file uploader
  - Drag & drop support with visual feedback
  - Image preview thumbnails
  - Progress indicators for uploads
  - Cleaner, more maintainable codebase

### Cross-Page Consistency

- **Unified Sidebar Menu**: All 33 HTML template pages now share identical sidebar navigation
  - Consistent menu structure and badges across all pages
  - Improved user experience when navigating between pages

### Code Quality

- **Removed Inline CSS**: Cleaned up inline styles, moved to proper SCSS files
- **SCSS Organization**: Consolidated badge and progress bar styles

---

## 2.1.3 - 12.01.2026

**Code Quality, Naming Standardization & UI Modernization Release**

### UI Modernization

- **Bootstrap Icons Integration**: Added Bootstrap Icons as alternative to Font Awesome
  - Installed `bootstrap-icons` package (v1.13.1)
  - Sidebar navigation now uses thinner, more modern Bootstrap Icons
  - Icon mappings: `fa-home` → `bi-house`, `fa-edit` → `bi-pencil-square`, `fa-desktop` → `bi-display`, etc.
  - All 35 HTML files updated with new icon classes

- **Header Navigation Fixes**: Rebuilt top navigation using proper Bootstrap 5 flexbox utilities
  - Uses `d-flex`, `align-items-center`, `justify-content-between`, `ms-auto`, `gap-3` classes
  - Dropdown order corrected: notifications first, then user profile
  - Dropdown menus widened (320px for notifications, 200px for user profile)
  - Proper `dropdown-menu-end` alignment for right-side dropdowns

- **Sidebar Improvements**:
  - Hamburger menu properly positioned for both expanded (230px) and collapsed (70px) sidebar states
  - Logo icon centered in collapsed sidebar mode using flexbox
  - Chevron arrows positioned to right side of menu items with `margin-left: auto`

### Code Cleanup

- **Removed Legacy Files**: Deleted orphaned jQuery-based files no longer in use
  - `src/js/examples.js` - Legacy jQuery popover and Flot chart examples
  - `src/js/form-validation-init.js` - Unused validation demo file
  - `src/main.js` - Legacy full jQuery bundle
  - `src/main-minimal.js` (old) - Legacy jQuery minimal bundle
  - `src/main-form-advanced.js` - Unreferenced form entry point
  - `src/main-form-basic-simple.js` - Orphaned stub file
  - `src/js/require-shim.js` - Legacy CommonJS shim

### Naming Standardization

- **Removed "-modern" suffixes**: Standardized file naming throughout the codebase
  - `dom-modern.js` → `dom.js`
  - `sidebar-modern.js` → `sidebar.js`
  - `init-modern.js` → `init.js`
  - `smartresize-modern.js` → `smartresize.js`
  - `tables-modern.js` → `tables.js`
  - `echarts-modern.js` → `echarts.js`
  - `main-minimal-modern.js` → `main-minimal.js`

### New Features

- **Test Suite**: Added comprehensive unit testing infrastructure
  - Vitest testing framework with JSDOM environment
  - 126 unit tests covering all utility modules
  - Test coverage for security.js, validation.js, dom.js, logger.js
  - New npm scripts: `test`, `test:watch`, `test:coverage`

- **Logger Utility**: Added centralized development-only logging (`src/utils/logger.js`)
  - Wraps console methods with environment checks
  - Automatic suppression in production builds
  - Group logging support for better debugging

- **CSS Variables System**: Added comprehensive CSS custom properties (`src/scss/_variables.scss`)
  - Brand colors, semantic colors, neutral palette
  - Spacing, typography, shadows, transitions
  - Z-index scale and border radius tokens

### Bundle Optimization

- **Removed Unused Dependencies**: Eliminated dead weight from bundle
  - Removed `flot` (4.2 MB package, never imported)
  - Removed `moment` (67 KB, dayjs already used as lightweight alternative)

- **Smart Chunk Splitting**: Optimized vendor chunks for better caching
  - Split Chart.js (203 KB) and ECharts (1,109 KB) into separate chunks
  - Pages using only Chart.js now save ~1 MB vs loading both
  - Added `vendor-calendar` chunk for FullCalendar (256 KB)
  - Extended `vendor-tables-ext` to include all DataTables extensions

- **Production Build Optimization**
  - Disabled CSS source maps in production (saves ~8 MB build size)
  - Enhanced Terser compression with `pure_getters`, `reduce_vars`, `collapse_vars`
  - 3-pass minification for additional size reduction

### SCSS Improvements

- **Fixed Color Inconsistencies**: Resolved `.aero` color class conflict between files
- **Improved Organization**: Added table of contents to custom.scss for navigation

### Bootstrap 5 Consolidation (Migration Phase 1-3)

- **CSS Variables Integration**: Replaced ~90 hardcoded color values with CSS custom properties
  - Primary colors (#1abb9c, #2a3f54, #e74c3c, etc.) now use `var(--gt-*)` references
  - Enables easier theming and dark mode support

- **Reduced !important Declarations**: Cut from 278 to 138 (50% reduction)
  - Sidebar toggle states now use `body.nav-md`/`body.nav-sm` for specificity
  - Typography hierarchy uses body prefix instead of !important
  - Profile and panel sections modernized

- **Bootstrap Collapse Integration**: Panel toolbox now uses Bootstrap 5's Collapse API
  - Collapse/expand functionality leverages native Bootstrap component
  - Automatic icon rotation via collapse events
  - Removed dependency on custom slideUp/slideDown for panels

- **Float to Flexbox Conversion**: Modernized key layout sections
  - `.profile` section uses flexbox instead of float
  - `.x_title` panel header uses flexbox for title/filter alignment
  - `.nav_menu` converted to flexbox layout
  - Removed float from `.x_content`

- **Color Utility Documentation**: Added migration guide comments for legacy color classes
  - Documents Bootstrap equivalents (.blue → .text-info, .bg-green → .bg-success)
  - Classes kept for backward compatibility with existing HTML

### Documentation Updates

- Updated CLAUDE.md with new file structure and renamed modules
- Updated directory layout to reflect cleaned-up architecture

---

## 2.1.2 - 12.01.2026

Maintenance Release - Comprehensive Dependency Updates

### Dependency Updates

All dependencies updated to their latest versions for improved security, performance, and compatibility.

#### Dev Dependencies

- **Vite** 7.1.5 → 7.3.1 (build system improvements)
- **ESLint** 9.35.0 → 9.39.2 (linting engine)
- **@eslint/js** 9.35.0 → 9.39.2
- **@typescript-eslint/eslint-plugin** 8.43.0 → 8.52.0
- **@typescript-eslint/parser** 8.43.0 → 8.52.0
- **TypeScript** 5.9.2 → 5.9.3
- **Prettier** 3.6.2 → 3.7.4 (code formatter)
- **SASS** 1.92.1 → 1.97.2 (CSS preprocessor)
- **Terser** 5.44.0 → 5.44.1 (JS minifier)
- **glob** 11.0.3 → 13.0.0 (major version upgrade)
- **rollup-plugin-visualizer** 6.0.3 → 6.0.5

#### Runtime Dependencies

- **Font Awesome** 7.0.1 → 7.1.0 (icon library)
- **FullCalendar** 6.1.19 → 6.1.20 (all packages)
- **Chart.js** 4.5.0 → 4.5.1
- **CropperJS** 2.0.1 → 2.1.0
- **DataTables** 2.3.4 → 2.3.6 (core and BS5 styling)
- **DataTables Buttons** 3.2.5 → 3.2.6
- **DataTables FixedHeader** 4.0.3 → 4.0.5
- **DataTables KeyTable** 2.12.1 → 2.12.2
- **DataTables Responsive** 3.0.6 → 3.0.7
- **Day.js** 1.11.18 → 1.11.19
- **DOMPurify** 3.2.6 → 3.3.1 (security library)

### Code Quality Improvements

- **ESLint Configuration**: Added comprehensive browser globals to eliminate false-positive errors
  - Added all standard browser APIs (setTimeout, fetch, localStorage, etc.)
  - Added DOM interfaces (HTMLElement, Event, CustomEvent, etc.)
  - Added library globals (TempusDominus, Skycons, DataTable, etc.)
- **Bug Fix**: Fixed parsing error in main-form-advanced.js (incomplete console statement)

### Known Issues

- Sass deprecation warnings in build output are from Bootstrap's internal SCSS files and will be resolved in future Bootstrap releases
- All functionality tested and verified working with updated dependencies

---

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
