/**
 * Read PLACEHOLDER configuration
 */
const cfgReader = require('properties-reader');
const parser = require("./variable-parser");

function loadPlaceholder(path) {
    const result = {};
    const properties = cfgReader(path);
    properties.each((key, value) => result[key] = value );
    return result;
}

function applyContext(currentPlaceholder, context) {
    return parser.parse(currentPlaceholder, context);
}

module.exports = {
    load: loadPlaceholder,
    apply: applyContext
}
