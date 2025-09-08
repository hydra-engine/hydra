import { CAPACITY, NONE, ObjectStateTree, SabTreeNodeIdPool, TREE_LINK_V_COUNT } from '@hydraengine/shared';
export function createObjectStateBuffer() {
    const sab = new SharedArrayBuffer(ObjectStateTree.bytesRequired());
    const byteOffset = SabTreeNodeIdPool.bytesRequired(CAPACITY);
    const meta = new Uint32Array(sab, byteOffset, CAPACITY * TREE_LINK_V_COUNT);
    meta.fill(NONE);
    return sab;
}
//# sourceMappingURL=object-state-buffer.js.map