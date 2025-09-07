import { SABNodePool } from './node-pool'
import { SABTreeLinks } from './tree-links'
import { SABBooleanValueArray, SABFloat32ValueArray, SABUint32ValueArray } from './value-array'

export class SABTree {
  readonly #pool: SABNodePool
  readonly #links: SABTreeLinks
  readonly #bvalues: SABBooleanValueArray
  readonly #uvalues: SABUint32ValueArray
  readonly #fvalues: SABFloat32ValueArray

  constructor(
    sab: SharedArrayBuffer,
    capacity: number,
    bvalueCount: number,
    uvalueCount: number,
    fvalueCount: number,
  ) {
    this.#pool = new SABNodePool(sab, 0, capacity)
    let offset = this.#pool.byteLength

    this.#links = new SABTreeLinks(sab, offset, capacity)
    offset += this.#links.byteLength

    this.#bvalues = new SABBooleanValueArray(sab, offset, capacity, bvalueCount)
    offset += this.#bvalues.byteLength

    this.#uvalues = new SABUint32ValueArray(sab, offset, capacity, uvalueCount)
    offset += this.#uvalues.byteLength

    this.#fvalues = new SABFloat32ValueArray(sab, offset, capacity, fvalueCount)
  }

  static bytesRequired(
    capacity: number,
    bvalueCount: number,
    uvalueCount: number,
    fvalueCount: number,
  ): number {
    const queueBytes = SABNodePool.bytesRequired(capacity)
    const linksBytes = SABTreeLinks.bytesRequired(capacity)
    const bvalueBytes = SABBooleanValueArray.bytesRequired(capacity, bvalueCount)
    const uvalueBytes = SABUint32ValueArray.bytesRequired(capacity, uvalueCount)
    const fvalueBytes = SABFloat32ValueArray.bytesRequired(capacity, fvalueCount)
    return queueBytes + linksBytes + bvalueBytes + uvalueBytes + fvalueBytes
  }

  addChild(p: number): number {
    const id = this.#pool.alloc()
    this.#links.insert(p, id)
    return id
  }

  remove(i: number) {
    this.#links.remove(i)
    this.#pool.free(i)
  }

  insertAt(p: number, c: number, index: number) { this.#links.insertAt(p, c, index) }

  setBValue(i: number, j: number, v: boolean) { this.#bvalues.set(i, j, v) }
  getBValue(i: number, j: number) { return this.#bvalues.get(i, j) }

  setUValue(i: number, j: number, v: number) { this.#uvalues.set(i, j, v) }
  getUValue(i: number, j: number) { return this.#uvalues.get(i, j) }

  setFValue(i: number, j: number, v: number) { this.#fvalues.set(i, j, v) }
  getFValue(i: number, j: number) { return this.#fvalues.get(i, j) }

  forEach(visitor: (node: number) => void) {
    this.#links.forEach(visitor)
  }

  sortChildren(parent: number, uvalueIndex: number) {
    this.#links.sortChildren(parent, (i) => this.#uvalues.get(i, uvalueIndex))
  }
}
