const jtry = require('just-try')
const stringify = object => jtry(() => JSON.stringify(object), () => String(object))
module.exports = stringify
