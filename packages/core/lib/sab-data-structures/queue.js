const CTRL_SIZE = 2;
export class SABUint32Queue {
    #ctrl;
    #data;
    #capacity;
    constructor(sab, byteOffset, capacity) {
        this.#ctrl = new Uint32Array(sab, byteOffset, CTRL_SIZE);
        this.#data = new Uint32Array(sab, byteOffset + CTRL_SIZE * Uint32Array.BYTES_PER_ELEMENT, capacity);
        this.#capacity = capacity;
    }
    static bytesRequired(capacity) {
        return (CTRL_SIZE + capacity) * Uint32Array.BYTES_PER_ELEMENT;
    }
    get byteLength() {
        return this.#ctrl.byteLength + this.#data.byteLength;
    }
    enqueue(v) {
        let tail = this.#ctrl[1];
        const idx = tail % this.#capacity;
        this.#data[idx] = v;
        tail = (tail + 1);
        this.#ctrl[1] = tail;
    }
    dequeue() {
        let head = this.#ctrl[0];
        const idx = head % this.#capacity;
        const val = this.#data[idx];
        head = (head + 1);
        this.#ctrl[0] = head;
        return val;
    }
}
//# sourceMappingURL=queue.js.map