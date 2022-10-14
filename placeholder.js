/**
 * Read PLACEHOLDER configuration
 */
const cfgReader = require('properties-reader');
const parser = require("./variable-parser");
const Helper = require('./helpers')

function loadPlaceholder(path) {
    const result = {};
    const properties = cfgReader(path);
    properties.each((key, value) => result[key] = value );
    return result;
}

function applyContext(currentPlaceholder, context) {
    const _context = {helper: new Helper(context), ...context};
    return parser.parse(currentPlaceholder, _context);
}

module.exports = {
    load: loadPlaceholder,
    apply: applyContext
}
