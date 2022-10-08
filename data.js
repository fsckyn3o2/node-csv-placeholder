/**
 * Replace key (from placeholder.js) with data (from csv.js)
 *
 *
 * constant.cfg :
 *   now=${helper.date('YYY-mm-dd HH:mm:ss')}
 *   insertDate=2022/09/27
 *   user=user001
 *
 * vars.cfg (reset for each row) :
 *   rowIndex=${helper.getDataKey()}
 *   pid=bull${helper.get('mynum')}
 *   ppid=${helper.format("10${mynum}") + 1}
 *   ppidGeek=${helper.math("10${mynum}").add(1).done()} // thanks 'mathjs.org' XD
 *
 * placeholder.cfg :
 *   INSERT_BS001=INSERT INTO bullshit (id, insert_date, username, header1, header2) VALUES ('bbs000', '${const.insertDate}', '${const.user}', '${header1}', '${header2}');
 *   INSERT_BS002=INSERT INTO bullshit (id, insert_date, username, header1, header2) VALUE ('${vars.pid}', '${const.insertDate}', '${const.user}', '${header1}', '${header2}');
 *   INSERT_BS003=INSERT INTO bullshit (id, insert_date, username, header1, header2) VALUE ('${vars.ppid}', '${const.insertDate}', '${const.user}', '${header1}', '${header3}');
 *   INSERT_BS004=INSERT INTO bullshit (id, insert_date, username, header1, header2) VALUE ('${vars.ppidGeek}', '${const.insertDate}', '${const.user}', '${header1}', '${header3}');
 *   SELECT_BS_HEADER1=SELECT * FROM bullshit WHERE header1 = '${header1}';
 *   SELECT_BS_USERNAME=SELECT * FROM bullshit WHERE username = '${const.user}';
 *   SELECT_BS_INSIDE_BS=${plh.SELECT_BS_USERNAME} AND header1 = '${header1}';
 *
 * template.tpl :
 *   -- BBS Scripts
 *   -- ${const.now}
 *
 *   -- Line - ${vars.rowIndex}
 *   ${placeholder.INSERT_BS001}
 *   ${placeholder.INSERT_BS002}
 *   ${placeholder.INSERT_BS003}
 *   ${placeholder.INSERT_BS004}
 *   ${placeholder.SELECT_BS_HEADER1}
 *   ${placeholder.SELECT_BS_USERNAME}
 *
 * data.csv :
 *   mynum;header1;header2;header3
 *   001;value11;value12;value13
 *   002;value21;value22;value23
 *   252;value31;value32;value33
 *
 *
 * 0. npm run start ./test.csv ./template.tpl ./placeholder.config ./vars.config ./constant.config
 *   a. constant -> constant.load('csvPath')
 *   b. vars -> vars.load('varsPath')
 *   c. placeholder -> placeholder.load('placeholderPath')
 *   d. template -> template.load('templatePath')
 *
 *   {
 *       This script use only files output
 *       Section "Output directory processing" contains stuff for that.
 *
 *       TODO extract section "Output directory processing" from data to a new "runOnFile" command.
 *       TODO create new command "runOnHttp" to do same with HTTP POST input for example.
 *
 *   }
 *
 *   e. data -> csv.read('$1')
 *        -> d.1 : vars.apply -- to apply row data on vars.cfg
 *        -> d.2 : placeholder.apply -- to apply row data on placeholder.cfg
 *        -> d.3 : template.render -- to render row data with [template.tpl] (which can be an array)
 *
 *   f. rendered row is write in output directory
 *
 */

const fs = require('fs');
const Path = require('path')
const constant = require('./constant');
const vars = require('./vars');
const placeholder = require('./placeholder');
const template = require('./template');

const inputCsv = require('./input_csv');
const inputXlsx = require('./input_xlsx');

function getDataParser(dataPath, dataOpt) {
    if(dataPath.lastIndexOf('.csv') === dataPath.length - 4) {
        return inputCsv;
    } else if(
        dataPath.lastIndexOf('.xlsx') === dataPath.length - 5 ||
        dataPath.lastIndexOf('.xls') === dataPath.length - 4
    ) {
        return inputXlsx;
    } else {
        return {read: () => console.error(`Data parser not found for paht : ${dataPath}`)};
    }
}

function run(dataPath, dataOpt, templatePath, placeholderPath, varsPath, constantPath, outputPath = null, outputExt = '.sql', allInOne = true, stdoutput = true, clean = true) {

console.log(`Run data with parameters :
  - dataPath :\t\t ${dataPath}
  - dataOpt :\t\t ${dataOpt}
  - templatePath :\t ${templatePath}
  - placeholderPath :\t ${placeholderPath}
  - varsPath :\t\t ${varsPath}
  - constantPath :\t ${constantPath}
  - outputPath :\t ${outputPath}
  - outputExt :\t ${outputExt}
  - stdOutput :\t ${stdoutput}
  - clean :\t ${clean}
`);

    console.log('Prepare modules :')
    const _const = constant.load(constantPath);
    console.log("  - constant loaded");
    const _vars = vars.load(varsPath);
    console.log("  - variable loaded");
    const _placeholders = placeholder.load(placeholderPath);
    console.log("  - placeholder loaded");


    const templates = (!Array.isArray(templatePath)?[templatePath]:templatePath)
        .map(tplPath => ({
                tplPath: tplPath,
                tplContent: template.load(tplPath),
                outputPath: false
            })
        );
    console.log("  - template loaded");

    // --- Output directory processing ----
    // ------------------------------------
    if(outputPath !== null && fs.existsSync(outputPath)) {

        console.log("  - prepare output");

        allInOneStream = false;
        if(allInOne) {
            if(clean) {
                allInOneStream = fs.createWriteStream(outputPath + '/all-in-one' + outputExt,{flags: 'w', autoClose: true, emitClose: true});
            } else {
                allInOneStream = fs.createWriteStream(outputPath + '/all-in-one' + outputExt, {flags: 'a', autoClose: true, emitClose: true});
            }
        }

        templates.forEach(tplObj => {
            tplObj.outputPath = outputPath ?
                outputPath + Path.sep + Path.basename(Path.basename(tplObj.tplPath), Path.extname(tplObj.tplPath)) + outputExt : false;

            if(clean) {
                tplObj.outputStream = fs.createWriteStream(tplObj.outputPath, {flags: 'w', autoClose: true, emitClose: true});
            } else {
                tplObj.outputStream = fs.createWriteStream(tplObj.outputPath, {flags: 'a', autoClose: true, emitClose: true});
            }
            tplObj.outputStreamAllInOne = allInOneStream;
        });
    }

    if(stdoutput) {
        console.log("\n---- OUTPUT ----\n----------------\n");
    }

    // ------------------------------------
    // ------------------------------------

    // Data source reading and rendering :
    const dataParser = getDataParser(dataPath, dataOpt);
    dataParser.read(dataPath, dataOpt, (rowIndex, row) => {

        let currentStatus =  `\r(...) processing line ${rowIndex} - `;
        if(!stdoutput) process.stdout.write(currentStatus);

        const context = {
            ...row,
            cts: _const,
            vars: {},
            plh: {}
        };

        // For rowdata - load vars
        context.vars = vars.apply(_vars, rowIndex, context);

        // For rowdata - load placeholder
        for (const [k, p] of Object.entries(_placeholders)) {
            context.plh[k] = placeholder.apply(p, context); // You can use Placeholder inside Placeholder
        }

        // For rowdata - render template
        templates.forEach(({tplPath, outputPath, tplContent, outputStream, outputStreamAllInOne}) => {
            template.render(tplContent, context, (renderedRow) => {

                if(outputPath) {
                    template.saveToFile(outputStream, renderedRow);
                    template.saveToFile(outputStreamAllInOne, renderedRow);
                }

                if(stdoutput) console.log(renderedRow);
                else process.stdout.write(currentStatus + ` current template - ${tplPath}` );
            });
        });

    });
}


module.exports = {
    run: run
}
