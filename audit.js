const fs = require('fs');
const path = require('path');

const baseDir = 'd:/opencode/joel/v2';
const issues = [];
const checked = new Set();

// Get all HTML and CSS files
const htmlFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.html'));
const cssFiles = ['css/style.css'];

const allFiles = [...htmlFiles.map(f => path.join(baseDir, f)), ...cssFiles.map(f => path.join(baseDir, f))];

allFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.relative(baseDir, filePath);
    
    // Match src="..." and url(...)
    const srcMatches = content.matchAll(/(?:src|poster|href)=["']([^"']*?(?:\.webp|\.png|\.jpg|\.jpeg|\.mp4|\.svg|\.gif|\.pdf)[^"']*?)["']/gi);
    const urlMatches = content.matchAll(/url\(["']?([^"')]*?(?:\.webp|\.png|\.jpg|\.jpeg|\.mp4|\.svg|\.gif)[^"')]*?)["']?\)/gi);
    
    for (const match of srcMatches) {
        let ref = match[1];
        if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('data:')) continue;
        const fullPath = path.resolve(baseDir, ref);
        const key = `${fileName}|${ref}`;
        if (checked.has(key)) continue;
        checked.add(key);
        
        if (!fs.existsSync(fullPath)) {
            issues.push({ file: fileName, ref: ref, status: 'MISSING' });
        }
    }
    
    for (const match of urlMatches) {
        let ref = match[1];
        if (ref.startsWith('http://') || ref.startsWith('https://') || ref.startsWith('data:')) continue;
        // CSS urls are relative to the CSS file location
        const cssDir = path.dirname(filePath);
        const fullPath = path.resolve(cssDir, ref);
        const key = `${fileName}|${ref}`;
        if (checked.has(key)) continue;
        checked.add(key);
        
        if (!fs.existsSync(fullPath)) {
            issues.push({ file: fileName, ref: ref, status: 'MISSING' });
        }
    }
});

console.log('\n=== ASSET AUDIT REPORT ===\n');
if (issues.length === 0) {
    console.log('✅ ALL local asset references are valid!');
} else {
    console.log(`❌ Found ${issues.length} broken references:\n`);
    issues.forEach(i => {
        console.log(`  File: ${i.file}`);
        console.log(`  Path: ${i.ref}`);
        console.log(`  ---`);
    });
}

// Also list all external (unsplash etc) references still remaining
const externals = [];
allFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.relative(baseDir, filePath);
    const extMatches = content.matchAll(/src=["'](https:\/\/images\.unsplash\.com[^"']*?)["']/gi);
    for (const match of extMatches) {
        externals.push({ file: fileName, url: match[1].substring(0, 80) + '...' });
    }
});

if (externals.length > 0) {
    console.log(`\n⚠️  ${externals.length} EXTERNAL image references (Unsplash) still in code:\n`);
    externals.forEach(e => {
        console.log(`  File: ${e.file}`);
        console.log(`  URL:  ${e.url}`);
        console.log(`  ---`);
    });
}
