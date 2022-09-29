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

const helperC = require('./constant').helper;

const cfgReader = require('properties-reader');
const moment = require("moment");
const math = require('mathjs');
const parser = require('./variable-parser');
const {help} = require("mathjs");

function Helper(context) {
    Object.entries(context).forEach(([key, value]) => this[key] = value);
    Object.entries(helperC).forEach(([key, value]) => this[key] = value);

    this.get = (key) => this[key];
    this.getDataKey = () => this._dataKey;
    this.format = (pattern) => eval(pattern);
    this.math = (a) => math.chain(a);
    this.notEmpty = (test, value) => test ? value : '';
    this.trim = (value) => value.replaceAll('  ', ' ').trim();
    this.switch = (value, testArr, newArr, defaultValue = '') => {
      const i = testArr.indexOf(value);
      return i>=0 ? newArr[i] : defaultValue;
    };
}

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
    let _helper = new Helper({_dataKey: dataKey, ...data});

    const context = {helper: _helper, _dataKey: dataKey, ...data};
    for(const [key, value] of Object.entries(loadedVars)) {
        result[key] = parser.parse(value, context);
    }
    return result;
}

module.exports = {
    load: loadVars,
    apply: applyData,
    helper: Helper
}
