import { SABUint32Queue } from './queue'

export class SABNodePool {
  readonly #q: SABUint32Queue

  constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number) {
    this.#q = new SABUint32Queue(sab, byteOffset, capacity - 1)
    for (let i = 1; i < capacity; i++) this.#q.enqueue(i)
  }

  static bytesRequired(capacity: number): number {
    return SABUint32Queue.bytesRequired(capacity - 1)
  }

  get byteLength() { return this.#q.byteLength }

  alloc(): number {
    return this.#q.dequeue()
  }

  free(idx: number): void {
    this.#q.enqueue(idx)
  }
}
