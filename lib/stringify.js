const {inspect} = require('util')
const jtry = require('just-try')

const chaintry = (act, onerror, ...fnlist) =>
  jtry(act, fnlist.length ? () => jtry(onerror, fnlist) : onerror)

const stringify = object => chaintry(
  () => inspect(object),
  () => JSON.stringify(object),
  () => String(object),
  () => `[Object ${object[Symbol.toStringTag]}]`,
  () => `[Object ${object.constructor.name}]`,
  () => '[Object]'
)

module.exports = stringify
