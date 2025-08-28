import { SABTree } from '../sab-data-structures/tree';
const OBJ_CAPACITY = 1_000_000;
const OBJ_BVALUE_COUNT = 0;
const OBJ_UVALUE_COUNT = 2;
const OBJ_FVALUE_COUNT = 2;
// booleans
// uints
const OBJECT_TYPE_IDX = 0;
const ASSET_ID_IDX = 1;
// floats
const X_IDX = 0;
const Y_IDX = 1;
export function createInitialObjectStateBuffer() {
    return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_CAPACITY, OBJ_BVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_FVALUE_COUNT));
}
export class ObjectStateTree extends SABTree {
    constructor(sab) {
        super(sab, OBJ_CAPACITY, OBJ_BVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_FVALUE_COUNT);
    }
    getX(i) { return this.getFValue(i, X_IDX); }
    setX(i, v) { this.setFValue(i, X_IDX, v); }
    getY(i) { return this.getFValue(i, Y_IDX); }
    setY(i, v) { this.setFValue(i, Y_IDX, v); }
    getObjectType(i) { return this.getUValue(i, OBJECT_TYPE_IDX); }
    setObjectType(i, v) { this.setUValue(i, OBJECT_TYPE_IDX, v); }
    getAssetId(i) { return this.getUValue(i, ASSET_ID_IDX); }
    setAssetId(i, v) { this.setUValue(i, ASSET_ID_IDX, v); }
}
//# sourceMappingURL=object-state-tree.js.map