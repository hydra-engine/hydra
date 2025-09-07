import { SabBooleanPool } from '../sab-data-structure/sab-boolean-pool';
import { SabFloat32Pool } from '../sab-data-structure/sab-float32-pool';
import { SabUint32Pool } from '../sab-data-structure/sab-uint32-pool';
import { SabTreeLinks } from './sab-tree-links';
import { SabTreeNodeIdPool } from './sab-tree-node-id-pool';
export class SabTree {
    #nodeIdPool;
    #links;
    #booleanPool;
    #uint32Pool;
    #float32Pool;
    constructor(sab, bCount, uCount, fCount, cap) {
        this.#nodeIdPool = new SabTreeNodeIdPool(sab, 0, cap);
        let byteOffset = this.#nodeIdPool.byteLength;
        this.#links = new SabTreeLinks(sab, byteOffset, cap);
        byteOffset += this.#links.byteLength;
        this.#booleanPool = new SabBooleanPool(sab, byteOffset, bCount, cap);
        byteOffset += this.#booleanPool.byteLength;
        this.#uint32Pool = new SabUint32Pool(sab, byteOffset, uCount, cap);
        byteOffset += this.#uint32Pool.byteLength;
        this.#float32Pool = new SabFloat32Pool(sab, byteOffset, fCount, cap);
    }
    static bytesRequired(bCount, uCount, fCount, cap) {
        const queueBytes = SabTreeNodeIdPool.bytesRequired(cap);
        const linksBytes = SabTreeLinks.bytesRequired(cap);
        const bvalueBytes = SabBooleanPool.bytesRequired(bCount, cap);
        const uvalueBytes = SabUint32Pool.bytesRequired(uCount, cap);
        const fvalueBytes = SabFloat32Pool.bytesRequired(fCount, cap);
        return queueBytes + linksBytes + bvalueBytes + uvalueBytes + fvalueBytes;
    }
    newChild(p) {
        const id = this.#nodeIdPool.alloc();
        this.#links.insert(p, id);
        return id;
    }
    insertAt(p, c, idx) {
        this.#links.insertAt(p, c, idx);
    }
    remove(id) {
        this.#links.remove(id);
        this.#nodeIdPool.free(id);
    }
    setBoolean(id, vi, v) { this.#booleanPool.set(id, vi, v); }
    getBoolean(id, vi) { return this.#booleanPool.get(id, vi); }
    setUint32(id, vi, v) { this.#uint32Pool.set(id, vi, v); }
    getUint32(id, vi) { return this.#uint32Pool.get(id, vi); }
    setFloat32(id, vi, v) { this.#float32Pool.set(id, vi, v); }
    getFloat32(id, vi) { return this.#float32Pool.get(id, vi); }
    forEach(visitor) {
        this.#links.forEach(visitor);
    }
    sortChildren(parent, uint32ValueIdx) {
        this.#links.sortChildren(parent, (i) => this.#uint32Pool.get(i, uint32ValueIdx));
    }
}
//# sourceMappingURL=sab-tree.js.map