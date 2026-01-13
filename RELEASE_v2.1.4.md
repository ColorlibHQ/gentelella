# Gentelella v2.1.4 Release

## UI Polish & Navigation Enhancement Release

We're excited to announce Gentelella v2.1.4, focused on UI polish, improved navigation, and cross-page consistency!

### Highlights

#### Go Pro Sidebar Link
Added a prominent "Go Pro" menu item at the top of the sidebar, linking to [DashboardPack](https://dashboardpack.com/) premium templates. Includes UTM tracking for analytics and opens in a new tab.

#### Sidebar Badge System
Introduced a colorful badge system throughout the sidebar navigation to highlight important items:
- **Pro** badge (yellow) - Go Pro link
- **Hot** badge (red) - UI Elements menu
- **New** badge (green) - Data Presentation menu
- **Updated** badge (blue) - ECharts and Landing Page

All badges have consistent styling with right alignment.

#### Avatar/Profile Thumbnail Redesign
Redesigned profile icons in activity feeds with colorful circular backgrounds and white icons for a modern, vibrant look.

#### Progress Bar Fixes
Fixed invisible progress bars that were affecting dashboard pages. Progress bars now display correctly with proper background colors and consistent styling.

#### Uppy File Upload Integration
Replaced the legacy Dropzone.js with the modern [Uppy](https://uppy.io/) file uploader, featuring:
- Drag & drop with visual feedback
- Image preview thumbnails
- Progress indicators
- Cleaner, more maintainable code

#### Cross-Page Consistency
All 33 HTML template pages now share an identical sidebar menu structure, providing a consistent user experience when navigating between pages.

### Full Changelog

**New Features:**
- Go Pro sidebar link with UTM tracking
- Sidebar badge system (Pro, Hot, New, Updated)

**UI/UX Improvements:**
- Redesigned avatar/profile thumbnails with colorful backgrounds
- Fixed invisible progress bars
- Removed spacing inconsistencies on dashboard
- Unified sidebar menu across all pages

**File Upload:**
- Replaced Dropzone.js with Uppy

**Code Quality:**
- Removed inline CSS
- Consolidated SCSS styles

### Upgrade Instructions

```bash
# Pull the latest changes
git pull origin master

# Install any new dependencies
npm install

# Build for production
npm run build
```

### Links

- [Live Demo](https://colorlib.com/polygon/gentelella/index.html)
- [Documentation](https://github.com/puikinsh/gentelella)
- [Premium Templates](https://dashboardpack.com/?utm_source=gentelella&utm_medium=github&utm_campaign=release)

---

**Full Changelog**: https://github.com/puikinsh/gentelella/compare/v2.1.3...v2.1.4

Thank you for using Gentelella! If you find this template useful, please consider giving it a star on GitHub.
