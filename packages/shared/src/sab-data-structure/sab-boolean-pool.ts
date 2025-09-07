export class SabBooleanPool {
  readonly #words: Uint32Array
  readonly #vCount: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    vCount: number,
    cap: number,
  ) {
    this.#vCount = vCount

    const totalBits = vCount * cap
    const wordCount = Math.ceil(totalBits / 32)
    this.#words = new Uint32Array(sab, byteOffset, wordCount)
  }

  static bytesRequired(vCount: number, cap: number) {
    const totalBits = vCount * cap
    const wordCount = Math.ceil(totalBits / 32)
    return wordCount * Uint32Array.BYTES_PER_ELEMENT
  }

  get byteLength() { return this.#words.byteLength }

  #bi(id: number, vi: number) {
    return id * this.#vCount + vi
  }

  set(id: number, vi: number, v: boolean) {
    const bi = this.#bi(id, vi)
    const wi = bi >>> 5
    const mask = 1 << (bi & 31)

    if (v) this.#words[wi] |= mask
    else this.#words[wi] &= ~mask
  }

  get(id: number, vi: number) {
    const bi = this.#bi(id, vi)
    const wi = bi >>> 5
    const mask = 1 << (bi & 31)

    return (this.#words[wi] & mask) !== 0
  }
}
