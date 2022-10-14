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
    this.equals = (expectedValue, value, result) => expectedValue === value ? result : '';
}

function loadTemplate(path) {
    let result = '';
    if(fs.existsSync(path)) {
        result = fs.readFileSync(path, {flag: 'r'});
    }
    return result;
}

function renderTemplate(template, context, renderCallback) {
    const _context = {helper: new Helper({...context}), ...context};
    const result = [];
    const tplLines = template.toString().replace(/\r\n/g, '\n').split('\n');

    for(let line of tplLines) {
        result.push(parser.parse(line, _context));
    }
    renderCallback(result.join('\n'));
}

function renderedTemplateToFile(writeStream, data) {
    writeStream.write(data);
}

module.exports = {
    load: loadTemplate,
    render: renderTemplate,
    saveToFile: renderedTemplateToFile
}
