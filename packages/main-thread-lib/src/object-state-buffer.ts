import { CAPACITY, NONE, ObjectStateTree, SabUint32Queue, TREE_LINK_V_COUNT } from '@hydraengine/shared'

export function createObjectStateBuffer() {
  const sab = new SharedArrayBuffer(ObjectStateTree.bytesRequired())

  const q = new SabUint32Queue(sab, 0, CAPACITY - 1)
  for (let id = 1; id < CAPACITY; id++) q.enqueue(id)

  const byteOffset = SabUint32Queue.bytesRequired(CAPACITY - 1)
  const meta = new Uint32Array(sab, byteOffset, CAPACITY * TREE_LINK_V_COUNT)
  meta.fill(NONE)

  return sab
}
