import { BOOLEAN_COUNT, CAPACITY, FLOAT32_COUNT, NONE, ObjectStateTree, SabBooleanPool, SabTreeLinks, SabTreeNodeIdPool, SabUint32Pool, SabUint32Queue, TREE_LINK_V_COUNT, UINT32_COUNT } from '@hydraengine/shared'

export function createObjectStateBuffer() {
  const sab = new SharedArrayBuffer(ObjectStateTree.bytesRequired())

  const q = new SabUint32Queue(sab, 0, CAPACITY - 1)
  for (let id = 1; id < CAPACITY; id++) q.enqueue(id)

  let byteOffset = SabTreeNodeIdPool.bytesRequired(CAPACITY)
  const links = new Uint32Array(sab, byteOffset, TREE_LINK_V_COUNT * CAPACITY)
  links.fill(NONE)

  byteOffset += SabTreeLinks.bytesRequired(CAPACITY)
  byteOffset += SabBooleanPool.bytesRequired(BOOLEAN_COUNT, CAPACITY)

  const uint32Pool = new Uint32Array(sab, byteOffset, UINT32_COUNT * CAPACITY)
  uint32Pool.fill(NONE)

  byteOffset += SabUint32Pool.bytesRequired(UINT32_COUNT, CAPACITY)

  const float32Pool = new Float32Array(sab, byteOffset, FLOAT32_COUNT * CAPACITY)
  float32Pool.fill(NaN)

  return sab
}
