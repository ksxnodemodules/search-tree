'use strict'
const {resolve} = require('path')
const packages = resolve(__dirname, 'packages')
const {defineProperty} = Object

require('fs')
  .readdirSync(packages)
  .map(item => resolve(packages, item))
  .forEach(pkgname => {
    try {
      defineProperty(exports, pkgname, {value: require(pkgname), enumerable: true})
    } catch (error) {
      console.error(error)
      defineProperty(exports, pkgname, {get: () => require(pkgname), enumerable: true})
    }
  })
