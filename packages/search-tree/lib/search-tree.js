'use strict'
const {custom = Symbol('unavailable: custom')} = require('util').inspect
const {stringify} = require('search-tree-utils')
const {assign, getPrototypeOf} = Object
const {iterator, toStringTag} = Symbol

function SearchTreeMapperBase (map, fn) {
  const mkmapfn = transform => () => new map.constructor(
    Array.from(map).map(([key, value]) => transform(fn(value, key, map), {key, value}))
  )

  assign(this, {
    pair: mkmapfn(pair => [...pair]),
    key: mkmapfn((key, {value}) => [key, value]),
    value: mkmapfn((value, {key}) => [key, value])
  })
}

class SearchTreeMapper extends SearchTreeMapperBase {
  static create (...args) {
    return new this(...args)
  }
}

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

    if (!spval) return false

    const {subtree} = spval

    if (rest.length) {
      if (subtree) {
        return subtree.delete(rest)
      } else {
        super.delete(first)
        return true
      }
    } else {
      if (subtree) {
        const {exists} = spval
        spval.exists = false
        return exists
      } else {
        super.delete(first)
        return true
      }
    }
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

  forEach (fn) {
    for (const [key, value] of this) {
      fn(value, key, this)
    }
    return this
  }

  map (fn) {
    const {Mapper = SearchTreeMapper} = this.constructor
    return new Mapper(this, fn)
  }

  toString ({
    prefix = `${this[toStringTag]}\n`,

    suffix = '',

    arrow = ' => ',

    delimiter = ',\n  ',

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

  get [custom] () {
    return this.toString()
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

SearchTree.Mapper = SearchTreeMapper

module.exports = SearchTree
