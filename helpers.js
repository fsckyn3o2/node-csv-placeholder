/**
 * Helpers for all
 */

const math = require("mathjs");
const moment = require("moment");

function Helper(context) {
    Object.entries(context).forEach(([key, value]) => this[key] = value);

    this.date = (pattern) => moment().format(pattern);
    this.get = (key) => this[key];
    this.getDataKey = () => this._dataKey;
    this.format = (pattern) => eval(pattern);
    this.math = (a) => math.chain(a);
    this.notEmpty = (test, value) => test ? value : '';
    this.equals = (expectedValue, value, result) => expectedValue === value ? result : '';
    this.trim = (value) => value.replaceAll('  ', ' ').trim();
    this.switch = (value, testArr, newArr, defaultValue = '') => {
        const i = testArr.indexOf(value);
        return i>=0 ? newArr[i] : defaultValue;
    };
}

module.exports = Helper;
