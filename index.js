'use strict'
const SearchTree = require('./lib/search-tree.js')

class StringSearchTree extends SearchTree {
  constructor (elements) {
    super(elements.map(([key, value]) => [String(key), value]))
  }

  has (key) {
    return super.has(String(key))
  }

  get (key) {
    return super.get(String(key))
  }

  set (key, value) {
    super.set(String(key), value)
    return this
  }

  delete (key, value) {
    return super.delete(String(key), value)
  }

  * entries () {
    for (const [key, value] of super.entries()) {
      yield [key.join(''), value]
    }
  }

  static get SearchTree () {
    return SearchTree
  }
}

module.exports = StringSearchTree
