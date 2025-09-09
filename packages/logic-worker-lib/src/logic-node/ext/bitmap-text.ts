import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { EventMap } from '@webtaku/event-emitter'
import { GameObject, GameObjectOptions } from '../core/game-object'

export type BitmapTextNodeOptions = {
  asset: number
} & GameObjectOptions

export class BitmapTextNode<E extends EventMap = EventMap> extends GameObject<E> {
  type = ObjectType.BitmapText

  #asset: number

  constructor(options: BitmapTextNodeOptions) {
    super(options)
    this.#asset = options.asset
  }

  get asset() { return this.#asset }
  set asset(v) {
    if (this.#asset !== v) {
      this.#asset = v

      if (this.id !== undefined && this.stateTree) {
        this.stateTree.setAssetId(this.id, v)
      }
    }
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    const id = super.attachToStateTree(parentId, stateTree)
    stateTree.setAssetId(id, this.#asset)
    return id
  }
}
