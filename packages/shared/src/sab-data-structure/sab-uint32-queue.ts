const CTRL_SIZE = 2 as const

export class SabUint32Queue {
  readonly #ctrl: Uint32Array
  readonly #data: Uint32Array
  readonly #cap: number

  constructor(sab: SharedArrayBuffer, byteOffset: number, cap: number) {
    this.#ctrl = new Uint32Array(sab, byteOffset, CTRL_SIZE)
    this.#data = new Uint32Array(
      sab,
      byteOffset + CTRL_SIZE * Uint32Array.BYTES_PER_ELEMENT,
      cap
    )
    this.#cap = cap
  }

  static bytesRequired(cap: number) { return (CTRL_SIZE + cap) * Uint32Array.BYTES_PER_ELEMENT }
  get byteLength() { return this.#ctrl.byteLength + this.#data.byteLength }

  enqueue(v: number) {
    const tail = this.#ctrl[1]
    this.#data[tail] = v
    this.#ctrl[1] = (tail + 1) % this.#cap
  }

  dequeue(): number {
    const head = this.#ctrl[0]
    this.#ctrl[0] = (head + 1) % this.#cap
    return this.#data[head]
  }
}
