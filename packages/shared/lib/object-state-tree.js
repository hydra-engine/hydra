import { SabTree } from './sab-tree/sab-tree';
const CAPACITY = 1_000_000;
// Boolean Indices
const BOOLEAN_COUNT = 0;
// Uint32 Indices
const UINT32_COUNT = 2;
const OBJECT_TYPE_IDX = 0;
const ASSET_ID_IDX = 1;
// Float32 Indices
const FLOAT32_COUNT = 2;
const X_IDX = 0;
const Y_IDX = 1;
export class ObjectStateTree extends SabTree {
    constructor(sab) {
        super(sab, BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY);
    }
    static bytesRequired() { return SabTree.bytesRequired(BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY); }
    setX(id, v) { this.setFloat32(id, X_IDX, v); }
    getX(id) { return this.getFloat32(id, X_IDX); }
    setY(id, v) { this.setFloat32(id, Y_IDX, v); }
    getY(id) { return this.getFloat32(id, Y_IDX); }
    setObjectType(id, v) { this.setUint32(id, OBJECT_TYPE_IDX, v); }
    getObjectType(id) { return this.getUint32(id, OBJECT_TYPE_IDX); }
    setAssetId(id, v) { this.setUint32(id, ASSET_ID_IDX, v); }
    getAssetId(id) { return this.getUint32(id, ASSET_ID_IDX); }
}
//# sourceMappingURL=object-state-tree.js.map