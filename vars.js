/**
 * Load vars config file.
 * Example :
 *   rowIndex=${helper.getDataKey()}
 *   pid=bull${helper.get('mynum')}
 *   ppid=${helper.format("10${mynum}") + 1}
 *   ppidGeek=${helper.math( helper.format("10${mynum}") ).add(1).done()}
 *
 *   Important note : Inside a placeholder ${  } you have to use double quote " for a string with a placeholder too :
 *                      - ${helper.format("10${mynum}") + 1}
 */

const cfgReader = require('properties-reader');
const moment = require("moment");
const math = require('mathjs');
const parser = require('./variable-parser');
const Helper = require('./helpers')

function loadVars(path) {
    const result = new Object();
    const properties = cfgReader(path);
    properties.each((key, value) => {
        result[key] = value;
    });
    return result;
}

function applyData(loadedVars, dataKey, data) {
    let result = {};

    const context = {helper: new Helper({_dataKey: dataKey, ...data}), _dataKey: dataKey, ...data};
    for(const [key, value] of Object.entries(loadedVars)) {
        result[key] = parser.parse(value, context);
    }
    return result;
}

module.exports = {
    load: loadVars,
    apply: applyData,
}
