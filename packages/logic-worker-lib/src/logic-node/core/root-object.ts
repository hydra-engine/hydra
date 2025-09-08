import { ObjectStateTree, ROOT_ID } from '@hydraengine/shared'
import { GameObject } from './game-object'

export class RootObject extends GameObject {
  constructor(stateTree: ObjectStateTree) {
    super()
    this._rootConfig(ROOT_ID, stateTree)
  }
}
