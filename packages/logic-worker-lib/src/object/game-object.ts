import { ObjectStateTree } from '@hydraengine/shared'

export type GameObjectOptions = {
  x?: number
  y?: number
}

export class GameObject {
  stateTree?: ObjectStateTree

  constructor(options?: GameObjectOptions) {
    //TODO
  }

  add(...children: GameObject[]) {
    //TODO
  }

  update(dt: number) {
    //TODO
  }
}
