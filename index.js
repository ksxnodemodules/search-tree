'use strict'
const {resolve} = require('path')
const packages = resolve(__dirname, 'packages')
const {defineProperty} = Object

require('fs')
  .readdirSync(packages)
  .map(item => [resolve(packages, item), item])
  .forEach(([pkgname, item]) => {
    const desc = {enumerable: true}

    try {
      desc.value = require(pkgname)
    } catch (error) {
      console.error(error)
      desc.get = () => require(pkgname)
    }

    ; [pkgname, item].forEach(
      name => defineProperty(exports, name, desc)
    )
  })
