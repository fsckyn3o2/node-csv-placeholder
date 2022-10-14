/**
 * Load constant config file
 */
const moment = require('moment');
const cfgReader = require('properties-reader');
const parser = require("./variable-parser");
const Helper = require('./helpers');

function loadConstant(path) {
    const result = {};
    const properties = cfgReader(path);
    properties.each((key, value) => {
        result[key] = parser.parse(value, {helper: new Helper({})});
    });
    return result;
}

module.exports = {
    load: loadConstant,
}
