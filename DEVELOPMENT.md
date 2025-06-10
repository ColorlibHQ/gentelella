# Gentelella Development Environment

This is a clean development environment for the Gentelella admin template. All pre-built files, vendor dependencies, and unnecessary content have been removed to provide a minimal base project.

## Project Structure

- **`src/`** - Source files (SCSS and JavaScript)
  - `src/scss/` - SCSS source files
  - `src/js/` - JavaScript source files
- **`build/`** - Compiled assets (generated from source, not committed)
  - `build/css/` - Compiled CSS files
  - `build/js/` - Compiled JavaScript files
- **`production/`** - HTML template pages (no CSS/JS subdirectories)

## Setup

### Prerequisites
- Node.js and npm

### Installation

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Build assets from source:
   ```bash
   npx gulp sass sass-minify scripts
   ```

## Development Workflow

### Building Assets

- **Build CSS**: `npx gulp sass sass-minify`
- **Build JavaScript**: `npx gulp scripts`
- **Build all**: `npx gulp sass sass-minify scripts`

### Development Server

Start the development server with live reload:
```bash
npx gulp default
```

This will:
- Start a browser-sync server
- Watch for changes in source files
- Automatically rebuild assets
- Reload the browser when changes are detected

### File Watching

The Gulp watch task monitors:
- `src/scss/*.scss` - Rebuilds CSS when SCSS files change
- `src/js/*.js` - Rebuilds JavaScript when JS files change
- `production/*.html` - Reloads browser when HTML files change

## Available Tasks

- `gulp sass` - Compile SCSS to CSS
- `gulp sass-minify` - Compile and minify SCSS to CSS
- `gulp scripts` - Concatenate and minify JavaScript
- `gulp browser-sync` - Start development server
- `gulp watch` - Watch files for changes
- `gulp default` - Start development server with file watching

## Notes

- The gulpfile has been updated to use modern Dart Sass instead of deprecated Ruby Sass
- All pre-built assets, vendor dependencies, and documentation have been removed for a minimal base project
- Source files in `src/` should be modified, not the built files in `build/`
- The `production/` folder contains only HTML templates (CSS/JS directories removed)
- The `build/` directory is ignored by git and will be created during the build process
- Bower configuration has been removed - manage dependencies through npm instead 