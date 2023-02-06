const data = require('./data');
const yargs = require('yargs');

const argv = yargs
    .scriptName('node-csv-placeholder')
    .usage('$0 <cmd> [args]')
    .command('run [data] [vars] [placeholder] [constant] [template] [output]',
        'Render row data with a template, placeholder, vars, constant and write it in an output directory', {
        data: {
            description: 'path of data file, support csv, excel (xls, xlsx) (see dataOpt parameters to customize data file parser)',
            alias: 'd',
            type: 'string'
        },
        dataOpt: {
            description: 'options for data parser, multiple [dataOpt] parameters accepted',
            alias: 'D',
            type: 'string'
        },
        constant: {
            description: 'path of constant file ./test/constant.cfg',
            alias: 'c',
            type: 'string'
        },
        vars: {
            description: 'path of vars file ./test/vars.cgf',
            alias: 'v',
            type: 'string'
        },
        placeholder: {
            description: 'path of placeholder file ./test/placeholder.cfg',
            alias: 'p',
            type: 'string'
        },
        template: {
            description: 'array of template file : ./test/template.tpl, multiple [template] parameters accepted',
            alias: 't',
            type: 'string'
        },
        mastertemplate: {
            description: 'array of master template files : ./test/mastemplate.tpl, multiple [master template] parameters accepted',
            alias: 'm',
            type: 'string'
        },
        clean: {
            description: 'clean target path before rendering, active by default',
            alias: 'r',
            type: 'boolean',
            default: true
        },
        output: {
            description: 'target path where generated file will be created',
            alias: 'o',
            type: 'string',
            default: './output'
        },
        outputext: {
            description: 'extension of generated files',
            alias: 'e',
            type: 'string',
            default: '.sql'
        },
        stdoutput: {
            description: 'enable/disable console log for template rendering, active by default.',
            alias: 's',
            type: 'boolean',
            default: true
        },
        allinone: {
            description: 'enable/disable "all-in-one" generation file, active by default',
            alias: 'a',
            type: 'boolean',
            default: true
        }
    })
    .help()
    .alias('help', 'h').argv;

if (argv._.includes('run')) {
    data.run(argv.data, argv.dataOpt, argv.mastertemplate, argv.template, argv.placeholder, argv.vars, argv.constant, argv.output, argv.outputext, argv.allinone, argv.stdoutput, argv.clean);
}
