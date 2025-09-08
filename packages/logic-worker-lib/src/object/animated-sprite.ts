import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { GameObject, GameObjectOptions } from './game-object'

export type AnimatedSpriteObjectOptions = {
  asset: number
  animation: number,
} & GameObjectOptions

export class AnimatedSpriteObject extends GameObject {
  type = ObjectType.AnimatedSprite
  #assetId: number
  #animationId: number

  constructor(options: AnimatedSpriteObjectOptions) {
    super(options)
    this.#assetId = options.asset
    this.#animationId = options.animation
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    const id = super.attachToStateTree(parentId, stateTree)
    stateTree.setAssetId(id, this.#assetId)
    stateTree.setAnimationId(id, this.#animationId)
    return id
  }
}
