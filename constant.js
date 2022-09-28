/**
 * Load constant config file
 */
const moment = require('moment');
const cfgReader = require('properties-reader');
const parser = require("./variable-parser");

const helper = {
    date: (pattern) => moment().format(pattern),
}

function loadConstant(path) {
    const result = {};
    const properties = cfgReader(path);
    properties.each((key, value) => {
        result[key] = parser.parse(value, {helper: helper});
    });
    return result;
}

module.exports = {
    load: loadConstant,
    helper: helper
}
