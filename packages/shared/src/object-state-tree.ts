import { SabTree } from './sab-tree/sab-tree'

export const CAPACITY = 1_000_000 as const

// ===== Boolean Indices =============================================================================
export const BOOLEAN_COUNT = 0 as const

// ===== Uint32 Indices =============================================================================
export const UINT32_COUNT = 5 as const
const OBJECT_TYPE_IDX = 0 as const
const LAYER_IDX = 1 as const
const TINT_IDX = 2 as const

// Sprite
const ASSET_ID_IDX = 3 as const
const ANIMATION_ID_IDX = 4 as const

// Shape
const SHAPE_ID_IDX = 3 as const

// Physics
const WORLD_ID_IDX = 3 as const
const BODY_ID_IDX = 3 as const

// ===== Float32 Indices =============================================================================
export const FLOAT32_COUNT = 23 as const

const DRAW_ORDER_IDX = 0 as const

// Local Transform
const LOCAL_X_IDX = 1 as const
const LOCAL_Y_IDX = 2 as const
const LOCAL_SCALE_X_IDX = 3 as const
const LOCAL_SCALE_Y_IDX = 4 as const
const LOCAL_PIVOT_X_IDX = 5 as const
const LOCAL_PIVOT_Y_IDX = 6 as const
const LOCAL_ROTATION_IDX = 7 as const
const LOCAL_COS_IDX = 8 as const
const LOCAL_SIN_IDX = 9 as const
const LOCAL_ALPHA_IDX = 10 as const

// World Transform
const WORLD_X_IDX = 11 as const
const WORLD_Y_IDX = 12 as const
const WORLD_SCALE_X_IDX = 13 as const
const WORLD_SCALE_Y_IDX = 14 as const
const WORLD_ROTATION_IDX = 15 as const
const WORLD_COS_IDX = 16 as const
const WORLD_SIN_IDX = 17 as const
const WORLD_ALPHA_IDX = 18 as const

// Shape
const WIDTH_IDX = 19 as const
const HEIGHT_IDX = 20 as const
const RADIUS_IDX = 19 as const

// Physics
const VELOCITY_X_IDX = 19 as const
const VELOCITY_Y_IDX = 20 as const
const TARGET_X_IDX = 21 as const
const TARGET_Y_IDX = 22 as const

export class ObjectStateTree extends SabTree {
  constructor(sab: SharedArrayBuffer) {
    super(sab, BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY)
  }

  static bytesRequired() { return SabTree.bytesRequired(BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY) }

  setObjectType(id: number, v: number) { this.setUint32(id, OBJECT_TYPE_IDX, v) }
  getObjectType(id: number) { return this.getUint32(id, OBJECT_TYPE_IDX) }

  setLocalX(id: number, v: number) { this.setFloat32(id, LOCAL_X_IDX, v) }
  getLocalX(id: number) { return this.getFloat32(id, LOCAL_X_IDX) }

  setLocalY(id: number, v: number) { this.setFloat32(id, LOCAL_Y_IDX, v) }
  getLocalY(id: number) { return this.getFloat32(id, LOCAL_Y_IDX) }

  setLocalScaleX(id: number, v: number) { this.setFloat32(id, LOCAL_SCALE_X_IDX, v) }
  getLocalScaleX(id: number) { return this.getFloat32(id, LOCAL_SCALE_X_IDX) }

  setLocalScaleY(id: number, v: number) { this.setFloat32(id, LOCAL_SCALE_Y_IDX, v) }
  getLocalScaleY(id: number) { return this.getFloat32(id, LOCAL_SCALE_Y_IDX) }

  setLocalPivotX(id: number, v: number) { this.setFloat32(id, LOCAL_PIVOT_X_IDX, v) }
  getLocalPivotX(id: number) { return this.getFloat32(id, LOCAL_PIVOT_X_IDX) }

  setLocalPivotY(id: number, v: number) { this.setFloat32(id, LOCAL_PIVOT_Y_IDX, v) }
  getLocalPivotY(id: number) { return this.getFloat32(id, LOCAL_PIVOT_Y_IDX) }

  setLocalRotation(id: number, v: number) { this.setFloat32(id, LOCAL_ROTATION_IDX, v) }
  getLocalRotation(id: number) { return this.getFloat32(id, LOCAL_ROTATION_IDX) }

  setLocalCos(id: number, v: number) { this.setFloat32(id, LOCAL_COS_IDX, v) }
  getLocalCos(id: number) { return this.getFloat32(id, LOCAL_COS_IDX) }

  setLocalSin(id: number, v: number) { this.setFloat32(id, LOCAL_SIN_IDX, v) }
  getLocalSin(id: number) { return this.getFloat32(id, LOCAL_SIN_IDX) }

  setLocalAlpha(id: number, v: number) { this.setFloat32(id, LOCAL_ALPHA_IDX, v) }
  getLocalAlpha(id: number) { return this.getFloat32(id, LOCAL_ALPHA_IDX) }

  setWorldX(id: number, v: number) { this.setFloat32(id, WORLD_X_IDX, v) }
  getWorldX(id: number) { return this.getFloat32(id, WORLD_X_IDX) }

  setWorldY(id: number, v: number) { this.setFloat32(id, WORLD_Y_IDX, v) }
  getWorldY(id: number) { return this.getFloat32(id, WORLD_Y_IDX) }

  setWorldScaleX(id: number, v: number) { this.setFloat32(id, WORLD_SCALE_X_IDX, v) }
  getWorldScaleX(id: number) { return this.getFloat32(id, WORLD_SCALE_X_IDX) }

  setWorldScaleY(id: number, v: number) { this.setFloat32(id, WORLD_SCALE_Y_IDX, v) }
  getWorldScaleY(id: number) { return this.getFloat32(id, WORLD_SCALE_Y_IDX) }

  setWorldRotation(id: number, v: number) { this.setFloat32(id, WORLD_ROTATION_IDX, v) }
  getWorldRotation(id: number) { return this.getFloat32(id, WORLD_ROTATION_IDX) }

  setWorldCos(id: number, v: number) { this.setFloat32(id, WORLD_COS_IDX, v) }
  getWorldCos(id: number) { return this.getFloat32(id, WORLD_COS_IDX) }

  setWorldSin(id: number, v: number) { this.setFloat32(id, WORLD_SIN_IDX, v) }
  getWorldSin(id: number) { return this.getFloat32(id, WORLD_SIN_IDX) }

  setWorldAlpha(id: number, v: number) { this.setFloat32(id, WORLD_ALPHA_IDX, v) }
  getWorldAlpha(id: number) { return this.getFloat32(id, WORLD_ALPHA_IDX) }

  setLayer(id: number, v: number) { this.setUint32(id, LAYER_IDX, v) }
  getLayer(id: number) { return this.getUint32(id, LAYER_IDX) }

  setDrawOrder(id: number, v: number) { this.setFloat32(id, DRAW_ORDER_IDX, v) }
  getDrawOrder(id: number) { return this.getFloat32(id, DRAW_ORDER_IDX) }

  setTint(id: number, v: number) { this.setUint32(id, TINT_IDX, v) }
  getTint(id: number) { return this.getUint32(id, TINT_IDX) }

  // Sprite
  setAssetId(id: number, v: number) { this.setUint32(id, ASSET_ID_IDX, v) }
  getAssetId(id: number) { return this.getUint32(id, ASSET_ID_IDX) }

  setAnimationId(id: number, v: number) { this.setUint32(id, ANIMATION_ID_IDX, v) }
  getAnimationId(id: number) { return this.getUint32(id, ANIMATION_ID_IDX) }

  // Shape
  setShapeId(id: number, v: number) { this.setUint32(id, SHAPE_ID_IDX, v) }
  getShapeId(id: number) { return this.getUint32(id, SHAPE_ID_IDX) }

  setRadius(id: number, v: number) { this.setFloat32(id, RADIUS_IDX, v) }
  getRadius(id: number) { return this.getFloat32(id, RADIUS_IDX) }

  setWidth(id: number, v: number) { this.setFloat32(id, WIDTH_IDX, v) }
  getWidth(id: number) { return this.getFloat32(id, WIDTH_IDX) }

  setHeight(id: number, v: number) { this.setFloat32(id, HEIGHT_IDX, v) }
  getHeight(id: number) { return this.getFloat32(id, HEIGHT_IDX) }

  // Physics
  setWorldId(id: number, v: number) { this.setUint32(id, WORLD_ID_IDX, v) }
  getWorldId(id: number) { return this.getUint32(id, WORLD_ID_IDX) }

  setBodyId(id: number, v: number) { this.setUint32(id, BODY_ID_IDX, v) }
  getBodyId(id: number) { return this.getUint32(id, BODY_ID_IDX) }

  setVelocityX(id: number, v: number) { this.setFloat32(id, VELOCITY_X_IDX, v) }
  getVelocityX(id: number) { return this.getFloat32(id, VELOCITY_X_IDX) }

  setVelocityY(id: number, v: number) { this.setFloat32(id, VELOCITY_Y_IDX, v) }
  getVelocityY(id: number) { return this.getFloat32(id, VELOCITY_Y_IDX) }

  setTargetX(id: number, v: number) { this.setFloat32(id, TARGET_X_IDX, v) }
  getTargetX(id: number) { return this.getFloat32(id, TARGET_X_IDX) }

  setTargetY(id: number, v: number) { this.setFloat32(id, TARGET_Y_IDX, v) }
  getTargetY(id: number) { return this.getFloat32(id, TARGET_Y_IDX) }

  #getCompValue = (id: number) => this.getDrawOrder(id)
  sortChildren(parent: number) { super.sortChildren(parent, this.#getCompValue) }
}
