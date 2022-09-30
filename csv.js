/**
 * Read CSV
 */
const fs = require("fs");
const { parse } = require("csv-parse");


function readCsv(path, delimiter = ';', startLine= 1, rowCallback) {
    let rowIndex = startLine;
    let csvHeader = null;
    fs.createReadStream(path)
        .pipe(parse({delimiter: delimiter, from_line: startLine, columns: true, skip_empty_lines: true}))
        .on("data", (row) => {
            rowCallback(rowIndex, row);
            rowIndex++;
        })
        .on("error", function (error) {
            console.log('CSV ERROR : ', error.message);
        });
}

module.exports = {
    read: readCsv
}
