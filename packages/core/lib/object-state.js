const MAX_OBJECT_COUNT = 1_000_000;
const BYTES_I32 = 4;
const BYTES_F32 = 4;
const HEADER_COUNT = 2;
const OBJ_COUNT_ALLOCATED_IDX = 0;
const OBJ_COUNT_LIVE_IDX = 1;
const OBJ_FIELD_COUNT = 18;
const LOCAL_X_IDX = 0;
const LOCAL_Y_IDX = 1;
const LOCAL_PIVOT_X_IDX = 2;
const LOCAL_PIVOT_Y_IDX = 3;
const LOCAL_SCALE_X_IDX = 4;
const LOCAL_SCALE_Y_IDX = 5;
const LOCAL_ROTATION_IDX = 6;
const LOCAL_COS_IDX = 7;
const LOCAL_SIN_IDX = 8;
const LOCAL_ALPHA_IDX = 9;
const WORLD_X_IDX = 10;
const WORLD_Y_IDX = 11;
const WORLD_SCALE_X_IDX = 12;
const WORLD_SCALE_Y_IDX = 13;
const WORLD_ROTATION_IDX = 14;
const WORLD_COS_IDX = 15;
const WORLD_SIN_IDX = 16;
const WORLD_ALPHA_IDX = 17;
export function createInitialObjectStateBuffer() {
    return new SharedArrayBuffer(HEADER_COUNT * BYTES_I32 +
        MAX_OBJECT_COUNT * OBJ_FIELD_COUNT * BYTES_F32);
}
export function createObjectStateManager(sab) {
    return {};
}
//# sourceMappingURL=object-state.js.map