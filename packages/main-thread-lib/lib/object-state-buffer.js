import { ObjectStateTree } from '@hydraengine/shared';
export function createObjectStateBuffer() {
    return new SharedArrayBuffer(ObjectStateTree.bytesRequired());
}
//# sourceMappingURL=object-state-buffer.js.map