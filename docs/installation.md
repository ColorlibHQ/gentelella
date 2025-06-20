---
layout: default
title: Installation Guide
nav_order: 2
---

# Installation Guide
{: .no_toc }

Complete installation and setup instructions for Gentelella Admin Template
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## System Requirements

### Prerequisites

Before installing Gentelella, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** (for cloning the repository)
- A modern code editor (VS Code recommended)

### Browser Support

Gentelella supports all modern browsers:

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| Edge | 88+ |
| Opera | 74+ |

**Note:** Internet Explorer is not supported.

---

## Installation Methods

### Method 1: Git Clone (Recommended)

This is the recommended method for development and customization:

```bash
# Clone the repository
git clone https://github.com/puikinsh/gentelella.git

# Navigate to the project directory
cd gentelella

# Install dependencies
npm install

# Start the development server
npm run dev
```

Your development server will be running at `http://localhost:3000`

### Method 2: Download ZIP

1. Visit [GitHub repository](https://github.com/puikinsh/gentelella)
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in the extracted folder
5. Run `npm install`
6. Run `npm run dev`

### Method 3: npm Package

Install as a dependency in your existing project:

```bash
npm install gentelella --save
```

### Method 4: Yarn Package

If you prefer Yarn:

```bash
yarn add gentelella
```

### Method 5: Bower (Legacy)

For legacy projects using Bower:

```bash
bower install gentelella --save
```

---

## Project Structure

After installation, your project structure will look like this:

```
gentelella/
├── 📁 docs/                   # Documentation files
├── 📁 production/              # HTML templates & assets
│   ├── 📄 index.html          # Main dashboard
│   ├── 📄 form.html           # Form examples
│   ├── 📄 tables.html         # Table examples
│   ├── 📄 charts.html         # Chart examples
│   ├── 📄 [38 more pages]     # Complete admin coverage
│   └── 📁 images/             # Image assets
├── 📁 src/                    # Source files
│   ├── 📄 main-core.js        # Core bundle (79KB)
│   ├── 📄 main.js             # Full bundle (779KB)
│   ├── 📄 main.scss           # Styles entry point
│   ├── 📁 js/                 # Custom JavaScript
│   ├── 📁 scss/               # Custom SASS files
│   └── 📁 modules/            # Smart loading modules
│       ├── 📄 charts.js       # Chart libraries (219KB)
│       ├── 📄 forms.js        # Form enhancements (200KB)
│       ├── 📄 tables.js       # DataTables functionality
│       ├── 📄 dashboard.js    # Dashboard widgets
│       └── 📄 utils.js        # Utility functions
├── 📁 dist/                   # Production build output
├── 📁 scripts/                # Build & optimization tools
├── 📁 vendors/                # Third-party libraries
├── 📄 vite.config.js          # Vite configuration
├── 📄 package.json            # Dependencies & scripts
└── 📄 README.md               # Basic documentation
```

---

## Development Commands

### Basic Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Advanced Commands

```bash
# Build with bundle analysis
npm run build:analyze

# Performance optimization analysis
npm run optimize

# SASS compilation only
npm run sass:watch

# JavaScript linting
npm run lint

# Code formatting
npm run format
```

---

## Configuration

### Environment Setup

1. **Development Environment**
   ```bash
   npm run dev
   ```
   - Hot reload enabled
   - Source maps available
   - All modules loaded for development

2. **Production Environment**
   ```bash
   npm run build
   npm run preview
   ```
   - Optimized bundles
   - Minified assets
   - Smart code splitting

### Vite Configuration

The template includes an optimized `vite.config.js` with:

- **Entry Points**: All 42 HTML files configured
- **Code Splitting**: Automatic vendor/app separation
- **Asset Optimization**: Images, fonts, and static files
- **Development Features**: Hot reload, source maps
- **Production Optimizations**: Minification, compression

### SASS Configuration

SASS is configured in `src/main.scss`:

```scss
// Modern @use syntax (recommended)
@use "bootstrap/scss/bootstrap";
@use "./scss/custom.scss";

// Legacy @import syntax (deprecated but still works)
// @import "bootstrap/scss/bootstrap";
// @import "./scss/custom.scss";
```

---

## Verification

### Check Installation

After installation, verify everything is working:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to `http://localhost:3000`

3. **You should see** the Gentelella dashboard

### Test All Pages

Navigate through different pages to ensure all modules load correctly:

- Dashboard pages (index.html, index2.html, index3.html)
- Form pages (form.html, form_advanced.html, form_validation.html)
- Table pages (tables.html, tables_dynamic.html)
- Chart pages (chartjs.html, chartjs2.html, chart3.html)

### Performance Check

Run the optimization analysis:

```bash
npm run optimize
```

This will show you:
- Bundle sizes
- Loading times
- Optimization recommendations

---

## Troubleshooting

### Common Issues

#### 1. Node.js Version Issues

**Error:** `npm ERR! engine Unsupported engine`

**Solution:** Update Node.js to version 16 or higher:
```bash
# Check current version
node --version

# Update Node.js from https://nodejs.org/
```

#### 2. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:** Either stop the conflicting process or use a different port:
```bash
# Use different port
npm run dev -- --port 3001
```

#### 3. SASS Compilation Errors

**Error:** SASS deprecation warnings

**Solution:** These are mainly from Bootstrap internal files and can be safely ignored. Our project code uses modern SASS syntax.

#### 4. Module Not Found

**Error:** `Cannot resolve module`

**Solution:** Clear cache and reinstall:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### 5. Build Failures

**Error:** Build process fails

**Solution:** Check for file permission issues and ensure all dependencies are installed:
```bash
# Clear cache
npm cache clean --force

# Reinstall
npm install

# Try building again
npm run build
```

### Getting Help

If you encounter issues not covered here:

1. **Check GitHub Issues**: [github.com/puikinsh/gentelella/issues](https://github.com/puikinsh/gentelella/issues)
2. **Create New Issue**: Provide detailed error messages and system information
3. **Community Support**: Join discussions on GitHub
4. **Documentation**: Check other sections of this documentation

---

## Next Steps

After successful installation:

1. **[Configuration Guide]({{ site.baseurl }}/docs/configuration/)** - Customize the template
2. **[Components Overview]({{ site.baseurl }}/docs/components/)** - Explore available components
3. **[Performance Guide]({{ site.baseurl }}/docs/performance/)** - Optimize your build
4. **[Customization]({{ site.baseurl }}/docs/customization/)** - Add your own styles and features

---

{: .highlight }
💡 **Pro Tip**: Use `npm run dev` during development for the best experience with hot reload and source maps. Only use `npm run build` when you're ready to deploy to production. 