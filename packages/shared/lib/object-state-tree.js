import { SabTree } from './sab-tree/sab-tree';
const CAPACITY = 1_000_000;
// ===== Boolean Indices =============================================================================
const BOOLEAN_COUNT = 0;
// ===== Uint32 Indices =============================================================================
const UINT32_COUNT = 3;
const OBJECT_TYPE_IDX = 0;
// Sprite
const ASSET_ID_IDX = 1;
const ANIMATION_ID_IDX = 2;
// Physics
const WORLD_ID_IDX = 1;
const BODY_ID_IDX = 1;
// ===== Float32 Indices =============================================================================
const FLOAT32_COUNT = 18;
// Local Transform
const LOCAL_X_IDX = 0;
const LOCAL_Y_IDX = 1;
const LOCAL_SCALE_X_IDX = 2;
const LOCAL_SCALE_Y_IDX = 3;
const LOCAL_PIVOT_X_IDX = 4;
const LOCAL_PIVOT_Y_IDX = 5;
const LOCAL_ROTATION_IDX = 6;
const LOCAL_COS_IDX = 7;
const LOCAL_SIN_IDX = 8;
const LOCAL_ALPHA_IDX = 9;
// World Transform
const WORLD_X_IDX = 10;
const WORLD_Y_IDX = 11;
const WORLD_SCALE_X_IDX = 12;
const WORLD_SCALE_Y_IDX = 13;
const WORLD_ROTATION_IDX = 14;
const WORLD_COS_IDX = 15;
const WORLD_SIN_IDX = 16;
const WORLD_ALPHA_IDX = 17;
export class ObjectStateTree extends SabTree {
    constructor(sab) {
        super(sab, BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY);
    }
    static bytesRequired() { return SabTree.bytesRequired(BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY); }
    setObjectType(id, v) { this.setUint32(id, OBJECT_TYPE_IDX, v); }
    getObjectType(id) { return this.getUint32(id, OBJECT_TYPE_IDX); }
    setLocalX(id, v) { this.setFloat32(id, LOCAL_X_IDX, v); }
    getLocalX(id) { return this.getFloat32(id, LOCAL_X_IDX); }
    setLocalY(id, v) { this.setFloat32(id, LOCAL_Y_IDX, v); }
    getLocalY(id) { return this.getFloat32(id, LOCAL_Y_IDX); }
    setLocalScaleX(id, v) { this.setFloat32(id, LOCAL_SCALE_X_IDX, v); }
    getLocalScaleX(id) { return this.getFloat32(id, LOCAL_SCALE_X_IDX); }
    setLocalScaleY(id, v) { this.setFloat32(id, LOCAL_SCALE_Y_IDX, v); }
    getLocalScaleY(id) { return this.getFloat32(id, LOCAL_SCALE_Y_IDX); }
    setLocalPivotX(id, v) { this.setFloat32(id, LOCAL_PIVOT_X_IDX, v); }
    getLocalPivotX(id) { return this.getFloat32(id, LOCAL_PIVOT_X_IDX); }
    setLocalPivotY(id, v) { this.setFloat32(id, LOCAL_PIVOT_Y_IDX, v); }
    getLocalPivotY(id) { return this.getFloat32(id, LOCAL_PIVOT_Y_IDX); }
    setLocalRotation(id, v) { this.setFloat32(id, LOCAL_ROTATION_IDX, v); }
    getLocalRotation(id) { return this.getFloat32(id, LOCAL_ROTATION_IDX); }
    setLocalCos(id, v) { this.setFloat32(id, LOCAL_COS_IDX, v); }
    getLocalCos(id) { return this.getFloat32(id, LOCAL_COS_IDX); }
    setLocalSin(id, v) { this.setFloat32(id, LOCAL_SIN_IDX, v); }
    getLocalSin(id) { return this.getFloat32(id, LOCAL_SIN_IDX); }
    setLocalAlpha(id, v) { this.setFloat32(id, LOCAL_ALPHA_IDX, v); }
    getLocalAlpha(id) { return this.getFloat32(id, LOCAL_ALPHA_IDX); }
    setWorldX(id, v) { this.setFloat32(id, WORLD_X_IDX, v); }
    getWorldX(id) { return this.getFloat32(id, WORLD_X_IDX); }
    setWorldY(id, v) { this.setFloat32(id, WORLD_Y_IDX, v); }
    getWorldY(id) { return this.getFloat32(id, WORLD_Y_IDX); }
    setWorldScaleX(id, v) { this.setFloat32(id, WORLD_SCALE_X_IDX, v); }
    getWorldScaleX(id) { return this.getFloat32(id, WORLD_SCALE_X_IDX); }
    setWorldScaleY(id, v) { this.setFloat32(id, WORLD_SCALE_Y_IDX, v); }
    getWorldScaleY(id) { return this.getFloat32(id, WORLD_SCALE_Y_IDX); }
    setWorldRotation(id, v) { this.setFloat32(id, WORLD_ROTATION_IDX, v); }
    getWorldRotation(id) { return this.getFloat32(id, WORLD_ROTATION_IDX); }
    setWorldCos(id, v) { this.setFloat32(id, WORLD_COS_IDX, v); }
    getWorldCos(id) { return this.getFloat32(id, WORLD_COS_IDX); }
    setWorldSin(id, v) { this.setFloat32(id, WORLD_SIN_IDX, v); }
    getWorldSin(id) { return this.getFloat32(id, WORLD_SIN_IDX); }
    setWorldAlpha(id, v) { this.setFloat32(id, WORLD_ALPHA_IDX, v); }
    getWorldAlpha(id) { return this.getFloat32(id, WORLD_ALPHA_IDX); }
    setAssetId(id, v) { this.setUint32(id, ASSET_ID_IDX, v); }
    getAssetId(id) { return this.getUint32(id, ASSET_ID_IDX); }
    setAnimationId(id, v) { this.setUint32(id, ANIMATION_ID_IDX, v); }
    getAnimationId(id) { return this.getUint32(id, ANIMATION_ID_IDX); }
    setWorldId(id, v) { this.setUint32(id, WORLD_ID_IDX, v); }
    getWorldId(id) { return this.getUint32(id, WORLD_ID_IDX); }
    setBodyId(id, v) { this.setUint32(id, BODY_ID_IDX, v); }
    getBodyId(id) { return this.getUint32(id, BODY_ID_IDX); }
}
//# sourceMappingURL=object-state-tree.js.map