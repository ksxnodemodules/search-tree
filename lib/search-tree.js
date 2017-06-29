'use strict'
const {assign} = Object
const {iterator, toStringTag} = Symbol

class SearchTree extends Map {
  constructor (...args) {
    super()
    args.forEach(x => this.set(...x))
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
      const subtree = new SearchTree([rest, value])
      super.set(first, {subtree, exists: true, value, __proto__: null})
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

    for (const [spval] of super.entries()) {
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

      if (exists) yield value

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
    arrow = ' => ',

    delimiter = ', ',

    brackets: [
      openBracket = '{ ',
      closeBracket = ' }'
    ] = []
  } = {}) {
    const middle = Array.from(this)
      .map(x => x.join(arrow))
      .join(delimiter)

    return openBracket + middle + closeBracket
  }

  get [toStringTag] () {
    return 'SearchTree'
  }

  _showInternalStructure () {
    return new Map(super.entries()
      .map(([keyel, spval]) => {
        if (!spval) return [keyel, spval]

        const {subtree, exists, value} = spval

        return subtree
          ? {
            subtree: subtree._showInternalStructure(),
            exists,
            value
          }
          : spval
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

  static create () {
    return new this()
  }

  static get new () {
    return this.create()
  }
}

module.exports = SearchTree
