import { ObjectStateTree } from '@hydraengine/shared'

export function createObjectStateBuffer() {
  return new SharedArrayBuffer(ObjectStateTree.bytesRequired())
}
