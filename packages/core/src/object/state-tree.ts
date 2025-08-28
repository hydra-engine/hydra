import { SABTree } from '../sab-data-structures/tree'

const OBJ_CAPACITY = 1_000_000 as const
const OBJ_BVALUE_COUNT = 0 as const
const OBJ_UVALUE_COUNT = 2 as const
const OBJ_FVALUE_COUNT = 2 as const

// booleans

// uints
const OBJECT_TYPE_IDX = 0 as const
const ASSET_ID_IDX = 1 as const

// floats
const X_IDX = 0 as const
const Y_IDX = 1 as const

export function createInitialObjectStateBuffer(): SharedArrayBuffer {
  return new SharedArrayBuffer(SABTree.bytesRequired(OBJ_CAPACITY, OBJ_BVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_FVALUE_COUNT))
}

export class ObjectStateTree extends SABTree {
  constructor(sab: SharedArrayBuffer) {
    super(sab, OBJ_CAPACITY, OBJ_BVALUE_COUNT, OBJ_UVALUE_COUNT, OBJ_FVALUE_COUNT)
  }

  getX(i: number) { return this.getFValue(i, X_IDX) }
  setX(i: number, v: number) { this.setFValue(i, X_IDX, v) }

  getY(i: number) { return this.getFValue(i, Y_IDX) }
  setY(i: number, v: number) { this.setFValue(i, Y_IDX, v) }

  getObjectType(i: number) { return this.getUValue(i, OBJECT_TYPE_IDX) }
  setObjectType(i: number, v: number) { this.setUValue(i, OBJECT_TYPE_IDX, v) }

  getAssetId(i: number) { return this.getUValue(i, ASSET_ID_IDX) }
  setAssetId(i: number, v: number) { this.setUValue(i, ASSET_ID_IDX, v) }
}
