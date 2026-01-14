const fs = require('fs');
const path = require('path');

const dir = __dirname;
const scriptTag = '<script src="js/nav.js"></script>';

fs.readdir(dir, (err, files) => {
    if (err) {
        console.error("Could not list directory", err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file) === '.html' && file !== 'index.html') {
            const filePath = path.join(dir, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return console.error(err);

                if (!data.includes('nav.js')) {
                    const newData = data.replace('</body>', `    ${scriptTag}\n</body>`);
                    fs.writeFile(filePath, newData, (err) => {
                        if (err) console.error("Error writing " + file, err);
                        else console.log("Injected nav into " + file);
                    });
                } else {
                    console.log("Skipping " + file + " (already has nav)");
                }
            });
        }
    });
});
