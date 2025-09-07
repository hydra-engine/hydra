import { SabUint32Queue } from '../sab-data-structure/sab-uint32-queue'

// 0번 ID(root)는 항상 존재하므로 제외
export class SabTreeNodeIdPool {
  readonly #q: SabUint32Queue

  constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number) {
    this.#q = new SabUint32Queue(sab, byteOffset, capacity - 1)
    for (let id = 1; id < capacity; id++) this.#q.enqueue(id)
  }

  static bytesRequired(capacity: number) { return SabUint32Queue.bytesRequired(capacity - 1) }
  get byteLength() { return this.#q.byteLength }

  alloc() { return this.#q.dequeue() }
  free(id: number) { this.#q.enqueue(id) }
}
