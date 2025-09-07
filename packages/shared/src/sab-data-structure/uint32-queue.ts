const CTRL_SIZE = 2 as const

export class Uint32Queue {
  readonly #ctrl: Uint32Array
  readonly #data: Uint32Array
  readonly #capacity: number

  constructor(sab: SharedArrayBuffer, byteOffset: number, capacity: number) {
    this.#ctrl = new Uint32Array(sab, byteOffset, CTRL_SIZE)
    this.#data = new Uint32Array(
      sab,
      byteOffset + CTRL_SIZE * Uint32Array.BYTES_PER_ELEMENT,
      capacity
    )
    this.#capacity = capacity
  }

  static bytesRequired(capacity: number): number {
    return (CTRL_SIZE + capacity) * Uint32Array.BYTES_PER_ELEMENT
  }

  get byteLength(): number {
    return this.#ctrl.byteLength + this.#data.byteLength
  }

  enqueue(v: number) {
    const tail = this.#ctrl[1]
    this.#data[tail] = v
    this.#ctrl[1] = (tail + 1) % this.#capacity
  }

  dequeue(): number {
    const head = this.#ctrl[0]
    this.#ctrl[0] = (head + 1) % this.#capacity
    return this.#data[head]
  }
}
