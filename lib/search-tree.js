'use strict'
const stringify = require('./stringify.js')
const {assign, getPrototypeOf} = Object
const {iterator, toStringTag} = Symbol

class SearchTree extends Map {
  constructor (elements = []) {
    super()
    elements.forEach(x => this.set(...x))
  }

  has ([first, ...rest]) {
    const spval = super.get(first)

    return Boolean(spval && (
      rest.length
        ? spval.subtree.has(rest)
        : spval.exists
    ))
  }

  get ([first, ...rest]) {
    const spval = super.get(first)

    return spval
      ? (rest.length
        ? spval.subtree.get(rest)
        : spval.value
      )
      : undefined
  }

  set ([first, ...rest], value) {
    const spval = super.get(first)

    if (spval) {
      if (rest.length) {
        spval.subtree.set(rest, value)
      } else {
        const {subtree = new SearchTree()} = spval
        assign(spval, {subtree, exists: true, value})
      }
    } else {
      const {length} = rest
      const subtree = new SearchTree(length ? [[rest, value]] : [])
      super.set(first, {subtree, exists: !length, value, __proto__: null})
    }

    return this
  }

  delete ([first, ...rest]) {
    const spval = super.get(first)

    if (!spval || !spval.exists) return false

    const {subtree} = spval

    if (rest.length) {
      if (subtree) {
        subtree.delete(rest)
      } else {
        super.delete(first)
      }
    } else {
      if (subtree) {
        spval.exists = false
      } else {
        super.delete(first)
      }
    }

    return true
  }

  clear () {
    super.clear()
    return this
  }

  get size () {
    let sz = 0

    for (const {1: spval} of super.entries()) {
      if (!spval) continue

      const {subtree, exists} = spval
      if (!subtree) continue

      sz += subtree.size + (exists ? 1 : 0)
    }

    return sz
  }

  * entries () {
    for (const [keyel, spval] of super.entries()) {
      if (!spval) continue

      const {subtree, exists, value} = spval

      if (exists) yield [keyel, value]

      if (subtree) {
        for (const [rest, value] of subtree) {
          yield [[keyel, ...rest], value]
        }
      }
    }
  }

  [iterator] () {
    return this.entries()
  }

  toString ({
    prefix = `${this[toStringTag]} `,

    suffix = '',

    arrow = ' => ',

    delimiter = ', ',

    brackets: [
      openBracket = '{ ',
      closeBracket = ' }'
    ] = []
  } = {}) {
    const middle = Array.from(this)
      .map(x => x.map(stringify).join(arrow))
      .join(delimiter)

    return prefix + openBracket + middle + closeBracket + suffix
  }

  get [toStringTag] () {
    return this.constructor.name
  }

  _showInternalStructure () {
    return new Map(Array.from(super.entries())
      .map(([keyel, spval]) => {
        if (!spval) return [keyel, spval]

        const {subtree, exists, value} = spval

        return [
          keyel,
          subtree
            ? {
              subtree: subtree._showInternalStructure(),
              exists,
              value
            }
            : spval
        ]
      })
    )
  }

  get _interalStructure () {
    return this._showInternalStructure()
  }

  remove (key) {
    this.remove(key)
    return this
  }

  get length () {
    return this.size
  }

  get count () {
    return this.size
  }

  static get name () {
    return 'SearchTree'
  }

  static get [toStringTag] () {
    return `class ${this.name} extends ${getPrototypeOf(this).name}`
  }

  static toString () {
    return this[toStringTag]
  }

  static create (...args) {
    return new this(...args)
  }

  static get new () {
    return this.create()
  }
}

module.exports = SearchTree
