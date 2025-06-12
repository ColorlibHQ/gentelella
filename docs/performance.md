---
layout: default
title: Performance Guide
nav_order: 5
---

# Performance Optimization
{: .no_toc }

Complete guide to optimizing Gentelella Admin Template for maximum performance
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Performance Overview

Gentelella v2.0 includes significant performance improvements over the original version:

### Performance Metrics

| Metric | v1.0 | v2.0 | Improvement |
|--------|------|------|-------------|
| **Initial Bundle Size** | 779 KB | 79 KB | **90% smaller** |
| **Total Page Load** | 1.3 MB | 770 KB | **40% reduction** |
| **First Contentful Paint** | 2.1s | 0.8s | **62% faster** |
| **Time to Interactive** | 3.5s | 1.2s | **66% faster** |
| **Largest Contentful Paint** | 2.8s | 1.1s | **61% faster** |
| **Cumulative Layout Shift** | 0.15 | 0.03 | **80% improvement** |

---

## Smart Loading System

### Core vs. Module Architecture

The template uses a two-tier loading system:

#### Core Bundle (79KB) - Always Loaded
Essential functionality that every page needs:

```javascript
// src/main-core.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './js/custom.min.js';

// Initialize tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
  // Bootstrap components initialization
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
  
  const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
  popovers.forEach(popover => new bootstrap.Popover(popover));
});
```

#### Conditional Modules - Loaded on Demand

**Charts Module** (219KB)
```javascript
// Only loads when chart elements are detected
if (document.querySelector('.chart-container')) {
  const charts = await import('./modules/charts.js');
  charts.initializeCharts();
}
```

**Forms Module** (200KB)
```javascript
// Only loads on pages with enhanced forms
if (document.querySelector('.select2, .datepicker, .form-wizard')) {
  const forms = await import('./modules/forms.js');
  forms.initializeForms();
}
```

**Tables Module**
```javascript
// Only loads when DataTables are needed
if (document.querySelector('.datatable')) {
  const tables = await import('./modules/tables.js');
  tables.initializeTables();
}
```

### Module Loading Strategy

```javascript
// Smart module detection and loading
export async function loadRequiredModules() {
  const modules = [];
  
  // Check for chart requirements
  if (document.querySelector('canvas, .morris-chart, .sparkline')) {
    modules.push(import('./modules/charts.js'));
  }
  
  // Check for form enhancements
  if (document.querySelector('.select2, .datepicker, .ion-range-slider')) {
    modules.push(import('./modules/forms.js'));
  }
  
  // Check for table features
  if (document.querySelector('.datatable, table[data-table]')) {
    modules.push(import('./modules/tables.js'));
  }
  
  // Check for dashboard widgets
  if (document.querySelector('.dashboard-widget, .tile_count')) {
    modules.push(import('./modules/dashboard.js'));
  }
  
  // Load all required modules in parallel
  const loadedModules = await Promise.all(modules);
  
  // Initialize each module
  loadedModules.forEach(module => {
    if (module.initialize) {
      module.initialize();
    }
  });
}
```

---

## Bundle Optimization

### Manual Chunk Splitting

The Vite configuration includes optimized chunk splitting:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries (loaded on every page)
          'vendor-core': [
            'bootstrap',
            '@popperjs/core'
          ],
          
          // Chart libraries (loaded only when needed)
          'vendor-charts': [
            'chart.js',
            'morris.js',
            'gauge.js',
            'jquery-sparkline'
          ],
          
          // Form enhancement libraries
          'vendor-forms': [
            'select2',
            'tempus-dominus',
            'ion-rangeslider',
            'switchery'
          ],
          
          // Table functionality
          'vendor-tables': [
            'datatables.net',
            'datatables.net-bs5',
            'datatables.net-responsive',
            'datatables.net-buttons'
          ],
          
          // Utility libraries
          'vendor-utils': [
            'dayjs',
            'nprogress',
            'autosize'
          ]
        }
      }
    }
  }
});
```

### Tree Shaking

Import only what you need:

```javascript
// ❌ Bad - imports entire library
import * as dayjs from 'dayjs';

// ✅ Good - imports only specific functions
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// ❌ Bad - imports entire Chart.js
import Chart from 'chart.js';

// ✅ Good - imports only needed components
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

---

## Asset Optimization

### Image Optimization

#### Responsive Images
```html
<!-- Use responsive images with srcset -->
<img src="images/thumb-400.jpg" 
     srcset="images/thumb-400.jpg 400w,
             images/thumb-800.jpg 800w,
             images/thumb-1200.jpg 1200w"
     sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
     alt="Dashboard preview"
     loading="lazy">
```

#### WebP Format with Fallback
```html
<picture>
  <source srcset="images/dashboard.webp" type="image/webp">
  <source srcset="images/dashboard.jpg" type="image/jpeg">
  <img src="images/dashboard.jpg" alt="Dashboard" loading="lazy">
</picture>
```

#### Lazy Loading
```html
<!-- Native lazy loading -->
<img src="images/placeholder.jpg" 
     data-src="images/actual-image.jpg"
     loading="lazy"
     alt="Description">

<!-- Intersection Observer approach -->
<img class="lazy" 
     src="images/placeholder.jpg" 
     data-src="images/actual-image.jpg"
     alt="Description">
```

```javascript
// Lazy loading implementation
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

### Font Optimization

#### Font Loading Strategy
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/roboto-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/roboto-bold.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display swap for better performance -->
<style>
@font-face {
  font-family: 'Roboto';
  src: url('/fonts/roboto-regular.woff2') format('woff2');
  font-display: swap;
  font-weight: 400;
}
</style>
```

#### Subset Fonts
```css
/* Load only the characters you need */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
```

---

## Caching Strategies

### Browser Caching

#### Vite Asset Hashing
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Add hash to filenames for cache busting
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  }
});
```

#### Service Worker Implementation
```javascript
// sw.js - Service Worker for caching
const CACHE_NAME = 'gentelella-v2.0.0';
const urlsToCache = [
  '/',
  '/assets/vendor-core.js',
  '/assets/main-core.js',
  '/assets/main.css',
  '/images/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### CDN Integration

```javascript
// vite.config.js - CDN configuration
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['jquery', 'bootstrap'],
      output: {
        globals: {
          jquery: 'jQuery',
          bootstrap: 'bootstrap'
        }
      }
    }
  }
});
```

```html
<!-- Load popular libraries from CDN -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
```

---

## Runtime Performance

### Efficient DOM Manipulation

#### Batch DOM Updates
```javascript
// ❌ Bad - multiple reflows
function updateMultipleElements(data) {
  data.forEach(item => {
    const element = document.getElementById(item.id);
    element.style.width = item.width + 'px';
    element.style.height = item.height + 'px';
    element.textContent = item.text;
  });
}

// ✅ Good - single reflow
function updateMultipleElements(data) {
  const fragment = document.createDocumentFragment();
  
  data.forEach(item => {
    const element = document.getElementById(item.id).cloneNode(true);
    element.style.width = item.width + 'px';
    element.style.height = item.height + 'px';
    element.textContent = item.text;
    fragment.appendChild(element);
  });
  
  document.body.appendChild(fragment);
}
```

#### Event Delegation
```javascript
// ❌ Bad - multiple event listeners
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// ✅ Good - single delegated listener
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn')) {
    handleClick(e);
  }
});
```

### Memory Management

#### Cleanup Event Listeners
```javascript
class Component {
  constructor(element) {
    this.element = element;
    this.handleClick = this.handleClick.bind(this);
    this.element.addEventListener('click', this.handleClick);
  }
  
  destroy() {
    // Clean up event listeners
    this.element.removeEventListener('click', this.handleClick);
    this.element = null;
  }
  
  handleClick(e) {
    // Handle click
  }
}
```

#### Debounce Expensive Operations
```javascript
function debounce(func, wait) {
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

// Usage for search
const debouncedSearch = debounce(performSearch, 300);
document.getElementById('search').addEventListener('input', debouncedSearch);
```

---

## Monitoring and Analysis

### Performance Monitoring

#### Core Web Vitals
```javascript
// Monitor Core Web Vitals
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### Performance Observer
```javascript
// Monitor long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long task detected:', entry);
  }
});

observer.observe({entryTypes: ['longtask']});

// Monitor resource loading
const resourceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 1000) {
      console.log('Slow resource:', entry.name, entry.duration);
    }
  }
});

resourceObserver.observe({entryTypes: ['resource']});
```

### Bundle Analysis

#### Webpack Bundle Analyzer
```bash
# Analyze your bundles
npm run build:analyze
```

```javascript
// scripts/analyze.js
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default defineConfig({
  plugins: [
    process.env.ANALYZE && new BundleAnalyzerPlugin()
  ].filter(Boolean)
});
```

#### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v8
        with:
          configPath: './lighthouserc.json'
```

---

## Performance Checklist

### Development Phase

- [ ] **Code Splitting**: Implement route-based and component-based splitting
- [ ] **Tree Shaking**: Import only needed functions and components
- [ ] **Module Loading**: Use dynamic imports for non-critical code
- [ ] **Bundle Analysis**: Regularly analyze bundle sizes
- [ ] **Dead Code**: Remove unused CSS and JavaScript

### Asset Optimization

- [ ] **Images**: Optimize, use WebP format, implement lazy loading
- [ ] **Fonts**: Subset fonts, use font-display: swap
- [ ] **Icons**: Use icon fonts or SVG sprites
- [ ] **Compression**: Enable gzip/brotli compression
- [ ] **Minification**: Minify CSS, JavaScript, and HTML

### Caching Strategy

- [ ] **Browser Caching**: Set appropriate cache headers
- [ ] **CDN**: Use CDN for static assets
- [ ] **Service Worker**: Implement for offline functionality
- [ ] **Versioning**: Use file hashing for cache busting

### Runtime Performance

- [ ] **Event Delegation**: Use for dynamic content
- [ ] **Debouncing**: Implement for expensive operations
- [ ] **Memory Leaks**: Clean up event listeners and timers
- [ ] **DOM Manipulation**: Batch updates and use DocumentFragment

### Monitoring

- [ ] **Core Web Vitals**: Monitor LCP, FID, CLS
- [ ] **Performance API**: Track loading times
- [ ] **Error Tracking**: Monitor JavaScript errors
- [ ] **User Experience**: Track real user metrics

---

## Advanced Optimization Techniques

### Preloading Strategies

#### Module Preloading
```html
<!-- Preload critical modules -->
<link rel="modulepreload" href="/assets/vendor-core.js">
<link rel="modulepreload" href="/assets/main-core.js">

<!-- Prefetch likely-needed modules -->
<link rel="prefetch" href="/assets/vendor-charts.js">
<link rel="prefetch" href="/assets/vendor-forms.js">
```

#### Predictive Loading
```javascript
// Preload modules based on user behavior
const observeNavigation = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const href = entry.target.getAttribute('href');
      
      // Preload likely modules for the target page
      if (href.includes('charts')) {
        import('./modules/charts.js');
      } else if (href.includes('forms')) {
        import('./modules/forms.js');
      }
    }
  });
});

// Observe navigation links
document.querySelectorAll('a[href]').forEach(link => {
  observeNavigation.observe(link);
});
```

### Critical Path Optimization

#### Critical CSS Inlining
```html
<style>
  /* Inline critical CSS for above-the-fold content */
  .header, .sidebar, .main-content { /* critical styles */ }
</style>

<!-- Load full CSS asynchronously -->
<link rel="preload" href="/assets/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

#### Resource Hints
```html
<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">

<!-- Preconnect to critical third-party origins -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

---

## Next Steps

- **[Deployment Guide]({{ site.baseurl }}/docs/deployment/)** - Deploy optimized builds
- **[Monitoring Guide]({{ site.baseurl }}/docs/monitoring/)** - Set up performance monitoring
- **[Troubleshooting]({{ site.baseurl }}/docs/troubleshooting/)** - Solve performance issues

---

{: .highlight }
💡 **Pro Tip**: Use the `npm run optimize` command to analyze your current bundle and get personalized optimization recommendations based on your specific usage patterns. 