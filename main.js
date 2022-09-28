const data = require('./data');
const yargs = require('yargs');

const argv = yargs
    .scriptName('node-csv-placeholder')
    .usage('$0 <cmd> [args]')
    .command('run [data] [vars] [placeholder] [constant] [template]',
        'Render row data in a template with placeholder, vars and constant', {
        data: {
            description: 'path of data file in csv with \';\' as separator ONLY! and Utf8 ONLY!',
            alias: 'd',
            type: 'string'
        },
        vars: {
            description: 'path of vars file',
            alias: 'v',
            type: 'string'
        },
        constant: {
            description: 'path of constant file',
            alias: 'c',
            type: 'string'
        },
        template: {
            description: 'path of template file',
            alias: 't',
            type: 'string'
        },
        placeholder: {
            description: 'path of placeholder file',
            alias: 'p',
            type: 'string'
        }
    })
    .help()
    .alias('help', 'h').argv;

if (argv._.includes('run')) {
    data.run(argv.data, argv.template, argv.placeholder, argv.vars, argv.constant);
}
