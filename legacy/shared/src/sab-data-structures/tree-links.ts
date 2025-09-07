export const ROOT = 0 as const

const NODE_WORDS = 5 as const
const PARENT = 0 as const
const FIRST = 1 as const
const LAST = 2 as const
const PREV = 3 as const
const NEXT = 4 as const

const NONE = 0xFFFFFFFF as const

export class SABTreeLinks {
  readonly #meta: Uint32Array

  constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number) {
    this.#meta = new Uint32Array(sab, byteOffset, capacity * NODE_WORDS)
    this.#meta.fill(NONE)
  }

  static bytesRequired(capacity: number): number {
    return capacity * NODE_WORDS * Uint32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#meta.byteLength }

  #offset(i: number) { return i * NODE_WORDS }
  #parent(i: number) { return this.#meta[this.#offset(i) + PARENT] }
  #first(i: number) { return this.#meta[this.#offset(i) + FIRST] }
  #last(i: number) { return this.#meta[this.#offset(i) + LAST] }
  #next(i: number) { return this.#meta[this.#offset(i) + NEXT] }

  remove(i: number) {
    const o = this.#offset(i)
    const p = this.#meta[o + PARENT]
    const l = this.#meta[o + PREV]
    const r = this.#meta[o + NEXT]

    if (p !== NONE) {
      const po = this.#offset(p)
      if (this.#meta[po + FIRST] === i) this.#meta[po + FIRST] = r
      if (this.#meta[po + LAST] === i) this.#meta[po + LAST] = l
    }
    if (l !== NONE) this.#meta[this.#offset(l) + NEXT] = r
    if (r !== NONE) this.#meta[this.#offset(r) + PREV] = l
  }

  #linkAsOnlyChild(p: number, c: number) {
    const po = this.#offset(p), co = this.#offset(c)
    this.#meta[co + PARENT] = p
    this.#meta[co + PREV] = NONE
    this.#meta[co + NEXT] = NONE
    this.#meta[po + FIRST] = c
    this.#meta[po + LAST] = c
  }

  #insertAfterSibling(p: number, left: number, c: number) {
    const lo = this.#offset(left)
    const right = this.#meta[lo + NEXT]
    const co = this.#offset(c)

    this.#meta[co + PARENT] = p
    this.#meta[co + PREV] = left
    this.#meta[co + NEXT] = right

    this.#meta[lo + NEXT] = c
    if (right !== NONE) this.#meta[this.#offset(right) + PREV] = c
    else this.#meta[this.#offset(p) + LAST] = c
  }

  #insertBeforeSibling(p: number, right: number, c: number) {
    const ro = this.#offset(right)
    const left = this.#meta[ro + PREV]
    const co = this.#offset(c)

    this.#meta[co + PARENT] = p
    this.#meta[co + NEXT] = right
    this.#meta[co + PREV] = left

    this.#meta[ro + PREV] = c
    if (left !== NONE) this.#meta[this.#offset(left) + NEXT] = c
    else this.#meta[this.#offset(p) + FIRST] = c
  }

  insert(p: number, c: number) {
    this.remove(c)
    const last = this.#last(p)
    if (last === NONE) this.#linkAsOnlyChild(p, c)
    else this.#insertAfterSibling(p, last, c)
  }

  insertAt(p: number, c: number, index: number) {
    this.remove(c)

    const f = this.#first(p)
    if (f === NONE) { this.#linkAsOnlyChild(p, c); return }

    if (index <= 0) { this.#insertBeforeSibling(p, f, c); return }

    let i = 0, cur = f
    while (cur !== NONE && i < index) { cur = this.#next(cur); i++ }

    if (cur === NONE) this.insert(p, c)
    else this.#insertBeforeSibling(p, cur, c)
  }

  forEach(visitor: (node: number) => void): void {
    let u: number = ROOT
    while (true) {
      visitor(u)

      const f = this.#first(u)
      if (f !== NONE) { u = f; continue }

      while (true) {
        if (u === ROOT) return
        const n = this.#next(u)
        if (n !== NONE) { u = n; break }
        u = this.#parent(u)
      }
    }
  }

  sortChildren(
    p: number,
    getValue: (node: number) => number,
  ) {
    let n = 0
    let head = this.#first(p)
    while (head !== NONE) { n++; head = this.#next(head) }
    if (n <= 1) return

    let runSize = 1
    while (runSize < n) {
      let mergedHead: number = NONE
      let mergedTail: number = NONE

      let cur = this.#first(p)
      while (cur !== NONE) {
        let left = cur
        let i = 1
        while (i < runSize && this.#next(cur) !== NONE) { cur = this.#next(cur); i++ }

        let right = this.#next(cur)
        const afterRightStart = right
        this.#meta[this.#offset(cur) + NEXT] = NONE
        if (right !== NONE) this.#meta[this.#offset(right) + PREV] = NONE

        let nextStart = afterRightStart
        i = 0
        while (i < runSize && nextStart !== NONE) { nextStart = this.#next(nextStart); i++ }

        if (nextStart !== NONE) {
          const prev = this.#meta[this.#offset(nextStart) + PREV]
          if (prev !== NONE) this.#meta[this.#offset(prev) + NEXT] = NONE
          this.#meta[this.#offset(nextStart) + PREV] = NONE
        }

        cur = nextStart

        let merged: number = NONE
        let mergedT: number = NONE
        let a = left
        let b = right

        while (a !== NONE || b !== NONE) {
          let takeFromA = false
          if (b === NONE) takeFromA = true
          else if (a === NONE) takeFromA = false
          else {
            const ka = getValue(a)
            const kb = getValue(b)
            takeFromA = (ka <= kb)
          }

          const node = takeFromA ? a : b
          if (takeFromA) a = this.#next(a); else b = this.#next(b)

          const no = this.#offset(node)
          this.#meta[no + PREV] = mergedT
          this.#meta[no + NEXT] = NONE
          this.#meta[no + PARENT] = p

          if (merged === NONE) merged = node
          else this.#meta[this.#offset(mergedT) + NEXT] = node
          mergedT = node
        }

        if (mergedHead === NONE) mergedHead = merged
        else {
          this.#meta[this.#offset(mergedTail) + NEXT] = merged
          this.#meta[this.#offset(merged) + PREV] = mergedTail
        }
        mergedTail = mergedT
      }

      const po = this.#offset(p)
      this.#meta[po + FIRST] = mergedHead
      this.#meta[po + LAST] = mergedTail

      runSize <<= 1
    }
  }
}
