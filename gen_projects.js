const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const OUTPUT_FILE = path.join(ROOT_DIR, 'projects.json');
const GITHUB_BASE_URL = 'https://github.com/55Pranjal/100-Front-End-Projects/tree/master/'; // Assuming master, commonly used for this repo type

const IGNORE_DIRS = [
    '.git',
    '.gemini',
    '.vscode',
    '.idea',
    'node_modules',
    'brain',
    '.agent' // internal agent dir
];

const projects = [];

try {
    const items = fs.readdirSync(ROOT_DIR, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            if (IGNORE_DIRS.includes(item.name)) continue;

            // Check if directory has an index.html (simplest check for a web project)
            const projectPath = path.join(ROOT_DIR, item.name);
            const hasIndexHtml = fs.existsSync(path.join(projectPath, 'index.html'));

            if (hasIndexHtml) {
                projects.push({
                    name: item.name,
                    folder: item.name,
                    liveUrl: `./${item.name}/index.html`,
                    sourceUrl: `${GITHUB_BASE_URL}${encodeURIComponent(item.name)}`
                });
            }
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
    console.log(`Successfully generated projects.json with ${projects.length} projects.`);

} catch (err) {
    console.error('Error generating project list:', err);
}
