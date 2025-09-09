import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { MessageBridge } from '../../message-bridge'
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

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge) {
    const id = super.attachToStateTree(parentId, stateTree, messageBridge)
    stateTree.setAssetId(id, this.#assetId)
    stateTree.setAnimationId(id, this.#animationId)
    return id
  }

  set animation(v: number) {
    if (!isNaN(v) && this.#animationId !== v) {
      this.#animationId = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setAnimationId(this.id, v)
      }
    }

    if (this.id) {
      this.messageBridge?.sendAnimationChangedToRenderWorker(this.id, v)
    }
  }

  get animation() {
    return this.#animationId
  }
}
