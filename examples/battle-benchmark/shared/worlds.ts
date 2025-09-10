import { WorldDescriptor } from '@hydraengine/shared'

export enum WorldId {
  Stage
}

export const worldDescriptors: Record<number, WorldDescriptor> = {
  [WorldId.Stage]: { gravity: 0 }
}
