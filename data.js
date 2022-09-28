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
 *   ppidGeek=${helper.math( helper.format("10${mynum}") ).add(1).done()} // thanks 'mathjs.org' XD
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
 *   a. constant -> constant.load('$5')
 *   b. vars -> vars.load('$4')
 *   c. placeholder -> placeholder.load('$3')
 *   d. data -> csv.read('$1')
 *   e. template -> template.read('$2') -- RENDER FOR EACH DATA ROW
 *
 */

const constant = require('./constant');
const vars = require('./vars');
const placeholder = require('./placeholder');
const csv = require('./csv');
const template = require('./template');
const {render} = require("./template");

function run(csvPath, templatePath, placeholderPath, varsPath, constantPath) {

console.log(`Run data with parameters :
  - csvPath :\t\t ${csvPath}
  - templatePath :\t ${templatePath}
  - placeholderPath :\t ${placeholderPath}
  - varsPath :\t\t ${varsPath}
  - constantPath :\t ${constantPath}
`);

    const _const = constant.load(constantPath);
    const _vars = vars.load(varsPath);
    const _placeholders = placeholder.load(placeholderPath);

    const result = [];
    csv.read(csvPath, ';', 1, (rowIndex, row) => {
        const context = {
            ...row,
            cts: _const,
            vars: vars.apply(_vars, rowIndex, row),
            plh: {}
        };

        for (const [k, p] of Object.entries(_placeholders)) {
            context.plh[k] = placeholder.apply(p, context); // You can use Placeholder inside Placeholder
        }

        template.render(templatePath, context, (renderedRow) => {
            result.push(renderedRow);
            console.log(renderedRow);
        });

    }, () => { console.log('!THE END! -- Stdout export'); console.log(result.join("\n"));} );
}


module.exports = {
    run: run
}
