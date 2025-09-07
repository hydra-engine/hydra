export class SabFloat32Pool {
    #data;
    #vCount;
    constructor(sab, byteOffset, vCount, cap) {
        this.#vCount = vCount;
        this.#data = new Float32Array(sab, byteOffset, vCount * cap);
    }
    static bytesRequired(vCount, cap) { return vCount * cap * Float32Array.BYTES_PER_ELEMENT; }
    get byteLength() { return this.#data.byteLength; }
    #o(id) { return id * this.#vCount; }
    set(id, vi, v) { this.#data[this.#o(id) + vi] = v; }
    get(id, vi) { return this.#data[this.#o(id) + vi]; }
}
//# sourceMappingURL=sab-float32-pool.js.map