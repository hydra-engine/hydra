import { Uint32Queue } from '../sab-data-structure/uint32-queue'

// 0번지(root)는 항상 존재하므로 제외
export class SabTreeNodeIdPool {
  readonly #q: Uint32Queue

  constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number) {
    this.#q = new Uint32Queue(sab, byteOffset, capacity - 1)
    for (let i = 1; i < capacity; i++) this.#q.enqueue(i)
  }

  static bytesRequired(capacity: number) { return Uint32Queue.bytesRequired(capacity - 1) }
  get byteLength() { return this.#q.byteLength }

  alloc() { return this.#q.dequeue() }
  free(idx: number) { this.#q.enqueue(idx) }
}
