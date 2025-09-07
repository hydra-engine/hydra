import { SabUint32Queue } from '../sab-data-structure/sab-uint32-queue';
// 0번 ID(root)는 항상 존재하므로 제외
export class SabTreeNodeIdPool {
    #q;
    constructor(sab, byteOffset, cap) {
        this.#q = new SabUint32Queue(sab, byteOffset, cap - 1);
        for (let id = 1; id < cap; id++)
            this.#q.enqueue(id);
    }
    static bytesRequired(cap) { return SabUint32Queue.bytesRequired(cap - 1); }
    get byteLength() { return this.#q.byteLength; }
    alloc() { return this.#q.dequeue(); }
    free(id) { this.#q.enqueue(id); }
}
//# sourceMappingURL=sab-tree-node-id-pool.js.map