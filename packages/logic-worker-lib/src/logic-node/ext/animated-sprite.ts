import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type AnimatedSpriteNodeOptions = {
  asset: number
  animation: number,
} & GameObjectOptions

export class AnimatedSpriteNode<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.AnimatedSprite

  #assetId: number
  #animationId: number

  constructor(options: AnimatedSpriteNodeOptions) {
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
