#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Bootstrap 5 Migration Rules
const classReplacements = [
    // Margin utilities
    { from: /\bml-(\d+)\b/g, to: 'ms-$1' },
    { from: /\bmr-(\d+)\b/g, to: 'me-$1' },
    { from: /\bpl-(\d+)\b/g, to: 'ps-$1' },
    { from: /\bpr-(\d+)\b/g, to: 'pe-$1' },
    
    // Text alignment
    { from: /\btext-left\b/g, to: 'text-start' },
    { from: /\btext-right\b/g, to: 'text-end' },
    
    // Floats
    { from: /\bfloat-left\b/g, to: 'float-start' },
    { from: /\bfloat-right\b/g, to: 'float-end' },
    
    // Borders
    { from: /\bborder-left\b/g, to: 'border-start' },
    { from: /\bborder-right\b/g, to: 'border-end' },
    
    // Rounded corners
    { from: /\brounded-left\b/g, to: 'rounded-start' },
    { from: /\brounded-right\b/g, to: 'rounded-end' },
    
    // Form classes
    { from: /\bcustom-select\b/g, to: 'form-select' },
    { from: /\bcustom-check\b/g, to: 'form-check' },
    { from: /\bcustom-switch\b/g, to: 'form-switch' },
    { from: /\bcustom-range\b/g, to: 'form-range' },
    { from: /\bform-control-file\b/g, to: 'form-control' },
    
    // Button classes
    { from: /\bbtn-block\b/g, to: 'd-grid' },
    
    // Badge classes - need to be more specific to avoid conflicts
    { from: /\bbadge-primary\b/g, to: 'bg-primary' },
    { from: /\bbadge-secondary\b/g, to: 'bg-secondary' },
    { from: /\bbadge-success\b/g, to: 'bg-success' },
    { from: /\bbadge-danger\b/g, to: 'bg-danger' },
    { from: /\bbadge-warning\b/g, to: 'bg-warning' },
    { from: /\bbadge-info\b/g, to: 'bg-info' },
    { from: /\bbadge-light\b/g, to: 'bg-light' },
    { from: /\bbadge-dark\b/g, to: 'bg-dark' },
    { from: /\bbadge-pill\b/g, to: 'rounded-pill' },
    
    // Grid classes
    { from: /\bno-gutters\b/g, to: 'g-0' },
    
    // Font weight utilities
    { from: /\bfont-weight-bold\b/g, to: 'fw-bold' },
    { from: /\bfont-weight-normal\b/g, to: 'fw-normal' },
    { from: /\bfont-weight-light\b/g, to: 'fw-light' },
    
    // Font style utilities
    { from: /\bfont-italic\b/g, to: 'fst-italic' },
    
    // Text utilities
    { from: /\btext-monospace\b/g, to: 'font-monospace' },
    
    // Close button
    { from: /\bclose\b/g, to: 'btn-close' },
    
    // Input group updates
    { from: /\binput-group-append\b/g, to: '' },
    { from: /\binput-group-prepend\b/g, to: '' },
];

const dataAttributeReplacements = [
    // Bootstrap 5 data attributes
    { from: /data-toggle=/g, to: 'data-bs-toggle=' },
    { from: /data-target=/g, to: 'data-bs-target=' },
    { from: /data-dismiss=/g, to: 'data-bs-dismiss=' },
    { from: /data-slide=/g, to: 'data-bs-slide=' },
    { from: /data-parent=/g, to: 'data-bs-parent=' },
    { from: /data-spy=/g, to: 'data-bs-spy=' },
    { from: /data-offset=/g, to: 'data-bs-offset=' },
    { from: /data-backdrop=/g, to: 'data-bs-backdrop=' },
    { from: /data-keyboard=/g, to: 'data-bs-keyboard=' },
    { from: /data-interval=/g, to: 'data-bs-interval=' },
    { from: /data-pause=/g, to: 'data-bs-pause=' },
    { from: /data-ride=/g, to: 'data-bs-ride=' },
    { from: /data-wrap=/g, to: 'data-bs-wrap=' },
];

const htmlStructureReplacements = [
    // Update navbar structure (add container requirement)
    {
        from: /<nav class="navbar([^>]*)>/g,
        to: '<nav class="navbar$1">\n    <div class="container-fluid">'
    },
    
    // Update form structure - remove form-group wrapper where appropriate
    {
        from: /<div class="form-group">/g,
        to: '<div class="mb-3">'
    },
    
    // Update cards structure for Bootstrap 5
    {
        from: /<div class="card-deck">/g,
        to: '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">'
    },
    
    // Remove jumbotron class (component removed in Bootstrap 5)
    {
        from: /<div class="jumbotron([^>]*)">/g,
        to: '<div class="bg-light p-5 rounded-3$1">'
    },
    
    // Update media component (removed in Bootstrap 5)
    {
        from: /<div class="media([^>]*)">/g,
        to: '<div class="d-flex$1">'
    },
    {
        from: /<div class="media-object([^>]*)">/g,
        to: '<div class="flex-shrink-0$1">'
    },
    {
        from: /<div class="media-body([^>]*)">/g,
        to: '<div class="flex-grow-1 ms-3$1">'
    },
];

// Update Font Awesome 4 to 6 icon classes
const fontAwesomeReplacements = [
    // Common FA4 to FA6 migrations
    { from: /\bfa fa-/g, to: 'fas fa-' },
    { from: /\bfab fa-/g, to: 'fab fa-' },
    { from: /\bfar fa-/g, to: 'far fa-' },
    { from: /\bfal fa-/g, to: 'fal fa-' },
    
    // Specific icon name changes
    { from: /\bfa-remove\b/g, to: 'fa-times' },
    { from: /\bfa-close\b/g, to: 'fa-times' },
    { from: /\bfa-gear\b/g, to: 'fa-cog' },
];

function migrateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Apply class replacements
    classReplacements.forEach(rule => {
        const newContent = content.replace(rule.from, rule.to);
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    });
    
    // Apply data attribute replacements
    dataAttributeReplacements.forEach(rule => {
        const newContent = content.replace(rule.from, rule.to);
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    });
    
    // Apply HTML structure replacements
    htmlStructureReplacements.forEach(rule => {
        const newContent = content.replace(rule.from, rule.to);
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    });
    
    // Apply Font Awesome replacements
    fontAwesomeReplacements.forEach(rule => {
        const newContent = content.replace(rule.from, rule.to);
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    });
    
    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Migrated: ${filePath}`);
        return true;
    }
    
    return false;
}

function migrateDirectory(dirPattern) {
    const files = glob.sync(dirPattern);
    let migratedCount = 0;
    
    files.forEach(filePath => {
        if (migrateFile(filePath)) {
            migratedCount++;
        }
    });
    
    return migratedCount;
}

// Main migration function
function runMigration() {
    console.log('🚀 Starting Bootstrap 5 Migration...\n');
    
    const directories = [
        'production/**/*.html',
        'vendors/**/*.html',
        'src/**/*.html'
    ];
    
    let totalMigrated = 0;
    
    directories.forEach(pattern => {
        console.log(`📁 Processing: ${pattern}`);
        const count = migrateDirectory(pattern);
        totalMigrated += count;
        console.log(`   ✅ ${count} files migrated\n`);
    });
    
    console.log(`🎉 Migration completed! Total files migrated: ${totalMigrated}`);
    console.log('\n⚠️  Manual Review Required:');
    console.log('   - Check for any custom Bootstrap 4 CSS that needs updating');
    console.log('   - Verify that removed components (jumbotron, media) look correct');
    console.log('   - Test form layouts and input groups');
    console.log('   - Validate navbar structure updates');
    console.log('   - Check that all JavaScript components still work');
}

if (require.main === module) {
    runMigration();
}

module.exports = { migrateFile, migrateDirectory, runMigration }; 