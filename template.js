/**
 * Load Template to print placeholder
 */

const fs = require('fs');
const rl = require('readline');
const parser = require("./variable-parser");

function renderTemplate(path, context, renderCallback) {
    const result = [];
    rl.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
    })
    .on('line', (line) => result.push(parser.parse(line, context)) )
    .on('close', () => renderCallback(result.join("\n")) );
}

module.exports = {
    render: renderTemplate
}
