const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const targetDirs = ['house/js', 'house/js/rooms'];

function fixPathsToRoot(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace "../assets/" with "/assets/"
    // Also replace "audio/" or "video/" if they don't have /assets/ prefix?
    // No, let's stick to converting "../assets/" -> "/assets/"
    // And also "assets/" -> "/assets/" if it mistakenly exists?

    // Current state: many files have "../assets/"
    // User wants: "/assets/"

    let newContent = content.replace(/\.\.\/assets\//g, '/assets/');

    // Also handle any remaining "assets/" that don't start with "/" or "."
    // e.g. src="assets/..." -> src="/assets/..."
    // regex: look for "assets/" not preceded by "/" or "."
    newContent = newContent.replace(/([^/.])assets\//g, '$1/assets/');

    // Fix any potential double // (e.g. //assets/) -> /assets/
    newContent = newContent.replace(/\/\/assets\//g, '/assets/');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated paths to root-relative in: ${filePath}`);
    }
}

function processDir(dir) {
    const fullPath = path.join(rootDir, dir);
    if (fs.existsSync(fullPath)) {
        const files = fs.readdirSync(fullPath);
        files.forEach(file => {
            if (file.endsWith('.js')) {
                fixPathsToRoot(path.join(fullPath, file));
            }
        });
    } else {
        console.warn(`Directory not found: ${fullPath}`);
    }
}

targetDirs.forEach(dir => processDir(dir));
