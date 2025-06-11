#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Font Awesome icon name migrations from FA4/5 to FA6
const iconNameMigrations = [
    // Clock icon fix
    { from: /fa-clock-o\b/g, to: 'fa-clock' },
    
    // Common FA4 -> FA6 icon renames
    { from: /fa-remove\b/g, to: 'fa-times' },
    { from: /fa-close\b/g, to: 'fa-times' },
    { from: /fa-gear\b/g, to: 'fa-cog' },
    { from: /fa-envelope-o\b/g, to: 'fa-envelope' },
    { from: /fa-user-o\b/g, to: 'fa-user' },
    { from: /fa-file-o\b/g, to: 'fa-file' },
    { from: /fa-trash-o\b/g, to: 'fa-trash' },
    { from: /fa-calendar-o\b/g, to: 'fa-calendar' },
    { from: /fa-heart-o\b/g, to: 'fa-heart' },
    { from: /fa-star-o\b/g, to: 'fa-star' },
    { from: /fa-bell-o\b/g, to: 'fa-bell' },
    { from: /fa-bookmark-o\b/g, to: 'fa-bookmark' },
    { from: /fa-sign-out\b/g, to: 'fa-sign-out-alt' },
    { from: /fa-sign-in\b/g, to: 'fa-sign-in-alt' },
    { from: /fa-bar-chart-o\b/g, to: 'fa-chart-column' },
    { from: /fa-bar-chart\b/g, to: 'fa-chart-column' },
];

// Glyphicon to Font Awesome mappings
const glyphiconToFontAwesome = [
    // Common glyphicons to FA6 equivalents
    { from: /glyphicon-cog/g, to: 'fa-cog' },
    { from: /glyphicon-fullscreen/g, to: 'fa-expand' },
    { from: /glyphicon-eye-close/g, to: 'fa-eye-slash' },
    { from: /glyphicon-eye-btn-close/g, to: 'fa-eye-slash' },
    { from: /glyphicon-off/g, to: 'fa-power-off' },
    { from: /glyphicon-calendar/g, to: 'fa-calendar' },
    { from: /glyphicon-time/g, to: 'fa-clock' },
    { from: /glyphicon-chevron-left/g, to: 'fa-chevron-left' },
    { from: /glyphicon-chevron-right/g, to: 'fa-chevron-right' },
    { from: /glyphicon-chevron-up/g, to: 'fa-chevron-up' },
    { from: /glyphicon-chevron-down/g, to: 'fa-chevron-down' },
    { from: /glyphicon-align-left/g, to: 'fa-align-left' },
    { from: /glyphicon-align-center/g, to: 'fa-align-center' },
    { from: /glyphicon-align-right/g, to: 'fa-align-right' },
    { from: /glyphicon-align-justify/g, to: 'fa-align-justify' },
    { from: /glyphicon-star/g, to: 'fa-star' },
    { from: /glyphicon-star-empty/g, to: 'far fa-star' },
    { from: /glyphicon-home/g, to: 'fa-home' },
    { from: /glyphicon-user/g, to: 'fa-user' },
    { from: /glyphicon-envelope/g, to: 'fa-envelope' },
    { from: /glyphicon-trash/g, to: 'fa-trash' },
    { from: /glyphicon-edit/g, to: 'fa-edit' },
    { from: /glyphicon-search/g, to: 'fa-search' },
    { from: /glyphicon-plus/g, to: 'fa-plus' },
    { from: /glyphicon-minus/g, to: 'fa-minus' },
    { from: /glyphicon-remove/g, to: 'fa-times' },
    { from: /glyphicon-ok/g, to: 'fa-check' },
    { from: /glyphicon-download/g, to: 'fa-download' },
    { from: /glyphicon-upload/g, to: 'fa-upload' },
    { from: /glyphicon-print/g, to: 'fa-print' },
    { from: /glyphicon-save/g, to: 'fa-save' },
    { from: /glyphicon-file/g, to: 'fa-file' },
    { from: /glyphicon-folder-close/g, to: 'fa-folder' },
    { from: /glyphicon-folder-open/g, to: 'fa-folder-open' },
    { from: /glyphicon-list/g, to: 'fa-list' },
    { from: /glyphicon-th/g, to: 'fa-th' },
    { from: /glyphicon-th-list/g, to: 'fa-list' },
    { from: /glyphicon-lock/g, to: 'fa-lock' },
    { from: /glyphicon-bell/g, to: 'fa-bell' },
    { from: /glyphicon-camera/g, to: 'fa-camera' },
    { from: /glyphicon-heart/g, to: 'fa-heart' },
    { from: /glyphicon-music/g, to: 'fa-music' },
    { from: /glyphicon-tag/g, to: 'fa-tag' },
    { from: /glyphicon-tags/g, to: 'fa-tags' },
    { from: /glyphicon-comment/g, to: 'fa-comment' },
    { from: /glyphicon-signal/g, to: 'fa-signal' },
    { from: /glyphicon-refresh/g, to: 'fa-sync' },
    { from: /glyphicon-dashboard/g, to: 'fa-tachometer-alt' },
    { from: /glyphicon-warning-sign/g, to: 'fa-exclamation-triangle' },
    { from: /glyphicon-question-sign/g, to: 'fa-question-circle' },
    { from: /glyphicon-info-sign/g, to: 'fa-info-circle' },
];

function migrateIconsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    const originalContent = content;
    
    // 1. Fix Font Awesome icon name migrations first
    iconNameMigrations.forEach(rule => {
        const newContent = content.replace(rule.from, rule.to);
        if (newContent !== content) {
            content = newContent;
            changed = true;
        }
    });
    
    // 2. Fix mixed glyphicon + fa classes by removing glyphicon and keeping fa
    content = content.replace(/<i class="([^"]*?)\bglyphicon\s+glyphicon-[a-z-]+([^"]*?)\b(fas?)\s+(fa-[a-z-]+)([^"]*?)"([^>]*?)>/g, 
        '<i class="$1$3 $4$2$5"$6>');
    
    // 3. Fix mixed fa + glyphicon classes by removing glyphicon and keeping fa  
    content = content.replace(/<i class="([^"]*?)\b(fas?)\s+(fa-[a-z-]+)([^"]*?)\bglyphicon\s+glyphicon-[a-z-]+([^"]*?)"([^>]*?)>/g, 
        '<i class="$1$2 $3$4$5"$6>');
    
    // 4. Convert remaining glyphicon classes to Font Awesome
    glyphiconToFontAwesome.forEach(rule => {
        // Convert glyphicon-* class names within class attributes
        const glyphRegex = new RegExp(`(class="[^"]*?)\\bglyphicon\\s+${rule.from.source}\\b([^"]*?")`, 'g');
        content = content.replace(glyphRegex, `$1fas ${rule.to}$2`);
        
        // Also handle cases with just glyphicon-*
        const glyphRegex2 = new RegExp(`(class="[^"]*?)\\b${rule.from.source}\\b([^"]*?")`, 'g');
        content = content.replace(glyphRegex2, `$1fas ${rule.to}$2`);
    });
    
    // 5. Remove remaining bare glyphicon classes
    content = content.replace(/\bglyphicon\s+/g, 'fas ');
    content = content.replace(/\bglyphicon\b/g, 'fas');
    
    // 6. Clean up spacing in class attributes
    content = content.replace(/class="([^"]*?)\s+"/g, 'class="$1"');
    content = content.replace(/class="\s+([^"]*?)"/g, 'class="$1"');
    content = content.replace(/class="([^"]*?)\s{2,}([^"]*?)"/g, 'class="$1 $2"');
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed icons in: ${filePath}`);
        return true;
    }
    
    return false;
}

function migrateDirectory(dirPattern) {
    const files = glob.sync(dirPattern);
    let migratedCount = 0;
    
    files.forEach(filePath => {
        if (migrateIconsInFile(filePath)) {
            migratedCount++;
        }
    });
    
    return migratedCount;
}

function runIconMigration() {
    console.log('🎨 Starting Font Awesome 6 Icon Migration...\n');
    
    const directories = [
        'production/**/*.html',
        'test_page.html'
    ];
    
    let totalMigrated = 0;
    
    directories.forEach(pattern => {
        console.log(`📁 Processing: ${pattern}`);
        const count = migrateDirectory(pattern);
        totalMigrated += count;
        console.log(`   ✅ ${count} files migrated\n`);
    });
    
    console.log(`🎉 Icon migration completed! Total files migrated: ${totalMigrated}`);
    console.log('\n✅ Changes made:');
    console.log('   • Fixed fa-clock-o → fa-clock');
    console.log('   • Converted all glyphicon classes to Font Awesome');
    console.log('   • Removed mixed class conflicts');
    console.log('   • Updated outdated Font Awesome icon names');
    console.log('   • Cleaned up class attribute spacing');
}

if (require.main === module) {
    runIconMigration();
}

module.exports = { migrateIconsInFile, runIconMigration }; 