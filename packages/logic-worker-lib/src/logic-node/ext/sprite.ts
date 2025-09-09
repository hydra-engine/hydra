import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type SpriteNodeOptions = {
  asset: number
} & GameObjectOptions

export class SpriteNode<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.Sprite

  #assetId: number

  constructor(options: SpriteNodeOptions) {
    super(options)
    this.#assetId = options.asset
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    const id = super.attachToStateTree(parentId, stateTree)
    stateTree.setAssetId(id, this.#assetId)
    return id
  }
}
