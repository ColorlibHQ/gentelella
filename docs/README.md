# Gentelella Admin Template Documentation

This directory contains the complete documentation for Gentelella Admin Template, built with Jekyll and deployable to GitHub Pages.

## 📚 Documentation Structure

- **[index.md](index.md)** - Main landing page with overview and quick start
- **[installation.md](installation.md)** - Detailed installation guide
- **[configuration.md](configuration.md)** - Configuration and setup options
- **[components.md](components.md)** - Complete component reference
- **[performance.md](performance.md)** - Performance optimization guide
- **[deployment.md](deployment.md)** - Production deployment instructions
- **[customization.md](customization.md)** - Advanced customization techniques
- **[api-integration.md](api-integration.md)** - API integration and data management

## 🚀 Local Development

### Prerequisites

- Ruby 3.1 or higher
- Bundler gem
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/puikinsh/gentelella.git
   cd gentelella/docs
   ```

2. **Install dependencies:**
   ```bash
   bundle install
   ```

3. **Start the development server:**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4000`

### Development Commands

```bash
# Start development server
bundle exec jekyll serve

# Start with live reload
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build

# Build with specific base URL
bundle exec jekyll build --baseurl "/gentelella"

# Clean generated files
bundle exec jekyll clean
```

## 🌐 GitHub Pages Deployment

The documentation is automatically deployed to GitHub Pages using GitHub Actions.

### Automatic Deployment

The site automatically deploys when changes are pushed to the `main` branch in the `docs/` directory. The workflow is defined in `.github/workflows/pages.yml`.

### Manual Deployment

To deploy manually:

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Set Source to "GitHub Actions"

2. **Trigger deployment:**
   - Push changes to the `main` branch
   - Or manually trigger the workflow in the Actions tab

### Custom Domain Setup

To use a custom domain:

1. **Add CNAME file:**
   ```bash
   echo "docs.yoursite.com" > CNAME
   ```

2. **Configure DNS:**
   Add CNAME record pointing to `username.github.io`

3. **Update _config.yml:**
   ```yaml
   url: "https://docs.yoursite.com"
   baseurl: ""
   ```

## 📝 Content Management

### Adding New Pages

1. **Create new markdown file:**
   ```bash
   touch new-page.md
   ```

2. **Add front matter:**
   ```yaml
   ---
   layout: default
   title: Your Page Title
   nav_order: 9
   ---
   ```

3. **Write content using markdown**

### Page Structure

Each page should include:

```yaml
---
layout: default
title: Page Title
nav_order: 1
description: "Page description for SEO"
permalink: /custom-url/
---

# Page Title
{: .no_toc }

Page description
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Your Content Here
```

### Navigation

Navigation is automatically generated based on:
- `nav_order` - Controls position in menu
- `title` - Displays in navigation
- File structure for sub-pages

### Styling and Components

The documentation uses [Just the Docs](https://just-the-docs.github.io/just-the-docs/) theme with custom styling.

#### Available Components

**Callouts:**
```markdown
{: .highlight }
💡 **Pro Tip**: Your tip content here

{: .warning }
⚠️ **Warning**: Important warning here
```

**Code Blocks:**
```markdown
```javascript
// Code with syntax highlighting
const example = 'hello world';
```

**Tables:**
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

**Buttons:**
```markdown
[Button Text](link){: .btn .btn-primary }
```

## 🔧 Configuration

### _config.yml

Key configuration options:

```yaml
# Site settings
title: Gentelella Admin Template
description: Modern Bootstrap 5 Admin Dashboard Template
url: "https://puikinsh.github.io"
baseurl: "/gentelella"

# Theme
theme: just-the-docs

# Search
search_enabled: true

# Navigation
nav_sort: case_insensitive

# Footer
footer_content: "Copyright &copy; 2025 Colorlib"

# External links
aux_links:
  "GitHub": "//github.com/puikinsh/gentelella"
  "Colorlib": "//colorlib.com"
```

### Gemfile

Dependencies managed through Bundler:

```ruby
source "https://rubygems.org"

# GitHub Pages compatible Jekyll version
gem "github-pages", group: :jekyll_plugins

# Theme
gem "just-the-docs"

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end
```

## 📊 Analytics and SEO

### Google Analytics

Add tracking ID to `_config.yml`:

```yaml
ga_tracking: UA-XXXXXXXX-X
```

### SEO Optimization

- All pages include meta descriptions
- Structured data for documentation
- Sitemap automatically generated
- Social media meta tags

### Performance

- Static site generation for fast loading
- Image optimization
- Minified CSS and HTML
- CDN-ready assets

## 🤝 Contributing

### Documentation Guidelines

1. **Clear and concise writing**
2. **Include code examples**
3. **Add table of contents for long pages**
4. **Use consistent formatting**
5. **Include links to related sections**

### Editing Process

1. **Fork the repository**
2. **Create feature branch**
3. **Make changes to documentation**
4. **Test locally with Jekyll**
5. **Submit pull request**

### Style Guide

- Use sentence case for headings
- Include code examples for all features
- Add screenshots when helpful
- Link to external resources appropriately
- Keep paragraphs concise

## 🐛 Troubleshooting

### Common Issues

**Bundle install fails:**
```bash
# Update RubyGems
gem update --system

# Clear bundle cache
bundle clean --force
rm Gemfile.lock
bundle install
```

**Jekyll serve fails:**
```bash
# Clear Jekyll cache
bundle exec jekyll clean

# Regenerate
bundle exec jekyll serve --trace
```

**GitHub Pages build fails:**
- Check Jekyll build logs in Actions tab
- Ensure all gems are GitHub Pages compatible
- Validate YAML front matter

### Getting Help

- Check [Jekyll documentation](https://jekyllrb.com/docs/)
- Review [Just the Docs guide](https://just-the-docs.github.io/just-the-docs/)
- Open issue in repository

## 📄 License

Documentation is licensed under MIT License - see main repository LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Jekyll](https://jekyllrb.com/)
- Styled with [Just the Docs](https://just-the-docs.github.io/just-the-docs/)
- Hosted on [GitHub Pages](https://pages.github.com/)
- Template by [Colorlib](https://colorlib.com/) 