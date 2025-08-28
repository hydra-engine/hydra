import { SABUint32Queue } from './queue';
export class SABNodePool {
    #q;
    constructor(sab, byteOffset, capacity) {
        this.#q = new SABUint32Queue(sab, byteOffset, capacity - 1);
        for (let i = 1; i < capacity; i++)
            this.#q.enqueue(i);
    }
    static bytesRequired(capacity) {
        return SABUint32Queue.bytesRequired(capacity - 1);
    }
    get byteLength() { return this.#q.byteLength; }
    alloc() {
        return this.#q.dequeue();
    }
    free(idx) {
        this.#q.enqueue(idx);
    }
}
//# sourceMappingURL=node-pool.js.map