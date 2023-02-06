/**
 * Master Template is to create a pivot from output file to Master Layout like transform rows to column
 * Load Master-Template with special commands
 */
const fs = require('fs');
const parser = require("./variable-parser");

function loadMasterTemplate(path) {
    let result = '';
    if(fs.existsSync(path)) {
        result = fs.readFileSync(path, {flag: 'r'});
    } else {
        console.error(`Master template not found : ${path}`);
    }
    return result;
}

function commandWith(inKey, outKey) {
    this.out[outKey] = this.out[inKey];
}

function commandLabel(id, withDataArr) {
    this._labelId = id;
    Object.entries(withDataArr).for((key, value) => {
        this.out[key] = value;
    });
}

function commandEndLabel(id) {
    this.out = [];
}

function renderMasterTemplate(template, context, renderCallback) {
    const _context = {Label: commandLabel, EndLabel: commandEndLabel, With: commandWith, ...context};
    const result = [];
    const tplLines = template.toString().replace(/\r\n/g, '\n').split('\n');

    for(let line of tplLines) {
        result.push(parser.parse(line, _context));
    }
    renderCallback(result.join('\n'));
}

function renderedMasterTemplateToFile(writeStream, data) {
    writeStream.write(data);
}

module.exports = {
    load: loadMasterTemplate,
    render: renderMasterTemplate,
    saveToFile: renderedMasterTemplateToFile
}
