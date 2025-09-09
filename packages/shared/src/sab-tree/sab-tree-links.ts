import { NONE, ROOT } from '../constants'

export const TREE_LINK_V_COUNT = 5 as const

const PARENT_IDX = 0 as const
const FIRST_IDX = 1 as const
const LAST_IDX = 2 as const
const PREV_IDX = 3 as const
const NEXT_IDX = 4 as const

export class SabTreeLinks {
  readonly #meta: Uint32Array

  constructor(sab: SharedArrayBuffer, byteOffset: number, cap: number) {
    this.#meta = new Uint32Array(sab, byteOffset, cap * TREE_LINK_V_COUNT)
  }

  static bytesRequired(cap: number) { return cap * TREE_LINK_V_COUNT * Uint32Array.BYTES_PER_ELEMENT }
  get byteLength() { return this.#meta.byteLength }

  #o(id: number) { return id * TREE_LINK_V_COUNT }
  parent(id: number) { return this.#meta[this.#o(id) + PARENT_IDX] }
  #first(id: number) { return this.#meta[this.#o(id) + FIRST_IDX] }
  #last(id: number) { return this.#meta[this.#o(id) + LAST_IDX] }
  #next(id: number) { return this.#meta[this.#o(id) + NEXT_IDX] }

  remove(id: number) {
    const o = this.#o(id)
    const p = this.#meta[o + PARENT_IDX]
    const l = this.#meta[o + PREV_IDX]
    const r = this.#meta[o + NEXT_IDX]

    if (p !== NONE) {
      const po = this.#o(p)
      if (this.#meta[po + FIRST_IDX] === id) this.#meta[po + FIRST_IDX] = r
      if (this.#meta[po + LAST_IDX] === id) this.#meta[po + LAST_IDX] = l
    }
    if (l !== NONE) this.#meta[this.#o(l) + NEXT_IDX] = r
    if (r !== NONE) this.#meta[this.#o(r) + PREV_IDX] = l
  }

  #linkAsOnlyChild(p: number, c: number) {
    const po = this.#o(p), co = this.#o(c)
    this.#meta[co + PARENT_IDX] = p
    this.#meta[co + PREV_IDX] = NONE
    this.#meta[co + NEXT_IDX] = NONE
    this.#meta[po + FIRST_IDX] = c
    this.#meta[po + LAST_IDX] = c
  }

  #insertAfterSibling(p: number, left: number, c: number) {
    const lo = this.#o(left)
    const right = this.#meta[lo + NEXT_IDX]
    const co = this.#o(c)

    this.#meta[co + PARENT_IDX] = p
    this.#meta[co + PREV_IDX] = left
    this.#meta[co + NEXT_IDX] = right

    this.#meta[lo + NEXT_IDX] = c
    if (right !== NONE) this.#meta[this.#o(right) + PREV_IDX] = c
    else this.#meta[this.#o(p) + LAST_IDX] = c
  }

  #insertBeforeSibling(p: number, right: number, c: number) {
    const ro = this.#o(right)
    const left = this.#meta[ro + PREV_IDX]
    const co = this.#o(c)

    this.#meta[co + PARENT_IDX] = p
    this.#meta[co + NEXT_IDX] = right
    this.#meta[co + PREV_IDX] = left

    this.#meta[ro + PREV_IDX] = c
    if (left !== NONE) this.#meta[this.#o(left) + NEXT_IDX] = c
    else this.#meta[this.#o(p) + FIRST_IDX] = c
  }

  insert(p: number, c: number) {
    this.remove(c)
    const last = this.#last(p)
    if (last === NONE) this.#linkAsOnlyChild(p, c)
    else this.#insertAfterSibling(p, last, c)
  }

  insertAt(p: number, c: number, idx: number) {
    this.remove(c)

    const f = this.#first(p)
    if (f === NONE) { this.#linkAsOnlyChild(p, c); return }
    if (idx <= 0) { this.#insertBeforeSibling(p, f, c); return }

    let i = 0, cur = f
    while (cur !== NONE && i < idx) { cur = this.#next(cur); i++ }

    if (cur === NONE) this.insert(p, c)
    else this.#insertBeforeSibling(p, cur, c)
  }

  forEach(visitor: (id: number) => void): void {
    let u: number = ROOT
    while (true) {
      visitor(u)

      const f = this.#first(u)
      if (f !== NONE) { u = f; continue }

      while (true) {
        if (u === ROOT) return
        const n = this.#next(u)
        if (n !== NONE) { u = n; break }
        u = this.parent(u)
      }
    }
  }

  sortChildren(p: number, getCompValue: (id: number) => number) {
    let head = this.#first(p)
    if (head === NONE || this.#next(head) === NONE) {
      return // 0 또는 1개의 요소는 정렬할 필요가 없습니다.
    }

    // 연결 리스트를 배열로 변환합니다.
    const children = []
    let current = head
    while (current !== NONE) {
      children.push(current)
      current = this.#next(current)
    }

    // 병합 정렬을 사용하여 배열을 정렬합니다.
    children.sort((a, b) => getCompValue(a) - getCompValue(b))

    // 정렬된 배열을 기반으로 연결 리스트를 다시 연결합니다.
    const po = this.#o(p)
    this.#meta[po + FIRST_IDX] = children[0]
    this.#meta[po + LAST_IDX] = children[children.length - 1]

    for (let i = 0; i < children.length; i++) {
      const childId = children[i]
      const co = this.#o(childId)
      const prevId = i > 0 ? children[i - 1] : NONE
      const nextId = i < children.length - 1 ? children[i + 1] : NONE

      this.#meta[co + PARENT_IDX] = p
      this.#meta[co + PREV_IDX] = prevId
      this.#meta[co + NEXT_IDX] = nextId
    }
  }
}
