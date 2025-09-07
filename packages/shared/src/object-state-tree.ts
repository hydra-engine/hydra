import { SabTree } from './sab-tree/sab-tree'

const CAPACITY = 1_000_000 as const

// Boolean Indices
const BOOLEAN_COUNT = 0 as const

// Uint32 Indices
const UINT32_COUNT = 2 as const
const OBJECT_TYPE_IDX = 0 as const
const ASSET_ID_IDX = 1 as const

// Float32 Indices
const FLOAT32_COUNT = 2 as const
const X_IDX = 0 as const
const Y_IDX = 1 as const

export class ObjectStateTree extends SabTree {
  constructor(sab: SharedArrayBuffer) {
    super(sab, BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY)
  }

  static bytesRequired() { return SabTree.bytesRequired(BOOLEAN_COUNT, UINT32_COUNT, FLOAT32_COUNT, CAPACITY) }

  setX(id: number, v: number) { this.setFloat32(id, X_IDX, v) }
  getX(id: number) { return this.getFloat32(id, X_IDX) }

  setY(id: number, v: number) { this.setFloat32(id, Y_IDX, v) }
  getY(id: number) { return this.getFloat32(id, Y_IDX) }

  setObjectType(id: number, v: number) { this.setUint32(id, OBJECT_TYPE_IDX, v) }
  getObjectType(id: number) { return this.getUint32(id, OBJECT_TYPE_IDX) }

  setAssetId(id: number, v: number) { this.setUint32(id, ASSET_ID_IDX, v) }
  getAssetId(id: number) { return this.getUint32(id, ASSET_ID_IDX) }
}
