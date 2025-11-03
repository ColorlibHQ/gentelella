---
layout: default
title: Configuration
nav_order: 3
---

# Configuration Guide
{: .no_toc }

Complete guide to configuring and customizing Gentelella Admin Template
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Vite Configuration

### Basic Configuration

The `vite.config.js` file contains optimized settings for both development and production builds:

```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        // All 42 HTML files are configured as entry points
        'index': 'production/index.html',
        'index2': 'production/index2.html',
        'index3': 'production/index3.html',
        'form': 'production/form.html',
        'form_advanced': 'production/form_advanced.html',
        'tables': 'production/tables.html',
        'charts': 'production/chartjs.html',
        // ... and 35 more pages
      },
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks: {
          'vendor-core': ['bootstrap', '@popperjs/core'],
          'vendor-charts': ['chart.js', 'morris.js'],
          'vendor-forms': ['select2', 'tempus-dominus'],
          'vendor-tables': ['datatables.net'],
          'vendor-utils': ['dayjs', 'nprogress']
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Advanced Vite Options

#### Development Optimizations

```javascript
export default defineConfig({
  server: {
    // Custom port
    port: 3001,
    
    // Enable HTTPS for local development
    https: true,
    
    // Proxy API requests
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  // Enable source maps in development
  css: {
    devSourcemap: true
  }
});
```

#### Production Optimizations

```javascript
export default defineConfig({
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2018',
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Generate source maps for production debugging
    sourcemap: true,
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  }
});
```

---

## SASS Configuration

### Main SASS File

The `src/main.scss` file is the entry point for all styles:

```scss
// Modern @use syntax (recommended)
@use "bootstrap/scss/bootstrap";
@use "./scss/custom.scss";

// Legacy @import syntax (still supported)
// @import "bootstrap/scss/bootstrap";
// @import "./scss/custom.scss";
```

### Bootstrap Customization

Create `src/scss/bootstrap-custom.scss` to override Bootstrap variables:

```scss
// Override Bootstrap variables BEFORE importing Bootstrap
$primary: #73879C;
$secondary: #6c757d;
$success: #26B99A;
$info: #3498DB;
$warning: #F39C12;
$danger: #E74C3C;

// Typography
$font-family-base: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
$font-size-base: 14px;
$line-height-base: 1.5;

// Sidebar customization
$sidebar-width: 230px;
$sidebar-bg: #2A3F54;
$sidebar-text-color: #E7E7E7;

// Import Bootstrap with your customizations
@import "bootstrap/scss/bootstrap";
```

### Custom Component Styles

Create `src/scss/components/` directory for modular styles:

```scss
// src/scss/components/_dashboard.scss
.dashboard-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .card-header {
    background: linear-gradient(135deg, $primary, darken($primary, 10%));
    color: white;
    border-radius: 8px 8px 0 0;
  }
}

// src/scss/components/_sidebar.scss
.sidebar {
  width: $sidebar-width;
  background-color: $sidebar-bg;
  
  .nav-link {
    color: $sidebar-text-color;
    padding: 12px 20px;
    border-radius: 4px;
    margin: 2px 10px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }
    
    &.active {
      background-color: $primary;
      color: white;
    }
  }
}
```

---

## Module Configuration

### Smart Loading System

Configure which modules load automatically vs. on-demand:

```javascript
// src/main-core.js - Always loaded essentials
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './js/custom.min.js';

// Initialize core functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => 
    new bootstrap.Tooltip(tooltipTriggerEl)
  );
  
  // Initialize popovers
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => 
    new bootstrap.Popover(popoverTriggerEl)
  );
});

// Dynamic module loading
export async function loadModule(moduleName) {
  try {
    switch(moduleName) {
      case 'charts':
        return await import('./modules/charts.js');
      case 'forms':
        return await import('./modules/forms.js');
      case 'tables':
        return await import('./modules/tables.js');
      case 'dashboard':
        return await import('./modules/dashboard.js');
      default:
        throw new Error(`Unknown module: ${moduleName}`);
    }
  } catch (error) {
    console.error(`Failed to load module ${moduleName}:`, error);
    return null;
  }
}
```

### Chart Module Configuration

```javascript
// src/modules/charts.js
import Chart from 'chart.js/auto';

export const chartConfig = {
  // Default Chart.js configuration
  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  },
  
  // Chart themes
  themes: {
    primary: {
      backgroundColor: 'rgba(115, 135, 156, 0.1)',
      borderColor: '#73879C',
      pointBackgroundColor: '#73879C'
    },
    success: {
      backgroundColor: 'rgba(38, 185, 154, 0.1)',
      borderColor: '#26B99A',
      pointBackgroundColor: '#26B99A'
    }
  }
};

export function initializeCharts() {
  // Auto-initialize charts on page load
  const chartElements = document.querySelectorAll('.chart-container canvas');
  chartElements.forEach(canvas => {
    const chartType = canvas.dataset.chartType || 'line';
    const chartData = JSON.parse(canvas.dataset.chartData || '{}');
    
    new Chart(canvas, {
      type: chartType,
      data: chartData,
      options: chartConfig.defaultOptions
    });
  });
}
```

### Form Module Configuration

```javascript
// src/modules/forms.js
import { DateTime } from 'tempus-dominus';

export const formConfig = {
  // Select2 configuration
  select2: {
    theme: 'bootstrap-5',
    width: '100%',
    placeholder: 'Select an option...',
    allowClear: true
  },
  
  // Date picker configuration
  datePicker: {
    display: {
      theme: 'light',
      components: {
        calendar: true,
        date: true,
        month: true,
        year: true,
        decades: true,
        clock: false
      }
    },
    localization: {
      format: 'MM/dd/yyyy'
    }
  },
  
  // Validation rules
  validation: {
    errorClass: 'is-invalid',
    successClass: 'is-valid',
    errorElement: 'div',
    errorPlacement: function(error, element) {
      error.addClass('invalid-feedback');
      element.closest('.form-group').append(error);
    }
  }
};

export function initializeForms() {
  // Initialize Select2
  $('.select2').select2(formConfig.select2);
  
  // Initialize date pickers
  $('.datepicker').each(function() {
    new DateTime(this, formConfig.datePicker);
  });
  
  // Initialize form validation
  $('form[data-validate]').each(function() {
    $(this).validate(formConfig.validation);
  });
}
```

---

## Environment Variables

### Development Environment

Create `.env.development`:

```env
# Development settings
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Gentelella Admin (Dev)
VITE_DEBUG_MODE=true
VITE_BUNDLE_ANALYZER=false

# Feature flags
VITE_ENABLE_CHARTS=true
VITE_ENABLE_MAPS=true
VITE_ENABLE_REAL_TIME=false
```

### Production Environment

Create `.env.production`:

```env
# Production settings
VITE_API_URL=https://api.yoursite.com
VITE_APP_NAME=Gentelella Admin
VITE_DEBUG_MODE=false
VITE_BUNDLE_ANALYZER=false

# Performance settings
VITE_PRELOAD_MODULES=charts,forms
VITE_CDN_URL=https://cdn.yoursite.com
```

### Using Environment Variables

```javascript
// In your JavaScript files
const apiUrl = import.meta.env.VITE_API_URL;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

if (debugMode) {
  console.log('Debug mode enabled');
}

// Conditional module loading
if (import.meta.env.VITE_ENABLE_CHARTS === 'true') {
  const charts = await import('./modules/charts.js');
  charts.initializeCharts();
}
```

---

## Performance Configuration

### Bundle Optimization

```javascript
// vite.config.js - Production optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries (loaded on every page)
          'vendor-core': [
            'bootstrap',
            '@popperjs/core',
            'jquery'
          ],
          
          // Chart libraries (loaded only on chart pages)
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
            'datatables.net-responsive'
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

### Asset Optimization

```javascript
// vite.config.js - Asset handling
export default defineConfig({
  assetsInclude: ['**/*.xlsx', '**/*.pdf'],
  
  build: {
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      }
    }
  }
});
```

---

## Advanced Configuration

### TypeScript Support

Enable TypeScript by creating `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@modules/*": ["./src/modules/*"]
    }
  },
  "include": ["src"]
}
```

### ESLint Configuration

Create `.eslintrc.js`:

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  ignorePatterns: ['dist', 'node_modules', 'vendors']
};
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## Next Steps

- **[Components Guide]({{ site.baseurl }}/docs/components/)** - Explore all available components
- **[Customization Guide]({{ site.baseurl }}/docs/customization/)** - Advanced customization techniques
- **[Performance Guide]({{ site.baseurl }}/docs/performance/)** - Optimization strategies
- **[Deployment Guide]({{ site.baseurl }}/docs/deployment/)** - Deploy to production

---

{: .highlight }
💡 **Pro Tip**: Start with the default configuration and gradually customize based on your project needs. The modular architecture allows you to enable/disable features as required. 