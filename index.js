'use strict'
const {resolve} = require('path')
const packages = resolve(__dirname, 'packages')
const {defineProperty} = Object

require('fs')
  .readdirSync(packages)
  .map(item => [resolve(packages, item), item])
  .forEach(([pkgname, item]) => {
    const desc = {enumerable: true, writable: false, configurable: false}

    try {
      desc.value = require(pkgname)
    } catch (error) {
      console.error(error)
      desc.get = () => require(pkgname)
    }

    ; [pkgname, createCamelCaseName(item)].forEach(
      name => defineProperty(exports, name, desc)
    )
  })

function createCamelCaseName (dashes) {
  const [first, ...rest] = String(dashes).split(/[-_ ]/)
  const reststr = rest.map(capitalize).join('')
  return first + reststr
}

function capitalize ([first, ...rest]) {
  const firststr = String(first).toUpperCase()
  const reststr = rest.map(x => String(x).toLowerCase()).join('')
  return firststr + reststr
}

Object.assign(exports, {createCamelCaseName, capitalize})
