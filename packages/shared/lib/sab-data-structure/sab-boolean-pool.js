export class SabBooleanPool {
    #words;
    #vCount;
    constructor(sab, byteOffset, vCount, cap) {
        this.#vCount = vCount;
        const totalBits = vCount * cap;
        const wordCount = Math.ceil(totalBits / 32);
        this.#words = new Uint32Array(sab, byteOffset, wordCount);
    }
    static bytesRequired(vCount, cap) {
        const totalBits = vCount * cap;
        const wordCount = Math.ceil(totalBits / 32);
        return wordCount * Uint32Array.BYTES_PER_ELEMENT;
    }
    get byteLength() { return this.#words.byteLength; }
    #bi(id, vi) {
        return id * this.#vCount + vi;
    }
    set(id, vi, v) {
        const bi = this.#bi(id, vi);
        const wi = bi >>> 5;
        const mask = 1 << (bi & 31);
        if (v)
            this.#words[wi] |= mask;
        else
            this.#words[wi] &= ~mask;
    }
    get(id, vi) {
        const bi = this.#bi(id, vi);
        const wi = bi >>> 5;
        const mask = 1 << (bi & 31);
        return (this.#words[wi] & mask) !== 0;
    }
}
//# sourceMappingURL=sab-boolean-pool.js.map