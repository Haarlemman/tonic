const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const targetDirs = ['house']; // Add other subdirectories if needed

function fixPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix src="assets/..." to src="../assets/..."
    // We only want to do this if we are in a subdirectory one level deep
    // Regex for src="assets/..." or src='assets/...'
    const srcRegex = /src=["']assets\//g;
    
    // Check if it's already ../assets/
    // actually simple replace might be enough but let's be careful
    
    // We want to replace src="assets/ with src="../assets/
    // But verify if it is not already ../
    
    // Let's iterate line by line or use regex replace with callback
    
    const newContent = content.replace(/(src|href|type)=["'](assets\/[^"']+)["']/g, (match, attr, p1) => {
        return `${attr}="../${p1}"`;
    });

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed paths in: ${filePath}`);
    }
}

function processDir(dir) {
    const fullPath = path.join(rootDir, dir);
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
            if (file.endsWith('.html')) {
                fixPaths(path.join(fullPath, file));
            }
        });
    } else {
        console.warn(`Directory not found: ${fullPath}`);
    }
}

targetDirs.forEach(dir => processDir(dir));
