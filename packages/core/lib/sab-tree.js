export class SABTree {
    #sab;
    #maxNodeCount;
    #freeQueue;
    #mem;
    constructor(sab) {
        this.#sab = sab;
        this.#maxNodeCount = sab.byteLength / (Uint32Array.BYTES_PER_ELEMENT + Float32Array.BYTES_PER_ELEMENT);
        this.#freeQueue = new Uint32Array(sab, 0, this.#maxNodeCount);
        this.#mem = new Float32Array(sab, this.#maxNodeCount * Uint32Array.BYTES_PER_ELEMENT, this.#maxNodeCount);
    }
}
//# sourceMappingURL=sab-tree.js.map