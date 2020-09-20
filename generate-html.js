const child_process = require('child_process');
const fs = require('fs').promises;
const path = require('path');

(async function process() {
    child_process.execSync('asciidoctor -R source -D html source/**/*.asciidoc');

    for await (const filename of getFiles('html')) {
        console.log(filename);
        await processLinks(filename);
    }
})();

async function processLinks(filename) {
    let content = await fs.readFile(filename, 'utf8');

    content = content.replace(/\.asciidoc/g, '.html');

    await fs.writeFile(filename, content, 'utf8');
}

async function* getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });

    for (const dirent of dirents) {
        const res = path.resolve(dir, dirent.name);

        if (dirent.isDirectory()) {
            yield* getFiles(res);
        } else {
            yield res;
        }
    }
}