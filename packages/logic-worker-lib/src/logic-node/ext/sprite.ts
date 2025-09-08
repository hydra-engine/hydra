import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type SpriteObjectOptions = {
  asset: number
} & GameObjectOptions

export class SpriteObject extends GameObject {
  type = ObjectType.Sprite
  #assetId: number

  constructor(options: SpriteObjectOptions) {
    super(options)
    this.#assetId = options.asset
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    const id = super.attachToStateTree(parentId, stateTree)
    stateTree.setAssetId(id, this.#assetId)
    return id
  }
}
