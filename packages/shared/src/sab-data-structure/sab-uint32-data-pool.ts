export class SabUint32DataPool {
  readonly #data: Uint32Array
  readonly #vCount: number

  constructor(
    sab: SharedArrayBuffer,
    byteOffset: number,
    vCount: number,
    cap: number,
  ) {
    this.#vCount = vCount
    this.#data = new Uint32Array(sab, byteOffset, vCount * cap)
  }

  static bytesRequired(vCount: number, cap: number) { return vCount * cap * Uint32Array.BYTES_PER_ELEMENT }
  get byteLength() { return this.#data.byteLength }

  #o(id: number) { return id * this.#vCount }
  set(id: number, vi: number, v: number) { this.#data[this.#o(id) + vi] = v }
  get(id: number, vi: number) { return this.#data[this.#o(id) + vi] }
}
