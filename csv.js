/**
 * Read CSV
 */
const fs = require("fs");
const { parse } = require("csv-parse");


function readCsv(path, delimiter = ';', startLine= 1, rowCallback, endCallback) {
    let rowIndex = 0;
    let csvHeader = null;
    fs.createReadStream(path)
        .pipe(parse({delimiter: delimiter, from_line: startLine}))
        .on("data", (row) => {
            if(rowIndex === 0) {
                csvHeader = row;
            } else {
                const rowByHeader = row.reduce(
                    (result, field, index) => ({ ...result, [csvHeader[index]]: field }), {}
                );
                rowCallback(rowIndex, rowByHeader);
            }
            rowIndex++;
        })
        .on("end", endCallback)
        .on("error", function (error) {
            console.log('CSV ERROR : ', error.message);
        });
}

module.exports = {
    read: readCsv
}
