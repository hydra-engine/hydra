export class SABFloat32ValueArray {
  readonly #values: Float32Array
  readonly #stride: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    capacity: number,
    valueCount: number,
  ) {
    this.#stride = valueCount
    this.#values = new Float32Array(sab, byteOffset, capacity * valueCount)
  }

  static bytesRequired(capacity: number, valueCount: number): number {
    return capacity * valueCount * Float32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#values.byteLength }

  #offset(i: number) { return i * this.#stride }

  set(i: number, j: number, v: number) {
    this.#values[this.#offset(i) + j] = v
  }

  get(i: number, j: number): number {
    return this.#values[this.#offset(i) + j]
  }
}

export class SABUint32ValueArray {
  readonly #values: Uint32Array
  readonly #stride: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    capacity: number,
    valueCount: number,
  ) {
    this.#stride = valueCount
    this.#values = new Uint32Array(sab, byteOffset, capacity * valueCount)
  }

  static bytesRequired(capacity: number, valueCount: number): number {
    return capacity * valueCount * Uint32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#values.byteLength }

  #offset(i: number) { return i * this.#stride }

  set(i: number, j: number, v: number) {
    this.#values[this.#offset(i) + j] = v
  }

  get(i: number, j: number): number {
    return this.#values[this.#offset(i) + j]
  }
}

export class SABBooleanValueArray {
  readonly #words: Uint32Array
  readonly #stride: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    capacity: number,
    valueCount: number,
  ) {
    this.#stride = valueCount

    const totalBits = capacity * valueCount
    const wordCount = Math.ceil(totalBits / 32)
    this.#words = new Uint32Array(sab, byteOffset, wordCount)
  }

  static bytesRequired(capacity: number, valueCount: number): number {
    const totalBits = capacity * valueCount
    const wordCount = Math.ceil(totalBits / 32)
    return wordCount * Uint32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#words.byteLength }

  #bitIndex(i: number, j: number): number {
    return (i * this.#stride) + j
  }

  set(i: number, j: number, v: boolean) {
    const bitIndex = this.#bitIndex(i, j)
    const wi = bitIndex >>> 5
    const mask = 1 << (bitIndex & 31)

    if (v) {
      this.#words[wi] |= mask
    } else {
      this.#words[wi] &= ~mask
    }
  }

  get(i: number, j: number): boolean {
    const bitIndex = this.#bitIndex(i, j)
    const wi = bitIndex >>> 5
    const mask = 1 << (bitIndex & 31)

    return (this.#words[wi] & mask) !== 0
  }
}
