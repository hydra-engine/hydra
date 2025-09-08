import { SabBooleanPool } from '../sab-data-structure/sab-boolean-pool'
import { SabFloat32Pool } from '../sab-data-structure/sab-float32-pool'
import { SabUint32Pool } from '../sab-data-structure/sab-uint32-pool'
import { SabTreeLinks } from './sab-tree-links'
import { SabTreeNodeIdPool } from './sab-tree-node-id-pool'

export class SabTree {
  readonly #nodeIdPool: SabTreeNodeIdPool
  readonly #links: SabTreeLinks
  readonly #booleanPool: SabBooleanPool
  readonly #uint32Pool: SabUint32Pool
  readonly #float32Pool: SabFloat32Pool

  constructor(
    sab: SharedArrayBuffer,
    bCount: number,
    uCount: number,
    fCount: number,
    cap: number,
  ) {
    this.#nodeIdPool = new SabTreeNodeIdPool(sab, 0, cap)
    let byteOffset = this.#nodeIdPool.byteLength

    this.#links = new SabTreeLinks(sab, byteOffset, cap)
    byteOffset += this.#links.byteLength

    this.#booleanPool = new SabBooleanPool(sab, byteOffset, bCount, cap)
    byteOffset += this.#booleanPool.byteLength

    this.#uint32Pool = new SabUint32Pool(sab, byteOffset, uCount, cap)
    byteOffset += this.#uint32Pool.byteLength

    this.#float32Pool = new SabFloat32Pool(sab, byteOffset, fCount, cap)
  }

  static bytesRequired(
    bCount: number,
    uCount: number,
    fCount: number,
    cap: number,
  ) {
    const queueBytes = SabTreeNodeIdPool.bytesRequired(cap)
    const linksBytes = SabTreeLinks.bytesRequired(cap)
    const bvalueBytes = SabBooleanPool.bytesRequired(bCount, cap)
    const uvalueBytes = SabUint32Pool.bytesRequired(uCount, cap)
    const fvalueBytes = SabFloat32Pool.bytesRequired(fCount, cap)
    return queueBytes + linksBytes + bvalueBytes + uvalueBytes + fvalueBytes
  }

  newChild(p: number) {
    const id = this.#nodeIdPool.alloc()
    this.#links.insert(p, id)
    return id
  }

  getParent(id: number) { return this.#links.parent(id) }

  insertAt(p: number, c: number, idx: number) {
    this.#links.insertAt(p, c, idx)
  }

  remove(id: number) {
    this.#links.remove(id)
    this.#nodeIdPool.free(id)
  }

  setBoolean(id: number, vi: number, v: boolean) { this.#booleanPool.set(id, vi, v) }
  getBoolean(id: number, vi: number) { return this.#booleanPool.get(id, vi) }

  setUint32(id: number, vi: number, v: number) { this.#uint32Pool.set(id, vi, v) }
  getUint32(id: number, vi: number) { return this.#uint32Pool.get(id, vi) }

  setFloat32(id: number, vi: number, v: number) { this.#float32Pool.set(id, vi, v) }
  getFloat32(id: number, vi: number) { return this.#float32Pool.get(id, vi) }

  forEach(visitor: (id: number) => void) {
    this.#links.forEach(visitor)
  }

  sortChildren(parent: number, uint32ValueIdx: number) {
    this.#links.sortChildren(parent, (id) => this.#uint32Pool.get(id, uint32ValueIdx))
  }
}
