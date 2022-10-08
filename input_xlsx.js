/**
 * Read EXCEL file
 * documentation of xslx : https://docs.sheetjs.com/docs/solutions/input#example-local-file
 */
const fs = require("fs");
const reader = require("xlsx");


function readExcel(path, opts = {sheetname: null, startline: 1}, rowCallback) {
    const parserParam = {startline: opts.startline};
    if(opts.sheetname != null) parserParam.sheets = [opts.sheetname];

    const workbook = reader.readFile(path, parserParam);
    const sheets = workbook.SheetNames;

    sheetname = opts.sheetname === null ? sheets[0] : (sheets.filter(s => s === opts.sheetname) || [null])[0];
    if(sheetname === null) {
        return ;
    }

    let rowIndex = opts.startline-1;
    let rowHeader = [];
    reader.utils.sheet_to_json(workbook.Sheets[sheetname], {
        skipHidden: true,
        header: 1,
        rawNumbers: true,
        blankrows: false,
        raw: opts.raw !== undefined ? opts.raw : false
    }).forEach(row => {
        if(rowIndex < opts.startline){
            rowHeader = row;
            rowIndex++;
        } else {
            rowCallback(rowIndex, rowHeader.map((k,i) => ({[k]: row[i]})).reduce((p,c,i) => ({...p,...c})) );
            rowIndex++;
        }
    });
}

module.exports = {
    read: readExcel
}
