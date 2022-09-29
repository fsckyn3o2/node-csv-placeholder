/**
 * Load Template to print placeholder
 */

const fs = require('fs');
const rl = require('readline');
const parser = require("./variable-parser");
const Path = require("path");

function Helper(context) {
    Object.entries(context).forEach(([key, value]) => this[key] = value);
    this.notEmpty = (test, value) => test?value:'';
}

function renderTemplate(path, context, renderCallback) {

    const _helper = new Helper({...context});
    const _context = {helper: _helper, ...context};
    const result = [];

    rl.createInterface({
        input: fs.createReadStream(path),
        output: process.stdout,
        terminal: false
    })
    .on('line', (line) => result.push(parser.parse(line, _context)) )
    .on('close', () => renderCallback(result.join("\n")) );
}

function saveRenderedTemplate(targetPath, data) {
    if(fs.existsSync(targetPath)) {
        fs.appendFile(targetPath, data, (err) => (err) ? console.log('TEMPLATE SAVING ERROR', err): null);
    } else {
        fs.writeFile(targetPath, data, (err) => (err) ? console.log('TEMPLATE SAVING ERROR', err): null);
    }
}

module.exports = {
    render: renderTemplate,
    save: saveRenderedTemplate
}
