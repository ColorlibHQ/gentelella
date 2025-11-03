# Bundle Analysis Guide

This guide explains how to use the bundle analyzer to monitor and optimize the bundle size of the Gentelella admin template.

## Quick Start

```bash
# Build and generate bundle analysis
npm run analyze

# Build without opening the stats file (for CI)
npm run analyze:ci
```

## Analysis File Location

After running the build, the bundle analysis is saved to:
- `dist/stats.html` - Interactive treemap visualization

## Understanding the Analysis

### Treemap View
The default treemap view shows:
- **Size of boxes** = Bundle size (larger boxes = larger bundles)
- **Colors** = Different modules and dependencies
- **Nested structure** = Module hierarchy and dependencies

### Key Metrics to Monitor

1. **Vendor Chunks** (largest bundles):
   - `vendor-charts` (~1.4MB) - Chart.js, ECharts, Leaflet
   - `vendor-core` (~168KB) - jQuery, Bootstrap, Popper.js
   - `vendor-forms` (~128KB) - Select2, Date pickers, Sliders
   - `vendor-ui` (~100KB) - jQuery UI, DataTables

2. **Application Code**:
   - `init` (~54KB) - Main initialization code
   - Page-specific bundles (2-3KB each)

3. **CSS Bundles**:
   - `init.css` (~510KB) - Main stylesheet bundle
   - Page-specific CSS (4-67KB each)

## Optimization Strategies

### 1. Identify Large Dependencies
- Look for unexpectedly large vendor chunks
- Check if dependencies are being tree-shaken properly
- Consider lighter alternatives for heavy libraries

### 2. Monitor Bundle Growth
- Track changes in bundle sizes over time
- Set up alerts for significant size increases
- Use gzip/brotli compressed sizes for realistic network transfer sizes

### 3. Code Splitting Optimization
Current manual chunks are optimized for:
- **vendor-core**: Essential libraries loaded on every page
- **vendor-charts**: Chart functionality (loaded only on chart pages)
- **vendor-forms**: Form enhancements (loaded only on form pages)
- **vendor-ui**: UI components (loaded as needed)/

### 4. Dynamic Import Opportunities
Consider converting large features to dynamic imports:
```javascript
// Instead of static import
import { Chart } from 'chart.js';

// Use dynamic import for conditional loading
if (document.querySelector('.chart-container')) {
  const { Chart } = await import('chart.js');
}
```

## Performance Targets

### Current Performance (as of latest build):
- **JavaScript Total**: ~2.4MB uncompressed, ~800KB gzipped
- **CSS Total**: ~610KB uncompressed, ~110KB gzipped
- **Page Load Impact**: Core bundle (168KB) loads on every page

### Recommended Targets:
- **Core Bundle**: <200KB (currently 168KB ✅)
- **Feature Bundles**: <150KB each (charts: 1.4MB ❌)
- **Total Initial Load**: <300KB gzipped (currently ~150KB ✅)

## Bundle Size Warnings

The build process will warn about chunks larger than 1000KB:
- This is currently triggered by the `vendor-charts` bundle
- Consider splitting chart libraries further or using dynamic imports
- Adjust the warning limit in `vite.config.js` if needed