/**
 * Read CSV
 */
const fs = require("fs");
const { parse } = require("csv-parse");

function readCsv(path, opts = {delimiter: ';', startLine: 1}, rowCallback, streamCloseCallback) {
    let rowIndex = opts.startLine;
    fs.createReadStream(path)
        .pipe(parse({delimiter: opts.delimiter, from_line: opts.startLine, columns: true, skip_empty_lines: true}))
        .on("data", (row) => {
            rowCallback(rowIndex, row);
            rowIndex++;
        })
        .on("error", (error) => {
            console.log('CSV ERROR : ', error.message);
        })
        .on("close", streamCloseCallback);
}

module.exports = {
    read: readCsv
}
