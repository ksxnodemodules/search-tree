'use strict'
const {inspect} = require('util')
const jtry = require('just-try')

const chaintry = (act, onerror, ...fnlist) =>
  jtry(act, fnlist.length ? () => jtry(onerror, fnlist) : onerror)

const stringify = (object, options = {}) => chaintry(
  () => inspect(object, options.inspect),
  () => JSON.stringify(object, ...options.json || []),
  () => object.toString(options.string),
  () => String(object),
  () => `[Object ${object[Symbol.toStringTag]}]`,
  () => `[Object ${object.constructor.name}]`,
  () => '[Object]'
)

module.exports = stringify
