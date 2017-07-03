'use strict'
const {resolve} = require('path')
const packages = resolve(__dirname, 'packages')
const {defineProperty} = Object

require('fs')
  .readdirSync(packages)
  .map(item => [resolve(packages, item), item])
  .forEach(([pkgname, item]) => {
    try {
      const desc = {value: require(pkgname), enumerable: true}
      defineProperty(exports, pkgname, desc)
      defineProperty(exports, item, desc)
    } catch (error) {
      console.error(error)
      const desc = {get: () => require(pkgname), enumerable: true}
      defineProperty(exports, pkgname, desc)
      defineProperty(exports, item, desc)
    }
  })
