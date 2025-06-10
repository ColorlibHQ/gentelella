# Clean Base Project - Gentelella Admin Template

This repository has been cleaned up to provide a minimal base project for the Gentelella admin template, suitable for starting new development projects.

## What Was Removed

### 🗑️ Pre-built Files & Dependencies
- **`vendors/`** - All Bower-managed third-party dependencies (jQuery, Bootstrap, etc.)
- **`production/css/`** - Pre-built CSS files
- **`production/js/`** - Pre-built JavaScript files  
- **`build/css/*`** - Pre-compiled CSS assets
- **`build/js/*`** - Pre-compiled JavaScript assets
- **`build/images/`** - Pre-built image assets
- **`docs/`** - Documentation website files

### 🧹 Configuration Files
- **`bower.json`** - Bower package configuration
- **`.bowerrc`** - Bower settings
- **`.DS_Store`** - macOS system files

## What Remains

### ✅ Essential Source Files
- **`src/scss/`** - SCSS source stylesheets
- **`src/js/`** - JavaScript source files
- **`production/*.html`** - HTML template pages
- **`production/images/`** - Template images and assets

### ✅ Development Tools
- **`gulpfile.js`** - Build configuration (updated for modern Sass)
- **`package.json`** - npm dependencies and scripts
- **`.gitignore`** - Updated to ignore build outputs

## Current Project Structure

```
gentelella/
├── src/                    # 🔧 Source files (edit these)
│   ├── scss/              # SCSS stylesheets
│   └── js/                # JavaScript source
├── build/                 # 📦 Generated assets (ignored by git)
│   ├── css/              # Will contain compiled CSS
│   └── js/               # Will contain compiled JS
├── production/           # 📄 HTML templates
│   ├── *.html           # Template pages
│   └── images/          # Template assets
├── gulpfile.js          # 🛠️ Build configuration
├── package.json         # 📋 npm dependencies
└── .gitignore          # 🚫 Git ignore rules
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build assets:**
   ```bash
   npx gulp sass sass-minify scripts
   ```

3. **Start development server:**
   ```bash
   npx gulp default
   ```

## Benefits of This Clean Setup

- ✅ **Minimal repository size** - No vendor dependencies or build artifacts
- ✅ **Modern build tools** - Updated to use Dart Sass instead of deprecated Ruby Sass
- ✅ **Reproducible builds** - All assets generated from source
- ✅ **Version control friendly** - Only source files are tracked
- ✅ **Easy to customize** - Clean separation between source and output
- ✅ **npm-only workflow** - No need for Bower or Ruby dependencies

## Notes

- The `build/` directory will be created automatically during the build process
- All external dependencies should now be managed through npm instead of Bower
- HTML templates in `production/` still reference the built CSS/JS files in `build/`
- This setup provides a clean foundation for building custom admin interfaces 