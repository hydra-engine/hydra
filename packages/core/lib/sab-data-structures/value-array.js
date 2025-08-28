export class SABFloat32ValueArray {
    #values;
    #stride;
    constructor(sab, byteOffset, capacity, valueCount) {
        this.#stride = valueCount;
        this.#values = new Float32Array(sab, byteOffset, capacity * valueCount);
    }
    static bytesRequired(capacity, valueCount) {
        return capacity * valueCount * Float32Array.BYTES_PER_ELEMENT;
    }
    get byteLength() { return this.#values.byteLength; }
    #offset(i) { return i * this.#stride; }
    set(i, j, v) {
        this.#values[this.#offset(i) + j] = v;
    }
    get(i, j) {
        return this.#values[this.#offset(i) + j];
    }
}
export class SABUint32ValueArray {
    #values;
    #stride;
    constructor(sab, byteOffset, capacity, valueCount) {
        this.#stride = valueCount;
        this.#values = new Uint32Array(sab, byteOffset, capacity * valueCount);
    }
    static bytesRequired(capacity, valueCount) {
        return capacity * valueCount * Uint32Array.BYTES_PER_ELEMENT;
    }
    get byteLength() { return this.#values.byteLength; }
    #offset(i) { return i * this.#stride; }
    set(i, j, v) {
        this.#values[this.#offset(i) + j] = v;
    }
    get(i, j) {
        return this.#values[this.#offset(i) + j];
    }
}
export class SABBooleanValueArray {
    #words;
    #stride;
    constructor(sab, byteOffset, capacity, valueCount) {
        this.#stride = valueCount;
        const totalBits = capacity * valueCount;
        const wordCount = Math.ceil(totalBits / 32);
        this.#words = new Uint32Array(sab, byteOffset, wordCount);
    }
    static bytesRequired(capacity, valueCount) {
        const totalBits = capacity * valueCount;
        const wordCount = Math.ceil(totalBits / 32);
        return wordCount * Uint32Array.BYTES_PER_ELEMENT;
    }
    get byteLength() { return this.#words.byteLength; }
    #bitIndex(i, j) {
        return (i * this.#stride) + j;
    }
    set(i, j, v) {
        const bitIndex = this.#bitIndex(i, j);
        const wi = bitIndex >>> 5;
        const mask = 1 << (bitIndex & 31);
        if (v) {
            this.#words[wi] |= mask;
        }
        else {
            this.#words[wi] &= ~mask;
        }
    }
    get(i, j) {
        const bitIndex = this.#bitIndex(i, j);
        const wi = bitIndex >>> 5;
        const mask = 1 << (bitIndex & 31);
        return (this.#words[wi] & mask) !== 0;
    }
}
//# sourceMappingURL=value-array.js.map