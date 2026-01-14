const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const targetDirs = ['house/js', 'house/js/rooms'];

function fixPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace 'assets/' with '../assets/' but avoid 'src="assets/' which we handled in HTML (though here it's JS strings)
    // We want to replace "assets/" or 'assets/' with "../assets/"
    // Be careful not to replace "../assets/" with "../../assets/"

    // Regex to find "assets/" that is NOT preceded by "../" or "/"
    // We need to match the start of the string or quote.

    // Pattern: (["'])assets/
    // Replace with: $1../assets/

    const newContent = content.replace(/(["'])assets\//g, (match, quote) => {
        return `${quote}../assets/`;
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
            if (file.endsWith('.js')) {
                fixPaths(path.join(fullPath, file));
            }
        });
    } else {
        console.warn(`Directory not found: ${fullPath}`);
    }
}

targetDirs.forEach(dir => processDir(dir));
