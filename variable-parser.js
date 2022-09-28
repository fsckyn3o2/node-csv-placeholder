
function parser(exp, context) {
    with(context) {
        return eval(exp);
    }
}

function parseVariable(string, context) {
    const exp = '"' + string.replaceAll('${', '" + ').replaceAll('}', ' + "') + '"';
    return parser.bind({}, exp, context)();
}

module.exports = {
    parse: parseVariable
}
