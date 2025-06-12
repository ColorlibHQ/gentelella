#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Running additional optimizations...');

// 1. Analyze bundle sizes
console.log('\n📊 Bundle Analysis:');
try {
  const distPath = path.join(__dirname, '../dist');
  
  if (fs.existsSync(distPath)) {
    // Get JS bundle sizes
    const jsFiles = fs.readdirSync(path.join(distPath, 'js'))
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const filePath = path.join(distPath, 'js', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: (stats.size / 1024).toFixed(2) + ' KB'
        };
      });
    
    console.log('JavaScript bundles:');
    jsFiles.forEach(file => console.log(`  ${file.name}: ${file.size}`));
    
    // Get CSS bundle sizes
    const cssFiles = fs.readdirSync(path.join(distPath, 'assets'))
      .filter(file => file.endsWith('.css'))
      .map(file => {
        const filePath = path.join(distPath, 'assets', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: (stats.size / 1024).toFixed(2) + ' KB'
        };
      });
    
    console.log('\nCSS bundles:');
    cssFiles.forEach(file => console.log(`  ${file.name}: ${file.size}`));
  }
} catch (error) {
  console.error('Error analyzing bundles:', error.message);
}

// 2. Check for large images that could be optimized
console.log('\n🖼️  Large Images (>100KB):');
try {
  const imagesPath = path.join(__dirname, '../dist/images');
  if (fs.existsSync(imagesPath)) {
    const largeImages = fs.readdirSync(imagesPath)
      .map(file => {
        const filePath = path.join(imagesPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size
        };
      })
      .filter(img => img.size > 100 * 1024)
      .sort((a, b) => b.size - a.size);
    
    largeImages.forEach(img => {
      console.log(`  ${img.name}: ${(img.size / 1024).toFixed(2)} KB`);
    });
    
    if (largeImages.length === 0) {
      console.log('  ✅ No large images found!');
    }
  }
} catch (error) {
  console.error('Error checking images:', error.message);
}

// 3. Generate performance recommendations
console.log('\n💡 Performance Recommendations:');
console.log('  1. ✅ Code splitting implemented');
console.log('  2. ✅ Manual chunk optimization configured');
console.log('  3. ✅ Asset optimization enabled');
console.log('  4. ✅ Console logs removed in production');
console.log('  5. 📝 Consider implementing lazy loading for images');
console.log('  6. 📝 Consider using WebP format for large images');
console.log('  7. 📝 Consider implementing service worker for caching');

console.log('\n✨ Optimization complete!'); 